# Software Requirements Specification

**Projeto Evolução Fitness**

| Documento | Especificação de Requisitos de Software (SRS) |
| --- | --- |
| Projeto | Evolução Fitness |
| Versão | 1.0 |
| Idioma | Português brasileiro |
| Status | Rascunho consolidado para revisão editorial |
| Data | Julho de 2026 |

# Sumário

- 1. Introdução
- 2. Objetivos do Projeto
- 3. Escopo da Versão 1.0
- 4. Tecnologias e Arquitetura
- 5. Requisitos Funcionais
- 6. Requisitos Não Funcionais
- 7. Modelo de Dados Conceitual
- 8. Fluxos da Aplicação
- 9. Dashboard
- 10. Interface e Design System
- 11. Roadmap
- 12. Critérios Gerais de Aceite
- 13. Registro de Decisões Arquiteturais
- 14. Glossário e Definições
- 15. Restrições e Premissas
- 16. Critérios de Aprovação da Especificação
- Apêndice A. Histórico de Versões

# 1. Introdução

## 1.1 Nome do Projeto

O projeto será denominado Evolução Fitness. Esse nome deverá ser utilizado como título da aplicação e como nome exibido no PWA.

## 1.2 Descrição

O Evolução Fitness é uma Progressive Web App destinada ao acompanhamento da evolução corporal do usuário ao longo do tempo. A aplicação permitirá registrar pesagens, consultar histórico, visualizar indicadores calculados automaticamente e acompanhar metas de peso.

A primeira versão será voltada a uso individual, mas deverá utilizar autenticação e banco de dados sincronizado para preservar as informações do usuário e permitir acesso em diferentes dispositivos.

## 1.3 Finalidade

A finalidade do projeto é fornecer ao usuário uma visão objetiva e histórica da própria evolução corporal. A aplicação deverá reduzir a dependência de percepções subjetivas e oscilações pontuais por meio de dados organizados, gráficos e médias.

A aplicação não terá finalidade médica, nutricional ou diagnóstica. O IMC e demais indicadores serão apresentados como referências gerais, sem substituir avaliação profissional.

## 1.4 Público-alvo

- Usuário individual que deseja acompanhar peso e metas corporais.
- Uso inicial privado, com possibilidade de expansão futura.
- Usuários que acessam a aplicação por celular, desktop ou PWA instalado.

## 1.5 Filosofia do Produto

- Simplicidade: registrar uma pesagem deve ser rápido e exigir poucos passos.
- Objetividade: a aplicação deverá apresentar dados e tendências, evitando linguagem motivacional genérica.
- Privacidade: dados corporais e observações pertencem exclusivamente ao usuário autenticado.
- Evolução incremental: a versão 1.0 deverá ser funcional e enxuta, deixando recursos adicionais para versões futuras.

## 1.6 Plataforma

A aplicação deverá ser responsiva, mobile-first, instalável como PWA e utilizável tanto em smartphones quanto em computadores. Não faz parte da versão 1.0 desenvolver aplicativos nativos para Android ou iOS.

## 1.7 Idioma e Tema

Toda a interface deverá utilizar português brasileiro. O tema escuro será o padrão inicial, com possibilidade de alternar para tema claro ou seguir a configuração do sistema operacional.

# 2. Objetivos do Projeto

## 2.1 Objetivo Geral

Desenvolver uma PWA moderna, segura, responsiva e de fácil utilização para acompanhamento da evolução corporal de usuários por meio de registros de peso, indicadores calculados e metas.

## 2.2 Objetivos da Versão 1.0

- Permitir cadastro, login, logout, recuperação de senha e sessão persistente.
- Manter os dados sincronizados em banco online associado à conta do usuário.
- Permitir registro, edição, exclusão e consulta de pesagens.
- Calcular automaticamente IMC, peso perdido, média móvel de sete dias, menor peso registrado e progresso até a meta.
- Apresentar Dashboard com visão resumida e gráfica da evolução.
- Permitir criação, edição, exclusão, ordenação, ativação e conclusão de metas.
- Permitir exportação dos dados em CSV e JSON.
- Ser instalável como PWA no Android e em desktop compatível.

## 2.3 Objetivos Técnicos

- Manter separação clara entre interface, regras de negócio, autenticação e persistência.
- Evitar exposição de credenciais sensíveis no navegador ou no repositório.
- Garantir isolamento de dados entre usuários por autenticação e políticas de acesso no banco.
- Manter documentação suficiente para instalação, estudo, deploy e manutenção.
- Permitir evolução futura sem reescrita significativa da aplicação.

## 2.4 Objetivos de Experiência do Usuário

A aplicação deverá permitir uso sem treinamento prévio. O usuário deverá conseguir registrar uma pesagem rapidamente, visualizar sua evolução imediatamente e compreender os indicadores sem conhecimento técnico.

## 2.5 Critérios de Sucesso

A versão 1.0 será considerada bem-sucedida quando o usuário conseguir criar uma conta, configurar seu perfil, registrar pesagens, acompanhar metas, visualizar o Dashboard, exportar seus dados e acessar as informações sincronizadas em mais de um dispositivo.

# 3. Escopo da Versão 1.0

## 3.1 Objetivo do Escopo

Este capítulo define as funcionalidades incluídas e excluídas da versão 1.0. Qualquer funcionalidade não descrita como incluída deverá ser considerada fora do escopo desta entrega, salvo atualização formal da especificação.

## 3.2 Funcionalidades Incluídas

### 3.2.1 Autenticação

- Cadastro por e-mail e senha.
- Confirmação de e-mail.
- Login e logout.
- Recuperação de senha.
- Sessão persistente.
- Exclusão da própria conta.

### 3.2.2 Perfil

Cada usuário deverá possuir perfil com nome, e-mail, altura, peso inicial informado, preferência de tema e data de criação. O peso inicial informado será referência de comparação e não deverá ser tratado como uma pesagem registrada.

### 3.2.3 Pesagens

O usuário poderá criar, editar e excluir pesagens. Cada pesagem terá data e peso como campos obrigatórios. Circunferência da cintura e observações serão opcionais. Não será permitido mais de um registro por usuário na mesma data.

### 3.2.4 Histórico

O histórico deverá exibir as pesagens do usuário com data, peso, IMC, variação em relação ao registro anterior, total perdido desde o peso inicial, cintura quando informada e observações quando existirem. Deverá haver filtros por 30 dias, 90 dias, último ano, período personalizado e todo o histórico.

### 3.2.5 Dashboard

O Dashboard deverá apresentar peso atual, peso inicial, total perdido, IMC atual, classificação do IMC, menor peso registrado, meta ativa, progresso até a meta, média móvel de sete dias, gráfico de evolução do peso e últimas pesagens.

### 3.2.6 Metas

O usuário poderá criar, editar, excluir, ordenar e ativar metas. A aplicação deverá detectar automaticamente quando a meta ativa for atingida e registrar a data de conclusão.

### 3.2.7 Exportação

A aplicação deverá permitir exportar dados do usuário autenticado em CSV e JSON. A exportação não deverá incluir credenciais, tokens ou informações internas de autenticação.

### 3.2.8 PWA

A aplicação deverá possuir manifesto, ícone próprio, identidade visual, modo de exibição independente e cache de recursos estáticos necessário para instalação como PWA.

## 3.3 Funcionalidades Fora do Escopo

- Percentual de gordura, massa muscular, bioimpedância, dobras cutâneas e cálculo de calorias.
- Diário alimentar, receitas, contagem de calorias, macronutrientes e integração com aplicativos de dieta.
- Cadastro de treinos, exercícios, séries, carga, tempo de atividade e integração com smartwatch.
- Registro de ingestão de água, sono, humor, energia, álcool ou refeições fora da rotina.
- Adicionar amigos, feed social, ranking, comentários, curtidas ou compartilhamento público.
- Painel administrativo, gerenciamento global de usuários e sistema de convites.
- Gamificação com níveis, XP, moedas, missões ou recompensas.
- Funcionalidades baseadas em inteligência artificial.
- Aplicativos nativos para Android ou iOS.
- Gravação offline de novas pesagens.

## 3.4 Definição de MVP

A versão 1.0 será um MVP, mas deverá estar pronta para uso diário. Não serão aceitas funcionalidades parcialmente implementadas, telas marcadas como em construção ou fluxos essenciais incompletos.

# 4. Tecnologias e Arquitetura

## 4.1 Tecnologias Obrigatórias

- Next.js, React e TypeScript para a aplicação web.
- Tailwind CSS para estilização.
- Supabase para autenticação, banco PostgreSQL e políticas de segurança.
- Vercel para hospedagem da aplicação.
- PWA para instalação em dispositivos compatíveis.

## 4.2 Tecnologias Não Utilizadas na Versão 1.0

- WordPress.
- Backend próprio completo.
- VPS, servidor dedicado, cPanel ou infraestrutura manual.
- Firebase, MongoDB ou banco local como armazenamento principal.
- Aplicativos nativos Android ou iOS.
- Provedores OAuth, como Google ou GitHub, para autenticação.

## 4.3 Arquitetura Geral

A aplicação será uma interface web hospedada na Vercel, comunicando-se com o Supabase por HTTPS. O Supabase será responsável por autenticação, persistência dos dados e autorização no nível do banco. Não haverá backend próprio completo na versão 1.0.

## 4.4 Separação de Responsabilidades

A implementação deverá separar responsabilidades de interface, regras de negócio, autenticação, acesso a dados, cálculos e exportações. Componentes visuais não deverão concentrar regras complexas nem depender diretamente de detalhes internos do banco.

## 4.5 Crescimento Futuro

A arquitetura deverá permitir futura inclusão de medidas corporais adicionais, fotos, hábitos, notificações, compartilhamento, painel administrativo e aplicativo Android empacotado, sem comprometer a simplicidade da versão inicial.

# 5. Requisitos Funcionais

## RF-001 - Cadastro de Usuário

O sistema deverá permitir que um novo usuário crie conta utilizando nome, e-mail, senha e confirmação de senha. O sistema deverá validar os dados, impedir senhas divergentes, informar e-mails já cadastrados quando aplicável e solicitar confirmação do e-mail antes do uso completo da aplicação.

## RF-002 - Login

O sistema deverá permitir autenticação por e-mail e senha. Após login bem-sucedido, o usuário deverá ser direcionado ao Dashboard ou ao onboarding, caso ainda não possua perfil completo.

## RF-003 - Recuperação de Senha

O sistema deverá permitir solicitar redefinição de senha por e-mail. O usuário deverá receber instruções, definir uma nova senha e conseguir acessar a aplicação com a nova credencial.

## RF-004 - Logout

O sistema deverá permitir encerrar a sessão. Após logout, informações privadas não deverão permanecer acessíveis e o usuário deverá retornar à área de autenticação.

## RF-005 - Onboarding

No primeiro acesso após autenticação, quando ainda não houver perfil configurado, o sistema deverá solicitar nome, altura, peso inicial informado e primeira meta. Após concluir o onboarding, o usuário deverá acessar o Dashboard.

## RF-006 - Registro de Pesagem

O usuário deverá conseguir registrar uma pesagem informando data e peso. A data atual deverá ser sugerida por padrão. Cintura e observações serão opcionais. O sistema deverá impedir datas futuras, valores não positivos e mais de uma pesagem na mesma data.

## RF-007 - Edição de Pesagem

O usuário deverá conseguir editar qualquer informação de uma pesagem própria. Após salvar, o Dashboard, o histórico, os gráficos e os indicadores deverão refletir a alteração.

## RF-008 - Exclusão de Pesagem

O usuário deverá conseguir excluir uma pesagem própria mediante confirmação. Após a exclusão, todos os indicadores derivados deverão ser recalculados com base no histórico restante.

## RF-009 - Consulta do Histórico

O usuário deverá consultar suas pesagens em lista ou tabela adaptada ao dispositivo. O histórico deverá permitir filtros por período e apresentar informações calculadas relevantes para cada registro.

## RF-010 - Dashboard

O sistema deverá apresentar uma tela inicial com resumo da evolução, indicadores atuais, meta ativa, gráfico de peso e últimas pesagens. As informações deverão refletir sempre os dados do usuário autenticado.

## RF-011 - Gerenciamento de Metas

O usuário deverá criar, editar, excluir, ordenar e definir metas como ativas. O sistema deverá permitir apenas uma meta ativa por vez e deverá registrar automaticamente a conclusão quando o peso atingir ou ficar abaixo do alvo.

## RF-012 - Configurações

O usuário deverá alterar nome, altura, peso inicial informado e preferência de tema. Alterar a altura deverá recalcular IMCs exibidos. Alterar o peso inicial não deverá alterar pesagens registradas.

## RF-013 - Exportação

O usuário deverá exportar seus dados em CSV e JSON. Os arquivos deverão conter apenas dados próprios e deverão identificar claramente datas, unidades e tipo de conteúdo.

## RF-014 - Exclusão da Conta

O usuário deverá conseguir solicitar exclusão da própria conta. A operação deverá exigir confirmação, informar suas consequências, remover dados funcionais associados e encerrar a sessão.

## RF-015 - PWA

A aplicação deverá ser instalável em dispositivos compatíveis, apresentar nome e ícone próprios e abrir em modo independente quando instalada.

# 6. Requisitos Não Funcionais

## RNF-001 - Responsividade

A aplicação deverá adotar abordagem mobile-first e permanecer utilizável em smartphones, tablets, notebooks e desktops. Não deverá haver rolagem horizontal involuntária. Botões, campos, gráficos e tabelas deverão se adaptar ao tamanho da tela.

## RNF-002 - Segurança

Todos os dados privados deverão ser protegidos por autenticação e autorização. Nenhum usuário poderá visualizar ou alterar dados de outro usuário. A segurança deverá existir no banco de dados, não apenas na interface. Chaves privilegiadas não poderão ser expostas no navegador.

## RNF-003 - Privacidade

A aplicação deverá coletar apenas os dados necessários ao escopo da versão 1.0. Não haverá publicidade, rastreamento comportamental de terceiros, compartilhamento social ou publicação de dados.

## RNF-004 - Integridade

O sistema deverá garantir consistência dos dados, incluindo unicidade de pesagem por usuário e data, rejeição de datas futuras, rejeição de valores não positivos e vínculo correto entre dados e usuário autenticado.

## RNF-005 - Desempenho

A aplicação deverá permanecer fluida para uso diário em dispositivos móveis comuns. Consultas e gráficos deverão continuar utilizáveis mesmo com milhares de registros.

## RNF-006 - Disponibilidade

A aplicação dependerá de Vercel, Supabase e serviço de e-mail do Supabase Auth. Falhas temporárias deverão ser comunicadas de forma compreensível, sem indicar sucesso antes da confirmação da operação.

## RNF-007 - Usabilidade

O registro de uma pesagem comum deverá exigir poucos passos. Campos opcionais deverão ser identificados. Mensagens de erro deverão explicar o problema. Ações destrutivas deverão exigir confirmação. Estados vazios deverão orientar o próximo passo útil.

## RNF-008 - Acessibilidade

A aplicação deverá seguir boas práticas compatíveis com WCAG 2.1 nível AA quando aplicável, incluindo contraste adequado, navegação por teclado, rótulos em campos, foco visível, nomes acessíveis para ícones e resumo textual para gráficos.

## RNF-009 - Compatibilidade

A aplicação deverá priorizar Chrome no Android, Chrome desktop, Edge, Firefox e Safari recentes. Quando a instalação como PWA não estiver disponível, a aplicação deverá continuar utilizável como site responsivo.

## RNF-010 - Confiabilidade dos Cálculos

Indicadores derivados deverão ser calculados a partir de dados brutos e de forma consistente. Valores ausentes não deverão ser interpretados como zero. Pesagens com datas civis não deverão sofrer alteração indevida por conversão de fuso horário.

## RNF-011 - Manutenibilidade

O código deverá priorizar clareza, separação de responsabilidades, nomes descritivos, tipagem consistente e ausência de abstrações desnecessárias. O projeto também deverá servir como base de estudo de Next.js, TypeScript e Supabase.

## RNF-012 - Testabilidade

As regras centrais, especialmente cálculos e validações, deverão poder ser testadas isoladamente. A documentação deverá informar como executar testes, verificação de tipos, lint e build.

## RNF-013 - Localidade

Datas, números e unidades deverão seguir padrão brasileiro. Pesos serão exibidos em quilogramas e medidas em centímetros.

## RNF-014 - PWA e Cache

A aplicação deverá atender aos requisitos técnicos para instalação como PWA. O cache poderá armazenar recursos estáticos, mas não será fonte principal dos dados do usuário.

## RNF-015 - Documentação

O repositório deverá conter documentação suficiente para instalação, configuração de variáveis de ambiente, execução local, configuração do Supabase, deploy na Vercel, comandos de qualidade e limitações conhecidas.

# 7. Modelo de Dados Conceitual

## 7.1 Entidades Principais

- Usuário autenticado: entidade gerenciada pelo serviço de autenticação.
- Perfil: informações funcionais do usuário, como nome, altura, peso inicial informado e tema.
- Pesagem: registro de data, peso, cintura opcional e observação opcional.
- Meta: objetivo de peso definido pelo usuário, com status, ordem e data de conclusão quando aplicável.

## 7.2 Perfil

O perfil deverá pertencer a um único usuário autenticado e conter nome, altura, peso inicial informado, preferência de tema e datas de criação e atualização. O tema padrão deverá ser escuro.

## 7.3 Pesagem

Cada pesagem deverá pertencer a um único usuário, conter uma data civil e possuir peso maior que zero. Cintura, quando informada, também deverá ser maior que zero. O sistema deverá impedir mais de uma pesagem do mesmo usuário na mesma data.

## 7.4 Meta

Cada meta deverá pertencer a um único usuário, conter peso-alvo, ordem de apresentação, indicação de meta ativa e data de conclusão opcional. Um usuário deverá possuir no máximo uma meta ativa.

## 7.5 Dados Derivados

IMC, classificação de IMC, média móvel, variações, total perdido, progresso e previsões não deverão ser tratados como dados independentes do usuário. Esses valores deverão ser calculados a partir dos dados persistidos.

## 7.6 Exclusão

A exclusão da conta deverá remover os dados funcionais associados ao usuário, evitando registros órfãos. A implementação deverá utilizar uma solução segura para remover a conta sem expor credenciais privilegiadas ao frontend.

# 8. Fluxos da Aplicação

## 8.1 Primeiro Acesso

1. O usuário acessa a aplicação.
2. Seleciona criar conta.
3. Informa nome, e-mail, senha e confirmação.
4. Confirma o e-mail quando solicitado.
5. Realiza o primeiro login.
6. Preenche onboarding com altura, peso inicial e primeira meta.
7. É direcionado ao Dashboard.

## 8.2 Registro de Pesagem

1. O usuário acessa a área de registro.
2. A data atual é apresentada como padrão.
3. O usuário informa peso.
4. Opcionalmente informa cintura e observação.
5. O sistema valida os dados.
6. A pesagem é salva.
7. Dashboard, histórico, gráficos e metas são atualizados.

## 8.3 Consulta e Manutenção do Histórico

O usuário deverá acessar o histórico, visualizar registros, aplicar filtros e selecionar pesagens para edição ou exclusão. Qualquer alteração deverá ser refletida imediatamente nos indicadores.

## 8.4 Gerenciamento de Metas

O usuário deverá acessar a tela de metas para criar, editar, excluir, reordenar e ativar metas. Metas atingidas deverão permanecer registradas como marcos históricos.

## 8.5 Configurações e Exportação

O usuário deverá acessar configurações para alterar dados de perfil, tema, exportar informações em CSV ou JSON, sair da conta ou solicitar exclusão definitiva.

## 8.6 Estados Vazios e Erros

Quando não houver pesagens, metas ou resultados para um filtro, a aplicação deverá informar a condição e orientar a próxima ação útil. Em falhas de conexão, autenticação ou salvamento, a aplicação deverá informar que a operação não foi concluída.

# 9. Dashboard

## 9.1 Objetivo

O Dashboard será a tela inicial após autenticação e deverá apresentar um resumo objetivo da evolução do usuário.

## 9.2 Conteúdo Obrigatório

- Peso atual.
- Peso inicial informado.
- Total perdido.
- IMC atual e classificação.
- Menor peso registrado.
- Meta ativa.
- Quanto falta para a meta.
- Progresso percentual.
- Média móvel dos últimos sete dias.
- Gráfico de evolução do peso.
- Últimas pesagens.

## 9.3 Estados

Sem pesagens, o Dashboard deverá orientar o registro da primeira pesagem. Com uma única pesagem, deverá exibir indicadores possíveis e ocultar ou sinalizar indicadores que dependam de histórico. Com histórico suficiente, todos os indicadores deverão ser exibidos.

## 9.4 Critérios de Aceite

- O Dashboard carrega após o login.
- Todas as informações pertencem ao usuário autenticado.
- Alterações nas pesagens refletem na tela sem atualização manual.
- A tela permanece utilizável em dispositivos móveis e desktops.

# 10. Interface e Design System

## 10.1 Princípios

A interface deverá priorizar simplicidade, legibilidade, consistência, objetividade e rapidez de uso. O visual deverá ser próprio e não deverá reproduzir interfaces de terceiros.

## 10.2 Tema

O tema escuro deverá ser o padrão. O usuário poderá escolher tema claro ou seguir o sistema operacional.

## 10.3 Navegação

A navegação deverá permitir acesso às áreas Dashboard, Registrar Peso, Histórico, Metas e Configurações a partir das telas autenticadas. No mobile, deverá favorecer acesso rápido às funções principais; no desktop, poderá utilizar um padrão mais amplo.

## 10.4 Componentes e Feedback

Botões, campos, cartões, diálogos, mensagens e indicadores deverão manter comportamento consistente. Toda ação do usuário deverá apresentar retorno visual adequado, incluindo carregamento, sucesso, erro ou confirmação.

## 10.5 Linguagem

As mensagens deverão ser claras, objetivas e compreensíveis para usuários não técnicos. A aplicação deverá evitar mensagens motivacionais genéricas e priorizar informações factuais.

# 11. Roadmap

Os itens abaixo representam possibilidades futuras e não fazem parte da versão 1.0.

## 11.1 Versão 1.1

- Importação de backup JSON.
- Melhorias de usabilidade.
- Filtros adicionais no histórico.
- Melhorias de acessibilidade.

## 11.2 Versão 1.2

- Medidas corporais adicionais.
- Fotografias de evolução.
- Estatísticas mais completas.

## 11.3 Versão 2.0

- Notificações.
- Hábitos.
- Integração com dispositivos.
- Compartilhamento opcional.
- Painel administrativo.

# 12. Critérios Gerais de Aceite

- Todos os requisitos funcionais da versão 1.0 estão implementados.
- Todos os requisitos não funcionais aplicáveis estão atendidos.
- Cadastro, confirmação, login, recuperação de senha e logout funcionam.
- Onboarding cria perfil e primeira meta.
- Pesagens podem ser criadas, editadas, excluídas e consultadas.
- Dashboard e gráficos refletem os dados corretamente.
- Metas são gerenciáveis e concluídas automaticamente quando atingidas.
- Exportações CSV e JSON estão disponíveis.
- Dados de usuários diferentes permanecem isolados.
- A aplicação está publicada na Vercel.
- O banco está configurado no Supabase.
- A aplicação pode ser instalada como PWA.
- Não existem credenciais versionadas.
- O repositório possui documentação suficiente para instalação, deploy e manutenção.

# 13. Registro de Decisões Arquiteturais

| Decisão | Justificativa |
| --- | --- |
| Utilizar PWA | Reduz custo e complexidade da versão inicial. |
| Utilizar Supabase | Permite autenticação, banco online e sincronização entre dispositivos. |
| Utilizar Vercel | Simplifica publicação e atende ao escopo do MVP. |
| Não utilizar backend próprio completo | Reduz infraestrutura e manutenção na versão 1.0. |
| Separar peso inicial de pesagens | Preserva o histórico e evita criar medição fictícia. |
| Tema escuro como padrão | Decisão de produto definida para a experiência inicial. |
| Dashboard como tela inicial | Facilita acompanhamento diário. |
| Uma pesagem por dia | Simplifica o histórico e evita inconsistências. |
| Indicadores calculados | Evita duplicação e divergência de dados. |
| Metas concluídas permanecem concluídas | Mantém histórico de marcos atingidos. |
| Roadmap separado do escopo | Evita crescimento descontrolado da versão 1.0. |

# 14. Glossário e Definições

- **Aplicação:** Sistema Evolução Fitness, desenvolvido como PWA.
- **Usuário:** Pessoa autenticada que utiliza a aplicação para registrar e acompanhar sua evolução corporal.
- **Perfil:** Conjunto de informações permanentes do usuário usadas pela aplicação.
- **Peso inicial informado:** Valor cadastrado no onboarding como ponto de partida. Não corresponde necessariamente à primeira pesagem.
- **Pesagem:** Registro individual com data e peso, podendo conter cintura e observações.
- **Histórico:** Conjunto de todas as pesagens registradas pelo usuário.
- **Meta:** Objetivo de peso definido pelo usuário.
- **Meta ativa:** Meta atualmente usada como referência principal no Dashboard.
- **Meta concluída:** Meta cujo peso-alvo foi atingido em algum momento do histórico.
- **Dashboard:** Tela inicial autenticada com resumo dos indicadores principais.
- **Indicador:** Informação calculada automaticamente a partir dos dados registrados.
- **IMC:** Índice de Massa Corporal calculado a partir do peso e da altura.
- **Média móvel:** Indicador que reduz oscilações naturais usando média dos últimos sete dias.
- **Onboarding:** Fluxo inicial para coletar dados mínimos do usuário.
- **PWA:** Aplicação web instalável com comportamento semelhante a aplicativo nativo.
- **Exportação:** Funcionalidade que permite obter cópia dos próprios dados.
- **Roadmap:** Lista de funcionalidades planejadas para versões futuras, fora da versão 1.0.

# 15. Restrições e Premissas

## 15.1 Premissas

- O usuário possui acesso à internet durante uso normal.
- Supabase e Vercel estarão disponíveis durante operação normal.
- O usuário utilizará navegador moderno.
- Cada usuário utilizará sua própria conta.
- O e-mail informado é válido e acessível pelo usuário.

## 15.2 Restrições

- Idioma exclusivo em português brasileiro na versão 1.0.
- Autenticação apenas por e-mail e senha.
- Sem gravação offline de dados.
- Sem integração com dispositivos externos.
- Sem funcionalidades sociais.
- Sem aplicativo nativo.
- Sem inteligência artificial.
- Sem painel administrativo.

## 15.3 Dependências Externas

A aplicação depende de Supabase, Vercel e do serviço de envio de e-mails utilizado pelo Supabase Auth. Falhas nesses serviços poderão impactar funcionalidades específicas.

# 16. Critérios de Aprovação da Especificação

Esta especificação estará aprovada para início do desenvolvimento quando todos os capítulos forem revisados, não houver conflitos entre requisitos, o escopo da versão 1.0 estiver claro, os critérios de aceite estiverem documentados e o roadmap estiver separado do escopo atual.

Após a aprovação, alterações relevantes deverão ser registradas por controle de versão da documentação. Ajustes exclusivamente editoriais não precisam ser tratados como mudanças de escopo.

# Apêndice A. Histórico de Versões

| Versão | Data | Descrição |
| --- | --- | --- |
| 1.0 | Julho de 2026 | Primeira versão consolidada da especificação do projeto Evolução Fitness. |
