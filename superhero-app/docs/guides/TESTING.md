# 🧪 Guía de Testing

## Índice
- [Configuración](#configuración)
- [Tipos de Tests](#tipos-de-tests)
- [Convenciones y Mejores Prácticas](#convenciones-y-mejores-prácticas)
- [Ejemplos de Testing](#ejemplos-de-testing)
- [Testing E2E](#testing-e2e)
- [Herramientas y Utilidades](#herramientas-y-utilidades)

## Configuración

### Herramientas Utilizadas
- Jasmine: Framework de testing
- Karma: Test runner
- Testing Library: Utilidades de testing
- Angular Testing Utilities

### Comandos Principales
```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests con coverage
npm test -- --code-coverage

# Ejecutar tests para un archivo específico
npm test -- --include=src/app/features/heroes/components/hero-list.component.spec.ts

# Modo watch
npm test -- --watch
```

### Configuración de Coverage
```javascript
// karma.conf.js
module.exports = function (config) {
  config.set({
    // ...
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage'),
      reporters: [
        { type: 'html' },
        { type: 'text-summary' }
      ],
      check: {
        global: {
          statements: 80,
          branches: 80,
          functions: 80,
          lines: 80
        }
      }
    }
  });
};
```

## Tipos de Tests

### Tests Unitarios

#### Componentes
```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroListComponent } from './hero-list.component';

describe('HeroListComponent', () => {
  let component: HeroListComponent;
  let fixture: ComponentFixture<HeroListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroListComponent],
      providers: [
        // Mocks y providers necesarios
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeroListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display heroes list', () => {
    // Arrange
    const mockHeroes = [/* ... */];
    component.heroes = mockHeroes;

    // Act
    fixture.detectChanges();

    // Assert
    const heroElements = fixture.nativeElement.querySelectorAll('.hero-card');
    expect(heroElements.length).toBe(mockHeroes.length);
  });
});
```

#### Servicios
```typescript
import { TestBed } from '@angular/core/testing';
import { HeroService } from './hero.service';
import { HttpTestingController } from '@angular/common/http/testing';

describe('HeroService', () => {
  let service: HeroService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpTestingModule],
      providers: [HeroService]
    });

    service = TestBed.inject(HeroService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should get heroes with pagination', () => {
    // Test implementation
  });
});
```

#### Store
```typescript
import { TestBed } from '@angular/core/testing';
import { HeroStore } from './hero.store';

describe('HeroStore', () => {
  let store: HeroStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HeroStore]
    });
    store = TestBed.inject(HeroStore);
  });

  it('should load heroes', () => {
    // Arrange
    const mockHeroes = [/* ... */];
    
    // Act
    store.loadHeroes();
    
    // Assert
    expect(store.heroes()).toEqual(mockHeroes);
  });
});
```

### Tests de Integración

```typescript
import { render, screen } from '@testing-library/angular';
import { HeroDetailComponent } from './hero-detail.component';
import userEvent from '@testing-library/user-event';

describe('HeroDetailComponent Integration', () => {
  it('should save hero when form is valid', async () => {
    // Arrange
    const { component } = await render(HeroDetailComponent, {
      imports: [/* ... */],
      providers: [/* ... */]
    });

    // Act
    await userEvent.type(
      screen.getByLabelText(/name/i),
      'New Hero'
    );

    await userEvent.click(screen.getByText(/save/i));

    // Assert
    expect(/* ... */);
  });
});
```

## Convenciones y Mejores Prácticas

### Estructura de Tests
```typescript
describe('ComponentName', () => {
  // Setup común
  beforeEach(() => {
    // ...
  });

  // Agrupación de tests relacionados
  describe('feature or behavior', () => {
    it('should do something specific', () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

### Nombrado de Tests
- Usar descripciones claras y específicas
- Seguir el patrón "should do something when condition"
```typescript
it('should display error message when form is invalid', () => {
  // ...
});

it('should call update service when save button is clicked', () => {
  // ...
});
```

### Mocks y Stubs
```typescript
// Mock de un servicio
const heroServiceMock = {
  getHeroes: jasmine.createSpy('getHeroes')
    .and.returnValue(of([/* mock data */])),
  updateHero: jasmine.createSpy('updateHero')
    .and.returnValue(of(/* mock data */))
};

// Stub de un componente
@Component({
  selector: 'app-hero-card',
  template: '<div>Hero Card Stub</div>'
})
class HeroCardStubComponent {
  @Input() hero: Hero;
}
```

## Testing E2E

### Configuración de Cypress
```javascript
// cypress.config.ts
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    specPattern: 'cypress/e2e/**/*.cy.ts'
  }
});
```

### Ejemplo de Test E2E
```typescript
describe('Hero Application', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display hero list', () => {
    cy.get('.hero-card').should('have.length.gt', 0);
  });

  it('should create new hero', () => {
    cy.get('[data-testid="create-hero-button"]').click();
    cy.get('[data-testid="hero-name-input"]').type('New Hero');
    // ...
  });
});
```

## Herramientas y Utilidades

### Test Utils
```typescript
// test-utils.ts
export function createMockHero(): Hero {
  return {
    id: '1',
    name: 'Test Hero',
    powers: ['Test Power'],
    publisher: 'Test Publisher',
    firstAppearance: new Date(),
    imageUrl: 'test.jpg',
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

export function setupTestModule(config: TestModuleConfig) {
  // Configuración común del TestBed
}
```

### Matchers Personalizados
```typescript
// custom-matchers.ts
export const customMatchers: jasmine.CustomMatcherFactories = {
  toHaveClass: function (util, customEqualityTesters) {
    return {
      compare: function (actual: HTMLElement, className: string) {
        // Implementación
      }
    };
  }
};
```

## Tips de Debugging

### Console Output
```typescript
// Habilitar logs detallados en tests
beforeEach(() => {
  spyOn(console, 'log').and.callThrough();
});

it('should log error', () => {
  // Act
  component.handleError(new Error('Test error'));
  
  // Assert
  expect(console.log).toHaveBeenCalledWith(
    jasmine.stringMatching(/error/i)
  );
});
```

### Depuración en VS Code
```json
// .vscode/launch.json
{
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Debug Tests",
      "url": "http://localhost:9876/debug.html",
      "webRoot": "${workspaceFolder}"
    }
  ]
}
```

## Referencias y Recursos
- [Documentación de Jasmine](https://jasmine.github.io/)
- [Angular Testing Guide](https://angular.io/guide/testing)
- [Testing Library Angular](https://testing-library.com/docs/angular-testing-library/intro/)
- [Cypress Documentation](https://docs.cypress.io/)