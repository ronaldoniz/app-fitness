# Software Requirements Specification (SRS)

# Projeto Evolução Fitness

| Campo | Valor |
| --- | --- |
| Documento | Especificação de Requisitos de Software |
| Projeto | Evolução Fitness |
| Versão da especificação | 1.0 |
| Idioma | Português brasileiro |
| Status | Revisão técnica estruturada para implementação |
| Data | Julho de 2026 |
| Formato recomendado para agentes | Markdown |

## Controle de Leitura para Codex

Este documento é a fonte de referência funcional, técnica e de produto para implementação da versão 1.0 do Evolução Fitness.

Ao usar esta especificação para gerar código, revisar código, criar tarefas, validar telas ou propor mudanças, o agente deverá obedecer às seguintes regras:

- Não acrescentar funcionalidades fora do escopo da versão 1.0.
- Não remover requisitos funcionais, regras de negócio, restrições ou premissas.
- Não alterar decisões arquiteturais registradas.
- Quando houver dúvida entre reorganizar o documento e preservar o conteúdo, preservar o conteúdo.
- Tratar roadmap como planejamento futuro, não como escopo da versão 1.0.
- Tratar indicadores derivados como cálculos, não como dados persistidos independentes.
- Tratar segurança e isolamento por usuário como obrigação de banco e autenticação, não apenas como controle visual.

## Sumário

1. Visão Geral
2. Objetivos
3. Escopo da Versão 1.0
4. Arquitetura e Tecnologias
5. Perfis de Usuário e Contexto de Uso
6. Modelo Conceitual de Dados
7. Regras de Negócio
8. Requisitos Funcionais
9. Requisitos Não Funcionais
10. Fluxos Principais
11. Dashboard
12. Interface, Navegação e Design System
13. Exportação de Dados
14. PWA
15. Segurança, Privacidade e Integridade
16. Critérios Gerais de Aceite
17. Roadmap Fora do Escopo da Versão 1.0
18. Registro de Decisões Arquiteturais
19. Glossário
20. Restrições, Premissas e Dependências
21. Critérios de Aprovação da Especificação
22. Apêndice A: Histórico de Versões

## 1. Visão Geral

### 1.1 Nome do Projeto

O projeto será denominado **Evolução Fitness**.

Esse nome deverá ser utilizado:

- Como título da aplicação.
- Como nome exibido no PWA.
- Como identificação principal do produto na interface.

### 1.2 Descrição

O Evolução Fitness é uma Progressive Web App destinada ao acompanhamento da evolução corporal do usuário ao longo do tempo.

A aplicação permitirá:

- Registrar pesagens.
- Consultar histórico.
- Visualizar indicadores calculados automaticamente.
- Acompanhar metas de peso.

A primeira versão será voltada a uso individual. Ainda assim, deverá utilizar autenticação e banco de dados sincronizado para preservar as informações do usuário e permitir acesso em diferentes dispositivos.

### 1.3 Finalidade

A finalidade do projeto é fornecer ao usuário uma visão objetiva e histórica da própria evolução corporal.

A aplicação deverá reduzir a dependência de percepções subjetivas e oscilações pontuais por meio de:

- Dados organizados.
- Indicadores calculados.
- Gráficos.
- Médias.
- Histórico consultável.

A aplicação não terá finalidade médica, nutricional ou diagnóstica.

O IMC e demais indicadores serão apresentados como referências gerais, sem substituir avaliação profissional.

A versão 1.0 será destinada a usuários adultos e utilizará as faixas gerais de classificação de IMC adulto da Organização Mundial da Saúde como referência não médica.

### 1.4 Filosofia do Produto

A experiência do produto deverá seguir os seguintes princípios:

- **Simplicidade:** registrar uma pesagem deve ser rápido e exigir poucos passos.
- **Objetividade:** a aplicação deverá apresentar dados e tendências, evitando linguagem motivacional genérica.
- **Privacidade:** dados corporais e observações pertencem exclusivamente ao usuário autenticado.
- **Evolução incremental:** a versão 1.0 deverá ser funcional e enxuta, deixando recursos adicionais para versões futuras.

### 1.5 Plataforma

A aplicação deverá ser:

- Responsiva.
- Mobile-first.
- Instalável como PWA.
- Utilizável em smartphones.
- Utilizável em computadores.

Não faz parte da versão 1.0 desenvolver aplicativos nativos para Android ou iOS.

### 1.6 Idioma e Tema

Toda a interface deverá utilizar português brasileiro.

O tema escuro será o padrão inicial.

O usuário poderá alternar para:

- Tema claro.
- Preferência do sistema operacional.

## 2. Objetivos

### 2.1 Objetivo Geral

Desenvolver uma PWA moderna, segura, responsiva e de fácil utilização para acompanhamento da evolução corporal de usuários por meio de registros de peso, indicadores calculados e metas.

### 2.2 Objetivos da Versão 1.0

A versão 1.0 deverá:

- Permitir cadastro, login, logout, recuperação de senha e sessão persistente.
- Manter dados sincronizados em banco online associado à conta do usuário.
- Permitir registro, edição, exclusão e consulta de pesagens.
- Calcular automaticamente IMC, peso perdido, média móvel de sete dias, menor peso registrado e progresso até a meta.
- Apresentar Dashboard com visão resumida e gráfica da evolução.
- Permitir criação, edição, exclusão, ordenação, ativação e conclusão de metas.
- Permitir exportação dos dados em CSV e JSON.
- Ser instalável como PWA no Android e em desktop compatível.

### 2.3 Objetivos Técnicos

A implementação deverá:

- Manter separação clara entre interface, regras de negócio, autenticação e persistência.
- Evitar exposição de credenciais sensíveis no navegador ou no repositório.
- Garantir isolamento de dados entre usuários por autenticação e políticas de acesso no banco.
- Manter documentação suficiente para instalação, estudo, deploy e manutenção.
- Permitir evolução futura sem reescrita significativa da aplicação.

### 2.4 Objetivos de Experiência do Usuário

A aplicação deverá permitir uso sem treinamento prévio.

O usuário deverá conseguir:

- Registrar uma pesagem rapidamente.
- Visualizar sua evolução imediatamente.
- Compreender os indicadores sem conhecimento técnico.

### 2.5 Critérios de Sucesso

A versão 1.0 será considerada bem-sucedida quando o usuário conseguir:

- Criar uma conta.
- Configurar seu perfil.
- Registrar pesagens.
- Acompanhar metas.
- Visualizar o Dashboard.
- Exportar seus dados.
- Acessar as informações sincronizadas em mais de um dispositivo.

## 3. Escopo da Versão 1.0

### 3.1 Definição de Escopo

Este capítulo define as funcionalidades incluídas e excluídas da versão 1.0.

Qualquer funcionalidade não descrita como incluída deverá ser considerada fora do escopo desta entrega, salvo atualização formal da especificação.

### 3.2 Funcionalidades Incluídas

#### 3.2.1 Autenticação

A aplicação deverá incluir:

- Cadastro por e-mail e senha.
- Confirmação de e-mail.
- Login.
- Logout.
- Recuperação de senha.
- Sessão persistente.
- Exclusão da própria conta.

#### 3.2.2 Perfil

Cada usuário deverá possuir perfil com:

- Nome.
- E-mail.
- Altura.
- Peso inicial informado.
- Preferência de tema.
- Data de criação.

O peso inicial informado será referência de comparação e não deverá ser tratado como uma pesagem registrada.

#### 3.2.3 Pesagens

O usuário poderá criar, editar e excluir pesagens.

Cada pesagem terá os seguintes campos obrigatórios:

- Data.
- Peso.

Cada pesagem poderá conter os seguintes campos opcionais:

- Circunferência da cintura.
- Observações.

Não será permitido mais de um registro por usuário na mesma data.

#### 3.2.4 Histórico

O histórico deverá exibir as pesagens do usuário com:

- Data.
- Peso.
- IMC.
- Variação em relação ao registro anterior.
- Total perdido desde o peso inicial.
- Cintura, quando informada.
- Observações, quando existirem.

O histórico deverá permitir filtros por:

- 30 dias.
- 90 dias.
- Último ano.
- Período personalizado.
- Todo o histórico.

#### 3.2.5 Dashboard

O Dashboard deverá apresentar:

- Peso atual.
- Peso inicial.
- Total perdido.
- IMC atual.
- Classificação do IMC.
- Menor peso registrado.
- Meta ativa.
- Progresso até a meta.
- Média móvel de sete dias.
- Gráfico de evolução do peso.
- Últimas pesagens.

#### 3.2.6 Metas

O usuário poderá:

- Criar metas.
- Editar metas.
- Excluir metas.
- Ordenar metas.
- Ativar metas.

A aplicação deverá concluir a meta ativa quando o peso atual atingir ou ficar abaixo do peso-alvo. Para essa regra, peso atual significa o peso da pesagem cronologicamente mais recente, e a data de conclusão deverá ser a data civil dessa pesagem.

A condição deverá ser reavaliada após criar, editar ou excluir pesagens e após criar, editar ou ativar metas. Quando satisfeita, a meta deverá ser desativada automaticamente.

Uma meta concluída não poderá ser editada nem reativada, mas poderá ser excluída mediante confirmação.

#### 3.2.7 Exportação

A aplicação deverá permitir exportar dados do usuário autenticado em:

- CSV contendo somente o histórico tabular de pesagens.
- JSON contendo perfil, metas e pesagens.

A exportação não deverá incluir:

- Credenciais.
- Tokens.
- Informações internas de autenticação.

#### 3.2.8 PWA

A aplicação deverá possuir:

- Manifesto.
- Ícone próprio.
- Identidade visual.
- Modo de exibição independente.
- Cache de recursos estáticos necessário para instalação como PWA.

### 3.3 Funcionalidades Fora do Escopo

As seguintes funcionalidades não fazem parte da versão 1.0:

- Percentual de gordura.
- Massa muscular.
- Bioimpedância.
- Dobras cutâneas.
- Cálculo de calorias.
- Diário alimentar.
- Receitas.
- Contagem de calorias.
- Macronutrientes.
- Integração com aplicativos de dieta.
- Cadastro de treinos.
- Exercícios.
- Séries.
- Carga.
- Tempo de atividade.
- Integração com smartwatch.
- Registro de ingestão de água.
- Registro de sono.
- Registro de humor.
- Registro de energia.
- Registro de álcool.
- Registro de refeições fora da rotina.
- Adicionar amigos.
- Feed social.
- Ranking.
- Comentários.
- Curtidas.
- Compartilhamento público.
- Painel administrativo.
- Gerenciamento global de usuários.
- Sistema de convites.
- Gamificação com níveis, XP, moedas, missões ou recompensas.
- Funcionalidades baseadas em inteligência artificial.
- Aplicativos nativos para Android ou iOS.
- Gravação offline de novas pesagens.

### 3.4 Definição de MVP

A versão 1.0 será um MVP, mas deverá estar pronta para uso diário.

Não serão aceitas:

- Funcionalidades parcialmente implementadas.
- Telas marcadas como em construção.
- Fluxos essenciais incompletos.

## 4. Arquitetura e Tecnologias

### 4.1 Tecnologias Obrigatórias

A aplicação deverá utilizar:

- Next.js.
- React.
- TypeScript.
- Tailwind CSS.
- Supabase.
- Vercel.
- PWA.

### 4.2 Responsabilidades por Tecnologia

| Tecnologia | Responsabilidade |
| --- | --- |
| Next.js | Aplicação web e estrutura de rotas |
| React | Interface e componentes |
| TypeScript | Tipagem e segurança de desenvolvimento |
| Tailwind CSS | Estilização |
| Supabase Auth | Autenticação |
| Supabase PostgreSQL | Persistência |
| Supabase Row Level Security | Isolamento de dados por usuário |
| Vercel | Hospedagem |
| PWA | Instalação e comportamento semelhante a aplicativo |

### 4.3 Tecnologias Não Utilizadas na Versão 1.0

A versão 1.0 não utilizará:

- WordPress.
- Backend próprio completo.
- VPS.
- Servidor dedicado.
- cPanel.
- Infraestrutura manual.
- Firebase.
- MongoDB.
- Banco local como armazenamento principal.
- Aplicativos nativos Android ou iOS.
- Provedores OAuth, como Google ou GitHub, para autenticação.

### 4.4 Arquitetura Geral

A aplicação será uma interface web hospedada na Vercel, comunicando-se com o Supabase por HTTPS.

O Supabase será responsável por:

- Autenticação.
- Persistência dos dados.
- Autorização no nível do banco.

Não haverá backend próprio completo na versão 1.0.

### 4.5 Separação de Responsabilidades

A implementação deverá separar:

- Interface.
- Regras de negócio.
- Autenticação.
- Acesso a dados.
- Cálculos.
- Exportações.

Componentes visuais não deverão concentrar regras complexas nem depender diretamente de detalhes internos do banco.

### 4.6 Crescimento Futuro

A arquitetura deverá permitir futura inclusão de:

- Medidas corporais adicionais.
- Fotos.
- Hábitos.
- Notificações.
- Compartilhamento.
- Painel administrativo.
- Aplicativo Android empacotado.

Essas possibilidades futuras não fazem parte do escopo da versão 1.0.

## 5. Perfis de Usuário e Contexto de Uso

### 5.1 Público-alvo

O público-alvo inicial é:

- Usuário adulto individual que deseja acompanhar perda de peso e metas corporais.
- Uso inicial privado, com possibilidade de expansão futura.
- Usuários que acessam a aplicação por celular, desktop ou PWA instalado.

### 5.2 Contexto de Uso

O usuário deverá conseguir usar a aplicação em situações cotidianas, principalmente para:

- Registrar uma pesagem recente.
- Consultar evolução.
- Verificar progresso em relação a uma meta.
- Exportar dados próprios.

### 5.3 Limite de Responsabilidade do Produto

A aplicação deverá comunicar dados e indicadores de forma objetiva.

A aplicação não deverá se posicionar como ferramenta médica, nutricional, diagnóstica ou prescritiva.

## 6. Modelo Conceitual de Dados

### 6.1 Entidades Principais

As entidades principais são:

- Usuário autenticado.
- Perfil.
- Pesagem.
- Meta.

### 6.2 Usuário Autenticado

O usuário autenticado será gerenciado pelo serviço de autenticação.

Todos os dados funcionais deverão estar associados a um usuário autenticado.

### 6.3 Perfil

O perfil deverá pertencer a um único usuário autenticado.

O perfil deverá conter:

- Nome.
- E-mail.
- Altura.
- Peso inicial informado.
- Preferência de tema.
- Data de criação.
- Data de atualização.

O tema padrão deverá ser escuro.

### 6.4 Pesagem

Cada pesagem deverá pertencer a um único usuário autenticado.

Cada pesagem deverá conter:

- Data civil.
- Peso maior que zero.

Cada pesagem poderá conter:

- Circunferência da cintura maior que zero, quando informada.
- Observação opcional.

O sistema deverá impedir mais de uma pesagem do mesmo usuário na mesma data.

### 6.5 Meta

Cada meta deverá pertencer a um único usuário autenticado.

Cada meta deverá conter:

- Peso-alvo.
- Ordem de apresentação.
- Indicação de meta ativa.
- Data de conclusão opcional.

Um usuário deverá possuir no máximo uma meta ativa por vez.

Na criação de uma meta ou na alteração de seu peso-alvo, o peso-alvo deverá ser menor que o peso da pesagem cronologicamente mais recente. Quando ainda não houver pesagens, o peso-alvo deverá ser menor que o peso inicial informado. A ativação de uma meta existente não deverá revalidar seu alvo contra o peso atual; caso esse alvo já tenha sido atingido, a ativação deverá concluir a meta imediatamente.

Metas concluídas deverão permanecer inativas e não poderão ser editadas nem reativadas. O usuário poderá excluir uma meta concluída mediante confirmação.

### 6.6 Dados Derivados

Os seguintes dados não deverão ser tratados como dados independentes persistidos:

- IMC.
- Classificação de IMC.
- Média móvel.
- Variações.
- Total perdido.
- Progresso.
- Previsões.

Esses valores deverão ser calculados a partir dos dados persistidos.

A média móvel de sete dias deverá considerar as pesagens existentes na janela de sete datas civis encerrada na data da pesagem cronologicamente mais recente.

O progresso até a meta deverá ser calculado pela fórmula:

`(peso inicial informado - peso atual) / (peso inicial informado - peso-alvo) * 100`

O valor apresentado deverá ser limitado ao intervalo de 0% a 100%.

### 6.7 Exclusão

A exclusão da conta deverá remover os dados funcionais associados ao usuário, evitando registros órfãos.

A implementação deverá utilizar uma solução segura para remover a conta sem expor credenciais privilegiadas ao frontend.

## 7. Regras de Negócio

### RN-001: Peso Inicial

O peso inicial informado no perfil será usado como referência de comparação.

O peso inicial informado não deverá ser criado automaticamente como uma pesagem.

### RN-002: Pesagem por Data

Não será permitido mais de um registro de pesagem por usuário na mesma data civil.

### RN-003: Datas Futuras

O sistema deverá impedir registro de pesagens com datas futuras.

### RN-004: Valores Positivos

O sistema deverá rejeitar:

- Peso menor ou igual a zero.
- Altura menor ou igual a zero.
- Circunferência da cintura menor ou igual a zero, quando informada.

### RN-005: Vínculo com Usuário Autenticado

Perfis, pesagens e metas deverão pertencer ao usuário autenticado correspondente.

Nenhum usuário poderá consultar, alterar, exportar ou excluir dados de outro usuário.

### RN-006: Meta Ativa Única

Cada usuário deverá possuir no máximo uma meta ativa por vez.

### RN-007: Conclusão Automática de Meta

A aplicação deverá detectar automaticamente quando o peso atual atingir ou ficar abaixo do peso-alvo da meta ativa.

Para esta regra, o peso atual deverá ser sempre o da pesagem cronologicamente mais recente existente no histórico após a operação realizada.

Quando isso ocorrer, a aplicação deverá:

- Registrar como data de conclusão a data civil da pesagem cronologicamente mais recente.
- Desativar automaticamente a meta.
- Preservar a conclusão registrada mesmo após edição ou exclusão posterior de pesagens.

A condição deverá ser reavaliada após:

- Criação, edição ou exclusão de pesagem.
- Criação ou edição de meta.
- Ativação de meta.

A ativação de uma meta não concluída cujo alvo já tenha sido atingido pelo peso atual deverá concluir essa meta imediatamente.

### RN-008: Recálculo de Indicadores

Alterações em pesagens deverão recalcular os indicadores derivados.

Isso se aplica a:

- Criação de pesagem.
- Edição de pesagem.
- Exclusão de pesagem.

Após cada uma dessas operações, a conclusão da meta ativa também deverá ser reavaliada com base no histórico resultante.

### RN-009: Alteração de Altura

Alterar a altura do perfil deverá recalcular os IMCs exibidos.

### RN-010: Alteração do Peso Inicial

Alterar o peso inicial informado não deverá alterar pesagens registradas.

### RN-011: Dados Ausentes

Valores ausentes não deverão ser interpretados como zero.

### RN-012: Datas Civis

Pesagens com datas civis não deverão sofrer alteração indevida por conversão de fuso horário.

### RN-013: Validade do Peso-Alvo

Como a versão 1.0 será voltada exclusivamente à perda de peso, na criação de uma meta ou alteração de seu peso-alvo o novo valor deverá ser menor que:

- O peso da pesagem cronologicamente mais recente, quando houver pesagens.
- O peso inicial informado, quando ainda não houver pesagens.

A simples ativação de uma meta existente não altera seu peso-alvo e não deverá aplicar novamente essa validação. A ativação deverá reavaliar a conclusão contra o peso atual.

### RN-014: Gestão de Meta Concluída

Uma meta concluída:

- Deverá permanecer inativa.
- Não poderá ser editada.
- Não poderá ser reativada.
- Poderá ser excluída pelo usuário mediante confirmação.

### RN-015: Média Móvel de Sete Dias

A média móvel deverá considerar as pesagens existentes na janela de sete datas civis encerrada na data da pesagem cronologicamente mais recente.

### RN-016: Progresso até a Meta

O progresso deverá utilizar o peso inicial informado como referência e ser calculado pela fórmula:

`(peso inicial informado - peso atual) / (peso inicial informado - peso-alvo) * 100`

O valor apresentado deverá ser limitado ao intervalo de 0% a 100%.

### RN-017: Classificação de IMC

A classificação de IMC deverá utilizar as faixas gerais de IMC adulto da Organização Mundial da Saúde.

A classificação será apresentada como referência geral e não médica. A versão 1.0 não coletará idade nem data de nascimento.

## 8. Requisitos Funcionais

### RF-001: Cadastro de Usuário

O sistema deverá permitir que um novo usuário crie conta utilizando:

- Nome.
- E-mail.
- Senha.
- Confirmação de senha.

O sistema deverá:

- Validar os dados.
- Impedir senhas divergentes.
- Informar e-mails já cadastrados quando aplicável.
- Solicitar confirmação do e-mail antes do uso completo da aplicação.
- Armazenar o nome informado nos metadados do usuário no Supabase Auth até a conclusão do onboarding.

Critérios de aceite:

- O usuário consegue iniciar cadastro com e-mail e senha.
- O sistema impede cadastro com confirmação de senha divergente.
- O sistema solicita confirmação de e-mail.
- O nome informado no cadastro fica disponível para preenchimento automático do onboarding.
- Após confirmação e autenticação, o usuário segue para o onboarding quando ainda não possui perfil completo.

### RF-002: Login

O sistema deverá permitir autenticação por e-mail e senha.

Após login bem-sucedido:

- O usuário deverá ser direcionado ao Dashboard, quando possuir perfil completo.
- O usuário deverá ser direcionado ao onboarding, quando ainda não possuir perfil completo.

Critérios de aceite:

- O usuário autenticado acessa a área privada.
- O usuário não autenticado não acessa informações privadas.
- A sessão persistente mantém o acesso conforme comportamento esperado de autenticação.

### RF-003: Recuperação de Senha

O sistema deverá permitir solicitar redefinição de senha por e-mail.

O usuário deverá:

- Receber instruções.
- Definir uma nova senha.
- Conseguir acessar a aplicação com a nova credencial.

Critérios de aceite:

- O fluxo de recuperação pode ser iniciado a partir da área de autenticação.
- A nova senha substitui a credencial anterior.
- O usuário consegue realizar login com a nova senha.

### RF-004: Logout

O sistema deverá permitir encerrar a sessão.

Após logout:

- Informações privadas não deverão permanecer acessíveis.
- O usuário deverá retornar à área de autenticação.

Critérios de aceite:

- O usuário consegue sair da conta.
- Rotas privadas deixam de ser acessíveis após logout.

### RF-005: Onboarding

No primeiro acesso após autenticação, quando ainda não houver perfil configurado, o sistema deverá solicitar:

- Nome, preenchido inicialmente com o valor armazenado nos metadados do Supabase Auth.
- Altura.
- Peso inicial informado.
- Primeira meta.

O usuário poderá alterar o nome sugerido antes de concluir o onboarding. O nome somente deverá integrar o perfil funcional após essa conclusão.

Após concluir o onboarding, o usuário deverá acessar o Dashboard.

Critérios de aceite:

- Usuários sem perfil completo passam pelo onboarding.
- O nome informado no cadastro é apresentado automaticamente no campo correspondente.
- O onboarding cria o perfil funcional.
- O perfil funcional utiliza o nome confirmado no onboarding.
- O onboarding cria a primeira meta.
- O usuário é direcionado ao Dashboard após concluir o fluxo.

### RF-006: Registro de Pesagem

O usuário deverá conseguir registrar uma pesagem informando:

- Data.
- Peso.

A data atual deverá ser sugerida por padrão.

Campos opcionais:

- Circunferência da cintura.
- Observação.

O sistema deverá impedir:

- Datas futuras.
- Valores não positivos.
- Mais de uma pesagem na mesma data.

Critérios de aceite:

- Uma pesagem válida é salva para o usuário autenticado.
- Uma pesagem inválida é rejeitada com mensagem compreensível.
- Após salvar, Dashboard, histórico, gráficos e metas refletem o novo registro.
- A meta ativa é reavaliada usando a pesagem cronologicamente mais recente após o registro.

### RF-007: Edição de Pesagem

O usuário deverá conseguir editar qualquer informação de uma pesagem própria.

Após salvar, deverão refletir a alteração:

- Dashboard.
- Histórico.
- Gráficos.
- Indicadores.

Critérios de aceite:

- O usuário edita apenas pesagens próprias.
- As mesmas validações de registro se aplicam à edição.
- Indicadores derivados são recalculados após a alteração.
- A meta ativa é reavaliada usando a pesagem cronologicamente mais recente após a edição.

### RF-008: Exclusão de Pesagem

O usuário deverá conseguir excluir uma pesagem própria mediante confirmação.

Após a exclusão, todos os indicadores derivados deverão ser recalculados com base no histórico restante.

Critérios de aceite:

- A ação destrutiva exige confirmação.
- O registro deixa de aparecer no histórico.
- Dashboard, gráficos, metas e indicadores refletem o histórico restante.
- A meta ativa é reavaliada usando a pesagem cronologicamente mais recente do histórico restante.

### RF-009: Consulta do Histórico

O usuário deverá consultar suas pesagens em lista ou tabela adaptada ao dispositivo.

O histórico deverá permitir filtros por período e apresentar informações calculadas relevantes para cada registro.

Critérios de aceite:

- O histórico exibe apenas pesagens do usuário autenticado.
- Os filtros disponíveis incluem 30 dias, 90 dias, último ano, período personalizado e todo o histórico.
- A visualização permanece utilizável em dispositivos móveis e desktops.

### RF-010: Dashboard

O sistema deverá apresentar uma tela inicial com:

- Resumo da evolução.
- Indicadores atuais.
- Meta ativa.
- Gráfico de peso.
- Últimas pesagens.

As informações deverão refletir sempre os dados do usuário autenticado.

Critérios de aceite:

- O Dashboard carrega após login.
- O Dashboard usa apenas dados do usuário autenticado.
- Alterações nas pesagens refletem na tela sem atualização manual.
- A tela permanece utilizável em dispositivos móveis e desktops.

### RF-011: Gerenciamento de Metas

O usuário deverá:

- Criar metas.
- Editar metas.
- Excluir metas.
- Ordenar metas.
- Definir metas como ativas.

O sistema deverá:

- Permitir apenas uma meta ativa por vez.
- Exigir, na criação da meta ou edição de seu peso-alvo, que o alvo seja menor que a pesagem cronologicamente mais recente ou, sem pesagens, menor que o peso inicial informado.
- Registrar automaticamente a conclusão quando o peso atual, definido pela pesagem cronologicamente mais recente, atingir ou ficar abaixo do alvo da meta ativa.
- Reavaliar essa condição após criar, editar ou excluir pesagens e após criar, editar ou ativar metas.
- Usar a data civil da pesagem cronologicamente mais recente como data de conclusão.
- Desativar automaticamente a meta concluída.
- Impedir a edição e a reativação de metas concluídas.
- Permitir a exclusão de metas concluídas mediante confirmação.
- Preservar a conclusão registrada após alterações posteriores no histórico de pesagens.

Critérios de aceite:

- O usuário gerencia apenas metas próprias.
- Ativar uma meta respeita a regra de meta ativa única.
- Pesos-alvo inválidos para perda de peso são rejeitados com mensagem compreensível.
- Criar, editar ou ativar uma meta reavalia sua conclusão com base no peso atual.
- Criar, editar ou excluir uma pesagem reavalia a meta ativa com base na pesagem cronologicamente mais recente do histórico resultante.
- Quando o peso atual atinge o alvo, a data civil dessa pesagem é registrada como data de conclusão e a meta é desativada.
- Uma meta concluída não pode ser editada nem reativada.
- Uma meta concluída somente é excluída após confirmação.
- Metas concluídas permanecem registradas como marcos históricos enquanto não forem excluídas pelo usuário.

### RF-012: Configurações

O usuário deverá alterar:

- Nome.
- Altura.
- Peso inicial informado.
- Preferência de tema.

Alterar a altura deverá recalcular IMCs exibidos.

Alterar o peso inicial não deverá alterar pesagens registradas.

Critérios de aceite:

- Alterações de perfil são persistidas para o usuário autenticado.
- A preferência de tema é aplicada conforme opção escolhida.
- Indicadores dependentes de altura ou peso inicial refletem alterações de configuração.

### RF-013: Exportação

O usuário deverá exportar seus dados em:

- CSV contendo o histórico tabular de pesagens.
- JSON contendo perfil, metas e pesagens.

Os arquivos deverão conter apenas dados próprios e deverão identificar claramente:

- Datas.
- Unidades.
- Tipo de conteúdo.

Os arquivos não deverão conter:

- Credenciais.
- Tokens.
- Informações internas de autenticação.

Critérios de aceite:

- O usuário autenticado consegue exportar seus próprios dados.
- A exportação em CSV é gerada somente com o histórico tabular de pesagens.
- A exportação em JSON é gerada com perfil, metas e pesagens.
- Nenhum dado de outro usuário aparece na exportação.
- Nenhuma credencial ou token aparece nos arquivos exportados.

### RF-014: Exclusão da Conta

O usuário deverá conseguir solicitar exclusão da própria conta.

A operação deverá:

- Exigir confirmação.
- Informar suas consequências.
- Remover dados funcionais associados.
- Encerrar a sessão.

Critérios de aceite:

- A exclusão não ocorre sem confirmação.
- Dados funcionais associados ao usuário são removidos.
- A sessão é encerrada após a exclusão.
- A implementação não expõe credenciais privilegiadas ao frontend.

### RF-015: PWA

A aplicação deverá ser instalável em dispositivos compatíveis.

A aplicação deverá apresentar:

- Nome próprio.
- Ícone próprio.
- Modo independente quando instalada.

Critérios de aceite:

- A aplicação possui manifesto.
- A aplicação possui ícones configurados.
- A aplicação pode ser instalada em ambientes compatíveis.
- Quando instalada, abre em modo independente.

## 9. Requisitos Não Funcionais

### RNF-001: Responsividade

A aplicação deverá adotar abordagem mobile-first e permanecer utilizável em:

- Smartphones.
- Tablets.
- Notebooks.
- Desktops.

Não deverá haver rolagem horizontal involuntária.

Botões, campos, gráficos e tabelas deverão se adaptar ao tamanho da tela.

### RNF-002: Segurança

Todos os dados privados deverão ser protegidos por autenticação e autorização.

Nenhum usuário poderá visualizar ou alterar dados de outro usuário.

A segurança deverá existir no banco de dados, não apenas na interface.

Chaves privilegiadas não poderão ser expostas no navegador.

### RNF-003: Privacidade

A aplicação deverá coletar apenas os dados necessários ao escopo da versão 1.0.

Não haverá:

- Publicidade.
- Rastreamento comportamental de terceiros.
- Compartilhamento social.
- Publicação de dados.

### RNF-004: Integridade

O sistema deverá garantir consistência dos dados, incluindo:

- Unicidade de pesagem por usuário e data.
- Rejeição de datas futuras.
- Rejeição de valores não positivos.
- Vínculo correto entre dados e usuário autenticado.

### RNF-005: Desempenho

A aplicação deverá permanecer fluida para uso diário em dispositivos móveis comuns.

Consultas e gráficos deverão continuar utilizáveis mesmo com milhares de registros.

### RNF-006: Disponibilidade

A aplicação dependerá de:

- Vercel.
- Supabase.
- Serviço de e-mail do Supabase Auth.

Falhas temporárias deverão ser comunicadas de forma compreensível, sem indicar sucesso antes da confirmação da operação.

### RNF-007: Usabilidade

O registro de uma pesagem comum deverá exigir poucos passos.

A aplicação deverá:

- Identificar campos opcionais.
- Explicar problemas em mensagens de erro.
- Exigir confirmação para ações destrutivas.
- Orientar o próximo passo útil em estados vazios.

### RNF-008: Acessibilidade

A aplicação deverá seguir boas práticas compatíveis com WCAG 2.1 nível AA quando aplicável, incluindo:

- Contraste adequado.
- Navegação por teclado.
- Rótulos em campos.
- Foco visível.
- Nomes acessíveis para ícones.
- Resumo textual para gráficos.

### RNF-009: Compatibilidade

A aplicação deverá priorizar:

- Chrome no Android.
- Chrome desktop.
- Edge.
- Firefox.
- Safari recentes.

Quando a instalação como PWA não estiver disponível, a aplicação deverá continuar utilizável como site responsivo.

### RNF-010: Confiabilidade dos Cálculos

Indicadores derivados deverão ser calculados a partir de dados brutos e de forma consistente.

Valores ausentes não deverão ser interpretados como zero.

Pesagens com datas civis não deverão sofrer alteração indevida por conversão de fuso horário.

### RNF-011: Manutenibilidade

O código deverá priorizar:

- Clareza.
- Separação de responsabilidades.
- Nomes descritivos.
- Tipagem consistente.
- Ausência de abstrações desnecessárias.

O projeto também deverá servir como base de estudo de Next.js, TypeScript e Supabase.

### RNF-012: Testabilidade

As regras centrais deverão poder ser testadas isoladamente, especialmente:

- Cálculos.
- Validações.

A documentação deverá informar como executar:

- Testes.
- Verificação de tipos.
- Lint.
- Build.

### RNF-013: Localidade

Datas, números e unidades deverão seguir padrão brasileiro.

Pesos serão exibidos em quilogramas.

Medidas serão exibidas em centímetros.

### RNF-014: PWA e Cache

A aplicação deverá atender aos requisitos técnicos para instalação como PWA.

O cache poderá armazenar recursos estáticos, mas não será fonte principal dos dados do usuário.

### RNF-015: Documentação

O repositório deverá conter documentação suficiente para:

- Instalação.
- Configuração de variáveis de ambiente.
- Execução local.
- Configuração do Supabase.
- Deploy na Vercel.
- Comandos de qualidade.
- Limitações conhecidas.

## 10. Fluxos Principais

### 10.1 Primeiro Acesso

1. O usuário acessa a aplicação.
2. Seleciona criar conta.
3. Informa nome, e-mail, senha e confirmação.
4. Confirma o e-mail quando solicitado.
5. Realiza o primeiro login.
6. Preenche onboarding com altura, peso inicial e primeira meta.
7. É direcionado ao Dashboard.

### 10.2 Registro de Pesagem

1. O usuário acessa a área de registro.
2. A data atual é apresentada como padrão.
3. O usuário informa peso.
4. Opcionalmente informa cintura e observação.
5. O sistema valida os dados.
6. A pesagem é salva.
7. Dashboard, histórico, gráficos e metas são atualizados.

### 10.3 Consulta e Manutenção do Histórico

1. O usuário acessa o histórico.
2. O sistema exibe as pesagens do usuário autenticado.
3. O usuário aplica filtros quando necessário.
4. O usuário seleciona uma pesagem para edição ou exclusão quando necessário.
5. O sistema valida a operação.
6. O sistema atualiza indicadores, Dashboard e gráficos após alterações.

### 10.4 Gerenciamento de Metas

1. O usuário acessa a tela de metas.
2. O usuário cria, edita, exclui, reordena ou ativa metas.
3. O sistema garante que apenas uma meta fique ativa.
4. Após criar, editar ou ativar uma meta, o sistema reavalia a meta ativa contra o peso da pesagem cronologicamente mais recente.
5. Quando esse peso atinge ou fica abaixo do alvo, o sistema usa a data civil da pesagem mais recente para registrar a conclusão e desativa a meta.
6. Metas concluídas permanecem disponíveis como marcos históricos enquanto não forem excluídas pelo usuário.
7. Metas concluídas não podem ser editadas nem reativadas e somente podem ser excluídas mediante confirmação.

### 10.5 Configurações e Exportação

1. O usuário acessa configurações.
2. O usuário altera dados de perfil ou preferência de tema quando necessário.
3. O usuário exporta informações em CSV ou JSON quando necessário.
4. O usuário pode sair da conta.
5. O usuário pode solicitar exclusão definitiva da conta.

### 10.6 Estados Vazios e Erros

Quando não houver pesagens, metas ou resultados para um filtro, a aplicação deverá informar a condição e orientar a próxima ação útil.

Em falhas de conexão, autenticação ou salvamento, a aplicação deverá informar que a operação não foi concluída.

## 11. Dashboard

### 11.1 Objetivo

O Dashboard será a tela inicial após autenticação e deverá apresentar um resumo objetivo da evolução do usuário.

### 11.2 Conteúdo Obrigatório

O Dashboard deverá exibir:

- Peso atual.
- Peso inicial informado.
- Total perdido.
- IMC atual.
- Classificação do IMC.
- Menor peso registrado.
- Meta ativa.
- Quanto falta para a meta.
- Progresso percentual.
- Média móvel dos últimos sete dias.
- Gráfico de evolução do peso.
- Últimas pesagens.

A média móvel deverá considerar as pesagens existentes na janela de sete datas civis encerrada na data da pesagem cronologicamente mais recente.

O progresso percentual deverá utilizar o peso inicial informado como referência, seguir a fórmula `(peso inicial informado - peso atual) / (peso inicial informado - peso-alvo) * 100` e ser apresentado no intervalo de 0% a 100%.

A classificação de IMC deverá utilizar as faixas gerais de IMC adulto da Organização Mundial da Saúde e ser apresentada como referência não médica.

### 11.3 Estados do Dashboard

#### 11.3.1 Sem Pesagens

Quando não houver pesagens, o Dashboard deverá orientar o registro da primeira pesagem.

#### 11.3.2 Com Uma Pesagem

Com uma única pesagem, o Dashboard deverá exibir os indicadores possíveis.

Indicadores que dependam de histórico deverão ser ocultados ou sinalizados.

#### 11.3.3 Com Histórico Suficiente

Com histórico suficiente, todos os indicadores deverão ser exibidos.

### 11.4 Critérios de Aceite do Dashboard

- O Dashboard carrega após o login.
- Todas as informações pertencem ao usuário autenticado.
- Alterações nas pesagens refletem na tela sem atualização manual.
- A tela permanece utilizável em dispositivos móveis e desktops.

## 12. Interface, Navegação e Design System

### 12.1 Princípios de Interface

A interface deverá priorizar:

- Simplicidade.
- Legibilidade.
- Consistência.
- Objetividade.
- Rapidez de uso.

O visual deverá ser próprio e não deverá reproduzir interfaces de terceiros.

### 12.2 Tema

O tema escuro deverá ser o padrão.

O usuário poderá escolher:

- Tema claro.
- Tema escuro.
- Seguir sistema operacional.

### 12.3 Navegação

A navegação deverá permitir acesso às seguintes áreas autenticadas:

- Dashboard.
- Registrar Peso.
- Histórico.
- Metas.
- Configurações.

No mobile, a navegação deverá favorecer acesso rápido às funções principais.

No desktop, a navegação poderá utilizar um padrão mais amplo.

### 12.4 Componentes e Feedback

Os seguintes elementos deverão manter comportamento consistente:

- Botões.
- Campos.
- Cartões.
- Diálogos.
- Mensagens.
- Indicadores.

Toda ação do usuário deverá apresentar retorno visual adequado, incluindo:

- Carregamento.
- Sucesso.
- Erro.
- Confirmação.

### 12.5 Linguagem

As mensagens deverão ser claras, objetivas e compreensíveis para usuários não técnicos.

A aplicação deverá evitar mensagens motivacionais genéricas e priorizar informações factuais.

## 13. Exportação de Dados

### 13.1 Formatos

A aplicação deverá permitir exportação nos formatos:

- CSV, para o histórico tabular de pesagens.
- JSON, para o conjunto de perfil, metas e pesagens.

### 13.2 Conteúdo

Os arquivos exportados deverão conter apenas dados do usuário autenticado.

O arquivo CSV deverá conter somente o histórico tabular de pesagens.

O arquivo JSON deverá conter:

- Perfil.
- Metas.
- Pesagens.

Os arquivos deverão identificar claramente:

- Datas.
- Unidades.
- Tipo de conteúdo.

### 13.3 Exclusões Obrigatórias

A exportação não deverá incluir:

- Credenciais.
- Tokens.
- Informações internas de autenticação.

## 14. PWA

### 14.1 Instalação

A aplicação deverá ser instalável em dispositivos compatíveis.

### 14.2 Manifesto e Identidade

A aplicação deverá possuir:

- Manifesto.
- Nome Evolução Fitness.
- Ícone próprio.
- Identidade visual própria.

### 14.3 Modo de Exibição

Quando instalada, a aplicação deverá abrir em modo independente.

### 14.4 Cache

O cache poderá armazenar recursos estáticos necessários para instalação e experiência PWA.

O cache não deverá ser fonte principal dos dados do usuário.

### 14.5 Limite Offline

A gravação offline de novas pesagens está fora do escopo da versão 1.0.

## 15. Segurança, Privacidade e Integridade

### 15.1 Autenticação

A aplicação deverá exigir autenticação para acesso a dados privados.

### 15.2 Autorização

A autorização deverá impedir acesso entre usuários.

Essa proteção deverá existir no banco de dados por políticas de acesso, não apenas na interface.

### 15.3 Credenciais

Credenciais sensíveis e chaves privilegiadas não poderão ser expostas:

- No navegador.
- No repositório.

### 15.4 Dados Coletados

A aplicação deverá coletar apenas dados necessários ao escopo da versão 1.0.

### 15.5 Exclusão de Conta

A exclusão da própria conta deverá:

- Exigir confirmação.
- Informar consequências.
- Remover dados funcionais associados.
- Encerrar sessão.
- Evitar registros órfãos.
- Não expor credenciais privilegiadas ao frontend.

## 16. Critérios Gerais de Aceite

A versão 1.0 será considerada aceita quando:

- Todos os requisitos funcionais da versão 1.0 estiverem implementados.
- Todos os requisitos não funcionais aplicáveis estiverem atendidos.
- Cadastro, confirmação, login, recuperação de senha e logout funcionarem.
- Onboarding criar perfil e primeira meta.
- Pesagens puderem ser criadas, editadas, excluídas e consultadas.
- Dashboard e gráficos refletirem os dados corretamente.
- Metas forem gerenciáveis e concluídas quando o peso da pesagem cronologicamente mais recente atingir ou ficar abaixo do alvo, com reavaliação após as operações definidas.
- Exportações do histórico de pesagens em CSV e dos dados completos em JSON estiverem disponíveis.
- Dados de usuários diferentes permanecerem isolados.
- A aplicação estiver publicada na Vercel.
- O banco estiver configurado no Supabase.
- A aplicação puder ser instalada como PWA.
- Não existirem credenciais versionadas.
- O repositório possuir documentação suficiente para instalação, deploy e manutenção.

## 17. Roadmap Fora do Escopo da Versão 1.0

Os itens abaixo representam possibilidades futuras e não fazem parte da versão 1.0.

### 17.1 Versão 1.1

- Importação de backup JSON.
- Melhorias de usabilidade.
- Filtros adicionais no histórico.
- Melhorias de acessibilidade.

### 17.2 Versão 1.2

- Medidas corporais adicionais.
- Fotografias de evolução.
- Estatísticas mais completas.

### 17.3 Versão 2.0

- Notificações.
- Hábitos.
- Integração com dispositivos.
- Compartilhamento opcional.
- Painel administrativo.

## 18. Registro de Decisões Arquiteturais

| ID | Decisão | Justificativa |
| --- | --- | --- |
| ADR-001 | Utilizar PWA | Reduz custo e complexidade da versão inicial. |
| ADR-002 | Utilizar Supabase | Permite autenticação, banco online e sincronização entre dispositivos. |
| ADR-003 | Utilizar Vercel | Simplifica publicação e atende ao escopo do MVP. |
| ADR-004 | Não utilizar backend próprio completo | Reduz infraestrutura e manutenção na versão 1.0. |
| ADR-005 | Separar peso inicial de pesagens | Preserva o histórico e evita criar medição fictícia. |
| ADR-006 | Tema escuro como padrão | Decisão de produto definida para a experiência inicial. |
| ADR-007 | Dashboard como tela inicial | Facilita acompanhamento diário. |
| ADR-008 | Uma pesagem por dia | Simplifica o histórico e evita inconsistências. |
| ADR-009 | Indicadores calculados | Evita duplicação e divergência de dados. |
| ADR-010 | Metas concluídas permanecem concluídas | Mantém histórico de marcos atingidos. |
| ADR-011 | Roadmap separado do escopo | Evita crescimento descontrolado da versão 1.0. |
| ADR-012 | Destinar a versão 1.0 a adultos e à perda de peso | Mantém coerência entre metas, indicadores e classificação de IMC. |
| ADR-013 | Usar sete datas civis na média móvel | Evita interpretar sete pesagens como sete dias. |
| ADR-014 | Concluir metas pelo peso atual após operações relevantes | Usa sempre a pesagem cronologicamente mais recente e reavalia a condição após alterações em pesagens ou metas. |
| ADR-015 | Limitar o progresso apresentado entre 0% e 100% | Mantém o indicador visual dentro do intervalo esperado. |
| ADR-016 | Exportar histórico em CSV e dados completos em JSON | Adequa cada formato ao tipo de conteúdo. |
| ADR-017 | Reutilizar no onboarding o nome informado no cadastro | Evita entrada repetida e adia a criação do perfil funcional até o onboarding. |

## 19. Glossário

| Termo | Definição |
| --- | --- |
| Aplicação | Sistema Evolução Fitness, desenvolvido como PWA. |
| Usuário | Pessoa adulta autenticada que utiliza a aplicação para registrar e acompanhar sua perda de peso. |
| Perfil | Conjunto de informações permanentes do usuário usadas pela aplicação. |
| Peso inicial informado | Valor cadastrado no onboarding como ponto de partida. Não corresponde necessariamente à primeira pesagem. |
| Pesagem | Registro individual com data e peso, podendo conter cintura e observações. |
| Histórico | Conjunto de todas as pesagens registradas pelo usuário. |
| Meta | Objetivo de peso definido pelo usuário. |
| Meta ativa | Meta atualmente usada como referência principal no Dashboard. |
| Meta concluída | Meta anteriormente ativa cujo peso atual, definido pela pesagem cronologicamente mais recente no momento da avaliação, atingiu ou ficou abaixo do alvo, ficando inativa e preservada como marco histórico enquanto não for excluída pelo usuário. |
| Dashboard | Tela inicial autenticada com resumo dos indicadores principais. |
| Indicador | Informação calculada automaticamente a partir dos dados registrados. |
| IMC | Índice de Massa Corporal calculado a partir do peso e da altura. |
| Média móvel | Média das pesagens existentes na janela de sete datas civis encerrada na pesagem cronologicamente mais recente. |
| Onboarding | Fluxo inicial para coletar dados mínimos do usuário. |
| PWA | Aplicação web instalável com comportamento semelhante a aplicativo nativo. |
| Exportação | Funcionalidade que permite obter cópia dos próprios dados. |
| Roadmap | Lista de funcionalidades planejadas para versões futuras, fora da versão 1.0. |

## 20. Restrições, Premissas e Dependências

### 20.1 Premissas

- O usuário possui acesso à internet durante uso normal.
- Supabase e Vercel estarão disponíveis durante operação normal.
- O usuário utilizará navegador moderno.
- Cada usuário utilizará sua própria conta.
- O e-mail informado é válido e acessível pelo usuário.

### 20.2 Restrições

- Versão 1.0 destinada a usuários adultos.
- Metas voltadas exclusivamente à perda de peso.
- Idioma exclusivo em português brasileiro na versão 1.0.
- Autenticação apenas por e-mail e senha.
- Sem gravação offline de dados.
- Sem integração com dispositivos externos.
- Sem funcionalidades sociais.
- Sem aplicativo nativo.
- Sem inteligência artificial.
- Sem painel administrativo.

### 20.3 Dependências Externas

A aplicação depende de:

- Supabase.
- Vercel.
- Serviço de envio de e-mails utilizado pelo Supabase Auth.

Falhas nesses serviços poderão impactar funcionalidades específicas.

## 21. Critérios de Aprovação da Especificação

Esta especificação estará aprovada para início do desenvolvimento quando:

- Todos os capítulos forem revisados.
- Não houver conflitos entre requisitos.
- O escopo da versão 1.0 estiver claro.
- Os critérios de aceite estiverem documentados.
- O roadmap estiver separado do escopo atual.

Após a aprovação, alterações relevantes deverão ser registradas por controle de versão da documentação.

Ajustes exclusivamente editoriais não precisam ser tratados como mudanças de escopo.

## 22. Apêndice A: Histórico de Versões

| Versão | Data | Descrição |
| --- | --- | --- |
| 1.0 | Julho de 2026 | Primeira versão consolidada da especificação do projeto Evolução Fitness. |
| 1.0-codex | Julho de 2026 | Revisão técnica em Markdown estruturada para leitura, interpretação e execução por Codex, preservando escopo, regras de negócio e decisões arquiteturais. |
| 1.0-codex.1 | Julho de 2026 | Incorporação das decisões consolidadas sobre público adulto, perda de peso, metas, cálculos, onboarding e exportação. |
| 1.0-codex.2 | Julho de 2026 | Correção da conclusão de metas para usar o peso atual e reavaliar a condição após alterações em pesagens e metas. |
