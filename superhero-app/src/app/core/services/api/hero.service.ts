// src/app/core/services/api/hero.service.ts
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
    const params = new HttpParams()
      .set('_page', filters.page.toString())
      .set('_limit', filters.pageSize.toString())
      // Añadimos el parámetro name_like solo si hay un término de búsqueda
      .set('name_like', filters.name || '');

    return this.http.get<Hero[]>(this.apiUrl, {
      params,
      observe: 'response'
    }).pipe(
      map((response: HttpResponse<Hero[]>) => ({
        data: response.body ?? [],
        total: Number(response.headers.get('X-Total-Count') || 0),
        page: filters.page,
        pageSize: filters.pageSize
      }))
    );
}

  searchHeroes(term: string): Observable<Hero[]> {
    return this.http.get<Hero[]>(`${this.apiUrl}`, {
      params: new HttpParams().set('name_like', term.toUpperCase())
    });
  }

  getHeroById(id: string): Observable<Hero> {
    return this.http.get<Hero>(`${this.apiUrl}/${id}`).pipe(
      map(hero => ({
        ...hero,
        firstAppearance: new Date(hero.firstAppearance)
      }))
    );
  }

  createHero(hero: Omit<Hero, 'id' | 'createdAt' | 'updatedAt'>): Observable<Hero> {
    const now = new Date().toISOString();
    return this.http.post<Hero>(this.apiUrl, {
      ...hero,
      createdAt: now,
      updatedAt: now
    });
  }

  updateHero(id: string, hero: Partial<Hero>): Observable<Hero> {
    return this.http.patch<Hero>(`${this.apiUrl}/${id}`, {
      ...hero,
      updatedAt: new Date().toISOString()
    });
  }

  deleteHero(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}