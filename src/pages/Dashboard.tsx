
import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSecurity } from "@/contexts/SecurityContext";
import { useCustomer } from "@/contexts/CustomerContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, AlertTriangle, Settings, Lock } from "lucide-react";

const Dashboard = () => {
  const { isLoggedIn, secureMode } = useSecurity();
  const { customers, packages, sectors } = useCustomer();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${
          secureMode ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}>
          {secureMode 
            ? <><Shield className="h-3 w-3 mr-1" /> Secure Mode</> 
            : <><AlertTriangle className="h-3 w-3 mr-1" /> Vulnerable Mode</>}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
            <p className="text-xs text-muted-foreground">
              Active subscribers
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Internet Packages</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{packages.length}</div>
            <p className="text-xs text-muted-foreground">
              Available service packages
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Market Sectors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sectors.length}</div>
            <p className="text-xs text-muted-foreground">
              Different customer segments
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Security Status</CardTitle>
            {secureMode 
              ? <Shield className="h-4 w-4 text-green-500" /> 
              : <AlertTriangle className="h-4 w-4 text-red-500" />}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${secureMode ? "text-green-600" : "text-red-600"}`}>
              {secureMode ? "Secure" : "Vulnerable"}
            </div>
            <p className="text-xs text-muted-foreground">
              Current system security mode
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Customer Management</CardTitle>
            <CardDescription>
              Add and manage customer data
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            <p>
              The customer management module allows you to add new customers, view customer data, and manage their
              internet packages. In vulnerable mode, this demonstrates XSS vulnerabilities.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/customers">Manage Customers</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>
              Update your password and security settings
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            <p>
              Regular password changes are an important security practice. Ensure your password meets all the
              required complexity standards.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link to="/change-password">
                <Lock className="h-4 w-4 mr-2" />
                Change Password
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security Vulnerabilities</CardTitle>
            <CardDescription>
              Educational demonstration of web security issues
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-1 text-sm">SQL Injection</h3>
                <p className="text-xs text-muted-foreground">
                  Located in login, register, and customer pages
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-1 text-sm">Cross-Site Scripting (XSS)</h3>
                <p className="text-xs text-muted-foreground">
                  Located in the customer management page
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-1 text-sm">Password Security</h3>
                <p className="text-xs text-muted-foreground">
                  Compare secure and insecure password handling
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className={`w-full px-4 py-2 rounded text-xs ${
              secureMode ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}>
              {secureMode
                ? "Secure mode: All security protections are enabled"
                : "Vulnerable mode: Security protections are disabled"}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
