
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSecurity } from "@/contexts/SecurityContext";
import { useCustomer } from "@/contexts/CustomerContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { VulnerabilityDemo, CodeExample } from "@/components/SecurityInfo";
import { unsafeRender, safeRender } from "@/lib/securityUtils";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone is required"),
  address: z.string().min(1, "Address is required"),
  packageId: z.string().min(1, "Package is required"),
  sectorId: z.string().min(1, "Sector is required"),
});

type FormData = z.infer<typeof formSchema>;

const Customers = () => {
  const { isLoggedIn, secureMode } = useSecurity();
  const { customers, packages, sectors, addCustomer, getPackageName, getSectorName } = useCustomer();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [addedCustomer, setAddedCustomer] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      packageId: "",
      sectorId: "",
    },
  });

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  const onSubmit = async (data: FormData) => {
    const newCustomer = addCustomer({
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      packageId: parseInt(data.packageId),
      sectorId: parseInt(data.sectorId),
    });
    
    if (newCustomer) {
      toast({
        title: "Customer added",
        description: "The customer has been added successfully.",
      });
      reset();
      setAddedCustomer(newCustomer.name);
    } else {
      toast({
        variant: "destructive",
        title: "Failed to add customer",
        description: "An error occurred while adding the customer.",
      });
    }
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Customer Management</h1>

      <VulnerabilityDemo title="Add New Customer">
        <p className="text-sm mb-4">
          This form demonstrates {secureMode ? "secure input handling" : "XSS vulnerability"} in customer name field. 
          {!secureMode && " Try entering HTML tags or script tags in the name field."}
        </p>
        
        <CodeExample
          vulnerable={`// Vulnerable XSS implementation
function displayCustomerName(name) {
  // Directly inserting user input into DOM
  customerNameElement.innerHTML = name;
  
  // This is vulnerable to XSS attacks
  // Example attack: <script>alert('XSS')</script>
}`}
          secure={`// Secure implementation
function displayCustomerName(name) {
  // Sanitizing user input
  const sanitizedName = name
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
  
  customerNameElement.innerHTML = sanitizedName;
  // Alternative: customerNameElement.textContent = name;
}`}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New Customer</CardTitle>
              <CardDescription>
                Enter customer details to add to the database
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Customer Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter customer name"
                    {...register("name")}
                    className={!secureMode ? "border-amber-500 focus:border-amber-500" : ""}
                  />
                  {!secureMode && (
                    <p className="text-xs text-amber-600">
                      Hint: Try entering <code>&lt;script&gt;alert('XSS')&lt;/script&gt;</code> in vulnerable mode
                    </p>
                  )}
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="customer@example.com"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    placeholder="Phone number"
                    {...register("phone")}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500">{errors.phone.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="Customer address"
                    {...register("address")}
                  />
                  {errors.address && (
                    <p className="text-sm text-red-500">{errors.address.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="packageId">Internet Package</Label>
                  <Select 
                    onValueChange={(value) => setValue("packageId", value)}
                    defaultValue=""
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select package" />
                    </SelectTrigger>
                    <SelectContent>
                      {packages.map((pkg) => (
                        <SelectItem key={pkg.id} value={pkg.id.toString()}>
                          {pkg.name} - {pkg.speed} - ${pkg.price}/month
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.packageId && (
                    <p className="text-sm text-red-500">{errors.packageId.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sectorId">Market Sector</Label>
                  <Select 
                    onValueChange={(value) => setValue("sectorId", value)}
                    defaultValue=""
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select sector" />
                    </SelectTrigger>
                    <SelectContent>
                      {sectors.map((sector) => (
                        <SelectItem key={sector.id} value={sector.id.toString()}>
                          {sector.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.sectorId && (
                    <p className="text-sm text-red-500">{errors.sectorId.message}</p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Adding..." : "Add Customer"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Latest Customer Added</CardTitle>
              <CardDescription>
                Display of the most recently added customer
              </CardDescription>
            </CardHeader>
            <CardContent>
              {addedCustomer ? (
                <div className="space-y-4">
                  <div className="p-4 border rounded-md">
                    <h3 className="text-lg font-medium mb-2">New Customer:</h3>
                    <div className="text-xl" dangerouslySetInnerHTML={{ 
                      __html: secureMode ? safeRender(addedCustomer) : unsafeRender(addedCustomer) 
                    }} />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {!secureMode ? (
                      <p className="text-amber-600">
                        In vulnerable mode, customer names are rendered unsafely, potentially allowing XSS attacks.
                      </p>
                    ) : (
                      <p className="text-green-600">
                        In secure mode, all user input is sanitized before rendering.
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <p>No customer added yet.</p>
                  <p className="text-sm">Add a new customer to see it displayed here.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </VulnerabilityDemo>

      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
          <CardDescription>
            All customers in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {customers.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Package</TableHead>
                    <TableHead>Sector</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">
                        {secureMode ? safeRender(customer.name) : (
                          <span dangerouslySetInnerHTML={{ __html: unsafeRender(customer.name) }} />
                        )}
                      </TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{getPackageName(customer.packageId)}</TableCell>
                      <TableCell>{getSectorName(customer.sectorId)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <p>No customers found.</p>
              <p className="text-sm">Add new customers using the form above.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Customers;
