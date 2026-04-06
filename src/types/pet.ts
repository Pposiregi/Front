export type Pet = {
  petId: number;
  name: string;
  petType: 'DOG' | 'CAT';
  color: string;
  exp: number;
  expression: 'HAPPY' | 'SAD' | 'TIRED' | string;
};

export interface petsRequest {
  name: string | null;
  petType: 'DOG' | 'CAT' | string;
  color?: string | null;
}

export interface petsResponse {
  petId: number;
  ownerId: number;
  name: string;
  petType: 'DOG' | 'CAT';
  color: string;
  exp: number;
  expression: 'HAPPY' | 'SAD' | 'TIRED' | string;
}
