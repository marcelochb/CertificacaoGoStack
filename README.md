# Certificação de Avaliação do Curso GoStack da Rocketseat
## Instruções para testar a aplicação em modo de desenvolvimento

### 1 - Backend
1.1 - Instalar e inicializar os bancos de dados Postgres e Redis pelo docker:
      A) Para instalar o Redis: docker run --name redis -p 6379:6379 -d -t redis:alpine
      B) Para inicializar o Redis: docker start redis
      C) Para instalar o Postgres: docker run --name database -e POSTEGRES_PASSWORD=docker -p 5432:5432 -d postgres
      D) Para iniciar o Postgres: docker start database
1.2 - Rodar as migrates do sequelize para criar a estrutura do banco Postgres:
      A) Entre na pasta do backend;
      B) Execute o comando: yarn sequelize db:migrate
1.3 - Instalar os pacotes e dependencias da aplicação:
      A) Entre na pasta do backend;
      B) Execute o comando: yarn
1.4 - Configurar as variaveis de ambiente no .env:
      A) Seguir o arquivo de exemplo .env.example e criar um .env 
1.5 - Inicializar o backend:
      A) Entre na pasta do backend;
      B) Execute o comando: yarn dev
1.6 - Inicializar a fila de e-mail:
      A) Entre na pasta do backend;
      B) Execute o comando: yarn queue
      
### 2 - Frontend
2.1 - Instalar os pacotes e dependencias da aplicação:
      A) Entre na pasta do frontend;
      B) Execute o comando: yarn
2.2 - Configurar as variaveis de ambiente no .env:
      A) Seguir o arquivo de exemplo .env.example e criar um .env 
2.3 - Inicializar o frontend:
      A) Entre na pasta do frontend;
      B) Execute o comando: yarn start
      
### 3 - Mobile (Apenas em iOS foi desenvolvido e testado)      
3.1 - Instalar os pacotes e dependencias da aplicação:
      A) Entre na pasta do mobile;
      B) Execute o comando: yarn
3.2 - Instalar os Pods:
      A) Entre na pasta do mobile/ios;
      B) Execute os comando: pod install
3.4 - Inicialize o mobile
      A) Entre na pasta do mobile;
      B) Execute o comando: react-native run-ios
