
import React from "react";
import { Link } from "react-router-dom";
import { Shield, Lock, AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SecurityBanner } from "@/components/SecurityInfo";
import { useSecurity } from "@/contexts/SecurityContext";

const Index = () => {
  const { isLoggedIn, secureMode } = useSecurity();

  return (
    <div className="space-y-8">
      <div className="pb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-cyber-primary mb-4">
          CommsShield Cyber Training Platform
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          A demonstration platform showcasing common web security vulnerabilities and their mitigations
        </p>
      </div>

      <SecurityBanner
        type="info"
        title="Educational Purpose Only"
        message="This platform is designed for educational purposes to demonstrate common web security vulnerabilities and how to mitigate them. The vulnerabilities shown here should never be implemented in production systems."
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-cyber-warning" />
              Vulnerability Demonstrations
            </CardTitle>
            <CardDescription>
              Interactive examples of common security flaws
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>SQL Injection attacks</li>
              <li>Cross-Site Scripting (XSS)</li>
              <li>Insecure authentication flows</li>
              <li>Insecure password storage</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-cyber-success" />
              Security Mitigations
            </CardTitle>
            <CardDescription>
              Learn proper security implementation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>Parameterized queries</li>
              <li>Input sanitization</li>
              <li>Secure password hashing</li>
              <li>Multi-factor authentication</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <RefreshCw className="h-5 w-5 mr-2 text-cyber-accent" />
              Switch Modes
            </CardTitle>
            <CardDescription>
              Toggle between secure and vulnerable modes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">
              This platform allows you to switch between secure and vulnerable implementations to observe the differences.
            </p>
            <p className="text-sm font-medium">
              Current mode: <span className={secureMode ? "text-cyber-success" : "text-cyber-danger"}>
                {secureMode ? "Secure" : "Vulnerable"}
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-cyber-primary rounded-lg p-8 shadow-lg">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0 md:mr-6">
            <h2 className="text-2xl font-bold text-cyber-text mb-2">
              Ready to explore cybersecurity concepts?
            </h2>
            <p className="text-cyber-text opacity-90">
              {isLoggedIn
                ? "Continue to the dashboard to practice identifying and mitigating security vulnerabilities."
                : "Register or login to access the full cybersecurity training platform."}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            {isLoggedIn ? (
              <Button asChild size="lg" className="bg-cyber-accent hover:bg-cyber-accent/90">
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="outline" size="lg" className="border-cyber-accent text-cyber-accent hover:bg-cyber-accent/10">
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild size="lg" className="bg-cyber-accent hover:bg-cyber-accent/90">
                  <Link to="/register">Register</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>About Communication_LTD</CardTitle>
            <CardDescription>Our fictional telecommunications company</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Communication_LTD is a fictional telecommunications company used in this cybersecurity demonstration. 
              The company offers various internet packages to different market sectors. This platform showcases a customer 
              management system with intentional security vulnerabilities for educational purposes.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How to Use This Platform</CardTitle>
            <CardDescription>Learning cybersecurity through practice</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Register a new account using the Register page</li>
              <li>Login with your credentials</li>
              <li>Toggle between secure and vulnerable modes</li>
              <li>Try to identify security vulnerabilities</li>
              <li>Compare secure implementations with vulnerable ones</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
