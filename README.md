# Evolução Fitness

PWA privada para acompanhamento da evolução de peso, conforme o
[`docs/SRS_Evolucao_Fitness_Codex.md`](docs/SRS_Evolucao_Fitness_Codex.md).

## Estado atual

As Fases 1 a 10 contêm:

- Next.js com App Router, React, TypeScript estrito e Tailwind CSS.
- PWA inicial com manifesto, ícones e cache exclusivo de recursos estáticos.
- Tipos, validações e cálculos puros do domínio.
- Clientes Supabase para navegador e servidor, criados sob demanda.
- Schema PostgreSQL para perfis, pesagens e metas.
- Constraints, triggers e RLS para integridade e isolamento por usuário.
- Camada de acesso a dados tipada para as operações centrais.
- Cadastro e confirmação de e-mail com nome armazenado nos metadados do Auth.
- Login, logout, recuperação de senha e sessão persistente em cookies.
- Proteção de rotas privadas e redirecionamento por estado do perfil.
- Onboarding transacional para criação do perfil definitivo e primeira meta.
- Registro e edição de pesagens com validação de data, peso, cintura e
  duplicidade por data.
- Exclusão de pesagens mediante confirmação.
- Reavaliação automática da meta ativa e recálculo dos indicadores após criar,
  editar ou excluir pesagens.
- Dashboard completo com peso atual e inicial, total perdido, menor peso, IMC
  adulto de referência não médica, média móvel de sete dias civis, meta ativa,
  valor restante, progresso e até cinco pesagens recentes.
- Gráfico responsivo de evolução com linhas de peso e média móvel, resumo
  textual acessível e estados específicos para zero, uma ou várias pesagens.
- Histórico autenticado com visualização responsiva em tabela e cartões.
- Filtros por 30 dias, 90 dias, último ano, período personalizado e todo o
  histórico.
- IMC, variação contra a pesagem cronologicamente anterior e total perdido
  calculados para cada registro, inclusive quando o registro anterior não
  aparece no período filtrado.
- Edição e exclusão de pesagens acessíveis diretamente pelo histórico, com
  revalidação do Dashboard e do histórico após alterações.
- Estados vazios e recuperação compreensível para falhas de carregamento.
- Tela autenticada de metas separada em meta ativa, metas pendentes e marcos
  concluídos.
- Criação e edição de metas exclusivas de perda de peso, com validação pelo
  peso atual ou pelo peso inicial quando ainda não há pesagens.
- Ativação transacional com apenas uma meta ativa e conclusão imediata quando
  uma meta antiga já foi atingida pelo peso atual.
- Ordenação atômica de metas pendentes, exclusão com confirmação e proteção de
  metas concluídas contra edição ou reativação.
- Estados vazios, carregamento e recuperação de erro para o gerenciamento de
  metas.
- Configurações autenticadas para nome, altura, peso inicial informado e tema.
- Temas escuro, claro e conforme o sistema operacional, com escuro como padrão.
- Revalidação dos indicadores dependentes de altura e peso inicial após
  alterações do perfil, sem modificar pesagens registradas.
- Logout visível na navegação e na área da conta.
- Exclusão definitiva da própria conta com confirmação textual, remoção
  transacional dos dados funcionais e encerramento da sessão.
- Exportação JSON de perfil funcional, pesagens e metas, com metadados de
  formato, datas e unidades e sem informações internas de autenticação.
- Exportação CSV exclusiva do histórico tabular de pesagens, com data civil,
  peso, cintura, observação, IMC, variação contra o registro cronologicamente
  anterior e total perdido.
- Downloads autenticados a partir de Configurações, sem cache de dados privados
  e com estados de preparação, sucesso e erro.
- Navegação responsiva entre todas as áreas privadas, com indicação da rota
  atual e alvos de toque adequados no mobile.
- Atalho de teclado para o conteúdo principal, foco visível reforçado,
  preferências de redução de movimento e tabela de histórico com semântica
  acessível.
- Estados gerais em português brasileiro para carregamento, falha e conteúdo
  não encontrado, sem expor detalhes técnicos ao usuário.
- Manifesto PWA com ícones de 192 e 512 pixels, metadata para instalação e
  service worker restrito aos arquivos estáticos do framework e da identidade
  PWA.
- Testes unitários e verificações estáticas do contrato da migration.

A aplicação está publicada em
`https://app-fitness-umbrion.vercel.app`. Credenciais e valores de ambiente
permanecem fora do repositório.

## Pré-requisitos

- Node.js 22 ou versão LTS compatível.
- npm.
- Para executar o Supabase local completo: Docker e Supabase CLI via `npx`.

## Configuração da aplicação

Instale as dependências e crie o arquivo local de ambiente:

```bash
npm install
cp .env.example .env.local
```

No PowerShell, o segundo comando pode ser substituído por:

```powershell
Copy-Item .env.example .env.local
```

Variáveis esperadas:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
APP_URL=http://localhost:3000
```

Preencha `.env.local` com os valores correspondentes ao ambiente escolhido:

- **Supabase local:** execute `npx supabase status -o env` depois de iniciar o
  stack. Use o valor de `API_URL` em `NEXT_PUBLIC_SUPABASE_URL` e o valor de
  `ANON_KEY` em `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Mantenha
  `APP_URL=http://localhost:3000`.
- **Projeto hospedado:** use a URL exibida em **Integrations > Data API** no
  Dashboard e a chave `anon` disponível em **Settings > API Keys > Legacy API
  Keys**. Em desenvolvimento local, mantenha
  `APP_URL=http://localhost:3000`.

Exemplo para o stack local padrão:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<valor de ANON_KEY>
APP_URL=http://localhost:3000
```

O arquivo `.env.example` não contém valores reais. A chave `service_role`
nunca deve ser exposta em uma variável `NEXT_PUBLIC_*` nem usada no navegador.
`APP_URL` é a origem usada para construir os links de confirmação e recuperação.
Sem as duas variáveis acima, a aplicação continua compilando, mas a criação de
um cliente Supabase falha com uma mensagem explícita.

## Banco de dados

As migrations estão em:

```text
supabase/migrations/20260726000000_initial_schema.sql
supabase/migrations/20260726010000_auth_onboarding.sql
supabase/migrations/20260726020000_goal_reordering.sql
supabase/migrations/20260727000000_account_deletion.sql
supabase/migrations/20260728000000_harden_table_privileges.sql
```

Elas criam:

- `profiles`, com um perfil por usuário autenticado;
- `weigh_ins`, com no máximo uma pesagem por usuário e data civil;
- `goals`, com no máximo uma meta ativa por usuário;
- validação do alvo contra a pesagem cronologicamente mais recente ou, quando
  não há pesagens, contra o peso inicial;
- conclusão da meta ativa quando a pesagem cronologicamente mais recente
  atingir o alvo, com reavaliação após alterações em pesagens e metas;
- ativação de metas antigas sem revalidar o alvo, concluindo imediatamente
  quando o peso atual já tiver atingido esse valor;
- preservação da conclusão e bloqueio de edição/reativação de metas concluídas;
- políticas RLS separadas para leitura, criação, alteração e exclusão.
- operação atômica de onboarding que obtém usuário e e-mail diretamente do
  Supabase Auth, cria o perfil com tema escuro e cria a primeira meta ativa.
- operação autenticada e atômica para reordenar apenas metas pendentes do
  próprio usuário.
- operação autenticada para excluir a própria conta, que deriva a identidade de
  `auth.uid()`, remove perfil, metas e pesagens e encerra o usuário do Auth sem
  expor uma chave administrativa ao navegador.
- revogação explícita dos privilégios amplos que projetos Supabase podem
  conceder às tabelas por padrão, seguida da concessão somente das operações e
  colunas usadas pela aplicação.

Para preparar uma instância local sem credenciais reais:

```bash
npx supabase start
npx supabase db reset
npx supabase status -o env
```

O repositório já inclui `supabase/config.toml` com confirmação de e-mail
habilitada, URL local e somente autenticação por e-mail e senha. A interface de
e-mails do ambiente local é informada pelo comando `npx supabase status`.

Use a URL e a chave `anon` exibidas pelo ambiente local apenas no seu
`.env.local`. `supabase db reset` recria o banco local e reaplica as migrations;
não o execute contra um banco com dados que precisem ser preservados.

### Aplicação das migrations

No ambiente local, `npx supabase db reset` recria o banco e aplica, em ordem,
todos os arquivos de `supabase/migrations/`.

Para um projeto hospedado, obtenha o identificador em **Project Settings >
General**, autentique a CLI e revise o plano antes de aplicar:

```bash
npx supabase login
npx supabase link --project-ref <project-ref>
npx supabase db push --dry-run
npx supabase db push
```

O token da CLI e a senha do banco não devem ser gravados em `.env.local`, no
README ou em qualquer arquivo versionado.

Depois da aplicação, execute
[`supabase/verification.sql`](supabase/verification.sql) no SQL Editor. O
resultado esperado é:

- `profiles`, `weigh_ins` e `goals` existentes com RLS habilitado;
- constraints para propriedade, valores positivos, datas não futuras,
  unicidade de pesagem por usuário/data e estado de conclusão das metas;
- índice parcial `goals_one_active_per_user_idx`;
- triggers de identidade, `updated_at`, validação/conclusão de metas e
  reavaliação após alterações em pesagens;
- funções públicas `complete_onboarding`, `activate_goal`,
  `move_pending_goal` e `delete_own_account` executáveis somente por
  `authenticated`;
- funções auxiliares no schema `private` sem execução por `anon` ou
  `authenticated`;
- nenhuma permissão de tabela para `anon` e permissões restritas para
  `authenticated`, inclusive por coluna em `goals`;
- políticas RLS de propriedade para todas as operações permitidas: seleção,
  alteração e exclusão em `profiles`, cuja criação ocorre somente pela função
  de onboarding; e seleção, criação, alteração e exclusão em `weigh_ins` e
  `goals`.

### Validação integrada

Com o stack local iniciado e `.env.local` preenchido:

1. Execute `npm run dev` e abra `http://localhost:3000`.
2. Cadastre um usuário descartável A. Abra a interface de e-mail indicada por
   `npx supabase status`, confirme a conta e conclua o onboarding.
3. Valide login, logout, persistência da sessão e recuperação de senha pelo
   e-mail capturado localmente.
4. Crie, edite e exclua pesagens; confirme duplicidade por data, datas futuras,
   valores positivos e conclusão da meta pelo peso cronologicamente mais
   recente.
5. Crie, edite, ordene e ative metas. Confirme meta ativa única e bloqueio de
   edição/reativação de metas concluídas.
6. Altere nome, altura, peso inicial e os três temas. Confirme que pesagens não
   são modificadas.
7. Baixe CSV e JSON. Confirme que o CSV contém somente pesagens e que o JSON
   contém perfil, pesagens e metas, sem tokens ou dados internos do Auth.
8. Cadastre um usuário descartável B e confirme que Dashboard, Histórico,
   Metas e exportações não mostram dados do usuário A. Tentativas diretas de
   consultar IDs pertencentes a A com a sessão de B devem retornar zero linhas
   ou erro de autorização.
9. Exclua as duas contas descartáveis pela interface e confirme que as sessões
   foram encerradas e que não restaram registros funcionais associados.

Esses testes exigem um Supabase local em execução ou um projeto hospedado
configurado. Os testes automatizados do repositório validam regras puras e o
contrato das migrations, mas não substituem a execução integrada contra
PostgreSQL, Auth e o serviço de e-mail.

### Configuração do Supabase Auth

Em uma instância hospedada, configure:

- `Site URL` com a mesma origem definida em `APP_URL`;
- a URL `http://localhost:3000/**` na lista de redirects durante desenvolvimento;
- confirmação de e-mail habilitada;
- nenhuma integração OAuth.

O código aceita o callback PKCE padrão em `/auth/callback` e também o formato
SSR com `token_hash` em `/auth/confirm`. Caso os templates de e-mail sejam
personalizados para o segundo formato, use:

```text
Confirmação:
{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email&next=/onboarding

Recuperação:
{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/redefinir-senha
```

### Registro operacional da Fase 11A

As migrations foram aplicadas manualmente no projeto Supabase hospedado e
`supabase/verification.sql` foi executado sem erros aparentes. A validação
integrada confirmou cadastro, login, uso do aplicativo e exportações CSV e JSON
com dados reais de teste.

Durante essa validação, a confirmação de e-mail foi desativada temporariamente
porque o provedor de Auth bloqueou o envio por excesso de solicitações. Depois
da validação, `Confirm email` foi reativado. Os fluxos reais de confirmação e
recuperação de senha foram homologados em produção.

O `Site URL` do Supabase Auth está configurado com a origem de produção, e a
lista de redirects inclui o ambiente local, os callbacks de produção e previews
da Vercel.

Nenhuma credencial do projeto remoto é versionada.

### Configuração da Vercel

O projeto está publicado na Vercel como aplicação Next.js. O ambiente de
produção exige:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://<projeto>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<chave-anon>
APP_URL=https://<dominio-da-aplicacao>
```

Use somente a chave `anon` solicitada pela configuração desta versão nas
variáveis `NEXT_PUBLIC_*`. Não cadastre uma chave `service_role` no frontend.
Mantenha a origem de `APP_URL` como `Site URL` e URL de redirecionamento no
Supabase Auth. As migrations do repositório já foram aplicadas ao projeto
hospedado e `supabase/verification.sql` foi executado.

## Execução

```bash
npm run dev
```

A aplicação ficará disponível em `http://localhost:3000`.

## Qualidade

```bash
npm test
npm run typecheck
npm run lint
npm run build
npm audit
```

## Estrutura principal

```text
src/
├── app/                  # Rotas públicas, privadas e callbacks de Auth
├── auth/                 # Ações, sessão, proteção e validações de autenticação
├── components/           # Formulários, pesagens, onboarding e registro da PWA
├── data/                 # Operações tipadas de persistência
├── dashboard/            # Modelo puro da série exibida no gráfico
├── domain/               # Tipos, datas civis, cálculos e validações
├── exporting/            # Serialização e respostas autenticadas de exportação
├── goals/                # Actions, agrupamento e validação das metas
├── history/              # Filtros civis e indicadores do histórico
├── onboarding/           # Validação pura do primeiro perfil e meta
├── settings/             # Actions e validação das configurações e conta
├── weigh-ins/            # Actions e validação da entrada de pesagens
└── lib/supabase/         # Ambiente, clientes SSR/browser e tipos do banco
supabase/
├── config.toml            # Auth local por e-mail com confirmação
└── migrations/            # Schema, integridade, onboarding, triggers e RLS
public/
└── sw.js                 # Cache exclusivo de recursos estáticos
```

O service worker é registrado somente no build de produção. Ele não intercepta
navegações, gravações, exportações ou consultas de dados: o cache inclui apenas
arquivos de `/_next/static/` e os recursos de identidade da PWA. Assim, o cache
não se torna fonte de dados do usuário.
