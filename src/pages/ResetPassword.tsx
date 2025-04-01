
import React, { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSecurity } from "@/contexts/SecurityContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { validatePassword } from "@/lib/passwordConfig";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  token: z.string().min(1, "Token is required"),
  newPassword: z.string().min(10, "Password must be at least 10 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof formSchema>;

const ResetPassword = () => {
  const { resetPassword } = useSecurity();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);

  const token = searchParams.get("token") || "";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      token: token,
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    // Set token from URL if available
    if (token) {
      setValue("token", token);
    }
  }, [token, setValue]);

  const onSubmit = async (data: FormData) => {
    // Validate password complexity
    const passwordValidation = validatePassword(data.newPassword);
    if (!passwordValidation.isValid) {
      setPasswordError(passwordValidation.message);
      return;
    }
    
    setPasswordError(null);
    
    // Reset password
    const success = resetPassword(data.email, data.token, data.newPassword);
    
    if (success) {
      toast({
        title: "Password reset successful",
        description: "Your password has been updated. You can now log in with your new password.",
      });
      setResetSuccess(true);
    } else {
      toast({
        variant: "destructive",
        title: "Failed to reset password",
        description: "Invalid or expired token, or email address not found.",
      });
    }
  };

  const watchNewPassword = watch("newPassword");

  if (resetSuccess) {
    return (
      <div className="max-w-md mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Password Reset Successful</CardTitle>
            <CardDescription>
              Your password has been updated
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Your password has been successfully changed. You can now log in with your new password.
            </p>
            
            <Button asChild className="w-full">
              <Link to="/login">
                Go to Login
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Reset Password</h1>

      <Card>
        <CardHeader>
          <CardTitle>Create new password</CardTitle>
          <CardDescription>
            Enter a new secure password for your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="token">Reset Token</Label>
              <Input
                id="token"
                placeholder="Enter the token from your email"
                {...register("token")}
              />
              {errors.token && (
                <p className="text-sm text-red-500">{errors.token.message}</p>
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

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-center">
            Remember your password?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResetPassword;
