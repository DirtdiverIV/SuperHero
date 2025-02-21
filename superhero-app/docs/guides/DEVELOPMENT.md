# 👨‍💻 Guía de Desarrollo

## Índice
- [Configuración del Entorno](#configuración-del-entorno)
- [Flujos de Trabajo](#flujos-de-trabajo)
- [Guías de Componentes](#guías-de-componentes)
- [Manejo del Estado](#manejo-del-estado)
- [Trabajando con el Mock Server](#trabajando-con-el-mock-server)
- [Tips y Trucos](#tips-y-trucos)
- [Solución de Problemas](#solución-de-problemas)

## Configuración del Entorno

### Requisitos Previos
```bash
# Verifica tu versión de Node
node --version  # Debe ser v18+

# Verifica tu versión de npm
npm --version   # Debe ser v9+

# Instala Angular CLI globalmente
npm install -g @angular/cli
```

### Configuración del Proyecto
```bash
# Clona el repositorio
git clone https://github.com/tuusuario/dirtdiveriv-superhero.git
cd dirtdiveriv-superhero

# Instala las dependencias
npm install

# Inicia el servidor de desarrollo
npm start

# En otra terminal, inicia el mock server
npm run mock:server
```

### Extensiones Recomendadas para VS Code
- Angular Language Service
- ESLint
- Prettier
- Material Icon Theme
- Angular Snippets

## Flujos de Trabajo

### Desarrollo de Nuevas Características

1. **Crear una nueva rama**
   ```bash
   git checkout -b feature/nombre-caracteristica
   ```

2. **Generar nuevos componentes**
   ```bash
   # Genera un nuevo componente
   ng generate component features/heroes/components/mi-componente

   # Genera un nuevo servicio
   ng generate service core/services/mi-servicio
   ```

3. **Estructura de Commits**
   ```bash
   feat: añade nuevo componente de héroe
   fix: corrige validación en formulario
   docs: actualiza documentación
   style: mejora estilos de la lista
   ```

### Proceso de Testing

```bash
# Ejecuta todos los tests
npm test

# Ejecuta tests con coverage
npm test -- --code-coverage

# Ejecuta tests en modo watch
npm test -- --watch
```

## Guías de Componentes

### Estructura de Componentes

```typescript
@Component({
  selector: 'app-feature',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    // ... otros imports
  ],
  template: `
    <div class="component-container">
      <!-- Template aquí -->
    </div>
  `,
  styles: [`
    .component-container {
      /* Estilos aquí */
    }
  `]
})
export class FeatureComponent {
  // Signals para estado local
  private state = signal<State>({ ... });
  
  // Computed values
  displayValue = computed(() => ...);
  
  // Constructor con inyección de dependencias
  constructor(
    private service: MyService,
    private store: MyStore
  ) {}
  
  // Métodos públicos
  handleAction() {
    // Implementación
  }
}
```

### Implementación de Formularios

```typescript
export class HeroFormComponent {
  heroForm = this.fb.group({
    name: ['', [Validators.required]],
    powers: [[] as string[]],
    publisher: ['', [Validators.required]]
  });

  onSubmit() {
    if (this.heroForm.valid) {
      // Implementación
    }
  }
}
```

## Manejo del Estado

### Usando el HeroStore

```typescript
// Consultar héroes
this.heroStore.loadHeroes({
  page: 1,
  pageSize: 10
});

// Crear héroe
this.heroStore.createHero({
  name: 'Nuevo Héroe',
  powers: ['Poder 1', 'Poder 2'],
  publisher: 'DC Comics'
});

// Actualizar héroe
this.heroStore.updateHero(id, {
  name: 'Héroe Actualizado'
});
```

### Implementación de Búsqueda

```typescript
@Component({
  // ...
})
export class HeroSearchComponent {
  searchControl = new FormControl('');

  ngOnInit() {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      this.heroStore.setSearchTerm(term || '');
    });
  }
}
```

## Trabajando con el Mock Server

### Estructura de Datos
El mock server utiliza `json-server` y los datos se encuentran en `mock-server/db.json`:

```json
{
  "heroes": [
    {
      "id": "1",
      "name": "SUPERMAN",
      "powers": ["Vuelo", "Super Fuerza"],
      // ... otros campos
    }
  ]
}
```

### Endpoints Disponibles

```typescript
// GET /heroes?_page=1&_limit=10
// GET /heroes/:id
// POST /heroes
// PATCH /heroes/:id
// DELETE /heroes/:id
```

### Modificando Datos Mock

1. Edita `mock-server/db.json`
2. Reinicia el servidor mock: `npm run mock:server`

## Tips y Trucos

### Debugging

1. **Chrome DevTools**
   - Utiliza `debugger;` en tu código
   - Usa el panel "Sources" para debugging
   - Inspecciona el estado con "Angular DevTools"

2. **Logging Efectivo**
   ```typescript
   // Usa console.table para datos tabulares
   console.table(heroes);

   // Usa console.group para agrupar logs
   console.group('Hero Update');
   console.log('Previous:', oldHero);
   console.log('Current:', newHero);
   console.groupEnd();
   ```

### Optimización de Rendimiento

1. **Uso de trackBy**
   ```typescript
   <div *ngFor="let hero of heroes; trackBy: trackByHero">
   
   trackByHero(index: number, hero: Hero): string {
     return hero.id;
   }
   ```

2. **Detección de Cambios**
   ```typescript
   // Usa signals para mejor rendimiento
   readonly heroes = signal<Hero[]>([]);
   
   // Evita cálculos innecesarios
   readonly filteredHeroes = computed(() => {
     // Implementación
   });
   ```

## Solución de Problemas

### Problemas Comunes

1. **El servidor mock no responde**
   - Verifica que el puerto 3000 esté libre
   - Reinicia el servidor mock
   - Comprueba los logs por errores

2. **Error de CORS**
   - Verifica la configuración del proxy
   - Comprueba las URLs en environment

3. **Problemas de Compilación**
   ```bash
   # Limpia la caché
   npm cache clean --force
   
   # Borra node_modules y reinstala
   rm -rf node_modules
   npm install
   ```

### Recursos Útiles

- [Angular Docs](https://angular.dev)
- [Material Design](https://material.angular.io)
- [RxJS Docs](https://rxjs.dev)
- [JSON Server Docs](https://github.com/typicode/json-server)

## Soporte

Si encuentras algún problema o tienes preguntas:

1. Revisa los issues existentes
2. Crea un nuevo issue con:
   - Descripción detallada
   - Pasos para reproducir
   - Comportamiento esperado vs actual
3. Usa las etiquetas apropiadas