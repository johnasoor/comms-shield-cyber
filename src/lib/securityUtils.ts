
import cryptoPolyfill from './cryptoPolyfill';
import { passwordConfig } from './passwordConfig';

// Use our polyfill instead of Node.js crypto
const crypto = cryptoPolyfill;

// Generate a random salt
export function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex');
}

// Hash password using HMAC + Salt
export function hashPassword(password: string, salt: string): string {
  const hmac = crypto.createHmac('sha256', salt);
  hmac.update(password);
  return hmac.digest('hex');
}

// Generate a reset token using SHA-1
export function generateResetToken(): { token: string; expiry: number } {
  const randomValue = crypto.randomBytes(20).toString('hex');
  const token = crypto.createHash('sha1').update(randomValue).digest('hex');
  const expiry = Date.now() + passwordConfig.passwordResetExpiry;
  
  return { token, expiry };
}

// Simulated email service
export function sendResetEmail(email: string, token: string): boolean {
  // In a real application, this would send an actual email
  console.log(`Sending password reset email to ${email} with token: ${token}`);
  return true;
}

// Sanitize input to prevent XSS
export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Demo method to show how unsanitized input is vulnerable
export function unsafeRender(input: string): string {
  return input; // Vulnerable to XSS
}

// Demo method to show how secure rendering works
export function safeRender(input: string): string {
  return sanitizeInput(input);
}

// Simulate SQL Injection vulnerability
export function vulnerableSqlQuery(input: string): string {
  return `SELECT * FROM users WHERE username = '${input}'`;
}

// Simulate parameterized query (safe from SQL Injection)
export function safeSqlQuery(input: string): string {
  return `SELECT * FROM users WHERE username = ?`; // Placeholder would be filled safely
}
