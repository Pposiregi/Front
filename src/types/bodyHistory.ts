export type BodyHistoryResponse = {
  id: number;
  userId: number;
  heightCm: number;
  weightKg: number;
  pbf: number;
  baseDate: string; // YYYY-MM-DD
  createdAt?: string;
};

export type BodyHistoryCreateRequest = {
  userId: number;
  heightCm: number;
  weightKg: number;
  pbf: number;
  baseDate: string; // YYYY-MM-DD
};

export type BodyHistoryUpdateRequest = {
  heightCm: number;
  weightKg: number;
  pbf: number;
  baseDate: string; // YYYY-MM-DD
};

export type BodyHistoryFormValues = BodyHistoryUpdateRequest;
