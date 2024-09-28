export type TRegex = Record<string, RegExp>;

export type LoginSchema = {
  email: string;
  password: string;
};

export type RegistrationSchema = LoginSchema & {
  username: string;
  confirmPassword?: string;
};

export type ChangeCredentialsSchema = Partial<RegistrationSchema>;
