export interface Messages {
  common: {
    loading: string;
    error: string;
    success: string;
  };
  home: {
    home: string;
    features: string;
    team: string;
    docs: string;
    light: string;
    dark: string;
    system: string;
    welcome: string;
    description: string;
    mainFeatures: string;
    bodyMeasurements: string;
    bodyMeasurementsDesc: string;
    calorieCounter: string;
    calorieCounterDesc: string;
    workoutAssistant: string;
    workoutAssistantDesc: string;
    hydrationMonitor: string;
    hydrationMonitorDesc: string;
    intermittentFasting: string;
    intermittentFastingDesc: string;
    mentalHealth: string;
    mentalHealthDesc: string;
    ourTeam: string;
    leadFullStackDeveloper: string;
    coLeadDeveloper: string;
    comingSoonQ32025: string;
    userTestimonials: string;
    navigation: {
      home: string;
      documentation: string;
      status: string;
      changelog: string;
    };
    quickLinks: {
      home: string;
      docs: string;
      status: string;
    };
  };
  auth: {
    resetPassword: {
      title: string;
      description: string;
      submit: string;
      success: string;
      error: string;
      newPassword: string;
      confirmPassword: string;
      enterNewPassword: string;
      confirmNewPassword: string;
      passwordRequirements: string;
      passwordsDontMatch: string;
      passwordTooShort: string;
      passwordRequired: string;
      passwordNeedsLowercase: string;
      passwordNeedsUppercase: string;
      passwordNeedsNumber: string;
      passwordTooWeak: string;
      successTitle: string;
      successMessage: string;
      invalidToken: string;
      expiredLink: string;
      tooManyAttempts: string;
      tryAgainIn: string;
      sessionExpired: string;
      unexpectedError: string;
      passwordInUse: string;
      passwordStrength: {
        weak: string;
        medium: string;
        strong: string;
      };
    };
  };
  layout: {
    footer: {
      terms: string;
      policy: string;
      eula: string;
      quickLinks: string;
      legal: string;
      contact: string;
      allRightsReserved: string;
    };
  };
  errors: {
    rateLimitTitle: string;
    rateLimitMessage: string;
    rateLimitDescription: string;
    backToLogin: string;
  };
}
