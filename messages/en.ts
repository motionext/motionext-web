export default {
  common: {
    loading: "Loading...",
    error: "Something went wrong",
    success: "Operation completed successfully",
  },
  home: {
    home: "Home",
    features: "Main Features",
    team: "Our Team",
    docs: "Docs",
    light: "Light",
    dark: "Dark",
    system: "System",
    welcome: "Welcome to Motionext",
    description:
      "Your journey to a healthier and more active life starts here. Discover the power of personalized fitness.",
    mainFeatures: "Main Features",
    bodyMeasurements: "Body Measurements",
    bodyMeasurementsDesc:
      "Track your progress with detailed body measurements.",
    calorieCounter: "Calorie Counter",
    calorieCounterDesc:
      "Control your daily caloric intake to reach your goals.",
    workoutAssistant: "Personal Workout Assistant",
    workoutAssistantDesc: "Get personalized guidance to maximize your results.",
    hydrationMonitor: "Hydration Monitor",
    hydrationMonitorDesc:
      "Ensure optimal hydration with reminders and water intake monitoring.",
    intermittentFasting: "Fasting Manager",
    intermittentFastingDesc:
      "Track your fasting periods to improve metabolic health.",
    mentalHealth: "Mental Wellbeing",
    mentalHealthDesc:
      "Access tools to reduce stress and promote mental wellbeing.",
    ourTeam: "Meet the Team",
    leadFullStackDeveloper: "Lead Full Stack Developer",
    coLeadDeveloper: "Co-Lead Developer",
    comingSoonQ32025: "Launching in Q3 2025",
    userTestimonials: "Testimonials",
    navigation: {
      home: "Home",
      documentation: "Documentation",
      status: "Status",
      changelog: "Changelog",
    },
    quickLinks: {
      home: "Home",
      docs: "Documentation",
      status: "Status",
    },
  },
  auth: {
    resetPassword: {
      title: "Reset Password",
      description: "Enter your new password below",
      submit: "Reset Password",
      success: "Password reset successful",
      error: "Error resetting password",
      newPassword: "New Password",
      confirmPassword: "Confirm Password",
      enterNewPassword: "Enter your new password",
      confirmNewPassword: "Confirm your new password",
      passwordRequirements: "Password must be at least 8 characters",
      passwordsDontMatch: "Passwords do not match",
      passwordTooShort: "Password must be at least 8 characters",
      passwordRequired: "Password is required",
      passwordNeedsLowercase:
        "Password must contain at least one lowercase letter",
      passwordNeedsUppercase:
        "Password must contain at least one uppercase letter",
      passwordNeedsNumber: "Password must contain at least one number",
      passwordTooWeak:
        "Password is too weak. Use uppercase, lowercase letters and numbers",
      successTitle: "Password Changed Successfully!",
      successMessage:
        "Your password has been reset successfully. You can now login with your new password.",
      invalidToken: "Invalid reset token",
      expiredLink: "Reset link has expired. Please request a new one.",
      tooManyAttempts: "Too many attempts",
      tryAgainIn: "Try again in {minutes} minutes",
      sessionExpired: "Session expired. Please request a new reset link.",
      unexpectedError: "An unexpected error occurred. Please try again.",
      passwordInUse: "This password is already in use. Please choose a different password.",
      passwordStrength: {
        weak: "Weak",
        medium: "Medium",
        strong: "Strong"
      },
    },
  },
  layout: {
    footer: {
      terms: "Terms of Use",
      policy: "Privacy Policy",
      eula: "EULA",
      quickLinks: "Quick Links",
      legal: "Legal",
      contact: "Contact",
      allRightsReserved: "All rights reserved.",
    },
  },
  errors: {
    rateLimitTitle: "Too Many Attempts",
    rateLimitMessage: "Try again in {minutes} minutes",
    rateLimitDescription: "Whoa there, speedy! Our servers need a coffee break. Take a breather and come back in a bit.",
    backToLogin: "Back to Login",
    notFoundTitle: "Page Not Found",
    notFoundDescription: "Oops! Looks like you're lost. The page you're looking for doesn't exist or has been moved.",
    errorTitle: "Something Went Wrong",
    errorDescription: "Sorry, an unexpected error occurred. Our team has been notified and is working to fix the issue.",
    backToHome: "Back to Home",
    tryAgain: "Try Again",
  },
} as const;
