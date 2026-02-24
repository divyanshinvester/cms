import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";

// models
import Performance from "@/models/performanceTrack.model";
import Blog from "@/models/dailyBlog.model";
import JourneyLog from "@/models/journeyLogs.model";

export async function GET() {
  try {
    await dbConnect();

    /* ======================
       PERFORMANCE (last update)
       ====================== */
    const performance = await Performance.findOne()
      .select("updatedAt")
      .lean();

    /* ======================
       BLOG (last added)
       ====================== */
    const lastBlog = await Blog.findOne()
      .sort({ createdAt: -1 })
      .select("createdAt")
      .lean();

    /* ======================
       JOURNEY LOGS (count)
       ====================== */
    const journeyCount = await JourneyLog.countDocuments();

    return NextResponse.json({
      success: true,
      data: {
        performanceLastUpdated: performance?.updatedAt || null,
        lastBlogAdded: lastBlog?.createdAt || null,
        journeyLogsCount: journeyCount,
      },
    });
  } catch (err) {
    console.error("STATS ERROR:", err);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch dashboard stats",
      },
      { status: 500 }
    );
  }
}
