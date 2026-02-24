import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ message: "File required" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    console.log(buffer);
    

    const upload = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "journeyLogs",
    resource_type: "image",
    }, (err, result) => {
          if (err) reject(err);
          resolve(result);
        })
        .end(buffer);
    });
 console.log(upload);
 
    return NextResponse.json({
      success: true,
      data: {
        url: upload.secure_url,
        public_id: upload.public_id,
      },
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ message: "Upload failed" }, { status: 500 });
  }
}