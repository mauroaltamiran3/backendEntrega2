# 🛒 E-commerce Backend con Autenticación, Logger, Mailing y Arquitectura en Capas

Este proyecto representa un backend completo para un sistema de e-commerce educativo, estructurado con buenas prácticas modernas y enfocado en la arquitectura por capas.

---

## 🚀 Tecnologías utilizadas

- **Node.js** + **Express**
- **MongoDB** + **Mongoose**
- **Handlebars** (vistas)
- **JWT** y **Cookies/Sessions**
- **Passport.js** (con GitHub OAuth)
- **Socket.io** (productos en tiempo real)
- **Faker.js** (datos simulados)
- **Nodemailer** (envío de mails)
- **Winston** (logger)
- **Arquitectura MVC por capas**
- **Validación de stock y tickets de compra**

---

## 🎯 Funcionalidades destacadas

- Registro y login de usuarios con **rol** (user/admin)
- Autenticación tradicional + GitHub
- Gestión de productos y carritos (CRUD)
- Generación de **tickets de compra**
- Envío automático de **correo de confirmación**
- Rutas protegidas con middlewares por rol
- Simulación de procesos bloqueantes y no bloqueantes
- Logger personalizado para debug, error y warnings
- Arquitectura escalable con separación de rutas, controladores, servicios y DAOs

---

## 📦 Instrucciones básicas

1. Clonar el repositorio
2. Instalar dependencias:

   ```bash
   npm install
   ```

3. Crear un archivo `.env` en la raíz del proyecto. Podés guiarte con el archivo `.env.example` incluido:

   ```env
   GITHUB_CLIENT_ID=tu_client_id
   GITHUB_CLIENT_SECRET=tu_client_secret
   GITHUB_CALLBACK_URL=http://localhost:8080/session/githubcallback

   JWT_SECRET=tuJWTsecreto

   GMAIL_USER=tu_correo@gmail.com
   GMAIL_PASS=tu_clave_app_gmail
   ```

4. Iniciar el servidor:

   ```bash
   npm start
   ```

5. Acceder en tu navegador:

   ```
   http://localhost:8080
   ```

---

## ⚠️ Nota de seguridad

⚠️ No subas tu archivo `.env` al repositorio. Usá un archivo `.env.example` para compartir las claves necesarias sin valores sensibles.
