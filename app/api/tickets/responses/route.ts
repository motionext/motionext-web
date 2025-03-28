import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import sharp from "sharp";
import {
  sendTicketResponseNotificationToUser,
  sendTicketResponseNotificationToStaff,
} from "@/lib/email-smtp";

const MAX_RESOLUTION = 1280; // Maximum ultra reduced resolution

/**
 * The `POST` function is a Next.js route handler that handles the creation of a ticket response.
 *
 * @param {NextRequest} request - The request object.
 * @returns The response from the creation of a ticket response.
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const message = formData.get("message") as string;
    const ticketId = formData.get("ticketId") as string;

    // Validate required data
    if (!message || !ticketId) {
      return NextResponse.json(
        { error: "Message and ticket ID are required" },
        { status: 400 }
      );
    }

    // Limit number of images
    const imageFiles = formData.getAll("images") as File[];
    if (imageFiles.length > 3) {
      return NextResponse.json(
        { error: "Maximum of 3 images allowed" },
        { status: 400 }
      );
    }

    // Determine locale based on Accept-Language
    const acceptLanguage = request.headers.get("Accept-Language") || "en";
    const locale = acceptLanguage.split(",")[0].split("-")[0];

    // Initialize Supabase client
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if the user is an admin
    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    const isAdmin = userData?.role === "admin";

    // Check if the ticket exists and if the user has permission to respond
    const { data: ticket, error: ticketError } = await supabase
      .from("tickets")
      .select("*")
      .eq("id", ticketId)
      .single();

    if (ticketError || !ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // Check if the user is the owner of the ticket or admin
    if (!isAdmin && ticket.user_id !== user.id) {
      return NextResponse.json(
        { error: "You do not have permission to respond to this ticket" },
        { status: 403 }
      );
    }

    // Check if the ticket is closed
    if (ticket.status === "closed") {
      return NextResponse.json(
        {
          error: "This ticket is closed and cannot receive new responses",
        },
        { status: 400 }
      );
    }

    // Process and upload images
    const imageUrls: string[] = [];

    if (imageFiles.length > 0) {
      for (const file of imageFiles) {
        // Read the file as a buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Process the image with sharp to correct orientation, resize and compress

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
        const fileName = `${ticketId}_${crypto.randomUUID()}.avif`;
        const filePath = `${user.id}/${fileName}`;

        // Upload the processed image
        const { error: uploadError } = await supabase.storage
          .from("tickets")
          .upload(filePath, processedImage, {
            contentType: "image/avif",
            upsert: true,
          });

        if (uploadError) {
          console.error("Error uploading image:", uploadError);
          return NextResponse.json(
            { error: "Failed to upload image" },
            { status: 500 }
          );
        }

        // Add image path to the list
        imageUrls.push(filePath);
      }
    }

    // Insert response into the database
    const { data: response, error: responseError } = await supabase
      .from("ticket_responses")
      .insert({
        ticket_id: ticketId,
        user_id: user.id,
        message,
        is_from_staff: isAdmin,
        images: imageUrls,
      })
      .select()
      .single();

    if (responseError) {
      console.error("Error inserting response:", responseError);
      return NextResponse.json(
        { error: "Failed to add response" },
        { status: 500 }
      );
    }

    // Update ticket status to "in_progress" if it's "open" and the response is from an admin
    if (isAdmin && ticket.status === "open") {
      await supabase
        .from("tickets")
        .update({
          status: "in_progress",
          updated_at: new Date().toISOString(),
        })
        .eq("id", ticketId);
    } else {
      // Update the ticket's update date
      await supabase
        .from("tickets")
        .update({
          updated_at: new Date().toISOString(),
        })
        .eq("id", ticketId);
    }

    // Send email notification
    try {
      if (isAdmin) {
        // If the response is from an admin, notify the user
        await sendTicketResponseNotificationToUser(
          ticket.email,
          {
            id: ticket.id,
            subject: ticket.subject,
          },
          {
            message: response.message,
            hasImages: imageUrls.length > 0,
          },
          true, // isFromStaff
          locale
        );
      } else {
        // If the response is from the user, notify the staff
        await sendTicketResponseNotificationToStaff(
          {
            id: ticket.id,
            subject: ticket.subject,
            email: ticket.email,
          },
          {
            message: response.message,
            hasImages: imageUrls.length > 0,
          },
          locale
        );
      }
    } catch (emailError) {
      console.error("Error sending email notification:", emailError);
      // Do not fail the main operation if the email fails
    }

    return NextResponse.json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error("Error processing response:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
