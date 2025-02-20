// src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LoadingComponent } from './shared/components/loading/loading.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    LoadingComponent
  ],
  template: `
    <div class="app-container">
      <mat-toolbar class="app-toolbar">
        <div class="toolbar-content">
          <div class="logo-section">
            <mat-icon class="hero-icon">security</mat-icon>
            <h1 class="hero-title">{{title}}</h1>
          </div>
        </div>
      </mat-toolbar>

      <main class="app-content">
        <router-outlet />
      </main>

      <app-loading />
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .app-toolbar {
      background: linear-gradient(90deg, #1565c0, #0d47a1);
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    .toolbar-content {
      width: 100%;
      max-width: 1280px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo-section {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .hero-icon {
      font-size: 2rem;
      width: 2rem;
      height: 2rem;
    }

    .hero-title {
      margin: 0;
      font-size: 2rem;
      background: linear-gradient(90deg, #fff, #bbdefb);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    }

    .app-content {
      flex: 1;
      padding: 5rem 1rem 1rem;
      margin: 0 auto;
      width: 100%;
      max-width: 1280px;
      box-sizing: border-box;
    }
  `]
})
export class AppComponent {
  title = 'Super Heroes';
}