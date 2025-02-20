// src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LoadingComponent } from './shared/components/loading/loading.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    LoadingComponent
  ],
  template: `
    <div class="app-container">
      <mat-toolbar class="app-toolbar">
        <div class="toolbar-content">
          <div class="logo-section" routerLink="/" style="cursor: pointer">
            <mat-icon class="logo-icon">bolt</mat-icon>
            <span class="logo-text">{{title}}</span>
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
      background-color: #1a1a1a;
    }

    .app-toolbar {
      background: #1a1a1a;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      height: 64px;
      padding: 0 24px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .toolbar-content {
      width: 100%;
      max-width: 1280px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100%;
    }

    .logo-section {
      display: flex;
      align-items: center;
      gap: 12px;
      transition: opacity 0.2s ease;

      &:hover {
        opacity: 0.8;
      }
    }

    .logo-icon {
      color: #2196f3;
      font-size: 32px;
      width: 32px;
      height: 32px;
    }

    .logo-text {
      font-family: 'Press Start 2P', monospace;
      font-size: 18px;
      color: #ffffff;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 400;
    }

    .app-content {
      flex: 1;
      padding: 80px 24px 24px;
      margin: 0 auto;
      width: 100%;
      max-width: 1280px;
      box-sizing: border-box;
    }

    :host ::ng-deep {
      .mat-toolbar-single-row {
        padding: 0;
      }
    }
  `]
})
export class AppComponent {
  title = 'D&M Cosplay Heroes';
}