# 🔧 Servicios API

## Índice
- [Servicios Principales](#servicios-principales)
  - [HeroService](#heroservice)
  - [HeroStore](#herostore)
- [Servicios de Utilidad](#servicios-de-utilidad)
  - [LoadingService](#loadingservice)
  - [ErrorService](#errorservice)
- [Interceptores](#interceptores)
- [Modelos de Datos](#modelos-de-datos)

## Servicios Principales

### HeroService

Servicio principal para interactuar con la API de héroes. Maneja todas las operaciones CRUD.

#### API

```typescript
@Injectable({
  providedIn: 'root'
})
export class HeroService {
  /**
   * Obtiene una lista paginada de héroes
   * @param filters Filtros de búsqueda y paginación
   * @returns Observable con la respuesta paginada
   */
  getHeroes(filters: HeroFilters): Observable<ApiResponse<Hero[]>>

  /**
   * Busca héroes por término de búsqueda
   * @param term Término de búsqueda
   * @returns Observable con la lista de héroes que coinciden
   */
  searchHeroes(term: string): Observable<Hero[]>

  /**
   * Obtiene un héroe por su ID
   * @param id ID del héroe
   * @returns Observable con los datos del héroe
   */
  getHeroById(id: string): Observable<Hero>

  /**
   * Crea un nuevo héroe
   * @param hero Datos del héroe sin ID
   * @returns Observable con el héroe creado
   */
  createHero(hero: Omit<Hero, 'id' | 'createdAt' | 'updatedAt'>): Observable<Hero>

  /**
   * Actualiza un héroe existente
   * @param id ID del héroe
   * @param hero Datos parciales del héroe
   * @returns Observable con el héroe actualizado
   */
  updateHero(id: string, hero: Partial<Hero>): Observable<Hero>

  /**
   * Elimina un héroe
   * @param id ID del héroe
   * @returns Observable vacío
   */
  deleteHero(id: string): Observable<void>
}
```

#### Ejemplos de Uso

```typescript
// Obtener héroes con paginación
heroService.getHeroes({ page: 1, pageSize: 10 }).subscribe(
  response => console.log('Héroes:', response.data)
);

// Buscar héroes
heroService.searchHeroes('man').subscribe(
  heroes => console.log('Resultados:', heroes)
);

// Crear héroe
const newHero = {
  name: 'NUEVO HÉROE',
  powers: ['Super Fuerza'],
  publisher: 'DC Comics',
  firstAppearance: new Date(),
  imageUrl: 'imagen.jpg'
};
heroService.createHero(newHero).subscribe(
  hero => console.log('Héroe creado:', hero)
);
```

### HeroStore

Store centralizado para la gestión del estado de héroes utilizando Signals.

#### API

```typescript
@Injectable({
  providedIn: 'root'
})
export class HeroStore {
  // Selectores
  readonly heroes = computed(() => this.state().heroes)
  readonly selectedHero = computed(() => this.state().selectedHero)
  readonly loading = computed(() => this.state().loading)
  readonly error = computed(() => this.state().error)
  readonly filters = computed(() => this.state().filters)
  readonly total = computed(() => this.state().total)

  // Acciones
  loadHeroes(filters?: Partial<HeroFilters>): void
  loadHeroById(id: string): void
  createHero(hero: Omit<Hero, 'id' | 'createdAt' | 'updatedAt'>): void
  updateHero(id: string, hero: Partial<Hero>): void
  deleteHero(id: string): void
  setSearchTerm(term: string): void
  clearSelectedHero(): void
  resetState(): void
}
```

#### Ejemplos de Uso

```typescript
// En un componente
export class HeroListComponent {
  constructor(private heroStore: HeroStore) {}

  // Acceder al estado
  heroes = this.heroStore.heroes
  loading = this.heroStore.loading

  // Cargar héroes
  ngOnInit() {
    this.heroStore.loadHeroes({
      page: 1,
      pageSize: 10
    });
  }

  // Realizar búsqueda
  onSearch(term: string) {
    this.heroStore.setSearchTerm(term);
  }

  // Eliminar héroe
  deleteHero(id: string) {
    this.heroStore.deleteHero(id);
  }
}
```

## Servicios de Utilidad

### LoadingService

Gestiona el estado de carga global de la aplicación.

```typescript
@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  loading = signal(false);

  show(): void {
    this.loading.set(true);
  }

  hide(): void {
    this.loading.set(false);
  }
}
```

### ErrorService

Maneja los errores globales y muestra notificaciones.

```typescript
@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  handleError(error: HttpErrorResponse): void {
    // Implementación del manejo de errores
  }
}
```

## Interceptores

### LoadingInterceptor

Muestra/oculta el indicador de carga durante las peticiones HTTP.

```typescript
export const loadingInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const loadingService = inject(LoadingService);
  const loadingTimeout = setTimeout(() => loadingService.show(), 100);

  return next(req).pipe(
    finalize(() => {
      clearTimeout(loadingTimeout);
      loadingService.hide();
    })
  );
};
```

### ErrorInterceptor

Intercepta y maneja errores HTTP de forma centralizada.

```typescript
export const errorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const errorService = inject(ErrorService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      errorService.handleError(error);
      return throwError(() => error);
    })
  );
};
```

## Modelos de Datos

### Hero

```typescript
export interface Hero {
  id: string;
  name: string;
  powers: string[];
  alterEgo?: string;
  publisher: string;
  firstAppearance: Date;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### HeroFilters

```typescript
export interface HeroFilters {
  name?: string;
  page: number;
  pageSize: number;
}
```

### ApiResponse

```typescript
export interface ApiResponse<T> {
  data: T;
  total: number;
  page: number;
  pageSize: number;
}
```

## Configuración

### Environment

```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  defaultPageSize: 9
};
```

## Consejos y Mejores Prácticas

1. **Manejo de Errores**
   - Usar el ErrorService para manejar errores de forma centralizada
   - Implementar retry para operaciones fallidas cuando sea apropiado
   - Proporcionar feedback al usuario

2. **Estado y Caché**
   - Usar el HeroStore para estado compartido
   - Implementar estrategias de caché cuando sea necesario
   - Mantener el estado lo más plano posible

3. **Rendimiento**
   - Implementar paginación del lado del servidor
   - Usar debounceTime para búsquedas
   - Cancelar suscripciones innecesarias

4. **Testing**
   - Escribir tests unitarios para cada servicio
   - Mockear dependencias externas
   - Probar casos de error y borde

## Ejemplos de Testing

```typescript
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

  it('should fetch heroes with pagination', () => {
    const mockResponse = {
      data: [/* ... */],
      total: 10,
      page: 1,
      pageSize: 10
    };

    service.getHeroes({ page: 1, pageSize: 10 })
      .subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

    const req = httpMock.expectOne(/* ... */);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
```

## Referencias

- [Angular HTTP Client](https://angular.io/guide/http)
- [RxJS Operators](https://rxjs.dev/guide/operators)
- [Signals Guide](https://angular.io/guide/signals)