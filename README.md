README sugerido (pt-BR)
ProjectBank (Banco Skull)
Resumo

Projeto full-stack de exemplo: backend Node.js + Express + Sequelize (MySQL) e frontend Angular (standalone components).
Funcionalidades: registro/login com JWT, CRUD de usuário, transações (extrato, saldo, criar transação), dashboard com gráficos.
Propósito: demonstrar fluxo completo (Docker MySQL, API REST, autenticação JWT e integração com frontend Angular).
Estrutura do repositório (principais arquivos/pastas)

docker-compose.yml — serviço MySQL para desenvolvimento.
schema.sql — schema das tabelas (usuarios, transacoes, pix).
backend/
.env — variáveis de ambiente do backend (porta, DB, JWT).
package.json — dependências e scripts.
src/
server.js — configuração do Express, CORS e rotas.
database.js — configuração Sequelize.
models/Usuario.js, Transacao.js — modelos Sequelize (hooks de bcrypt).
controllers/UsuarioController.js, TransacaoController.js — lógica de negócio.
auth.js — validação do JWT.
index.js — rotas públicas e protegidas.
src/ (frontend Angular)
app/ — componentes standalone (login, dashboard, extrato, saldo, perfil).
account.ts — serviço que consome a API (login, register, perfil, saldo, extrato).
auth.interceptor.ts — adiciona Authorization header com o token.
app.routes.ts — rotas do frontend.
README.md — (arquivo que você está editando / pretende adicionar).
Pré-requisitos

Docker & Docker Compose (para rodar o MySQL localmente).
Node.js (v16+ recomendado) e npm.
Angular CLI (opcional, para desenvolvimento frontend): npm i -g @angular/cli
Configuração (variáveis importantes)

Backend: .env (exemplo já incluído)
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=admin
DB_PASS=admin123
DB_NAME=banco_skull
JWT_SECRET=sua_chave_secreta_muito_segura
JWT_EXPIRES_IN=1d
Arquivo docker-compose.yml já cria um container MySQL com:
MYSQL_ROOT_PASSWORD: root
MYSQL_DATABASE: banco_skull
MYSQL_USER: admin
MYSQL_PASSWORD: admin123
Como subir o ambiente (passo a passo)

Levantar o MySQL via Docker Compose
Verificar containers:

(Opcional) Importar o schema se necessário
O schema.sql já foi usado, mas se precisar importar manualmente:
Rodar o backend
O backend expõe a API em: http://localhost:3000/api
Arquivo principal: server.js
Rodar o frontend (Angular)
Testes rápidos via curl (exemplos)

Registrar novo usuário:
Login:
Usar token recebido (ex: para /usuario):
Credenciais de teste (criados durante esta sessão)

Email: teste@email.com

Senha: 123456

Email: teste2@email.com

Senha: 123456

Observações sobre autenticação e segurança

Senhas são hashadas com bcrypt (hooks em Usuario.js).
A API retorna um JWT no registro/login; o frontend armazena no localStorage e o interceptor (account.ts + auth.interceptor.ts) envia no header Authorization.
Não use as chaves/senhas de exemplo em produção. Troque JWT_SECRET e credenciais do DB em produção.
Rotas da API (resumo)

POST /api/register — criar usuário (público)
POST /api/login — autenticar e retornar token (público)
GET /api/usuario — obter perfil do usuário (protegido)
PUT /api/usuario — atualizar perfil (protegido)
GET /api/saldo — obter saldo (protegido)
GET /api/extrato — obter extrato (protegido)
POST /api/transacao — criar transação (protegido)
CORS

CORS está configurado em server.js para permitir requests do frontend local:
origin: http://localhost:4200
methods: GET, POST, PUT, DELETE, OPTIONS
allowedHeaders: Content-Type, Authorization
Se você for acessar de outro host/porta, ajuste FRONTEND_URL em .env ou origin em server.js.
Como inspecionar o banco de dados

Abrir um shell MySQL dentro do container:
Problemas comuns e soluções

401 Unauthorized no login:
Verifique se o usuário existe. Faça um POST /api/register antes de logar.
Verifique se a senha enviada está correta (senhas são hashadas no banco).
Erro de conexão com MySQL:
Verifique se o container está rodando (docker ps), portas e credenciais em .env.
Se estiver usando Docker em outra máquina, atualize DB_HOST para o host correto.
Erros de CORS:
Cheque server.js e FRONTEND_URL no .env.
Teste preflight com curl:
Contribuindo

Abra issues descrevendo o comportamento esperado e reproduções.
Para adicionar funcionalidades: crie branch, adicione testes mínimos e faça PR.
Tarefas futuras / melhorias

Adicionar testes automatizados (unit/integration).
Melhorar validação das rotas e mensagens de erro.
Implementar paginação e filtros no extrato.
Implementar roles/permissões e melhores políticas de segurança.
Licença
