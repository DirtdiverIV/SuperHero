// src/app/core/models/hero.model.ts
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

export interface HeroFilters {
  name?: string;
  page: number;
  pageSize: number;
}
