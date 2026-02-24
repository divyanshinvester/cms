import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Blog from "@/models/dailyBlog.model";

/* ======================
   GET – latest 3 blogs
   ====================== */
export async function GET() {
  await dbConnect();

  const blogs = await Blog.find()
    .sort({ createdAt: -1 })
    .limit(3)
    .lean();

  return NextResponse.json(blogs);
}

/* ======================
   POST – add new blog
   ====================== */
export async function POST(req) {
  await dbConnect();
  const { blog } = await req.json();

  if (!blog) {
    return NextResponse.json({ message: "Blog required" }, { status: 400 });
  }

  // create new blog
  await Blog.create({ blog });

  // keep only 3 latest
  const blogs = await Blog.find()
    .sort({ createdAt: -1 })
    .skip(3);

  if (blogs.length) {
    await Blog.deleteMany({
      _id: { $in: blogs.map((b) => b._id) },
    });
  }

  return NextResponse.json({ message: "Blog added" });
}

/* ======================
   PUT – update blog
   ====================== */
export async function PUT(req) {
  await dbConnect();
  const { id, blog } = await req.json();

  await Blog.findByIdAndUpdate(id, { blog });

  return NextResponse.json({ message: "Blog updated" });
}

/* ======================
   DELETE – delete blog
   ====================== */
export async function DELETE(req) {
  await dbConnect();
  const { id } = await req.json();

  await Blog.findByIdAndDelete(id);

  return NextResponse.json({ message: "Blog deleted" });
}
