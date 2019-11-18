# Certificação de Avaliação do Curso GoStack da Rocketseat

## A Certificação foi publicada: [Meetup!](https://meetupweb.netlify.com/)
- Back-End (Heroku com postgres | AWS S3 para upload de arquivos)
- Front-End (Netlify)

![alt text](https://github.com/marcelochb/CertificacaoGoStack/blob/master/assets/meetupWeb.png)

![alt text](https://github.com/marcelochb/CertificacaoGoStack/blob/master/assets/meetupWeb1.png)

## Instruções para testar a aplicação em modo de desenvolvimento

### 1 - Backend
   #### 1.1 - Instalar e inicializar os bancos de dados Postgres e Redis pelo docker:
       A) Para instalar o Redis: docker run --name redis -p 6379:6379 -d -t redis:alpine
       B) Para inicializar o Redis: docker start redis
       C) Para instalar o Postgres: docker run --name database -e POSTEGRES_PASSWORD=docker -p 5432:5432 -d postgres
       D) Para iniciar o Postgres: docker start database
   #### 1.2 - Rodar as migrates do sequelize para criar a estrutura do banco Postgres:
      A) Entre na pasta do backend;
      B) Execute o comando: yarn sequelize db:migrate
   #### 1.3 - Instalar os pacotes e dependencias da aplicação:
      A) Entre na pasta do backend;
      B) Execute o comando: yarn

   #### 1.4 - Configurar as variaveis de ambiente no .env:
      A) Seguir o arquivo de exemplo .env.example e criar um .env 

   #### 1.5 - Inicializar o backend:
      A) Entre na pasta do backend;
      B) Execute o comando: yarn dev

   #### 1.6 - Inicializar a fila de e-mail:
      A) Entre na pasta do backend;
      B) Execute o comando: yarn queue
      
### 2 - Frontend

   #### 2.1 - Instalar os pacotes e dependencias da aplicação:
      A) Entre na pasta do frontend;
      B) Execute o comando: yarn

   #### 2.2 - Configurar as variaveis de ambiente no .env:
      A) Seguir o arquivo de exemplo .env.example e criar um .env 

   #### 2.3 - Inicializar o frontend:
      A) Entre na pasta do frontend;
      B) Execute o comando: yarn start
      
### 3 - Mobile (Apenas em iOS foi desenvolvido e testado)      

   #### 3.1 - Instalar os pacotes e dependencias da aplicação:
      A) Entre na pasta do mobile;
      B) Execute o comando: yarn

   #### 3.2 - Instalar os Pods:
      A) Entre na pasta do mobile/ios;
      B) Execute os comando: pod install
      
   #### 3.3 - Configurar a variavel de conexao com o backend
      A) Entrar na pasta mobile/src/servces
      B) Editar o arquivo api.js e colocar o endereço do backend na variavel: baseURL

   #### 3.4 - Inicialize o mobile
      A) Entre na pasta do mobile;
      B) Execute o comando: react-native run-ios
  


#############################################
      
## Instruções para desenvolver a aplicação


# Back-end: Parte 01

Crie uma aplicação do zero utilizando Express ou Adonis.

Nessa aplicação configure as seguintes ferramentas:

- Sucrase + Nodemon;
- ESLint + Prettier + EditorConfig;
- Sequelize (Utilize PostgresSQL ou MySQL);

Durante esse desafio você dará início a um novo projeto no Bootcamp, esse projeto será desenvolvido aos poucos até o fim da sua jornada onde você terá uma aplicação completa envolvendo back-end, front-end e mobile.

Esse projeto também será utilizado para a certificação do bootcamp, então bora pro código!

## Aplicação

A aplicação que iremos dar início ao desenvolvimento a partir de agora é um app agregador de eventos para desenvolvedores chamado Meetapp (um acrônimo à Meetup + App).

Nesse primeiro desafio vamos criar algumas funcionalidades básicas que aprendemos ao longo das aulas até aqui.

## Funcionalidades

Abaixo estão descritas as funcionalidades que você deve adicionar em sua aplicação.

### Autenticação

Permita que um usuário se autentique em sua aplicação utilizando e-mail e senha.

- A autenticação deve ser feita utilizando JWT.
- Realize a validação dos dados de entrada;

### Cadastro e atualização de usuários

Permita que novos usuários se cadastrem em sua aplicação utilizando nome, e-mail e senha.

Para atualizar a senha, o usuário deve também enviar um campo de confirmação com a mesma senha.

- Criptografe a senha do usuário para segurança.
- Realize a validação dos dados de entrada;


# Back-end: Parte 02

Durante esse desafio vamos aprimorar a aplicação Meetapp que demos início no desafio anterior implementando funcionalidades que aprendemos durante as aulas até agora.

## Funcionalidades

Abaixo estão descritas as funcionalidades que você deve adicionar em sua aplicação.

### Gerenciamento de arquivos

Crie uma rota para upload de arquivos que cadastra em uma tabela o caminho e nome do arquivo e retorna todos dados do arquivo cadastrado.

### Gerenciamento de meetups

O usuário pode cadastrar meetups na plataforma com título do meetup, descrição, localização, data e hora e imagem (banner). Todos campos são obrigatórios. Adicione também um campo user_id que armazena o ID do usuário que organiza o evento.

Não deve ser possível cadastrar meetups com datas que já passaram.

O usuário também deve poder editar todos dados de meetups que ainda não aconteceram e que ele é organizador.

Crie uma rota para listar os meetups que são organizados pelo usuário logado.

O usuário deve poder cancelar meetups organizados por ele e que ainda não aconteceram. O cancelamento deve deletar o meetup da base de dados.

### Inscrição no meetup

O usuário deve poder se inscrever em meetups que não organiza.

O usuário não pode se inscrever em meetups que já aconteceram.

O usuário não pode se inscrever no mesmo meetup duas vezes.

O usuário não pode se inscrever em dois meetups que acontecem no mesmo horário.

Sempre que um usuário se inscrever no meetup, envie um e-mail ao organizador contendo os dados relacionados ao usuário inscrito. O template do e-mail fica por sua conta :)

### Listagem de meetups

Crie uma rota para listar os meetups com filtro por data (não por hora), os resultados dessa listagem devem vir paginados em 10 itens por página. Abaixo tem um exemplo de chamada para a rota de listagem dos meetups:

```
http://localhost:3333/meetups?date=2019-07-01&page=2
```

Nesse exemplo, listaremos a página 2 dos meetups que acontecerão no dia 01 de Julho.

Nessa listagem retorne também os dados do organizador.

### Listagem de inscrições

Crie uma rota para listar os meetups em que o usuário logado está inscrito.

Liste apenas meetups que ainda não passaram e ordene meetups mais próximos como primeiros da lista.


# Front-end

Nesse desafio você irá construir o front-end com ReactJS do Meetapp que utilizará a API que você desenvolveu anteriormente.

Crie uma aplicação do zero utilizando create-react-app e configure as ferramentas de padrões de código, Reactotron, Redux e Redux Saga.

Essa aplicação será utilizada por organizadores de meetups e não contará com funcionalidades de inscrição.

Essa aplicação faz parte do desafio final do bootcamp utilizado para finalização e certificação.

O layout do projeto está anexado nesse repositório.

## Telas

### Autenticação

O usuário deve poder se autenticar utilizando e-mail e senha.

### Cadastro

O usuário deve poder se cadastrar com nome, e-mail e senha.

### Dashboard

O usuário deve poder listar os meetups que organiza e clicar para ver detalhes de um meetup.

Nessa tela o usuário pode navegar para a página de criação de meetup.

### Detalhes

O usuário deve poder visualizar detalhes de um meetup previamente cadastrado.

Nessa tela o usuário pode editar os dados de um meetup ou até cancelar um meetup.

### Novo/editar

O usuário deve poder cadastrar ou editar informações de meetups que organiza.

Exiba a preview de imagem de banner do meetup quando o usuário selecionar uma imagem.

Utilize validação nos campos.

### Perfil

O usuário deve poder editar suas informações de cadastro.

Utilize validação nos campos.


# Mobile

Nesse desafio você irá construir o app mobile com React Native do Meetapp que utilizará a API que você desenvolveu anteriormente.

Crie uma aplicação do zero utilizando React Native CLI e configure as ferramentas de padrões de código, Reactotron, Redux e Redux Saga.

Essa aplicação será utilizada por inscritos de meetups e não contará com funcionalidades de organização de meetups.

Essa aplicação faz parte do desafio final do bootcamp utilizado para finalização e certificação.

O layout do projeto está anexado nesse repositório.

## Telas

### Autenticação

O usuário deve poder se autenticar utilizando e-mail e senha.

### Cadastro

O usuário deve poder se cadastrar com nome, e-mail e senha.

### Dashboard

O usuário deve poder navegar pelos meetups por data.

Utilize scroll infinito nessa página.

Nessa tela o usuário deve poder se inscrever em um Meetup.

### Inscrições

O usuário deve poder visualizar suas inscrições em meetups.

Nessa tela o usuário pode cancelar uma inscrição.

### Perfil

O usuário deve poder editar suas informações de cadastro.

Utilize validação nos campos.
