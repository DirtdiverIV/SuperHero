// src/app/core/services/api/hero.service.ts
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Hero, HeroFilters } from '../../models/hero.model';
import { ApiResponse } from '../../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/heroes`;

  getHeroes(filters: HeroFilters): Observable<ApiResponse<Hero[]>> {
    let params = new HttpParams()
      .set('page', filters.page.toString())
      .set('pageSize', filters.pageSize.toString());

    if (filters.name) {
      params = params.set('name_like', filters.name);
    }

    return this.http.get<ApiResponse<Hero[]>>(this.apiUrl, { params });
  }

  getHeroById(id: string): Observable<Hero> {
    return this.http.get<Hero>(`${this.apiUrl}/${id}`);
  }

  createHero(hero: Omit<Hero, 'id' | 'createdAt' | 'updatedAt'>): Observable<Hero> {
    return this.http.post<Hero>(this.apiUrl, {
      ...hero,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  updateHero(id: string, hero: Partial<Hero>): Observable<Hero> {
    return this.http.patch<Hero>(`${this.apiUrl}/${id}`, {
      ...hero,
      updatedAt: new Date()
    });
  }

  deleteHero(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}