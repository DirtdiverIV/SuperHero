# 📥 Guía de Instalación

## Índice
- [Requisitos Previos](#requisitos-previos)
- [Instalación Básica](#instalación-básica)
- [Configuración del Entorno](#configuración-del-entorno)
- [Instalación con Docker](#instalación-con-docker)
- [Configuración Adicional](#configuración-adicional)
- [Solución de Problemas](#solución-de-problemas)

## Requisitos Previos

### Software Necesario

| Software | Versión Mínima | Comando para verificar |
|----------|----------------|----------------------|
| Node.js  | v18.0.0       | `node --version`     |
| npm      | v9.0.0        | `npm --version`      |
| Angular CLI | v18.0.0    | `ng version`         |
| Git      | v2.0.0        | `git --version`      |

### Instalación de Requisitos

```bash
# Instalar Node.js
# Windows: Descargar desde https://nodejs.org
# Mac: 
brew install node

# Instalar Angular CLI globalmente
npm install -g @angular/cli

# Verificar instalaciones
node --version
npm --version
ng version
```

## Instalación Básica

### 1. Clonar el Repositorio

```bash
# HTTPS
git clone https://github.com/tuusuario/dirtdiveriv-superhero.git

# SSH
git clone git@github.com:tuusuario/dirtdiveriv-superhero.git

# Entrar al directorio
cd dirtdiveriv-superhero
```

### 2. Instalar Dependencias

```bash
# Instalación de dependencias
npm install

# O si prefieres usar yarn
yarn install
```

### 3. Configurar Variables de Entorno

```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar las variables según tu entorno
# Ejemplo de .env:
API_URL=http://localhost:3000
DEFAULT_PAGE_SIZE=9
```

### 4. Iniciar el Proyecto

```bash
# Terminal 1: Iniciar el servidor de desarrollo
npm start

# Terminal 2: Iniciar el mock server
npm run mock:server
```

La aplicación estará disponible en `http://localhost:4200`

## Configuración del Entorno

### Entorno de Desarrollo

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  defaultPageSize: 9
};
```

### Entorno de Producción

```typescript
// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.tudominio.com',
  defaultPageSize: 9
};
```

## Instalación con Docker

### Usando Docker Compose

1. **Crear Dockerfile**
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 4200
CMD ["npm", "start"]
```

2. **Crear docker-compose.yml**
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "4200:4200"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development

  mock-server:
    image: node:18-alpine
    working_dir: /app
    volumes:
      - .:/app
    command: npm run mock:server
    ports:
      - "3000:3000"
```

3. **Ejecutar con Docker Compose**
```bash
# Construir e iniciar contenedores
docker-compose up --build

# Detener contenedores
docker-compose down
```

## Configuración Adicional

### Angular Material

El proyecto utiliza Angular Material. Los estilos están configurados para un tema oscuro personalizado.

```bash
# Verificar instalación de Angular Material
ng add @angular/material
```

### Configuración de VSCode

1. **Extensiones Recomendadas**
   - Angular Language Service
   - ESLint
   - Prettier
   - Material Icon Theme

2. **Configuración del Workspace**
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### Configuración de Git

```bash
# Configurar git hooks
npm run prepare

# Verificar configuración
git config --list
```

## Solución de Problemas

### Problemas Comunes

1. **Error: Port 4200 is already in use**
```bash
# Windows
netstat -ano | findstr :4200
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :4200
kill -9 <PID>
```

2. **Error: Cannot find module '@angular/core'**
```bash
# Limpiar caché de npm
npm cache clean --force

# Borrar node_modules y reinstalar
rm -rf node_modules
npm install
```

3. **Error: Mock server no responde**
```bash
# Verificar que el puerto 3000 está libre
# Reiniciar el servidor mock
npm run mock:server
```

### Verificación de la Instalación

```bash
# Verificar dependencias
npm ls

# Ejecutar tests
npm test

# Verificar build
npm run build
```

### Logs y Debugging

```bash
# Ver logs del servidor de desarrollo
npm start -- --verbose

# Debugging con Chrome DevTools
npm run start -- --configuration=development
# Abrir Chrome DevTools (F12) > Sources
```

## Scripts Disponibles

```json
{
  "scripts": {
    "start": "ng serve",
    "build": "ng build",
    "test": "ng test",
    "lint": "ng lint",
    "mock:server": "json-server --watch mock-server/db.json --port 3000 --delay 500"
  }
}
```

## Recursos Adicionales

- [Documentación de Angular](https://angular.dev)
- [Angular Material](https://material.angular.io)
- [JSON Server](https://github.com/typicode/json-server)

## Soporte

Si encuentras problemas durante la instalación:

1. Revisa la [sección de problemas comunes](#problemas-comunes)
2. Busca en los [issues existentes](https://github.com/tuusuario/dirtdiveriv-superhero/issues)
3. Crea un nuevo issue con:
   - Descripción detallada del problema
   - Logs de error
   - Pasos para reproducir
   - Entorno (SO, versiones, etc.)

## Notas de Versión

Consulta el archivo [CHANGELOG.md](./CHANGELOG.md) para ver los cambios entre versiones.