// Common Shared Types
export interface ApiResponse<T> { data: T; message: string; }
export interface PaginatedResponse<T> { data: T[]; total: number; page: number; }
export interface ErrorResponse { error: string; statusCode: number; }