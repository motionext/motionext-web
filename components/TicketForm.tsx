"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import Image from "next/image";
import { XIcon, ImageIcon, SendIcon, LogInIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Messages } from "@/types/messages";

type TicketSubject = "privacy" | "security" | "bug" | "help";

interface TicketFormProps {
  messages: Messages["ticketForm"];
  isAuthenticated?: boolean;
  locale?: string;
}

/**
 * The `TicketForm` component is a React component that displays a form for submitting a ticket.
 * It allows users to select a subject, enter a message, and upload images.
 *
 * @param {TicketFormProps} props - The properties for the component
 * @param {Messages["ticketForm"]} props.messages - The messages for the component
 * @param {boolean} [props.isAuthenticated=true] - Whether the user is authenticated
 * @param {string} [props.locale="en"] - The locale for the component
 *
 * @returns The `TicketForm` component returns a form for submitting a ticket.
 */
export function TicketForm({
  messages,
  isAuthenticated = true,
  locale = "en",
}: TicketFormProps) {
  const t = messages;
  const supabase = createClient();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [subject, setSubject] = useState<TicketSubject | "">("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [hasSession, setHasSession] = useState(false);

  // Check user session to fill in the email automatically
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.email) {
        setEmail(user.email);
        setHasSession(true);
      }
      setIsLoadingSession(false);
    };

    checkSession();
  }, [supabase.auth]);

  // Generate previews for images
  useEffect(() => {
    // Clear old previews
    const clearPreviousURLs = () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview));
    };

    // Clear old previews
    clearPreviousURLs();

    // Create new previews only when images change
    const newPreviews = images.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);

    // Limpar URLs quando o componente for desmontado
    return () => {
      newPreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images]);

  /**
   * The `handleImageChange` function is a React function that handles the change of images in the
   * file input.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - The event object for the change event
   *
   * @returns The `handleImageChange` function returns void.
   */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Validate maximum number of images
    if (images.length + files.length > 3) {
      toast.error(t.tooManyImages);
      return;
    }

    const newImages: File[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validate file type (only images)
      if (!file.type.startsWith("image/")) {
        toast.error(t.invalidImageType);
        continue;
      }

      // Validate file size (maximum 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(t.imageTooLarge);
        continue;
      }

      newImages.push(file);
    }

    setImages((prevImages) => [...prevImages, ...newImages]);

    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setPreviews((prevPreviews) => {
      const newPreviews = [...prevPreviews];
      URL.revokeObjectURL(newPreviews[index]);
      newPreviews.splice(index, 1);
      return newPreviews;
    });
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

    // Basic validations
    if (!subject) {
      toast.error(t.missingSubject);
      return;
    }

    if (!message.trim()) {
      toast.error(t.missingMessage);
      return;
    }

    // Check if the email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      toast.error(t.invalidEmail);
      return;
    }

    setIsLoading(true);

    try {
      // Instead of uploading directly, we send the files to the API
      const formData = new FormData();
      formData.append("subject", subject);
      formData.append("message", message);
      formData.append("email", email);

      // Add images to FormData
      images.forEach((image, index) => {
        formData.append(`image${index}`, image);
      });

      toast.info(t.submitting);

      // Send the FormData to the API
      const response = await fetch("/api/tickets", {
        method: "POST",
        body: formData, // We don't set Content-Type to let the browser define it automatically with boundary
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      // Clear form
      setSubject("");
      setMessage("");
      setImages([]);
      setPreviews([]);

      toast.success(t.successMessage);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t.errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormDisabled = (!hasSession && !isAuthenticated) || isLoadingSession;

  return (
    <Card className="max-w-4xl mx-auto bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
        <CardDescription>{t.description}</CardDescription>
      </CardHeader>

      {isLoadingSession ? (
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex flex-col items-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 dark:border-gray-200"></div>
            <p className="text-sm text-muted-foreground">
              {t.verifyingAuthentication}
            </p>
          </div>
        </CardContent>
      ) : (
        <>
          {!hasSession && !isAuthenticated && (
            <CardContent>
              <Alert className="mb-6 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900">
                <AlertDescription className="flex flex-col space-y-4">
                  <p>{t.authenticationRequired}</p>
                  <Button asChild className="w-full sm:w-auto mt-2">
                    <Link href={`/${locale}/auth/sign-in?redirect=/support`}>
                      <LogInIcon className="w-4 h-4 mr-2" />
                      {t.signIn}
                    </Link>
                  </Button>
                </AlertDescription>
              </Alert>
            </CardContent>
          )}

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="subject">{t.subjectLabel}</Label>
                <Select
                  value={subject}
                  onValueChange={(value) => setSubject(value as TicketSubject)}
                  disabled={isFormDisabled}
                >
                  <SelectTrigger id="subject">
                    <SelectValue placeholder={t.subjectLabel} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="privacy">
                      {t.subjects.privacy}
                    </SelectItem>
                    <SelectItem value="security">
                      {t.subjects.security}
                    </SelectItem>
                    <SelectItem value="bug">{t.subjects.bug}</SelectItem>
                    <SelectItem value="help">{t.subjects.help}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">{t.messageLabel}</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t.messagePlaceholder}
                  rows={6}
                  className="resize-none"
                  disabled={isFormDisabled}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="images">{t.imagesLabel}</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {previews.map((preview, index) => (
                    <div
                      key={index}
                      className="relative border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden aspect-square"
                    >
                      <Image
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        aria-label={t.removeImage}
                        disabled={isFormDisabled}
                      >
                        <XIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}

                  {previews.length < 3 && (
                    <div
                      className={`border border-dashed border-gray-200 dark:border-gray-800 rounded-md flex items-center justify-center aspect-square ${isFormDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <label
                        htmlFor="file-upload"
                        className={`flex flex-col items-center p-4 cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 ${isFormDisabled ? "pointer-events-none" : ""}`}
                      >
                        <ImageIcon className="h-8 w-8 mb-2" />
                        <span className="text-sm text-center">
                          {t.addImages}
                        </span>
                        <input
                          id="file-upload"
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={handleImageChange}
                          ref={fileInputRef}
                          disabled={isFormDisabled}
                        />
                      </label>
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {t.imagesInfo}
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                disabled={isLoading || isFormDisabled}
                className="w-full sm:w-auto"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                    {t.submitting}
                  </span>
                ) : (
                  <span className="flex items-center">
                    <SendIcon className="mr-2 h-4 w-4" />
                    {t.submitButton}
                  </span>
                )}
              </Button>
            </CardFooter>
          </form>
        </>
      )}
    </Card>
  );
}
