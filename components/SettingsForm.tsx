"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Loader2,
  Upload,
  X,
  Camera,
  Save,
  User,
  Users,
  RotateCcw,
  RotateCw,
  KeySquare,
  Trash2,
  AlertCircle,
} from "lucide-react";
import Cropper from "react-easy-crop";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Messages } from "@/types/messages";
import { Slider } from "@/components/ui/slider";
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
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { getDateLocale, checkInappropriateContent } from "@/lib/utils";
import { format } from "date-fns";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface CroppedArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Friend {
  id: string;
  first_name: string;
  last_name: string;
  profile_image: string | null;
  created_at: string;
}

interface CroppedAreaPixels {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SettingsFormProps {
  locale: string;
  messages: Messages;
}

/**
 * The `SettingsForm` component is a React functional component that allows users to manage their
 * account settings, including profile information and account deletion.
 *
 * @param {SettingsFormProps} props - The properties for the component.
 * @param {string} props.locale - The locale code for the application.
 * @param {Messages} props.messages - The messages for the component.
 *
 * @returns The rendered settings form.
 */
export function SettingsForm({ locale, messages }: SettingsFormProps) {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loadingFriends, setLoadingFriends] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] =
    useState<CroppedAreaPixels | null>(null);
  const [friendToRemove, setFriendToRemove] = useState<Friend | null>(null);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);
  const [showDeleteAccountDialog, setShowDeleteAccountDialog] = useState(false);
  const [showFinalDeleteConfirmation, setShowFinalDeleteConfirmation] =
    useState(false);
  const [deleteCountdown, setDeleteCountdown] = useState(5);
  const [countdownActive, setCountdownActive] = useState(false);
  const [removingImage, setRemovingImage] = useState(false);
  const [showRemoveImageDialog, setShowRemoveImageDialog] = useState(false);
  const [isProfileIncomplete, setIsProfileIncomplete] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  const dateLocale = getDateLocale(locale);

  // Define the validation schema with Zod
  const formSchema = z.object({
    firstName: z
      .string()
      .min(1, messages.auth.nameCollection.error.firstNameRequired)
      .max(50, messages.auth.nameCollection.error.firstNameTooLong)
      .regex(
        /^[a-zA-ZÀ-ÿ\s'-]+$/,
        messages.auth.nameCollection.error.invalidFirstName
      )
      .transform((val) => val.trim()),
    lastName: z
      .string()
      .min(1, messages.auth.nameCollection.error.lastNameRequired)
      .max(50, messages.auth.nameCollection.error.lastNameTooLong)
      .regex(
        /^[a-zA-ZÀ-ÿ\s'-]+$/,
        messages.auth.nameCollection.error.invalidLastName
      )
      .transform((val) => val.trim()),
  });

  // Define the form data type
  type FormData = z.infer<typeof formSchema>;

  // Initialize the form with react-hook-form and zodResolver
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
    },
  });

  // Function to validate name during typing
  const validateFirstName = (value: string) => {
    try {
      formSchema.shape.firstName.parse(value);
      form.clearErrors("firstName");
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        form.setError("firstName", { message: error.errors[0].message });
      }
      return false;
    }
  };

  // Function to validate last name during typing
  const validateLastName = (value: string) => {
    try {
      formSchema.shape.lastName.parse(value);
      form.clearErrors("lastName");
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        form.setError("lastName", { message: error.errors[0].message });
      }
      return false;
    }
  };

  const loadUserData = useCallback(async () => {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        toast.error(messages.settings.sessionExpired);
        router.push("/");
        return;
      }

      const { data: userData, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        return;
      }

      setUser(userData);
      setFirstName(userData.first_name || "");
      setLastName(userData.last_name || "");
      form.setValue("firstName", userData.first_name || "");
      form.setValue("lastName", userData.last_name || "");
      setImageUrl(userData.profile_image || null);

      // Check if the profile is incomplete (without first name or last name)
      setIsProfileIncomplete(!userData.first_name || !userData.last_name);
    } catch {
      console.error("Error loading user");
    }
  }, [form, messages.settings.sessionExpired, router, supabase]);

  const loadFriends = useCallback(async () => {
    if (!user) return;

    setLoadingFriends(true);
    try {
      // Use RPC function
      const { data: friendsData, error } = await supabase.rpc(
        "get_friends_data",
        { input_user_id: user.id }
      );

      if (error) return;

      if (!friendsData || friendsData.length === 0) {
        setFriends([]);
        return;
      }

      setFriends(
        friendsData.map((friend: Friend) => ({
          id: friend.id,
          first_name: friend.first_name,
          last_name: friend.last_name,
          profile_image: friend.profile_image,
          created_at: friend.created_at,
        }))
      );
    } catch {
      console.error("Error loading friends");
    } finally {
      setLoadingFriends(false);
    }
  }, [supabase, user]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  useEffect(() => {
    if (user) {
      loadFriends();
    }
  }, [user, loadFriends]);

  /**
   * The `handleImageChange` function is a callback that handles the change event of an image input
   * element. It checks if the file is valid, checks its type and size, and sets the image file and
   * shows the cropper if the file is valid.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event object.
   */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast.error(messages.settings.invalidFileType);
      return;
    }

    // Check file size (max 15MB)
    if (file.size > 15 * 1024 * 1024) {
      toast.error(messages.settings.maxFileSize);
      return;
    }

    setImageFile(file);
    setShowCropper(true);
  };

  const onCropComplete = useCallback(
    (_croppedArea: CroppedArea, croppedAreaPixels: CroppedAreaPixels) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  /**
   * The `createCroppedImage` function is an asynchronous function that creates a cropped image from
   * the uploaded image file. It uses the `FileReader` API to securely load the image and create a
   * canvas for the crop.
   *
   * @returns {Promise<File | null>} A promise that resolves to a File object representing the cropped
   * image or null if the image file or cropped area pixels are not available.
   */
  const createCroppedImage = async (): Promise<File | null> => {
    try {
      if (!imageFile || !croppedAreaPixels) return null;

      // Create a canvas for the crop
      const image = new Image();

      // Use FileReader instead of URL.createObjectURL for better security
      const reader = new FileReader();

      // Load the image securely using FileReader
      const imageLoadPromise = new Promise<void>((resolve, reject) => {
        reader.onload = (e) => {
          if (e.target?.result) {
            image.onload = () => resolve();
            image.onerror = () => reject(new Error("Failed to load image"));
            image.src = e.target.result as string;
          } else {
            reject(new Error("Failed to read file"));
          }
        };
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(imageFile);
      });

      await imageLoadPromise;

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) return null;

      // Set canvas dimensions
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      // Save the current context state
      ctx.save();

      // Move to the center of the canvas
      ctx.translate(canvas.width / 2, canvas.height / 2);

      // Rotate the canvas
      ctx.rotate((rotation * Math.PI) / 180);

      // Draw the cropped image, compensating for the rotation
      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        -canvas.width / 2,
        -canvas.height / 2,
        canvas.width,
        canvas.height
      );

      // Restore the original state
      ctx.restore();

      // Convert to blob
      return new Promise<File | null>((resolve) => {
        canvas.toBlob((blob) => {
          if (!blob) {
            resolve(null);
            return;
          }

          const file = new File([blob], "cropped_image.webp", {
            type: "image/webp",
          });
          resolve(file);
        }, "image/webp");
      });
    } catch {
      return null;
    }
  };

  /**
   * The `handleUploadImage` function is an asynchronous function that handles the upload of a cropped
   * image to the user's profile. It creates a cropped image from the uploaded file, gets the current
   * file name to delete after, and uploads the cropped image to the user's profile.
   *
   * @returns  A promise that resolves when the image is uploaded successfully.
   */
  const handleUploadImage = async () => {
    if (!imageFile) return;

    setLoading(true);

    try {
      // Create cropped image
      const croppedFile = await createCroppedImage();

      if (!croppedFile) {
        toast.error(messages.settings.uploadError);
        return;
      }

      // Get current file name to delete after
      let oldFilename = null;
      if (imageUrl) {
        try {
          // Extract the file name from the URL
          const url = new URL(imageUrl);
          const pathname = url.pathname;
          // The typical format is /storage/v1/object/public/avatars/filename
          const segments = pathname.split("/");
          oldFilename = segments[segments.length - 1];
        } catch {
          console.error("Error extracting old file name");
        }
      }

      // Create FormData and upload
      const formData = new FormData();
      formData.append("file", croppedFile);

      // If we have an old file to delete, include it in FormData
      if (oldFilename) {
        formData.append("oldFilename", oldFilename);
      }

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setImageUrl(data.imageUrl);
      setShowCropper(false);
      setImageFile(null);

      toast.success(messages.settings.saved);

      // Reload user data
      loadUserData();
    } catch {
      toast.error(messages.settings.uploadError);
    } finally {
      setLoading(false);
    }
  };

  /**
   * The `handleCancelCrop` function is a callback that handles the cancellation of a crop operation.
   * It sets the showCropper state to false and resets the image file to null.
   */
  const handleCancelCrop = () => {
    setShowCropper(false);
    setImageFile(null);
  };

  /**
   * The `handleSaveProfile` function is an asynchronous function that handles the saving of a user's
   * profile information. It validates the form data, updates the user's profile in the database, and
   * reloads the user data.
   *
   * @returns  A promise that resolves when the profile is saved successfully.
   */
  const handleSaveProfile = async () => {
    try {
      // The handleSubmit function from react-hook-form will validate the data
      form.handleSubmit(async (values) => {
        setLoading(true);

        // Clear any previous errors
        form.clearErrors();

        try {
          // Check for inappropriate content in the first name
          const firstNameCheck = checkInappropriateContent(
            values.firstName,
            messages
          );
          if (!firstNameCheck.isValid) {
            form.setError("firstName", {
              message: firstNameCheck.reason,
            });
            // Use the specific content filter message
            toast.error(firstNameCheck.reason);
            setLoading(false);
            return;
          }

          // Check for inappropriate content in the last name
          const lastNameCheck = checkInappropriateContent(
            values.lastName,
            messages
          );
          if (!lastNameCheck.isValid) {
            form.setError("lastName", {
              message: lastNameCheck.reason,
            });
            // Use the specific content filter message
            toast.error(lastNameCheck.reason);
            setLoading(false);
            return;
          }

          const { error } = await supabase
            .from("users")
            .update({
              first_name: values.firstName,
              last_name: values.lastName,
            })
            .eq("id", user?.id);

          if (error) {
            throw error;
          }

          toast.success(messages.settings.saved);

          // Reload user data
          loadUserData();
        } catch {
          toast.error(messages.settings.saveError);
        } finally {
          setLoading(false);
        }
      })();
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  /**
   * The `handleResetPassword` function is an asynchronous function that handles the resetting of a
   * user's password. It sets the reset password loading state to true, gets the current locale from
   * the URL, and makes a call to our custom API instead of the direct Supabase function.
   *
   * @returns A promise that resolves when the password is reset successfully.
   */
  const handleResetPassword = async () => {
    try {
      setResetPasswordLoading(true);

      // Get current locale from URL
      const pathname = window.location.pathname;
      const locale = pathname.split("/")[1] || "pt";

      // Make a call to our custom API instead of the direct Supabase function
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user?.email,
          locale,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      toast.success(messages.settings.resetPasswordSuccess);
    } catch {
      toast.error(messages.settings.resetPasswordError);
    } finally {
      setResetPasswordLoading(false);
    }
  };

  /**
   * The `handleDeleteAccount` function is an asynchronous function that handles the deletion of a user's
   * account. It sets the loading state to true, gets the current locale from the URL, and makes a call
   * to our custom API instead of the direct Supabase function.
   *
   * @returns A promise that resolves when the account is deleted successfully.
   */
  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      // Get current locale from URL
      const pathname = window.location.pathname;
      const locale = pathname.split("/")[1] || "en";

      // Request account deletion via API
      const response = await fetch("/api/auth/delete-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user?.email,
          locale,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }

      toast.success(messages.settings.accountDeletedSuccess);

      // Logout and redirect to home page
      await supabase.auth.signOut();
      router.push("/");
      router.refresh();
    } catch {
      toast.error(messages.settings.accountDeletedError);
    } finally {
      setLoading(false);
      setShowFinalDeleteConfirmation(false);
    }
  };

  /**
   * The `handleRotateLeft` function is a callback that handles the rotation of an image to the left.
   * It updates the rotation state by decrementing the current rotation value by 90 degrees.
   */
  const handleRotateLeft = () => {
    setRotation((prev) => prev - 90);
  };

  /**
   * The `handleRotateRight` function is a callback that handles the rotation of an image to the right.
   * It updates the rotation state by incrementing the current rotation value by 90 degrees.
   */
  const handleRotateRight = () => {
    setRotation((prev) => prev + 90);
  };

  /**
   * The `openRemoveDialog` function is a callback that opens a dialog to remove a friend.
   * It sets the friend to remove and the show remove dialog state to true.
   *
   * @param {Friend} friend - The friend to remove.
   */
  const openRemoveDialog = (friend: Friend) => {
    setFriendToRemove(friend);
    setShowRemoveDialog(true);
  };

  const confirmRemoveFriend = async () => {
    if (!friendToRemove) return;

    try {
      const { error } = await supabase
        .from("friends")
        .delete()
        .match({ user_id: user?.id, friend_id: friendToRemove.id });

      if (error) {
        throw error;
      }

      toast.success(messages.settings.friendRemoveSuccess);
      setShowRemoveDialog(false);
      setFriendToRemove(null);

      // Update friends list
      loadFriends();
    } catch {
      toast.error(messages.settings.friendRemoveError);
    }
  };

  const cancelRemoveFriend = () => {
    setShowRemoveDialog(false);
    setFriendToRemove(null);
  };

  // Manage the timer state based on the dialog state
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (showFinalDeleteConfirmation) {
      // When the dialog opens, reset the timer
      setDeleteCountdown(5);
      setCountdownActive(true);

      // Configure the interval to decrement the counter
      timer = setInterval(() => {
        setDeleteCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCountdownActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      // When the dialog closes, reset the state
      setDeleteCountdown(5);
      setCountdownActive(false);
    }

    // Clean up the timer when the component unmounts or the state changes
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [showFinalDeleteConfirmation]);

  // Function to remove the profile image
  const handleRemoveProfileImage = async () => {
    if (!imageUrl || !user) return;

    setRemovingImage(true);

    try {
      // Extract the file name from the URL
      let oldFilename = null;
      try {
        // Extract the file name from the URL
        const url = new URL(imageUrl);
        const pathname = url.pathname;
        // The typical format is /storage/v1/object/public/avatars/filename
        const segments = pathname.split("/");
        oldFilename = segments[segments.length - 1];
      } catch {
        console.error("Error extracting old file name");
      }

      if (!oldFilename) {
        throw new Error("Failed to identify the file name");
      }

      // Call API to remove the image from the bucket
      const response = await fetch("/api/remove-profile-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filename: oldFilename }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      // Update the user profile to remove the image reference
      const { error } = await supabase
        .from("users")
        .update({
          profile_image: null,
        })
        .eq("id", user.id);

      if (error) {
        throw error;
      }

      // Update the UI
      setImageUrl(null);
      setShowRemoveImageDialog(false);
      toast.success(messages.settings.imageRemoved);

      // Reload user data
      loadUserData();
    } catch (error) {
      console.error("Error removing image:", error);
      toast.error(messages.settings.imageRemoveError);
    } finally {
      setRemovingImage(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {messages.home.settings}
          </h1>
          <p className="text-muted-foreground mt-1">
            {messages.settings.subtitle}
          </p>
        </div>
      </div>

      {isProfileIncomplete && (
        <Alert
          variant="destructive"
          className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
        >
          <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          <AlertTitle className="text-amber-800 dark:text-amber-300">
            {messages.settings.profileIncomplete}
          </AlertTitle>
          <AlertDescription className="text-amber-700 dark:text-amber-400">
            {messages.settings.profileIncompleteDescription}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            {messages.settings.profile}
          </TabsTrigger>
          <TabsTrigger value="friends" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {messages.settings.friends}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{messages.settings.profileImage}</CardTitle>
              <CardDescription>
                {messages.settings.imageRequirements}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="relative group mb-6">
                <Avatar className="h-32 w-32 border-4 border-background shadow-md">
                  <AvatarImage src={imageUrl || undefined} />
                  <AvatarFallback className="text-3xl">
                    {firstName && lastName
                      ? `${firstName[0]}${lastName[0]}`
                      : user?.email?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-2">
                    <Label
                      htmlFor="profileImage"
                      className="cursor-pointer p-3 rounded-full hover:bg-white/20 transition-colors"
                    >
                      <Camera className="h-6 w-6 text-white" />
                    </Label>
                    <Input
                      id="profileImage"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleImageChange}
                    />
                    {imageUrl && (
                      <button
                        type="button"
                        onClick={() => setShowRemoveImageDialog(true)}
                        className="p-3 rounded-full hover:bg-white/20 transition-colors"
                      >
                        <Trash2 className="h-6 w-6 text-white" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground max-w-md text-center">
                {messages.settings.maxFileSize}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{messages.settings.personalInfo}</CardTitle>
              <CardDescription>
                {messages.settings.personalInfoSubtitle}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Form {...form}>
                <div className="grid gap-6 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{messages.settings.firstName}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value);
                              setFirstName(value);
                              validateFirstName(value);
                            }}
                            placeholder={messages.settings.firstName}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{messages.settings.lastName}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value);
                              setLastName(value);
                              validateLastName(value);
                            }}
                            placeholder={messages.settings.lastName}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </Form>

              <div className="space-y-2">
                <Label htmlFor="email">{messages.settings.email}</Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="bg-muted"
                />
                <p className="text-sm text-muted-foreground">
                  {messages.settings.emailCannotBeChanged}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  onClick={handleSaveProfile}
                  disabled={loading}
                  className="bg-primary hover:bg-primary/90"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {messages.settings.saving}
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {messages.settings.save}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{messages.settings.securitySettings}</CardTitle>
              <CardDescription>
                {messages.settings.securitySettingsSubtitle}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                <div className="flex gap-3">
                  <KeySquare className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-800 dark:text-amber-300 mb-1">
                      {messages.settings.resetPassword}
                    </h4>
                    <p className="text-amber-700 dark:text-amber-400 text-sm">
                      {messages.settings.resetPasswordDescription}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={handleResetPassword}
                  disabled={resetPasswordLoading}
                  className="mt-4 border-amber-300 dark:border-amber-700 bg-amber-100/50 dark:bg-amber-900/50 hover:bg-amber-200 dark:hover:bg-amber-800 text-amber-900 dark:text-amber-100"
                >
                  {resetPasswordLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {messages.settings.processing}
                    </>
                  ) : (
                    messages.settings.resetPasswordButton
                  )}
                </Button>
              </div>

              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                <div className="flex gap-3">
                  <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-800 dark:text-red-300 mb-1">
                      {messages.settings.deleteAccount}
                    </h4>
                    <p className="text-red-700 dark:text-red-400 text-sm">
                      {messages.settings.deleteAccountDescription}
                    </p>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteAccountDialog(true)}
                  className="mt-4 border-red-300 dark:border-red-700 bg-red-100/50 dark:bg-red-900/50 hover:bg-red-200 dark:hover:bg-red-800 text-red-900 dark:text-red-100"
                >
                  {messages.settings.deleteAccountButton}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="friends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{messages.settings.friends}</CardTitle>
              <CardDescription>
                {messages.settings.friendsSubtitle}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingFriends ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : friends.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">
                    {messages.settings.noFriends}
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {friends.map((friend) => (
                      <div
                        key={friend.id}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={friend.profile_image || undefined}
                            />
                            <AvatarFallback>
                              {friend.first_name && friend.last_name
                                ? `${friend.first_name[0]}${friend.last_name[0]}`
                                : null}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{`${friend.first_name} ${friend.last_name}`}</p>
                            <p className="text-xs text-muted-foreground">
                              {messages.settings.friendSince}{" "}
                              {format(new Date(friend.created_at), "PPPp", {
                                locale: dateLocale,
                              })}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="destructive"
                          onClick={() => openRemoveDialog(friend)}
                          className="flex items-center gap-2 bg-destructive/20 hover:bg-destructive/60 hover:text-destructive rounded-lg text-dark"
                        >
                          <X className="h-4 w-4" />
                          {messages.settings.remove}
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog for image cropping */}
      <Dialog open={showCropper} onOpenChange={setShowCropper}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{messages.settings.cropImage}</DialogTitle>
            <DialogDescription>
              {messages.settings.cropImageDescription}
            </DialogDescription>
          </DialogHeader>
          <div className="relative w-full h-[300px] my-4">
            {imageFile && (
              <Cropper
                image={URL.createObjectURL(imageFile)}
                crop={crop}
                zoom={zoom}
                aspect={1}
                rotation={rotation}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            )}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="zoom">Zoom</Label>
                <span className="text-sm text-muted-foreground">
                  {zoom.toFixed(1)}x
                </span>
              </div>
              <Slider
                id="zoom"
                min={1}
                max={3}
                step={0.1}
                value={[zoom]}
                onValueChange={(value) => setZoom(value[0])}
              />
            </div>

            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={handleRotateLeft}
                className="h-10 w-10 rounded-full"
              >
                <RotateCcw className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleRotateRight}
                className="h-10 w-10 rounded-full"
              >
                <RotateCw className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={handleCancelCrop}>
              {messages.settings.cancel}
            </Button>
            <Button onClick={handleUploadImage} disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              {messages.settings.apply}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Alert Dialog for friend removal confirmation */}
      <AlertDialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {messages.settings.friendRemoveConfirmTitle}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {friendToRemove
                ? `${messages.settings.friendRemoveConfirmMessage.replace(
                    "{friend}",
                    `${friendToRemove.first_name} ${friendToRemove.last_name}`
                  )}`
                : messages.settings.friendRemoveConfirmMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelRemoveFriend}>
              {messages.settings.confirmCancel}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRemoveFriend}
              className="bg-destructive hover:bg-destructive/60 text-white"
            >
              {messages.settings.confirmRemove}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog for account deletion confirmation */}
      <AlertDialog
        open={showDeleteAccountDialog}
        onOpenChange={setShowDeleteAccountDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {messages.settings.deleteAccountConfirmTitle}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {messages.settings.deleteAccountConfirmMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {messages.settings.confirmCancel}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowDeleteAccountDialog(false);
                setShowFinalDeleteConfirmation(true);
              }}
              className="bg-destructive hover:bg-destructive/60 text-white"
            >
              {messages.settings.confirmDelete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Final confirmation dialog for account deletion */}
      <AlertDialog
        open={showFinalDeleteConfirmation}
        onOpenChange={setShowFinalDeleteConfirmation}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-500">
              {messages.settings.deleteAccountFinalConfirmTitle}
            </AlertDialogTitle>
            <AlertDialogDescription className="font-medium">
              {messages.settings.deleteAccountFinalConfirmMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setShowFinalDeleteConfirmation(false)}
            >
              {messages.settings.confirmCancel}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-destructive hover:bg-destructive/60 text-white"
              disabled={loading || countdownActive}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {messages.settings.deleting}
                </>
              ) : countdownActive ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  <span className="font-bold">{deleteCountdown}s</span>
                </>
              ) : (
                messages.settings.confirmFinalDelete
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* AlertDialog for profile image removal confirmation */}
      <AlertDialog
        open={showRemoveImageDialog}
        onOpenChange={setShowRemoveImageDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {messages.settings.removeImageTitle}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {messages.settings.removeImageConfirmation}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {messages.settings.confirmCancel}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveProfileImage}
              className="bg-destructive hover:bg-destructive/60 text-white"
              disabled={removingImage}
            >
              {removingImage ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {messages.settings.removing}
                </>
              ) : (
                messages.settings.removeImage
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
