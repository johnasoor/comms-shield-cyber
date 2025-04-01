
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSecurity } from "@/contexts/SecurityContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { validatePassword } from "@/lib/passwordConfig";

const formSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(10, "Password must be at least 10 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof formSchema>;

const ChangePassword = () => {
  const { isLoggedIn, changePassword } = useSecurity();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  const onSubmit = async (data: FormData) => {
    // Validate password complexity
    const passwordValidation = validatePassword(data.newPassword);
    if (!passwordValidation.isValid) {
      setPasswordError(passwordValidation.message);
      return;
    }
    
    setPasswordError(null);
    
    // Change password
    const success = changePassword(data.currentPassword, data.newPassword);
    
    if (success) {
      toast({
        title: "Password changed",
        description: "Your password has been updated successfully.",
      });
      reset();
    } else {
      toast({
        variant: "destructive",
        title: "Failed to change password",
        description: "Current password is incorrect or new password was previously used.",
      });
    }
  };

  const watchNewPassword = watch("newPassword");

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Change Password</h1>

      <Card>
        <CardHeader>
          <CardTitle>Update your password</CardTitle>
          <CardDescription>
            Ensure your account is using a secure password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                placeholder="Enter your current password"
                {...register("currentPassword")}
              />
              {errors.currentPassword && (
                <p className="text-sm text-red-500">{errors.currentPassword.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Create a new password"
                {...register("newPassword")}
              />
              {errors.newPassword && (
                <p className="text-sm text-red-500">{errors.newPassword.message}</p>
              )}
              {passwordError && (
                <p className="text-sm text-red-500">{passwordError}</p>
              )}
              {watchNewPassword && watchNewPassword.length > 0 && !errors.newPassword && !passwordError && (
                <div className="text-xs space-y-1 mt-2">
                  <p className="font-medium">Password requirements:</p>
                  <ul className="space-y-1 pl-4 list-disc">
                    <li className={watchNewPassword.length >= 10 ? "text-green-600" : "text-amber-600"}>
                      At least 10 characters
                    </li>
                    <li className={/[A-Z]/.test(watchNewPassword) ? "text-green-600" : "text-amber-600"}>
                      At least one uppercase letter
                    </li>
                    <li className={/[a-z]/.test(watchNewPassword) ? "text-green-600" : "text-amber-600"}>
                      At least one lowercase letter
                    </li>
                    <li className={/\d/.test(watchNewPassword) ? "text-green-600" : "text-amber-600"}>
                      At least one number
                    </li>
                    <li className={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(watchNewPassword) ? "text-green-600" : "text-amber-600"}>
                      At least one special character
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your new password"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="text-sm text-muted-foreground">
              <p>Password requirements:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>At least 10 characters long</li>
                <li>Include uppercase and lowercase letters</li>
                <li>Include at least one number and special character</li>
                <li>Cannot be one of your 3 previous passwords</li>
                <li>Cannot contain common dictionary words</li>
              </ul>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Changing..." : "Change Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangePassword;
