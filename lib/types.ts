export type Goal = 'fat_loss' | 'muscle_gain' | 'strength' | 'maintenance';
export type Experience = 'beginner' | 'intermediate' | 'advanced';
export type WorkoutType = 'gym' | 'home' | 'no_equipment';
export type Diet = 'vegetarian' | 'non_vegetarian' | 'vegan';

export type Profile = {
  id: string;
  full_name: string | null;
  age: number | null;
  gender: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  goal: string | null;
  experience: string | null;
  workout_type: string | null;
  diet: string | null;
  injuries: string | null;
  streak: number;
  points: number;
};

export type Exercise = {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  instructions: string;
  image: string;
};

export type WorkoutDay = {
  day: string;
  focus: string;
  exercises: Exercise[];
};

export type WorkoutPlan = {
  title: string;
  days: WorkoutDay[];
};

export type Meal = {
  name: string;
  type: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  image: string;
  recipe: string;
};

export type MealPlan = {
  daily_target: number;
  meals: Meal[];
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'coach';
  content: string;
  created_at: string;
};

export type ProgressEntry = {
  id: string;
  weight_kg: number | null;
  calories: number | null;
  protein: number | null;
  water_ml: number | null;
  steps: number | null;
  chest_cm: number | null;
  waist_cm: number | null;
  hip_cm: number | null;
  photo_url: string | null;
  note: string | null;
  logged_at: string;
};
