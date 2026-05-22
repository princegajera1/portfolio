import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided in the request" }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Dynamic absolute path to standard Next.js public uploads directory
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    
    // Ensure the folder exists
    await mkdir(uploadsDir, { recursive: true });

    // Clean up filename and append timestamp to prevent name collisions
    const ext = path.extname(file.name);
    const originalBaseName = path.basename(file.name, ext);
    const safeBaseName = originalBaseName.replace(/[^a-zA-Z0-9]/g, "_");
    const uniqueFileName = `${safeBaseName}_${Date.now()}${ext}`;
    
    const filePath = path.join(uploadsDir, uniqueFileName);

    // Save to local filesystem
    await writeFile(filePath, buffer);

    // Next.js serves files in the 'public' folder from the root domain directly
    const relativeUrl = `/uploads/${uniqueFileName}`;

    return NextResponse.json({
      success: true,
      url: relativeUrl,
      fileName: uniqueFileName,
    });
  } catch (error: any) {
    console.error("API Upload Route Error:", error);
    return NextResponse.json({ error: error.message || "Failed to process upload" }, { status: 500 });
  }
}
