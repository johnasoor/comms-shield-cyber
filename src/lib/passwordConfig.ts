
export const passwordConfig = {
  minLength: 10,
  requireUppercase: true,
  requireLowercase: true,
  requireDigits: true,
  requireSpecialChars: true,
  passwordHistory: 3,
  maxLoginAttempts: 3,
  passwordResetExpiry: 15 * 60 * 1000, // 15 minutes in milliseconds
};

export const dictionaryWords = [
  "password", "admin", "welcome", "123456", "qwerty", "letmein", "monkey", "football", 
  "baseball", "dragon", "superman", "batman", "sunshine", "iloveyou", "starwars",
  "master", "login", "princess", "abc123", "admin123", "welcome123"
];

export const validatePassword = (password: string): { isValid: boolean; message: string } => {
  if (password.length < passwordConfig.minLength) {
    return { 
      isValid: false, 
      message: `Password must be at least ${passwordConfig.minLength} characters long.` 
    };
  }
  
  if (passwordConfig.requireUppercase && !/[A-Z]/.test(password)) {
    return { isValid: false, message: "Password must contain at least one uppercase letter." };
  }
  
  if (passwordConfig.requireLowercase && !/[a-z]/.test(password)) {
    return { isValid: false, message: "Password must contain at least one lowercase letter." };
  }
  
  if (passwordConfig.requireDigits && !/\d/.test(password)) {
    return { isValid: false, message: "Password must contain at least one digit." };
  }
  
  if (passwordConfig.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { isValid: false, message: "Password must contain at least one special character." };
  }
  
  // Check if password contains a common dictionary word
  const lowerPassword = password.toLowerCase();
  for (const word of dictionaryWords) {
    if (lowerPassword.includes(word)) {
      return { isValid: false, message: "Password contains a common word that is not allowed." };
    }
  }
  
  return { isValid: true, message: "Password meets all requirements." };
};
