import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import JourneyLog from "@/models/journeyLogs.model";
import cloudinary from "@/lib/cloudinary";
import { deleteFromCloudinary } from "@/lib/cloudinary";

/* ======================
   GET – list + search
   ====================== */
export async function GET(req) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const q = searchParams.get("q");

  // 🔹 SINGLE (edit)
  if (id) {
    const log = await JourneyLog.findById(id).lean();

    if (!log) {
      return NextResponse.json(
        { message: "Not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(log);
  }

  // 🔹 LIST (search + limit 30)
  const query = q ? { $text: { $search: q } } : {};

  const logs = await JourneyLog.find(query)
    .sort({ createdAt: -1 })
    .limit(30)
    .lean();

  return NextResponse.json(logs);
}
/* ======================
   POST – add (max 30)
   ====================== */
export async function POST(req) {
  await dbConnect();
  const body = await req.json();

  const log = await JourneyLog.create(body);
  console.log(log);
  

  // 🔥 keep only 30 logs
  const count = await JourneyLog.countDocuments();
  if (count > 30) {
    const excess = count - 30;

    const oldLogs = await JourneyLog.find()
      .sort({ createdAt: 1 })
      .limit(excess);

    for (const l of oldLogs) {
      if (l.thumbnailOpenPublicId)
        await cloudinary.uploader.destroy(l.thumbnailOpenPublicId);
      if (l.thumbnailClosePublicId)
        await cloudinary.uploader.destroy(l.thumbnailClosePublicId);
    }

    await JourneyLog.deleteMany({
      _id: { $in: oldLogs.map((l) => l._id) },
    });
  }

  return NextResponse.json({ message: "Journey log added" }, { status: 201 });
}

/* ======================
   DELETE – delete + Cloudinary
   ====================== */
export async function DELETE(req) {
  await dbConnect();
  const { id } = await req.json();

  const log = await JourneyLog.findById(id);
  if (!log) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  if (log.thumbnailOpenPublicId)
    await cloudinary.uploader.destroy(log.thumbnailOpenPublicId);

  if (log.thumbnailClosePublicId)
    await cloudinary.uploader.destroy(log.thumbnailClosePublicId);

  await JourneyLog.findByIdAndDelete(id);

  return NextResponse.json({ message: "Deleted" });
}


/* ======================
   PUT – update journey log
   ====================== */
export async function PUT(req) {
  await dbConnect();

  const body = await req.json();
  const {
    id,
    description,
    thumbnailType,

    // new uploads (optional)
    thumbnailOpen,
    thumbnailClose,
    thumbnailOpenPublicId,
    thumbnailClosePublicId,
  } = body;

  if (!id || !description || !thumbnailType) {
    return NextResponse.json(
      { message: "Required fields missing" },
      { status: 400 }
    );
  }

  const existing = await JourneyLog.findById(id);

  if (!existing) {
    return NextResponse.json(
      { message: "Journey log not found" },
      { status: 404 }
    );
  }

  /* ======================
     DELETE OLD IMAGES IF REPLACED
     ====================== */

  // 🔴 Open image replaced
  if (
    thumbnailOpenPublicId &&
    existing.thumbnailOpenPublicId &&
    thumbnailOpenPublicId !== existing.thumbnailOpenPublicId
  ) {
    await deleteFromCloudinary(existing.thumbnailOpenPublicId);
  }

  // 🔴 Close image replaced
  if (
    thumbnailClosePublicId &&
    existing.thumbnailClosePublicId &&
    thumbnailClosePublicId !== existing.thumbnailClosePublicId
  ) {
    await deleteFromCloudinary(existing.thumbnailClosePublicId);
  }

  /* ======================
     UPDATE DB
     ====================== */
  existing.description = description;
  existing.thumbnailType = thumbnailType;

  if (thumbnailOpen) {
    existing.thumbnailOpen = thumbnailOpen;
    existing.thumbnailOpenPublicId = thumbnailOpenPublicId;
  }

  if (thumbnailClose) {
    existing.thumbnailClose = thumbnailClose;
    existing.thumbnailClosePublicId = thumbnailClosePublicId;
  }

  await existing.save();

  return NextResponse.json({
    message: "Journey log updated",
  });
}
