export type TRegex = Record<string, RegExp>;

export type LoginSchema = {
  email: string;
  password: string;
};

export type CreateAccSchema = LoginSchema & {
  username: string;
  confirmPassword?: string;
};

export type ChangeCredentialsSchema = Partial<CreateAccSchema>;

export type MessageFormSchema = {
  message: string;
};
