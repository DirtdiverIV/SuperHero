// src/app/core/models/api-response.model.ts
export interface ApiResponse<T> {
    data: T;
    total: number;
    page: number;
    pageSize: number;
  }