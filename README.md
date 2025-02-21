# 🦸‍♂️ D&M Cosplay Heroes

## 💡 Sobre el Proyecto

Este proyecto es un challenge técnico desarrollado para Mindata, donde se requería crear una aplicación de gestión de superhéroes. Como en cada proyecto que desarrollo, he querido darle un toque personal y único: las imágenes de los superhéroes son pixel art creados por mí (David), representando versiones imaginarias de mi novia y yo caracterizados como diferentes héroes.

La elección del pixel art y la temática personal refleja mi filosofía de que incluso un challenge técnico puede ser una oportunidad para mostrar creatividad y añadir un toque de corazón al código. La aplicación combina los requisitos técnicos del challenge con un estilo visual retro a través del pixel art, reflejado también en la elección de la fuente "Press Start 2P" y otros elementos de diseño.

![Angular](https://img.shields.io/badge/Angular-18-DD0031?style=for-the-badge&logo=angular) 
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Angular Material](https://img.shields.io/badge/Material-18-3f51b5?style=for-the-badge&logo=angular)
![RxJS](https://img.shields.io/badge/RxJS-B7178C?style=for-the-badge&logo=reactivex&logoColor=white)

Una aplicación SPA desarrollada en Angular 18 para gestionar una colección de superhéroes personalizados. El proyecto implementa un CRUD completo con características avanzadas como paginación, búsqueda en tiempo real, y gestión de estado reactiva.

## 🚀 Características Implementadas

### Core Features
- ✅ CRUD completo de superhéroes
- ✅ Paginación de resultados
- ✅ Búsqueda en tiempo real
- ✅ Formularios reactivos con validaciones
- ✅ Confirmación de eliminación
- ✅ Navegación y ruteo

### Características Técnicas
- ✅ Arquitectura basada en signals de Angular
- ✅ Gestión de estado centralizada
- ✅ Programación reactiva con RxJS
- ✅ Interceptores HTTP
- ✅ Directivas personalizadas
- ✅ Lazy loading de módulos
- ✅ Mock Server con json-server

### UI/UX
- ✅ Diseño responsivo
- ✅ Angular Material
- ✅ Indicadores de carga
- ✅ Feedback visual de acciones
- ✅ Animaciones y transiciones

## 🛠️ Tecnologías Principales

- Angular 18
- TypeScript
- Angular Material
- RxJS
- JSON Server

## 📋 Prerrequisitos

- Node.js (v18 o superior)
- npm (v9 o superior)
- Angular CLI (última versión)

## 🔧 Instalación

1. Clonar el repositorio
```bash
git clone https://github.com/tuusuario/dirtdiveriv-superhero.git
cd dirtdiveriv-superhero
```

2. Instalar dependencias
```bash
npm install
```

3. Iniciar el mock server
```bash
npm run mock:server
```

4. En otra terminal, iniciar la aplicación
```bash
npm start
```

La aplicación estará disponible en `http://localhost:4200`

## 📚 Documentación

Encuentra documentación detallada en nuestra [carpeta de docs](./docs):

- [Guía de Arquitectura](./docs/ARCHITECTURE.md)
- [Guía de Desarrollo](./docs/guides/DEVELOPMENT.md)
- [Documentación de la API](./docs/api/SERVICES.md)
- [Guía de Testing](./docs/guides/TESTING.md)
- [Mejores Prácticas](./docs/development/BEST-PRACTICES.md)

## 🏗️ Estructura del Proyecto

```
src/
├── app/
│   ├── core/                 # Servicios, modelos e interceptores
│   ├── features/            # Módulos funcionales
│   ├── shared/              # Componentes y utilidades compartidas
│   └── app.component.ts     # Componente raíz
├── assets/                  # Recursos estáticos
└── environments/           # Configuraciones por entorno
```

## 🌟 Características Destacadas

### Store y Gestión de Estado
```typescript
export class HeroStore {
  private state = signal<HeroState>({...});
  heroes = computed(() => this.state().heroes);
  // ...
}
```

### Directiva de Mayúsculas
```typescript
@Directive({
  selector: '[appUppercaseInput]'
})
export class UppercaseInputDirective {
  @HostListener('input', ['$event'])
  onInput(event: InputEvent) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.toUpperCase();
  }
}
```

### Interceptor de Carga
```typescript
export const loadingInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  loadingService.show();
  return next(req).pipe(
    finalize(() => loadingService.hide())
  );
};
```

## 🤝 Feedback

Todo feedback es bienvenido.