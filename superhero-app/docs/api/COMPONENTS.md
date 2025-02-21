# 🧩 Componentes

## Índice
- [Componentes de Página](#componentes-de-página)
  - [HeroDashboardComponent](#herodashboardcomponent)
  - [HeroDetailComponent](#herodetailcomponent)
- [Componentes de Característica](#componentes-de-característica)
  - [HeroListComponent](#herolistcomponent)
  - [HeroFormComponent](#heroformcomponent)
  - [HeroSearchComponent](#herosearchcomponent)
- [Componentes Compartidos](#componentes-compartidos)
  - [LoadingComponent](#loadingcomponent)
  - [ConfirmationDialogComponent](#confirmationdialogcomponent)
- [Directivas](#directivas)

## Componentes de Página

### HeroDashboardComponent

Página principal que muestra la lista de héroes con funcionalidades de búsqueda y filtrado.

```typescript
@Component({
  selector: 'app-hero-dashboard',
  standalone: true,
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <div class="header-content">
          <div class="title-section">
            <h1>Galería de Héroes</h1>
            <p>Descubre y gestiona tu colección de superhéroes</p>
          </div>
          <button mat-raised-button color="primary" (click)="createHero()">
            <mat-icon>add</mat-icon>
            Nuevo Héroe
          </button>
        </div>
        <app-hero-search />
      </div>
      <app-hero-list />
    </div>
  `
})
export class HeroDashboardComponent {
  constructor(
    private router: Router,
    private heroStore: HeroStore
  ) {}

  ngOnInit() {
    this.heroStore.loadHeroes();
  }

  createHero() {
    this.router.navigate(['/heroes/create']);
  }
}
```

#### Características
- Punto de entrada principal para la gestión de héroes
- Integra búsqueda y lista de héroes
- Botón para crear nuevos héroes
- Diseño responsivo

### HeroDetailComponent

Página de detalle/edición de un héroe individual.

```typescript
@Component({
  selector: 'app-hero-detail',
  standalone: true,
  template: `
    <div class="p-4">
      <app-hero-form [mode]="mode" />
    </div>
  `
})
export class HeroDetailComponent implements OnInit, OnDestroy {
  @Input() mode: 'create' | 'edit' | 'view' = 'create';

  constructor(
    private route: ActivatedRoute,
    private heroStore: HeroStore
  ) {}

  ngOnInit() {
    const heroId = this.route.snapshot.paramMap.get('id');
    if (heroId) {
      this.heroStore.loadHeroById(heroId);
    }
  }

  ngOnDestroy() {
    this.heroStore.clearSelectedHero();
  }
}
```

#### Características
- Maneja tres modos: creación, edición y visualización
- Carga automática de datos del héroe
- Limpieza de estado al destruir

## Componentes de Característica

### HeroListComponent

Lista paginada de héroes con acciones CRUD.

```typescript
@Component({
  selector: 'app-hero-list',
  standalone: true,
  template: `
    <div class="heroes-grid">
      @for (hero of heroes(); track trackByHero) {
        <mat-card class="hero-card" (click)="viewHero(hero.id)">
          <!-- Template del héroe -->
        </mat-card>
      }
    </div>
    <mat-paginator
      [length]="total()"
      [pageSize]="pageSize()"
      [pageIndex]="currentPage()"
      (page)="onPageChange($event)">
    </mat-paginator>
  `
})
export class HeroListComponent {
  heroes = this.heroStore.heroes;
  total = this.heroStore.total;
  
  constructor(
    private heroStore: HeroStore,
    private dialog: MatDialog,
    private router: Router
  ) {}

  onPageChange(event: PageEvent) {
    this.heroStore.loadHeroes({
      page: event.pageIndex + 1,
      pageSize: event.pageSize
    });
  }

  trackByHero(index: number, hero: Hero): string {
    return hero.id;
  }
}
```

#### Propiedades
- `heroes`: Signal<Hero[]>
- `total`: Signal<number>
- `pageSize`: Signal<number>
- `currentPage`: Signal<number>

#### Métodos
- `onPageChange(event: PageEvent): void`
- `viewHero(id: string): void`
- `editHero(id: string): void`
- `deleteHero(id: string, name: string): void`

### HeroFormComponent

Formulario para crear/editar héroes.

```typescript
@Component({
  selector: 'app-hero-form',
  standalone: true
})
export class HeroFormComponent implements OnInit {
  @Input() mode: 'create' | 'edit' | 'view' = 'create';

  heroForm = this.fb.group({
    name: ['', [Validators.required]],
    alterEgo: [''],
    publisher: ['', [Validators.required]],
    firstAppearance: ['', [Validators.required]],
    imageUrl: ['', [Validators.required]],
    powers: [[]]
  });

  constructor(
    private fb: FormBuilder,
    private heroStore: HeroStore,
    private router: Router
  ) {}
}
```

#### Inputs
- `mode`: 'create' | 'edit' | 'view'

#### Características
- Validación de formularios
- Gestión de poderes con chips
- Preview de imagen
- Manejo de estado de formulario

### HeroSearchComponent

Componente de búsqueda con autocompletado.

```typescript
@Component({
  selector: 'app-hero-search',
  standalone: true,
  template: `
    <mat-form-field appearance="outline">
      <mat-label>Buscar héroe</mat-label>
      <input
        matInput
        [formControl]="searchControl"
        placeholder="Nombre del héroe"
        appUppercaseInput>
    </mat-form-field>
  `
})
export class HeroSearchComponent implements OnInit {
  searchControl = new FormControl('');

  constructor(private heroStore: HeroStore) {}

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

#### Características
- Búsqueda en tiempo real
- Debounce de búsqueda
- Conversión automática a mayúsculas

## Componentes Compartidos

### LoadingComponent

Indicador de carga global.

```typescript
@Component({
  selector: 'app-loading',
  standalone: true,
  template: `
    @if (loadingService.loading()) {
      <div class="loading-overlay">
        <mat-spinner diameter="48"></mat-spinner>
      </div>
    }
  `
})
export class LoadingComponent {
  constructor(public loadingService: LoadingService) {}
}
```

#### Características
- Overlay semi-transparente
- Spinner animado
- Gestión automática via interceptor

### ConfirmationDialogComponent

Diálogo de confirmación reutilizable.

```typescript
@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  template: `
    <h2 mat-dialog-title>{{data.title}}</h2>
    <mat-dialog-content>
      <p>{{data.message}}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="false">Cancelar</button>
      <button mat-raised-button color="warn" [mat-dialog-close]="true">
        Confirmar
      </button>
    </mat-dialog-actions>
  `
})
export class ConfirmationDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      title: string;
      message: string;
    }
  ) {}
}
```

#### Uso
```typescript
const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
  data: {
    title: 'Eliminar héroe',
    message: `¿Estás seguro de que quieres eliminar a ${heroName}?`
  }
});

dialogRef.afterClosed().subscribe(result => {
  if (result) {
    // Proceder con la acción
  }
});
```

## Directivas

### UppercaseInputDirective

Convierte automáticamente el texto a mayúsculas.

```typescript
@Directive({
  selector: '[appUppercaseInput]',
  standalone: true
})
export class UppercaseInputDirective {
  @HostListener('input', ['$event'])
  onInput(event: InputEvent) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.toUpperCase();
  }
}
```

#### Uso
```html
<input matInput appUppercaseInput>
```

## Estilos Comunes

### Clases Utilitarias

```scss
.dashboard-container {
  min-height: 100%;
}

.dashboard-header {
  background: linear-gradient(145deg, #1a1a1a, #262626);
  padding: 2rem 1rem;
  border-radius: 0 0 24px 24px;
}

.heroes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.hero-card {
  border-radius: 16px;
  overflow: hidden;
  background: linear-gradient(145deg, #2a2a2a, #1f1f1f);
}
```

## Testing

### Ejemplo de Test de Componente

```typescript
describe('HeroListComponent', () => {
  let component: HeroListComponent;
  let fixture: ComponentFixture<HeroListComponent>;
  let heroStore: jasmine.SpyObj<HeroStore>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('HeroStore', ['loadHeroes'], {
      heroes: signal([]),
      total: signal(0)
    });

    await TestBed.configureTestingModule({
      imports: [HeroListComponent],
      providers: [
        { provide: HeroStore, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeroListComponent);
    component = fixture.componentInstance;
    heroStore = TestBed.inject(HeroStore) as jasmine.SpyObj<HeroStore>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Más tests...
});
```

## Mejores Prácticas

1. **Componentes**
   - Mantener componentes pequeños y enfocados
   - Usar interfaces para inputs/outputs
   - Implementar OnDestroy para limpieza

2. **Rendimiento**
   - Usar trackBy en ngFor
   - Implementar ChangeDetectionStrategy.OnPush
   - Memoizar valores computados

3. **Accesibilidad**
   - Usar roles ARIA apropiados
   - Mantener contraste adecuado
   - Soportar navegación por teclado

4. **Testing**
   - Probar outputs y eventos
   - Verificar renders condicionales
   - Mockear dependencias

## Recursos

- [Angular Material Components](https://material.angular.io/components/categories)
- [Angular Template Syntax](https://angular.io/guide/template-syntax)
- [Testing Angular](https://angular.io/guide/testing)