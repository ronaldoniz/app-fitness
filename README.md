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

Não há credenciais reais nem deploy configurado.

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
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
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
```

O repositório já inclui `supabase/config.toml` com confirmação de e-mail
habilitada, URL local e somente autenticação por e-mail e senha. A interface de
e-mails do ambiente local é informada pelo comando `npx supabase status`.

Use a URL e a chave publicável exibidas pelo ambiente local apenas no seu
`.env.local`. `supabase db reset` recria o banco local e reaplica as migrations;
não o execute contra um banco com dados que precisem ser preservados.

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

Quando um projeto remoto existir, as migrations poderão ser aplicadas pelo
fluxo oficial da CLI após autenticar e vincular explicitamente esse projeto.
Nenhum vínculo remoto ou deploy é realizado nesta fase.

### Preparação futura da Vercel

Quando o deploy for autorizado, importe o repositório na Vercel como projeto
Next.js e cadastre no ambiente de produção:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://<projeto>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<chave-publicavel>
APP_URL=https://<dominio-da-aplicacao>
```

Use somente a chave publicável nas variáveis `NEXT_PUBLIC_*`. Não cadastre uma
chave `service_role` no frontend. Antes de publicar, configure a mesma origem
de `APP_URL` como `Site URL` e URL de redirecionamento no Supabase Auth, aplique
as migrations ao projeto remoto e execute todos os comandos da seção
Qualidade. Estes passos são apenas documentação: este repositório continua sem
projeto remoto vinculado e sem deploy realizado.

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
