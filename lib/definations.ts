export type RegisterFormState = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type ActionState = {
  success?: string;
  error?: string;
  errors?: Record<string, string[]>;
};
