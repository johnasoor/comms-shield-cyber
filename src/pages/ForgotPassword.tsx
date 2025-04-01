
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSecurity } from "@/contexts/SecurityContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { sendResetEmail } from "@/lib/securityUtils";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type FormData = z.infer<typeof formSchema>;

const ForgotPassword = () => {
  const { requestPasswordReset } = useSecurity();
  const { toast } = useToast();
  const [resetRequested, setResetRequested] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    const result = requestPasswordReset(data.email);
    
    if (result) {
      const { token } = result;
      setResetToken(token);
      sendResetEmail(data.email, token);
      
      toast({
        title: "Password reset email sent",
        description: "Check your email for a reset link.",
      });
      setResetRequested(true);
    } else {
      toast({
        variant: "destructive",
        title: "Email not found",
        description: "If this email exists in our system, you will receive reset instructions.",
      });
      // Still show the reset requested screen for security reasons
      setResetRequested(true);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Forgot Password</h1>

      {!resetRequested ? (
        <Card>
          <CardHeader>
            <CardTitle>Reset your password</CardTitle>
            <CardDescription>
              Enter your email to receive a password reset link
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

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-center">
              Remembered your password?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Login
              </Link>
            </p>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Check your email</CardTitle>
            <CardDescription>
              We've sent a password reset link to your email
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              For demonstration purposes, here is the reset token that would normally be sent to your email:
            </p>
            
            {resetToken && (
              <div className="p-4 bg-muted rounded-md font-mono text-sm break-all">
                {resetToken}
              </div>
            )}
            
            <div className="text-sm text-muted-foreground">
              <p>Please use the link in your email to reset your password.</p>
              <p className="mt-2">
                In a real application, this token would only be sent via email and never displayed on screen.
              </p>
            </div>
            
            <div className="pt-2">
              <Button asChild className="w-full">
                <Link to={`/reset-password?token=${resetToken}`}>
                  Continue to Reset Password
                </Link>
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-center">
              Didn't receive an email?{" "}
              <Button variant="link" className="p-0 h-auto" onClick={() => setResetRequested(false)}>
                Try again
              </Button>
            </p>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default ForgotPassword;
