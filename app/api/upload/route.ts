import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import sharp from "sharp";

const MAX_RESOLUTION = 512; // Maximum of 512x512 for avatars

/**
 * The `POST` function is a Next.js route handler that handles the upload of user avatars.
 *
 * @param {NextRequest} request - The request object.
 * @returns The response from the avatar upload process.
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication securely
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const oldFilename = formData.get("oldFilename") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Verify file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 }
      );
    }

    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json(
        { error: "The image cannot exceed 15MB" },
        { status: 400 }
      );
    }

    // Read the image buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Process image with sharp (remove metadata, resize if necessary and compress)
    const processedImage = await sharp(buffer)
      .metadata()
      .then(({ width, height, orientation }) => {
        // Use default values if width or height are undefined
        const safeWidth = width || MAX_RESOLUTION;
        const safeHeight = height || MAX_RESOLUTION;
        
        // If it's larger than 512px in any dimension, reduce proportionally
        const scaleFactor = Math.min(
          1,
          MAX_RESOLUTION / Math.max(safeWidth, safeHeight)
        );

        return sharp(buffer)
          .rotate(orientation ? undefined : 0) // Correct rotation only if necessary
          .resize({
            width: Math.round(safeWidth * scaleFactor),
            height: Math.round(safeHeight * scaleFactor),
            fit: "inside",
            withoutEnlargement: true,
          })
          .avif({
            quality: 50, // Best balance between compression and quality
            effort: 4, // Good compression without losing much time
          })
          .toBuffer();
      });

    // Delete the old image if it exists
    if (oldFilename) {
      try {
        const { error: deleteError } = await supabase.storage
          .from("avatars")
          .remove([oldFilename]);

        if (deleteError) {
          console.error("Error deleting old image:", deleteError);
          // Continue even with error in old image deletion
        }
      } catch (deleteErr) {
        console.error("Exception deleting old image:", deleteErr);
        // Continue even with error in old image deletion
      }
    }

    // Upload to Supabase
    const fileName = `${user.id}_${Date.now()}.avif`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, processedImage, {
        upsert: true,
        contentType: "image/avif",
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json(
        { error: "Error uploading image" },
        { status: 500 }
      );
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(fileName);

    // Update user profile
    const { error: updateError } = await supabase
      .from("users")
      .update({ profile_image: publicUrl })
      .eq("id", user.id);

    if (updateError) {
      console.error("Error updating profile:", updateError);
      return NextResponse.json(
        { error: "Error updating profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      imageUrl: publicUrl,
    });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
