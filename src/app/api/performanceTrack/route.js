import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Performance from "@/models/performanceTrack.model";

/* =====================
   GET – fetch data
   ===================== */
export async function GET() {
  try {
    await dbConnect();

    const data = await Performance.findOne().lean();

    if (!data) {
      return NextResponse.json(
        { message: "Performance data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("GET performanceTrack error:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

/* =====================
   PUT – update data
   ===================== */
export async function PUT(req) {
  try {
    await dbConnect();

    const body = await req.json();
    const {
      totalTrades,
      accuracy,
      avgRiskToReward,
      best,
      worst,
    } = body;
console.log( totalTrades,
      accuracy,
      avgRiskToReward,
      best,
      worst,);

    if (
      !totalTrades ||
      !accuracy ||
      !avgRiskToReward ||
      !best ||
      !worst
    ) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const updated = await Performance.findOneAndUpdate(
      {}, // single document
      {
        totalTrades,
        accuracy,
        avgRiskToReward,
        best,
        worst,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    console.log("updated",updated);
    

    return NextResponse.json(
      {
        message: "Performance updated successfully",
        data: updated,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("PUT performanceTrack error:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
