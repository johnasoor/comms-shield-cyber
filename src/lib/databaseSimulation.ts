
import { hashPassword, generateSalt, generateResetToken } from "./securityUtils";

// Types
export interface User {
  id: number;
  email: string;
  username: string;
  passwordHash: string;
  salt: string;
  previousPasswords: string[];
  loginAttempts: number;
  resetToken?: string;
  resetTokenExpiry?: number;
  isLocked: boolean;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  packageId: number;
  sectorId: number;
}

export interface Package {
  id: number;
  name: string;
  description: string;
  price: number;
  speed: string;
}

export interface Sector {
  id: number;
  name: string;
  description: string;
}

// In-memory database
class Database {
  users: User[] = [];
  customers: Customer[] = [];
  packages: Package[] = [];
  sectors: Sector[] = [];
  userId = 1;
  customerId = 1;

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Add some sample packages
    this.packages = [
      { id: 1, name: "Basic", description: "Basic internet package", price: 29.99, speed: "50 Mbps" },
      { id: 2, name: "Standard", description: "Standard internet package", price: 49.99, speed: "100 Mbps" },
      { id: 3, name: "Premium", description: "Premium internet package", price: 79.99, speed: "300 Mbps" },
      { id: 4, name: "Ultra", description: "Ultra-fast internet package", price: 99.99, speed: "1 Gbps" }
    ];

    // Add some sample sectors
    this.sectors = [
      { id: 1, name: "Residential", description: "Residential customers" },
      { id: 2, name: "Small Business", description: "Small business customers" },
      { id: 3, name: "Corporate", description: "Corporate customers" },
      { id: 4, name: "Government", description: "Government agencies" }
    ];

    // Create an admin user
    const salt = generateSalt();
    const passwordHash = hashPassword("Admin@123456", salt);
    this.users.push({
      id: this.userId++,
      email: "admin@comms-shield.com",
      username: "admin",
      passwordHash,
      salt,
      previousPasswords: [passwordHash],
      loginAttempts: 0,
      isLocked: false
    });
  }

  // VULNERABLE implementations (for educational purposes)
  vulnerableRegisterUser(email: string, username: string, password: string): User | null {
    // Check if username already exists - VULNERABLE to SQL Injection
    const existingUser = this.users.find(u => u.username === username);
    if (existingUser) {
      return null;
    }

    const salt = generateSalt();
    const passwordHash = hashPassword(password, salt);
    
    const newUser: User = {
      id: this.userId++,
      email,
      username,
      passwordHash,
      salt,
      previousPasswords: [passwordHash],
      loginAttempts: 0,
      isLocked: false
    };
    
    this.users.push(newUser);
    return newUser;
  }

  vulnerableLogin(username: string, password: string): User | null {
    // VULNERABLE to SQL Injection
    const user = this.users.find(u => u.username === username);
    
    if (!user) {
      return null;
    }

    if (user.isLocked) {
      return null;
    }

    const passwordHash = hashPassword(password, user.salt);
    
    if (passwordHash !== user.passwordHash) {
      user.loginAttempts++;
      if (user.loginAttempts >= 3) {
        user.isLocked = true;
      }
      return null;
    }
    
    user.loginAttempts = 0;
    return user;
  }

  vulnerableAddCustomer(customerData: Omit<Customer, "id">): Customer {
    // VULNERABLE to XSS (no input sanitization)
    const newCustomer: Customer = {
      id: this.customerId++,
      ...customerData
    };
    
    this.customers.push(newCustomer);
    return newCustomer;
  }

  // SECURE implementations
  secureRegisterUser(email: string, username: string, password: string): User | null {
    // Check if username already exists - using safe comparison
    const existingUser = this.users.find(u => u.username === username);
    if (existingUser) {
      return null;
    }

    const salt = generateSalt();
    const passwordHash = hashPassword(password, salt);
    
    const newUser: User = {
      id: this.userId++,
      email,
      username,
      passwordHash,
      salt,
      previousPasswords: [passwordHash],
      loginAttempts: 0,
      isLocked: false
    };
    
    this.users.push(newUser);
    return newUser;
  }

  secureLogin(username: string, password: string): User | null {
    // Parameterized query simulation
    const user = this.users.find(u => u.username === username);
    
    if (!user) {
      return null;
    }

    if (user.isLocked) {
      return null;
    }

    const passwordHash = hashPassword(password, user.salt);
    
    if (passwordHash !== user.passwordHash) {
      user.loginAttempts++;
      if (user.loginAttempts >= 3) {
        user.isLocked = true;
      }
      return null;
    }
    
    user.loginAttempts = 0;
    return user;
  }

  secureAddCustomer(customerData: Omit<Customer, "id">): Customer {
    // Input is sanitized before storage
    const sanitizedData = {
      name: this.sanitizeInput(customerData.name),
      email: this.sanitizeInput(customerData.email),
      phone: this.sanitizeInput(customerData.phone),
      address: this.sanitizeInput(customerData.address),
      packageId: customerData.packageId,
      sectorId: customerData.sectorId
    };
    
    const newCustomer: Customer = {
      id: this.customerId++,
      ...sanitizedData
    };
    
    this.customers.push(newCustomer);
    return newCustomer;
  }

  // Password management
  requestPasswordReset(email: string): { token: string; expiry: number } | null {
    const user = this.users.find(u => u.email === email);
    if (!user) {
      return null;
    }

    const { token, expiry } = generateResetToken();
    
    user.resetToken = token;
    user.resetTokenExpiry = expiry;
    
    return { token, expiry };
  }

  validateResetToken(email: string, token: string): boolean {
    const user = this.users.find(u => u.email === email);
    
    if (!user || !user.resetToken || !user.resetTokenExpiry) {
      return false;
    }

    if (user.resetToken !== token) {
      return false;
    }

    if (Date.now() > user.resetTokenExpiry) {
      return false;
    }

    return true;
  }

  changePassword(username: string, currentPassword: string, newPassword: string): boolean {
    const user = this.users.find(u => u.username === username);
    
    if (!user) {
      return false;
    }

    // Verify current password
    const currentHash = hashPassword(currentPassword, user.salt);
    if (currentHash !== user.passwordHash) {
      return false;
    }

    // Check password history
    const newHash = hashPassword(newPassword, user.salt);
    if (user.previousPasswords.includes(newHash)) {
      return false;
    }

    // Update password
    user.passwordHash = newHash;
    
    // Update password history
    user.previousPasswords.push(newHash);
    if (user.previousPasswords.length > 3) {
      user.previousPasswords.shift();
    }

    return true;
  }

  resetPassword(email: string, token: string, newPassword: string): boolean {
    const user = this.users.find(u => u.email === email);
    
    if (!user || !user.resetToken || !user.resetTokenExpiry) {
      return false;
    }

    if (user.resetToken !== token) {
      return false;
    }

    if (Date.now() > user.resetTokenExpiry) {
      return false;
    }

    // Check password history
    const newHash = hashPassword(newPassword, user.salt);
    if (user.previousPasswords.includes(newHash)) {
      return false;
    }

    // Update password
    user.passwordHash = newHash;
    
    // Update password history
    user.previousPasswords.push(newHash);
    if (user.previousPasswords.length > 3) {
      user.previousPasswords.shift();
    }

    // Clear reset token
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    
    return true;
  }

  // Data access methods
  getCustomers(): Customer[] {
    return this.customers;
  }

  getPackages(): Package[] {
    return this.packages;
  }

  getSectors(): Sector[] {
    return this.sectors;
  }

  // Helper methods
  private sanitizeInput(input: string): string {
    return input
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}

// Create a singleton instance
const db = new Database();
export default db;
