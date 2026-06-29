export type DrinkType = 'cocktail' | 'mocktail';

export interface DrinkIngredient {
  id: string;
  name: string;
  quantity: string;
  unit: string;
  category: string;
}

export interface DrinkRating {
  overall: number;
  taste: number;
  balance: number;
  presentation: number;
  style: number;
  originality: number;
  difficulty: number;
  professionalism: number;
  ingredientHarmony: number;
  vibeConsistency: number;
}

export interface DrinkEvaluation {
  scores: DrinkRating;
  pros: string[];
  cons: string[];
  servingTips: string[];
  suggestedGarnish: string;
  glassRecommendation: string;
  suggestedImprovements: string[];
  possibleVariations: string[];
}

export interface Drink {
  id: string;
  name: string;
  type: DrinkType;
  base: string;
  vibes: string[];
  ingredients: DrinkIngredient[];
  preparation: string;
  notes: string;
  tags: string[];
  evaluation: DrinkEvaluation | null;
  photo: string | null;
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export type Page = 'landing' | 'builder' | 'library' | 'stats' | 'detail';

export interface IngredientSuggestion {
  name: string;
  category: string;
  rating: number;
  reason: string;
}
