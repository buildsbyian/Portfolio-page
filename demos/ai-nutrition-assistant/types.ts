export type VolumeUnit = 'ml' | 'oz' | 'L';
export type WeightUnit = 'g' | 'oz' | 'lb';
export type EnergyUnit = 'kcal' | 'kj';

export interface DisplayUnits {
  volume: VolumeUnit;
  weight: WeightUnit;
  energy: EnergyUnit;
}

export interface DemoGoal {
  nutrient: string;
  target_value: number;
  unit: string;
  goal_type?: 'goal' | 'limit';
  yellow_min?: number;
  green_min?: number;
  red_min?: number;
}

export interface DemoFoodLog {
  id: string;
  log_time: string;
  food_name: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_total_g: number;
  fat_saturated_g?: number;
  fiber_g: number;
  sugar_g: number;
  sodium_mg: number;
  hydration_ml: number;
  serving_size?: string;
  portion?: string;
  confidence?: 'low' | 'medium' | 'high';
  confidence_details?: Record<string, 'low' | 'medium' | 'high'>;
  error_sources?: string[];
  extras?: Record<string, number>;
}

export interface DemoRecipeIngredient {
  ingredient_name: string;
  quantity: number;
  unit: string;
}

export interface DemoRecipe {
  id: string;
  recipe_name: string;
  servings: number;
  serving_size?: string;
  calories: number;
  description?: string;
  instructions?: string;
  ingredients?: string;
  recipe_ingredients?: DemoRecipeIngredient[];
  per_serving_nutrition?: Record<string, number>;
  nutrition_data?: Record<string, number>;
}

export interface DemoChatMessage {
  id: string;
  sender: 'user' | 'bot' | 'assistant' | 'error';
  text: string;
  metadata?: {
    nutrition?: DemoFoodLog[];
    progress_logs?: DemoFoodLog[];
    recipe?: DemoRecipe;
    warnings?: string[];
  };
  message_type?:
    | 'food_logged'
    | 'recipe_saved'
    | 'progress_logs'
    | 'nutrition_info'
    | 'audit'
    | 'summary'
    | 'analysis';
  flagged?: boolean;
}

export interface DemoChatSession {
  id: string;
  title: string;
  updated_at: string;
  messages: DemoChatMessage[];
}

export type DemoPage =
  | 'dashboard'
  | 'chat'
  | 'history'
  | 'recipes'
  | 'analytics'
  | 'settings';

export interface DemoProfile {
  displayUnits: DisplayUnits;
  healthNotes: string[];
  dayType: 'normal' | 'travel' | 'social' | 'recovery';
}

export interface NutritionAssistantDemoState {
  activePage: DemoPage;
  activeChatId: string;
  chatSessions: DemoChatSession[];
  goals: DemoGoal[];
  logs: DemoFoodLog[];
  recipes: DemoRecipe[];
  profile: DemoProfile;
}
