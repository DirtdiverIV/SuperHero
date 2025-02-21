# 📋 Mejores Prácticas

## Índice
- [Arquitectura y Estructura](#arquitectura-y-estructura)
- [Convenciones de Código](#convenciones-de-código)
- [Rendimiento](#rendimiento)
- [Seguridad](#seguridad)
- [Testing](#testing)
- [Estado y Signals](#estado-y-signals)
- [Componentes](#componentes)
- [Formularios](#formularios)
- [RxJS y Observables](#rxjs-y-observables)
- [Error Handling](#error-handling)

## Arquitectura y Estructura

### Organización del Código

```
src/
├── app/
│   ├── core/          # Servicios singleton, modelos, interceptores
│   ├── features/      # Módulos funcionales
│   └── shared/        # Componentes y utilidades compartidas
```

### Principios SOLID

1. **Single Responsibility (SRP)**
```typescript
// ✅ Bien
@Injectable()
export class HeroService {
  constructor(private http: HttpClient) {}
  
  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>('/api/heroes');
  }
}

@Injectable()
export class HeroValidator {
  validateHero(hero: Hero): boolean {
    // Lógica de validación
  }
}

// ❌ Mal
@Injectable()
export class HeroService {
  validateAndGetHeroes() {
    // Mezcla responsabilidades de validación y datos
  }
}
```

2. **Open/Closed Principle**
```typescript
// ✅ Bien
interface FilterStrategy {
  apply(heroes: Hero[]): Hero[];
}

class PowerFilterStrategy implements FilterStrategy {
  apply(heroes: Hero[]): Hero[] {
    // Implementación específica
  }
}

// ❌ Mal
class HeroFilter {
  filter(heroes: Hero[], type: string) {
    switch(type) {
      // Múltiples casos que requieren modificar la clase
    }
  }
}
```

## Convenciones de Código

### Nomenclatura

```typescript
// ✅ Bien
interface Hero {
  id: string;
  name: string;
}

class HeroListComponent {
  private readonly maxHeroes = 10;
  heroes: Hero[] = [];
}

// ❌ Mal
interface hero_interface {
  ID: string;
  Name: string;
}

class heroList {
  private MAX_HEROES = 10;
  HEROES = [];
}
```

### TypeScript

```typescript
// ✅ Bien
function getHeroById(id: string): Hero | undefined {
  return this.heroes.find(hero => hero.id === id);
}

// ❌ Mal
function getHero(id) {
  return this.heroes.find(h => h.id == id);
}
```

## Rendimiento

### Detección de Cambios

```typescript
// ✅ Bien
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroListComponent {
  heroes = signal<Hero[]>([]);
  
  trackByHero(index: number, hero: Hero): string {
    return hero.id;
  }
}

// ❌ Mal
@Component({})
export class HeroListComponent {
  heroes: Hero[] = [];
}
```

### Memoización

```typescript
// ✅ Bien
@Component({})
export class HeroListComponent {
  private heroes = signal<Hero[]>([]);
  
  filteredHeroes = computed(() => 
    this.heroes().filter(hero => hero.active)
  );
}

// ❌ Mal
@Component({})
export class HeroListComponent {
  get filteredHeroes() {
    return this.heroes.filter(hero => hero.active);
  }
}
```

## Seguridad

### XSS Prevention

```typescript
// ✅ Bien
@Component({
  template: `
    <div [innerHTML]="sanitizer.bypassSecurityTrustHtml(content)"></div>
  `
})
class HeroDescriptionComponent {
  constructor(private sanitizer: DomSanitizer) {}
}

// ❌ Mal
@Component({
  template: `
    <div [innerHTML]="content"></div>
  `
})
class HeroDescriptionComponent {}
```

### Validación de Entrada

```typescript
// ✅ Bien
@Component({})
class HeroFormComponent {
  heroForm = this.fb.group({
    name: ['', [
      Validators.required,
      Validators.minLength(2),
      Validators.pattern(/^[a-zA-Z0-9\s]+$/)
    ]]
  });
}

// ❌ Mal
@Component({})
class HeroFormComponent {
  submitHero(name: string) {
    // Sin validación
    this.heroService.save({ name });
  }
}
```

## Testing

### Unit Tests

```typescript
// ✅ Bien
describe('HeroService', () => {
  let service: HeroService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HeroService]
    });

    service = TestBed.inject(HeroService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should fetch heroes', () => {
    // Arrange
    const mockHeroes = [/* ... */];

    // Act
    service.getHeroes().subscribe(heroes => {
      // Assert
      expect(heroes).toEqual(mockHeroes);
    });

    // Assert
    const req = httpMock.expectOne('/api/heroes');
    expect(req.request.method).toBe('GET');
    req.flush(mockHeroes);
  });
});
```

## Estado y Signals

### Gestión del Estado

```typescript
// ✅ Bien
@Injectable({ providedIn: 'root' })
export class HeroStore {
  private state = signal<HeroState>({
    heroes: [],
    loading: false,
    error: null
  });

  heroes = computed(() => this.state().heroes);
  loading = computed(() => this.state().loading);

  loadHeroes() {
    this.state.update(s => ({ ...s, loading: true }));
    // ...
  }
}

// ❌ Mal
@Injectable()
export class HeroService {
  heroes: Hero[] = [];
  loading = false;

  loadHeroes() {
    this.loading = true;
    // Mutación directa del estado
  }
}
```

## Componentes

### Composición

```typescript
// ✅ Bien
@Component({
  template: `
    <app-hero-list>
      <app-hero-card
        *ngFor="let hero of heroes()"
        [hero]="hero"
        (select)="onSelect($event)">
      </app-hero-card>
    </app-hero-list>
  `
})
class HeroesComponent {}

// ❌ Mal
@Component({
  template: `
    <div class="heroes">
      <!-- Lógica compleja en un solo componente -->
    </div>
  `
})
class HeroesComponent {}
```

## Formularios

### Formularios Reactivos

```typescript
// ✅ Bien
@Component({})
class HeroFormComponent {
  heroForm = this.fb.group({
    name: ['', Validators.required],
    powers: this.fb.array([]),
    details: this.fb.group({
      origin: [''],
      weakness: ['']
    })
  });

  addPower(power: string) {
    const powers = this.heroForm.get('powers') as FormArray;
    powers.push(this.fb.control(power));
  }
}

// ❌ Mal
@Component({})
class HeroFormComponent {
  // Formularios template-driven para lógica compleja
  heroName: string = '';
  heroPowers: string[] = [];
}
```

## RxJS y Observables

### Gestión de Suscripciones

```typescript
// ✅ Bien
@Component({})
class HeroListComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.heroService.getHeroes().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(heroes => {
      // Manejar heroes
    });
  }
}

// ❌ Mal
@Component({})
class HeroListComponent {
  subscription: Subscription;

  ngOnInit() {
    this.subscription = this.heroService.getHeroes()
      .subscribe(heroes => {
        // Posible memory leak
      });
  }
}
```

### Operadores

```typescript
// ✅ Bien
@Component({})
class HeroSearchComponent {
  search(term: string): Observable<Hero[]> {
    return this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => this.heroService.searchHeroes(term))
    );
  }
}

// ❌ Mal
@Component({})
class HeroSearchComponent {
  search(term: string) {
    // Llamadas directas sin debounce
    this.heroService.searchHeroes(term).subscribe();
  }
}
```

## Error Handling

### Manejo Global

```typescript
// ✅ Bien
@Injectable()
export class ErrorHandlingInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError(error => {
        this.errorService.handleError(error);
        return throwError(() => error);
      })
    );
  }
}

// ❌ Mal
// Manejo de errores disperso en componentes
this.heroService.getHeroes().subscribe({
  error: error => console.error(error)
});
```

### Boundary de Errores

```typescript
// ✅ Bien
@Component({
  template: `
    <error-boundary>
      <app-hero-list></app-hero-list>
    </error-boundary>
  `
})
class HeroesComponent {}

// ❌ Mal
@Component({
  template: `
    <div>
      {{ heroes$ | async }}
      <!-- Sin manejo de errores -->
    </div>
  `
})
class HeroesComponent {}
```

## Referencias

- [Angular Style Guide](https://angular.io/guide/styleguide)
- [RxJS Best Practices](https://rxjs.dev/guide/testing)
- [TypeScript Guidelines](https://www.typescriptlang.org/docs/handbook/declaration-files/do-and-dont.html)
- [Angular Security Guide](https://angular.io/guide/security)