// Form validation utilities

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Email validation
export function validateEmail(email: string): ValidationResult {
  const errors: string[] = [];
  
  if (!email) {
    errors.push("Email is required");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("Please enter a valid email address");
  }
  
  return { isValid: errors.length === 0, errors };
}

// Password validation
export function validatePassword(password: string): ValidationResult {
  const errors: string[] = [];
  
  if (!password) {
    errors.push("Password is required");
  } else {
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    if (!/\d/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Password must contain at least one special character");
    }
  }
  
  return { isValid: errors.length === 0, errors };
}

// Name validation
export function validateName(name: string): ValidationResult {
  const errors: string[] = [];
  
  if (!name) {
    errors.push("Name is required");
  } else if (name.length < 2) {
    errors.push("Name must be at least 2 characters");
  } else if (name.length > 100) {
    errors.push("Name must be less than 100 characters");
  }
  
  return { isValid: errors.length === 0, errors };
}

// Confirm password validation
export function validateConfirmPassword(password: string, confirmPassword: string): ValidationResult {
  const errors: string[] = [];
  
  if (!confirmPassword) {
    errors.push("Please confirm your password");
  } else if (password !== confirmPassword) {
    errors.push("Passwords do not match");
  }
  
  return { isValid: errors.length === 0, errors };
}

// Security question validation
export function validateSecurityQuestions(
  questions: { question: string; answer: string }[]
): ValidationResult {
  const errors: string[] = [];
  
  if (questions.length < 3) {
    errors.push("Please answer at least 3 security questions");
  }
  
  questions.forEach((q, index) => {
    if (!q.question) {
      errors.push(`Please select question ${index + 1}`);
    }
    if (!q.answer || q.answer.trim().length < 2) {
      errors.push(`Answer ${index + 1} must be at least 2 characters`);
    }
  });
  
  // Check for duplicate questions
  const selectedQuestions = questions.map((q) => q.question).filter(Boolean);
  if (new Set(selectedQuestions).size !== selectedQuestions.length) {
    errors.push("Please select different questions");
  }
  
  return { isValid: errors.length === 0, errors };
}

// App prompt validation
export function validatePrompt(prompt: string): ValidationResult {
  const errors: string[] = [];
  
  if (!prompt) {
    errors.push("Please describe your app idea");
  } else if (prompt.length < 10) {
    errors.push("Please provide more detail about your app (at least 10 characters)");
  } else if (prompt.length > 5000) {
    errors.push("Description is too long (max 5000 characters)");
  }
  
  return { isValid: errors.length === 0, errors };
}
