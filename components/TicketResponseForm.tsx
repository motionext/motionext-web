"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import {
  X as XIcon,
  Image as ImageIcon,
  Send as SendIcon,
  CheckCircle,
  Archive,
  Clock,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { Messages } from "@/types/messages";
import { getDateLocale } from "@/lib/utils";

interface TicketResponseFormProps {
  ticketId: string;
  ticketStatus: string;
  messages: Messages["tickets"];
  isAdmin?: boolean;
  resolvedAt?: string;
  closedAt?: string;
  locale: string;
}

const MAX_CHARS = 500;

/**
 * The `TicketResponseForm` component is a React component that displays a form for submitting a
 * response to a ticket.
 *
 * @param {TicketResponseFormProps} props - The properties for the component
 * @param {string} props.ticketId - The ID of the ticket
 * @param {string} props.ticketStatus - The status of the ticket
 * @param {Messages["tickets"]} props.messages - The messages for the component
 * @param {boolean} [props.isAdmin=false] - Whether the user is an admin
 * @param {string} [props.resolvedAt] - The date and time the ticket was resolved
 * @param {string} [props.closedAt] - The date and time the ticket was closed
 * @param {string} props.locale - The locale for the component
 *
 * @returns The `TicketResponseForm` component returns a form for submitting a response to a ticket.
 */
export function TicketResponseForm({
  ticketId,
  ticketStatus,
  messages,
  isAdmin = false,
  resolvedAt,
  closedAt,
  locale,
}: TicketResponseFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false);
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);

  /**
   * The `updatePreviews` function is a React function that updates the previews for images.
   *
   * @param {File[]} newImages - The new images to update the previews for
   *
   * @returns The `updatePreviews` function returns void.
   */
  const updatePreviews = (newImages: File[]) => {
    // Clear old previews
    previews.forEach((preview) => URL.revokeObjectURL(preview));

    // Create new previews
    const newPreviews = newImages.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  /**
   * The `handleImageChange` function is a React function that handles the change of images in the
   * file input.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - The event object for the change event
   *
   * @returns The `handleImageChange` function returns void.
   */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;
    const newFiles = Array.from(fileList);
    const allFiles = [...images, ...newFiles];

    // Validate maximum number of images
    if (allFiles.length > 3) {
      toast.error(messages.maxImages);
      return;
    }

    // Validate each file
    for (const file of newFiles) {
      // Check type
      if (!file.type.startsWith("image/")) {
        toast.error(messages.invalidImageType);
        return;
      }

      // Check size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(messages.imageTooLarge);
        return;
      }
    }

    setImages(allFiles);
    updatePreviews(allFiles);
  };

  /**
   * The `removeImage` function is a React function that removes an image from the list of images and
   * previews.
   *
   * @param {number} index - The index of the image to remove
   *
   * @returns The `removeImage` function returns void.
   */
  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    updatePreviews(newImages);
  };

  /**
   * The `handleMessageChange` function is a React function that handles the change of a message in a
   * text area.
   *
   * @param {React.ChangeEvent<HTMLTextAreaElement>} e - The event object for the change event
   *
   * @returns The `handleMessageChange` function returns void.
   */
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;

    // Limit consecutive new lines
    let formattedValue = value.replace(/\n{3,}/g, "\n\n");

    // Truncate text if it exceeds the limit
    if (formattedValue.length > MAX_CHARS) {
      formattedValue = formattedValue.substring(0, MAX_CHARS);
    }

    setMessage(formattedValue);
    setCharCount(formattedValue.length);
  };

  /**
   * The `handleSubmit` function is a React function that handles the submission of a form.
   *
   * @param {React.FormEvent<HTMLFormElement>} e - The event object for the form submission
   *
   * @returns The `handleSubmit` function returns void.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!message.trim()) {
      return;
    }

    setIsLoading(true);

    try {
      // Create FormData with message and images
      const formData = new FormData();
      formData.append("message", message);
      formData.append("ticketId", ticketId);

      // Add images if there are any
      images.forEach((image) => {
        formData.append("images", image);
      });

      toast.info(messages.submitting);

      // Send to API
      const response = await fetch("/api/tickets/responses", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      // Clear form
      setMessage("");
      setImages([]);
      setPreviews([]);

      toast.success(messages.responseAdded);

      // Reload page to show response
      router.refresh();
    } catch {
      toast.error(messages.responseError);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * The `markAsResolved` function is a React function that marks a ticket as resolved.
   *
   * @returns The `markAsResolved` function returns void.
   */
  const markAsResolved = async () => {
    if (ticketStatus === "resolved") return;

    setIsLoading(true);

    try {
      toast.info(messages.updateStatus);

      const response = await fetch("/api/tickets/status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ticketId,
          status: "resolved",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      toast.success(messages.resolveSuccess);

      // Reload page to show updated status
      router.refresh();
    } catch {
      toast.error(messages.resolveError);
    } finally {
      setIsLoading(false);
      setResolveDialogOpen(false);
    }
  };

  /**
   * The `closeTicket` function is a React function that closes a ticket.
   *
   * @returns The `closeTicket` function returns void.
   */
  const closeTicket = async () => {
    if (ticketStatus === "closed") return;

    setIsLoading(true);

    try {
      toast.info(messages.updateStatus);

      const response = await fetch("/api/tickets/status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ticketId,
          status: "closed",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      toast.success(messages.ticketClosed);

      // Reload page to show updated status
      router.refresh();
    } catch {
      toast.error(messages.statusUpdateError);
    } finally {
      setIsLoading(false);
      setCloseDialogOpen(false);
    }
  };

  /**
   * The `formattedResolvedAt` function is a React function that formats a date as a string.
   *
   * @returns The `formattedResolvedAt` function returns a formatted date string.
   */
  const formattedResolvedAt = resolvedAt
    ? format(new Date(resolvedAt), "PPPP pp", {
        locale: getDateLocale(locale),
      })
    : null;
  const formattedClosedAt = closedAt
    ? format(new Date(closedAt), "PPPP pp", {
        locale: getDateLocale(locale),
      })
    : null;

  return (
    <div className="mt-8 space-y-4">
      {ticketStatus !== "closed" && ticketStatus !== "resolved" && (
        <div className="flex justify-end space-x-2">
          <AlertDialog
            open={resolveDialogOpen}
            onOpenChange={setResolveDialogOpen}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => setResolveDialogOpen(true)}
              disabled={isLoading}
              className="flex items-center gap-2 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 border-green-300"
            >
              <CheckCircle className="h-4 w-4" />
              {messages.markAsResolved}
            </Button>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {messages.resolveConfirmation}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {messages.resolveConfirmationText}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isLoading}>
                  {messages.cancel}
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={markAsResolved}
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isLoading ? messages.processing : messages.resolve}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      {ticketStatus === "resolved" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-green-700">
              <CheckCircle className="h-4 w-4" />
              <span>{messages.resolvedStatus}</span>
              {formattedResolvedAt && (
                <span className="flex items-center text-muted-foreground gap-1 ml-2">
                  <Clock className="h-3 w-3" />
                  {formattedResolvedAt}
                </span>
              )}
            </div>

            {isAdmin && (
              <AlertDialog
                open={closeDialogOpen}
                onOpenChange={setCloseDialogOpen}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCloseDialogOpen(true)}
                  disabled={isLoading}
                  className="flex items-center gap-2 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800 border-red-300"
                >
                  <Archive className="h-4 w-4" />
                  {messages.closeTicket}
                </Button>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {messages.closeConfirmation}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {messages.closeConfirmationText}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoading}>
                      {messages.cancel}
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={closeTicket}
                      disabled={isLoading}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {isLoading ? messages.processing : messages.closeTicket}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      )}

      {ticketStatus !== "closed" && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Textarea
              placeholder={messages.responseLabel}
              value={message}
              onChange={handleMessageChange}
              rows={4}
              className="resize-y"
              disabled={isLoading}
              maxLength={MAX_CHARS}
            />
            <div className="flex justify-end mt-1">
              <span
                className={`text-xs ${charCount >= MAX_CHARS ? "text-red-500" : "text-muted-foreground"}`}
              >
                {charCount}/{MAX_CHARS}
              </span>
            </div>
          </div>

          {previews.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">{messages.imagesLabel}</p>
              <div className="grid grid-cols-3 gap-2">
                {previews.map((url, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-md overflow-hidden border"
                  >
                    <Image
                      src={url}
                      alt={`Preview ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 p-1 bg-black/50 rounded-full"
                      aria-label={messages.removeImage}
                    >
                      <XIcon className="h-4 w-4 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center">
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                multiple
                className="hidden"
                disabled={isLoading || images.length >= 3}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading || images.length >= 3}
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                {messages.addImages}
              </Button>
              <p className="text-xs text-muted-foreground mt-1">
                {messages.maxFileSizeInfo}
              </p>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !message.trim()}
              className="ml-auto"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <span className="mr-2">{messages.submitting}</span>
                  <Loader2 className="animate-spin h-4 w-4 text-primary" />
                </span>
              ) : (
                <span className="flex items-center">
                  <span className="mr-2">{messages.sendResponse}</span>
                  <SendIcon className="h-4 w-4" />
                </span>
              )}
            </Button>
          </div>
        </form>
      )}

      {ticketStatus === "closed" && (
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
            <Archive className="h-4 w-4" />
            <span>{messages.closedTicketNote}</span>
          </div>
          <div className="flex flex-col space-y-1 text-xs text-muted-foreground mt-2">
            {formattedClosedAt && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>
                  {messages.closedAt} {formattedClosedAt}
                </span>
              </div>
            )}
            {formattedResolvedAt && (
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                <span>
                  {messages.resolvedAt} {formattedResolvedAt}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
