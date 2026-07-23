import type { Profile, WorkoutPlan, MealPlan, Exercise, Meal } from './types';

const gymExercises: Record<string, Exercise[]> = {
  'Chest + Triceps': [
    { name: 'Bench Press', sets: 4, reps: '8-10', rest: '90s', instructions: 'Lie flat, lower bar to mid-chest, press up explosively.', image: 'https://images.pexels.com/photos/1431282/pexels-photo-1431282.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', rest: '75s', instructions: 'Set bench to 30°, press dumbbells up and slightly together.', image: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { name: 'Cable Fly', sets: 3, reps: '12-15', rest: '60s', instructions: 'Arms slightly bent, bring handles together in an arc.', image: 'https://images.pexels.com/photos/4753986/pexels-photo-4753986.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { name: 'Triceps Pushdown', sets: 3, reps: '12-15', rest: '60s', instructions: 'Keep elbows pinned, extend fully, squeeze at bottom.', image: 'https://images.pexels.com/photos/4753986/pexels-photo-4753986.jpeg?auto=compress&cs=tinysrgb&w=600' },
  ],
  'Back + Biceps': [
    { name: 'Deadlift', sets: 4, reps: '6-8', rest: '120s', instructions: 'Flat back, drive through heels, hips and shoulders rise together.', image: 'https://images.pexels.com/photos/1552103/pexels-photo-1552103.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { name: 'Pull-Ups', sets: 3, reps: '8-12', rest: '90s', instructions: 'Full hang, pull chest to bar, control the descent.', image: 'https://images.pexels.com/photos/1552103/pexels-photo-1552103.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { name: 'Barbell Row', sets: 3, reps: '10-12', rest: '75s', instructions: 'Hinge forward, pull bar to lower ribs, squeeze back.', image: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { name: 'Barbell Curl', sets: 3, reps: '10-12', rest: '60s', instructions: 'Elbows tucked, curl fully, no swinging.', image: 'https://images.pexels.com/photos/4753986/pexels-photo-4753986.jpeg?auto=compress&cs=tinysrgb&w=600' },
  ],
  'Legs + Core': [
    { name: 'Squat', sets: 4, reps: '8-10', rest: '120s', instructions: 'Feet shoulder-width, descend below parallel, drive up.', image: 'https://images.pexels.com/photos/1552103/pexels-photo-1552103.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { name: 'Romanian Deadlift', sets: 3, reps: '10-12', rest: '90s', instructions: 'Soft knees, push hips back, feel hamstring stretch.', image: 'https://images.pexels.com/photos/1431282/pexels-photo-1431282.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { name: 'Leg Press', sets: 3, reps: '12-15', rest: '75s', instructions: 'Lower to 90°, push through full foot.', image: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { name: 'Plank', sets: 3, reps: '45-60s', rest: '45s', instructions: 'Brace core, neutral spine, hold steady.', image: 'https://images.pexels.com/photos/4753986/pexels-photo-4753986.jpeg?auto=compress&cs=tinysrgb&w=600' },
  ],
  'Shoulders + Arms': [
    { name: 'Overhead Press', sets: 4, reps: '8-10', rest: '90s', instructions: 'Press bar overhead, brace core, lock out.', image: 'https://images.pexels.com/photos/1431282/pexels-photo-1431282.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { name: 'Lateral Raise', sets: 3, reps: '12-15', rest: '60s', instructions: 'Slight bend, raise to shoulder height, lower slow.', image: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { name: 'Hammer Curl', sets: 3, reps: '10-12', rest: '60s', instructions: 'Neutral grip, curl keeping elbows fixed.', image: 'https://images.pexels.com/photos/4753986/pexels-photo-4753986.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { name: 'Skull Crusher', sets: 3, reps: '10-12', rest: '60s', instructions: 'Lower to forehead, extend fully, keep elbows in.', image: 'https://images.pexels.com/photos/4753986/pexels-photo-4753986.jpeg?auto=compress&cs=tinysrgb&w=600' },
  ],
  'Cardio + Mobility': [
    { name: 'Treadmill Run', sets: 1, reps: '20 min', rest: '-', instructions: 'Moderate pace, aim for steady heart rate.', image: 'https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { name: 'Jump Rope', sets: 4, reps: '2 min', rest: '60s', instructions: 'Light bounce, turn rope with wrists.', image: 'https://images.pexels.com/photos/4753986/pexels-photo-4753986.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { name: 'Hip Mobility Flow', sets: 1, reps: '10 min', rest: '-', instructions: '90/90 transitions, deep lunge, pigeon pose.', image: 'https://images.pexels.com/photos/3823039/pexels-photo-3823039.jpeg?auto=compress&cs=tinysrgb&w=600' },
  ],
};

const homeExercises: Record<string, Exercise[]> = {
  'Upper Body': [
    { name: 'Push-Ups', sets: 4, reps: '12-15', rest: '60s', instructions: 'Body straight, chest to floor, push explosively.', image: 'https://images.pexels.com/photos/4753986/pexels-photo-4753986.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { name: 'Pike Push-Ups', sets: 3, reps: '8-10', rest: '60s', instructions: 'Hips high, lower head toward floor, press up.', image: 'https://images.pexels.com/photos/4753986/pexels-photo-4753986.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { name: 'Towel Rows', sets: 3, reps: '12-15', rest: '60s', instructions: 'Wrap towel around door handle, lean back, pull.', image: 'https://images.pexels.com/photos/4753986/pexels-photo-4753986.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { name: 'Diamond Push-Ups', sets: 3, reps: '10-12', rest: '60s', instructions: 'Hands form diamond, targets triceps.', image: 'https://images.pexels.com/photos/4753986/pexels-photo-4753986.jpeg?auto=compress&cs=tinysrgb&w=600' },
  ],
  'Lower Body': [
    { name: 'Bodyweight Squats', sets: 4, reps: '15-20', rest: '60s', instructions: 'Full depth, drive through heels.', image: 'https://images.pexels.com/photos/4753986/pexels-photo-4753986.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { name: 'Bulgarian Split Squat', sets: 3, reps: '10 each', rest: '60s', instructions: 'Rear foot elevated, descend straight down.', image: 'https://images.pexels.com/photos/4753986/pexels-photo-4753986.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { name: 'Glute Bridge', sets: 3, reps: '15', rest: '45s', instructions: 'Squeeze glutes, pause at top.', image: 'https://images.pexels.com/photos/4753986/pexels-photo-4753986.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { name: 'Calf Raises', sets: 3, reps: '20', rest: '45s', instructions: 'Full stretch, pause at top.', image: 'https://images.pexels.com/photos/4753986/pexels-photo-4753986.jpeg?auto=compress&cs=tinysrgb&w=600' },
  ],
  'Core + Cardio': [
    { name: 'Mountain Climbers', sets: 4, reps: '40s', rest: '20s', instructions: 'Fast pace, hips low.', image: 'https://images.pexels.com/photos/4753986/pexels-photo-4753986.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { name: 'Bicycle Crunches', sets: 3, reps: '20', rest: '45s', instructions: 'Opposite elbow to knee, twist torso.', image: 'https://images.pexels.com/photos/4753986/pexels-photo-4753986.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { name: 'Burpees', sets: 4, reps: '10', rest: '60s', instructions: 'Chest to floor, jump at top.', image: 'https://images.pexels.com/photos/4753986/pexels-photo-4753986.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { name: 'Plank Hold', sets: 3, reps: '45-60s', rest: '45s', instructions: 'Brace, neutral spine.', image: 'https://images.pexels.com/photos/4753986/pexels-photo-4753986.jpeg?auto=compress&cs=tinysrgb&w=600' },
  ],
};

const vegMeals: Meal[] = [
  { name: 'Greek Yogurt Bowl', type: 'Breakfast', calories: 380, protein: 28, carbs: 45, fats: 10, image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=600', recipe: 'Mix Greek yogurt with berries, honey, and granola.' },
  { name: 'Chickpea Power Bowl', type: 'Lunch', calories: 520, protein: 24, carbs: 70, fats: 16, image: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=600', recipe: 'Chickpeas, quinoa, roasted veggies, tahini dressing.' },
  { name: 'Protein Smoothie', type: 'Snack', calories: 240, protein: 25, carbs: 28, fats: 5, image: 'https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg?auto=compress&cs=tinysrgb&w=600', recipe: 'Whey, banana, spinach, almond milk, blend.' },
  { name: 'Tofu Stir-Fry', type: 'Dinner', calories: 560, protein: 32, carbs: 55, fats: 20, image: 'https://images.pexels.com/photos/1640775/pexels-photo-1640775.jpeg?auto=compress&cs=tinysrgb&w=600', recipe: 'Crispy tofu, broccoli, peppers, soy-ginger sauce, brown rice.' },
];
const nonVegMeals: Meal[] = [
  { name: 'Egg & Avocado Toast', type: 'Breakfast', calories: 420, protein: 26, carbs: 35, fats: 20, image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=600', recipe: 'Scrambled eggs on whole-grain toast with avocado.' },
  { name: 'Grilled Chicken Bowl', type: 'Lunch', calories: 540, protein: 45, carbs: 50, fats: 14, image: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=600', recipe: 'Grilled chicken, rice, black beans, salsa.' },
  { name: 'Cottage Cheese & Nuts', type: 'Snack', calories: 260, protein: 22, carbs: 18, fats: 12, image: 'https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg?auto=compress&cs=tinysrgb&w=600', recipe: 'Cottage cheese with almonds and pineapple.' },
  { name: 'Salmon & Sweet Potato', type: 'Dinner', calories: 580, protein: 40, carbs: 45, fats: 22, image: 'https://images.pexels.com/photos/1640775/pexels-photo-1640775.jpeg?auto=compress&cs=tinysrgb&w=600', recipe: 'Baked salmon, roasted sweet potato, asparagus.' },
];
const veganMeals: Meal[] = [
  { name: 'Overnight Oats', type: 'Breakfast', calories: 390, protein: 14, carbs: 60, fats: 11, image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=600', recipe: 'Oats, chia, almond milk, maple, berries.' },
  { name: 'Lentil Curry Bowl', type: 'Lunch', calories: 530, protein: 22, carbs: 80, fats: 12, image: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=600', recipe: 'Red lentils, coconut curry, basmati rice.' },
  { name: 'Hummus & Veggies', type: 'Snack', calories: 220, protein: 8, carbs: 30, fats: 9, image: 'https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg?auto=compress&cs=tinysrgb&w=600', recipe: 'Hummus with carrot, cucumber, pita.' },
  { name: 'Tempeh Stir-Fry', type: 'Dinner', calories: 550, protein: 30, carbs: 55, fats: 18, image: 'https://images.pexels.com/photos/1640775/pexels-photo-1640775.jpeg?auto=compress&cs=tinysrgb&w=600', recipe: 'Tempeh, broccoli, peppers, soy-ginger, brown rice.' },
];

export function generateWorkoutPlan(profile: Partial<Profile>): WorkoutPlan {
  const type = profile.workout_type || 'gym';
  const exp = profile.experience || 'beginner';
  const goal = profile.goal || 'maintenance';

  let pool: Record<string, Exercise[]>;
  let dayOrder: string[];

  if (type === 'gym') {
    pool = gymExercises;
    dayOrder = ['Chest + Triceps', 'Back + Biceps', 'Legs + Core', 'Shoulders + Arms', 'Cardio + Mobility'];
  } else {
    pool = homeExercises;
    dayOrder = ['Upper Body', 'Lower Body', 'Core + Cardio', 'Upper Body', 'Core + Cardio'];
  }

  const setMultiplier = exp === 'advanced' ? 1.25 : exp === 'intermediate' ? 1 : 0.75;
  const days: WorkoutPlan['days'] = dayOrder.map((focus, i) => ({
    day: `Day ${i + 1}`,
    focus,
    exercises: pool[focus].map((ex) => ({
      ...ex,
      sets: Math.max(3, Math.round(ex.sets * setMultiplier)),
    })),
  }));

  const titleMap: Record<string, string> = {
    fat_loss: 'Fat Loss Shred Program',
    muscle_gain: 'Lean Muscle Builder',
    strength: 'Strength Foundation',
    maintenance: 'Maintenance & Health',
  };

  return { title: titleMap[goal] || 'Personalized Plan', days };
}

export function generateMealPlan(profile: Partial<Profile>): MealPlan {
  const diet = profile.diet || 'non_vegetarian';
  const goal = profile.goal || 'maintenance';
  const weight = profile.weight_kg || 70;

  const proteinTarget = Math.round(weight * (goal === 'muscle_gain' ? 2 : 1.8));
  const calorieTarget =
    goal === 'fat_loss'
      ? Math.round(weight * 28)
      : goal === 'muscle_gain'
        ? Math.round(weight * 36)
        : Math.round(weight * 32);

  let meals: Meal[];
  if (diet === 'vegan') meals = veganMeals;
  else if (diet === 'vegetarian') meals = vegMeals;
  else meals = nonVegMeals;

  return { daily_target: calorieTarget, meals };
}

const coachResponses = [
  "Great question! Based on your goal, I'd recommend focusing on progressive overload — add weight or reps each week to keep challenging your muscles.",
  "You're on the right track. For recovery, aim for 7-9 hours of sleep and stay hydrated. Your muscles grow when you rest, not when you train.",
  "Consistency beats intensity. Even a short workout counts. Keep your streak going — you've got this!",
  "For your nutrition, prioritize protein at every meal. It keeps you full and supports muscle repair. Aim for 25-30g per meal.",
  "Listen to your body. If something feels sharp or painful, stop. Soreness is normal; joint pain is not. Scale back if needed.",
  "Motivation comes and goes, but discipline builds habits. Show up even when you don't feel like it — that's where the transformation happens.",
];

export function generateCoachReply(userMessage: string, profile: Partial<Profile>): string {
  const msg = userMessage.toLowerCase();
  if (msg.includes('weight') || msg.includes('fat')) {
    return `For fat loss, focus on a moderate calorie deficit (~300-500 cal/day), keep protein high to preserve muscle, and combine strength training with cardio. At your current weight of ${profile.weight_kg || 70}kg, aim for steady progress of 0.5kg/week.`;
  }
  if (msg.includes('diet') || msg.includes('eat') || msg.includes('meal') || msg.includes('food')) {
    return `Your meal plan is designed around your ${profile.diet || 'balanced'} preference. Prioritize whole foods, hit your protein target, and don't fear carbs — they fuel your workouts. Want me to adjust a specific meal?`;
  }
  if (msg.includes('motivat') || msg.includes('give up') || msg.includes('tired')) {
    return `Every rep counts. You started this journey for a reason — remember that. ${profile.streak || 0} day streak is proof you can show up. Take it one workout at a time.`;
  }
  if (msg.includes('recover') || msg.includes('sore') || msg.includes('rest')) {
    return `Active recovery works wonders. Light walking, stretching, or yoga on off days boosts blood flow and reduces soreness. Take a full rest day if you're feeling worn down.`;
  }
  return coachResponses[Math.floor(Math.random() * coachResponses.length)];
}
