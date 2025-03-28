import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  sendTicketConfirmationEmail,
  sendTicketNotificationEmail,
} from "@/lib/email-smtp";
import { i18nConfig } from "@/messages/i18n-config";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";

const MAX_RESOLUTION = 1280; // Maximum ultra reduced resolution

/**
 * The `POST` function is a Next.js route handler that handles the creation of a new ticket.
 *
 * @param {NextRequest} request - The request object.
 * @returns The response from the ticket creation process.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get form data
    const formData = await request.formData();
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;
    const email = formData.get("email") as string;

    // Basic validations
    if (!subject || !message || !email) {
      return NextResponse.json({ error: "Incomplete data" }, { status: 400 });
    }

    // Process images
    const imageUrls: string[] = [];
    const userId = user.id;
    const ticketId = uuidv4();

    // Find all images in the formData
    const imagePromises: Promise<void>[] = [];
    let imageIndex = 0;

    while (formData.has(`image${imageIndex}`)) {
      const file = formData.get(`image${imageIndex}`) as File;
      if (!file) continue;

      const processImagePromise = async () => {
        // Read the file as buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Process image with sharp in minimum acceptable quality for reading
        const processedImage = await sharp(buffer)
          .metadata()
          .then(({ width, height, orientation }) => {
            // Use default values if width or height are undefined
            const safeWidth = width || MAX_RESOLUTION;
            const safeHeight = height || MAX_RESOLUTION;
            
            // If it's larger than 720px in any dimension, reduce proportionally
            const scaleFactor = Math.min(
              1,
              MAX_RESOLUTION / Math.max(safeWidth, safeHeight)
            );
            return sharp(buffer)
              .rotate(orientation ? undefined : 0) // Only corrects if there is EXIF rotation
              .resize({
                width: Math.round(safeWidth * scaleFactor),
                height: Math.round(safeHeight * scaleFactor),
                fit: "inside",
                withoutEnlargement: true,
              })
              .avif({
                quality: 30, // Super low quality for maximum compression
                effort: 6, // Extreme compression
              })
              .toBuffer();
          });

        // Generate unique file name
        const fileExt = "avif"; // Will always be avif after processing
        const fileName = `${ticketId}_${uuidv4()}.${fileExt}`;
        const filePath = `${userId}/${fileName}`;

        // Upload processed image
        const { error } = await supabase.storage
          .from("tickets")
          .upload(filePath, processedImage, {
            upsert: false,
            contentType: "image/avif",
          });

        if (error) {
          throw new Error(`Error uploading image: ${error.message}`);
        }

        // Add URL to the list
        imageUrls.push(filePath);
      };

      imagePromises.push(processImagePromise());
      imageIndex++;
    }

    // Wait for all images to be processed
    await Promise.all(imagePromises);

    // Create the ticket in the database
    const { data: ticket, error } = await supabase
      .from("tickets")
      .insert({
        user_id: userId,
        email,
        subject,
        message,
        status: "open",
        images: imageUrls,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating ticket:", error);
      return NextResponse.json(
        { error: "Error creating ticket" },
        { status: 500 }
      );
    }

    // Send confirmation email to the user
    await sendTicketConfirmationEmail({
      email,
      ticketData: {
        id: ticketId,
        subject,
        message,
        hasImages: imageUrls.length > 0,
      },
      locale: i18nConfig.defaultLocale,
    });

    // Send notification to the team
    await sendTicketNotificationEmail({
      ticketData: {
        id: ticketId,
        subject,
        message,
        email,
        hasImages: imageUrls.length > 0,
        images: imageUrls,
      },
      locale: i18nConfig.defaultLocale,
    });

    return NextResponse.json({
      success: true,
      ticket,
    });
  } catch (error) {
    console.error("Error processing ticket:", error);
    return NextResponse.json(
      { error: "Error processing ticket" },
      { status: 500 }
    );
  }
}
