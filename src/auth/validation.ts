const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ValidationResult<T> =
  | { valid: true; value: T }
  | { valid: false; message: string };

export interface RegistrationCredentials {
  name: string;
  email: string;
  password: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export function validateRegistrationCredentials(input: {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}): ValidationResult<RegistrationCredentials> {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();

  if (!name) {
    return { valid: false, message: "Informe seu nome." };
  }

  if (!EMAIL_PATTERN.test(email)) {
    return { valid: false, message: "Informe um e-mail válido." };
  }

  if (!input.password) {
    return { valid: false, message: "Informe uma senha." };
  }

  if (input.password !== input.passwordConfirmation) {
    return { valid: false, message: "As senhas informadas não coincidem." };
  }

  return {
    valid: true,
    value: {
      name,
      email,
      password: input.password,
    },
  };
}

export function validateLoginCredentials(input: {
  email: string;
  password: string;
}): ValidationResult<LoginCredentials> {
  const email = input.email.trim().toLowerCase();

  if (!EMAIL_PATTERN.test(email)) {
    return { valid: false, message: "Informe um e-mail válido." };
  }

  if (!input.password) {
    return { valid: false, message: "Informe sua senha." };
  }

  return {
    valid: true,
    value: {
      email,
      password: input.password,
    },
  };
}

export function validateEmail(
  input: string,
): ValidationResult<string> {
  const email = input.trim().toLowerCase();

  return EMAIL_PATTERN.test(email)
    ? { valid: true, value: email }
    : { valid: false, message: "Informe um e-mail válido." };
}

export function validateNewPassword(input: {
  password: string;
  passwordConfirmation: string;
}): ValidationResult<string> {
  if (!input.password) {
    return { valid: false, message: "Informe a nova senha." };
  }

  if (input.password !== input.passwordConfirmation) {
    return { valid: false, message: "As senhas informadas não coincidem." };
  }

  return { valid: true, value: input.password };
}
