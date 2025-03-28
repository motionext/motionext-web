import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * The `POST` function is a Next.js route handler that handles the update of a ticket status.
 *
 * @param {NextRequest} request - The request object.
 * @returns The response from the update of a ticket status.
 */
export async function POST(request: NextRequest) {
  try {
    // Get request body
    const body = await request.json();
    const { ticketId, status } = body;

    if (!ticketId || !status) {
      return NextResponse.json(
        { error: "Ticket ID and status are required" },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ["open", "in_progress", "resolved", "closed"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Get Supabase client
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if the user is the owner of the ticket or staff (admin)
    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    const isAdmin = userData?.role === "admin";

    // Check if the ticket exists and if the user has access
    const { data: ticket, error: ticketError } = await supabase
      .from("tickets")
      .select("user_id, email, status")
      .eq("id", ticketId)
      .single();

    if (ticketError || !ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // Check if the user is the owner of the ticket
    const { data: userInfo } = await supabase.auth.getUser();
    const userEmail = userInfo.user?.email || "";
    const isOwner = ticket.user_id === user.id || ticket.email === userEmail;

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized to update this ticket" },
        { status: 403 }
      );
    }

    // Check status change restrictions
    // Regular users can only change to "resolved" if the ticket is open or in progress
    if (!isAdmin && status === "closed") {
      return NextResponse.json(
        { error: "Only administrators can close tickets" },
        { status: 403 }
      );
    }

    if (!isAdmin && status === "in_progress") {
      return NextResponse.json(
        { error: "Only administrators can set tickets as in progress" },
        { status: 403 }
      );
    }

    // Regular users can only mark as resolved if the ticket is open or in progress
    if (!isAdmin && status === "resolved" && ticket.status === "closed") {
      return NextResponse.json(
        { error: "Cannot reopen a closed ticket" },
        { status: 403 }
      );
    }

    // Update ticket status
    const { data: updatedTicket, error: updateError } = await supabase
      .from("tickets")
      .update({
        status,
        ...(status === "resolved"
          ? { resolved_at: new Date().toISOString() }
          : {}),
        ...(status === "closed" ? { closed_at: new Date().toISOString() } : {}),
      })
      .eq("id", ticketId)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: `Error updating ticket: ${updateError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Ticket status updated successfully",
      data: updatedTicket,
    });
  } catch (error) {
    console.error("Error processing status update:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
