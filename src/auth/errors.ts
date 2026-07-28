const AUTH_ERROR_MESSAGES: Record<string, string> = {
  email_address_invalid: "Informe um e-mail válido.",
  email_exists: "Já existe uma conta para este e-mail.",
  email_not_confirmed: "Confirme seu e-mail antes de entrar.",
  invalid_credentials: "E-mail ou senha inválidos.",
  over_email_send_rate_limit:
    "Muitas mensagens foram solicitadas. Aguarde alguns minutos.",
  same_password: "A nova senha deve ser diferente da senha atual.",
  signup_disabled: "O cadastro está temporariamente indisponível.",
  user_already_exists: "Já existe uma conta para este e-mail.",
  weak_password: "A senha não atende aos requisitos de segurança.",
};

export function getAuthErrorMessage(
  code: string | undefined,
  fallback: string,
): string {
  return (code && AUTH_ERROR_MESSAGES[code]) || fallback;
}
