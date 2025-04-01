
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof formSchema>;

const Login = () => {
  const { loginUser, secureMode } = useSecurity();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    if (isLocked) {
      toast({
        variant: "destructive",
        title: "Account locked",
        description: "Too many failed login attempts. Please try again later.",
      });
      return;
    }

    const success = loginUser(data.username, data.password);
    
    if (success) {
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      navigate("/dashboard");
    } else {
      setLoginAttempts(prev => prev + 1);
      
      if (loginAttempts >= 2) {
        setIsLocked(true);
        toast({
          variant: "destructive",
          title: "Account locked",
          description: "Too many failed login attempts. Please try again later.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: `Invalid username or password. ${3 - (loginAttempts + 1)} attempts remaining.`,
        });
      }
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <VulnerabilityDemo title="Login Implementation">
        <p className="text-sm mb-4">
          This login form demonstrates {secureMode ? "secure" : "vulnerable"} authentication.
          {!secureMode && " The form is vulnerable to SQL injection in the username field."}
        </p>
        
        <CodeExample
          vulnerable={`// Vulnerable implementation
function login(username, password) {
  // Direct concatenation of user input in SQL query
  const query = "SELECT * FROM users WHERE username = '" + username + "' AND password_hash = '" + passwordHash + "'";
  
  // This is vulnerable to SQL injection attacks
  // Example attack: username: admin' --
  const user = db.query(query);
  return user;
}`}
          secure={`// Secure implementation
function login(username, password) {
  // Using parameterized query
  const query = "SELECT * FROM users WHERE username = ? AND password_hash = ?";
  
  // Parameters are properly escaped
  const user = db.query(query, [username, passwordHash]);
  return user;
}`}
        />

        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Access the cybersecurity demonstration platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Enter your username"
                  {...register("username")}
                  className={!secureMode ? "border-amber-500 focus:border-amber-500" : ""}
                  disabled={isLocked}
                />
                {!secureMode && (
                  <p className="text-xs text-amber-600">
                    Hint: Try using SQL injection like <code>admin' --</code> in vulnerable mode
                  </p>
                )}
                {errors.username && (
                  <p className="text-sm text-red-500">{errors.username.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  {...register("password")}
                  disabled={isLocked}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>

              {isLocked && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                  Account locked due to too many failed attempts. Please try again later or reset your password.
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting || isLocked}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-center">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary hover:underline">
                Register
              </Link>
            </p>
          </CardFooter>
        </Card>
      </VulnerabilityDemo>
    </div>
  );
};

export default Login;
