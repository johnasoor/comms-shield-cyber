
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSecurity } from "@/contexts/SecurityContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { VulnerabilityDemo, CodeExample } from "@/components/SecurityInfo";
import { validatePassword } from "@/lib/passwordConfig";
import { unsafeRender, safeRender } from "@/lib/securityUtils";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(10, "Password must be at least 10 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof formSchema>;

const Register = () => {
  const { registerUser, secureMode } = useSecurity();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    // Validate password complexity
    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.isValid) {
      setPasswordError(passwordValidation.message);
      return;
    }
    
    setPasswordError(null);
    
    // Register user
    const success = registerUser(data.email, data.username, data.password);
    
    if (success) {
      toast({
        title: "Registration successful!",
        description: "You can now log in with your credentials.",
      });
      navigate("/login");
    } else {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "Username might already exist or server error occurred.",
      });
    }
  };

  const watchPassword = watch("password");

  return (
    <div className="max-w-md mx-auto space-y-6">
      <VulnerabilityDemo title="Register Implementation">
        <p className="text-sm mb-4">
          This registration form demonstrates {secureMode ? "secure" : "vulnerable"} user registration.
          {!secureMode && " The form is vulnerable to SQL injection in the username field."}
        </p>
        
        <CodeExample
          vulnerable={`// Vulnerable implementation
function registerUser(username, password) {
  // Direct concatenation of user input
  const query = "INSERT INTO users (username, password_hash) VALUES ('" + username + "', '" + passwordHash + "')";
  
  // This is vulnerable to SQL injection attacks
  db.execute(query);
}`}
          secure={`// Secure implementation
function registerUser(username, password) {
  // Using parameterized query
  const query = "INSERT INTO users (username, password_hash) VALUES (?, ?)";
  
  // Parameters are properly escaped
  db.execute(query, [username, passwordHash]);
}`}
        />

        <Card>
          <CardHeader>
            <CardTitle>Create an account</CardTitle>
            <CardDescription>
              Register to access the cybersecurity demonstration platform
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
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Choose a username"
                  {...register("username")}
                  className={!secureMode ? "border-amber-500 focus:border-amber-500" : ""}
                />
                {!secureMode && (
                  <p className="text-xs text-amber-600">
                    Warning: This field is vulnerable to SQL injection in unsafe mode
                  </p>
                )}
                {errors.username && (
                  <p className="text-sm text-red-500">{errors.username.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a secure password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
                {passwordError && (
                  <p className="text-sm text-red-500">{passwordError}</p>
                )}
                {watchPassword && watchPassword.length > 0 && !errors.password && !passwordError && (
                  <div className="text-xs space-y-1 mt-2">
                    <p className="font-medium">Password requirements:</p>
                    <ul className="space-y-1 pl-4 list-disc">
                      <li className={watchPassword.length >= 10 ? "text-green-600" : "text-amber-600"}>
                        At least 10 characters
                      </li>
                      <li className={/[A-Z]/.test(watchPassword) ? "text-green-600" : "text-amber-600"}>
                        At least one uppercase letter
                      </li>
                      <li className={/[a-z]/.test(watchPassword) ? "text-green-600" : "text-amber-600"}>
                        At least one lowercase letter
                      </li>
                      <li className={/\d/.test(watchPassword) ? "text-green-600" : "text-amber-600"}>
                        At least one number
                      </li>
                      <li className={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(watchPassword) ? "text-green-600" : "text-amber-600"}>
                        At least one special character
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Repeat your password"
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Registering..." : "Register"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-center">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </VulnerabilityDemo>
    </div>
  );
};

export default Register;
