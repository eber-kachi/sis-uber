# sistema de taxis tipo uber / indriver 

## Backend
   [Node.js](https://nodejs.org/en)
   framework  [NestJs](https://docs.nestjs.com/)
### Tecnologias
    - [Node.js => v16.13.1]
    - [NestJs => 8.2.5]
    - [Typescript]
    - [TypeOrm]
    - [Socket.io]
### Instalacion 
    $ cd api
    $ npm i -g @nestjs/cli
    $ npm install 
    $ copy .development.env .env
 Crear base de datos MYSQL y configurar variables de entorno .env 
 ```dotenv
  # Database envioroment variables
  DB_HOST=127.0.0.1
  DB_PORT=3306
  DB_USERNAME=root
  DB_PASSWORD=
  DB_DATABASE=NameDataBase
 ```
 puerto del servidor 
  ```dotenv
     PORT=3001
  ```
### Correr proyecto 
    $ npm run start:dev
    $ npm run start:debug
    $ npm run start:prod
 
 ## Web Dashboard
  [Nextjs](https://nextjs.org/docs)
  
  ### Instalacion 
      $ cd web-admin
      $ npm install 
      $ copy .env.development .env
   Configuracion de .env 
   
  ```dotenv
    NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
    NEXT_PUBLIC_FRONT_URL=http://localhost:3000
    
    
    #Maps
    NEXT_PUBLIC_GOOGLE_MAPS_KEY="You Key" 
  ```
### Correr proyecto 
    $ npm run dev
    $ npm run build
    $ npm run start
    
 ## App Movil
 instalar expo, react-native
 
    $ npm install
    $ npm run expo:start
    $ npm run expo:android

### Configuracion variables config.prod.ts

  ```typescript 
     export default {
       API_URL: "http://192.168.1.7:3001/", // change you ip
     }
  ```
