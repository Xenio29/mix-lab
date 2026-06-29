import type { Drink, DrinkEvaluation, DrinkIngredient } from '../types';

const acidIngredients = ['Lime Juice', 'Lemon Juice', 'Grapefruit Juice', 'Passion Fruit Juice', 'Cranberry Juice', 'Yuzu'];
const sweetIngredients = ['Simple Syrup', 'Honey Syrup', 'Agave Syrup', 'Grenadine', 'Vanilla Syrup', 'Orgeat', 'Maple Syrup', 'Demerara Syrup', 'Cinnamon Syrup', 'Rose Syrup', 'Lavender Syrup', 'Elderflower Syrup', 'Coconut Syrup', 'Passion Fruit Syrup', 'Condensed Milk'];
const bitterIngredients = ['Angostura Bitters', 'Orange Bitters', 'Peychaud\'s Bitters', 'Chocolate Bitters', 'Campari', 'Aperol', 'Fernet', 'Chartreuse'];
const creamyIngredients = ['Heavy Cream', 'Coconut Cream', 'Baileys', 'Egg White', 'Whole Egg', 'Condensed Milk', 'Whipped Cream', 'Yogurt', 'Coconut Milk', 'Oat Milk', 'Almond Milk'];
const freshHerbs = ['Mint', 'Basil', 'Rosemary', 'Thyme', 'Cilantro', 'Sage', 'Lavender', 'Dill', 'Tarragon', 'Lemongrass'];
const garnishIngredients = ['Lime Wheel', 'Lemon Twist', 'Orange Peel', 'Cherry', 'Olive', 'Cocktail Onion', 'Cucumber Ribbon', 'Mint Sprig', 'Rosemary Sprig', 'Edible Flower', 'Sugar Rim', 'Salt Rim', 'Cinnamon Stick', 'Pineapple Wedge', 'Umbrella', 'Dehydrated Citrus'];
const classicCombinations = [
  ['Lime Juice', 'Simple Syrup'],
  ['Lemon Juice', 'Simple Syrup'],
  ['Angostura Bitters', 'Simple Syrup'],
  ['Egg White', 'Lemon Juice', 'Simple Syrup'],
  ['Tonic Water', 'Lime Juice'],
  ['Coconut Cream', 'Pineapple Juice'],
  ['Espresso', 'Kahlúa'],
];

function hasIngredient(ingredients: DrinkIngredient[], names: string[]): boolean {
  return ingredients.some(i => names.includes(i.name));
}

function getIngredientNames(ingredients: DrinkIngredient[]): string[] {
  return ingredients.map(i => i.name);
}

export function evaluateDrink(drink: Drink): DrinkEvaluation {
  const names = getIngredientNames(drink.ingredients);
  const ingredientCount = drink.ingredients.length;

  // Balance: check sweet vs acid
  const hasAcid = hasIngredient(drink.ingredients, acidIngredients);
  const hasSweet = hasIngredient(drink.ingredients, sweetIngredients);
  const hasBitter = hasIngredient(drink.ingredients, bitterIngredients);
  const hasCreamy = hasIngredient(drink.ingredients, creamyIngredients);
  const hasHerbs = hasIngredient(drink.ingredients, freshHerbs);
  const hasGarnish = hasIngredient(drink.ingredients, garnishIngredients);

  let balanceScore = 5;
  if (hasAcid && hasSweet) balanceScore += 3;
  else if (hasAcid && !hasSweet) balanceScore -= 1;
  else if (!hasAcid && hasSweet) balanceScore -= 1;
  if (hasBitter) balanceScore += 1;
  balanceScore = Math.min(10, Math.max(1, balanceScore));

  // Taste score
  let tasteScore = 5;
  if (ingredientCount >= 3 && ingredientCount <= 7) tasteScore += 2;
  if (ingredientCount > 8) tasteScore -= 1;
  if (hasAcid) tasteScore += 1;
  if (hasSweet) tasteScore += 1;
  if (hasHerbs) tasteScore += 1;
  tasteScore = Math.min(10, Math.max(1, tasteScore));

  // Presentation
  let presentationScore = 4;
  if (hasGarnish) presentationScore += 3;
  if (hasHerbs) presentationScore += 1;
  if (drink.preparation) presentationScore += 1;
  presentationScore = Math.min(10, Math.max(1, presentationScore));

  // Style
  let styleScore = 5;
  const vibeCount = drink.vibes.length;
  if (vibeCount >= 1 && vibeCount <= 3) styleScore += 2;
  if (vibeCount > 4) styleScore -= 1;
  if (drink.vibes.includes('Elegant') || drink.vibes.includes('Classic') || drink.vibes.includes('Luxury')) styleScore += 1;
  styleScore = Math.min(10, Math.max(1, styleScore));

  // Originality
  let originalityScore = 5;
  const hasClassicCombo = classicCombinations.some(combo =>
    combo.every(c => names.includes(c))
  );
  if (hasClassicCombo) originalityScore -= 1;
  if (drink.vibes.includes('Experimental') || drink.vibes.includes('Modern')) originalityScore += 2;
  if (ingredientCount > 5) originalityScore += 1;
  if (hasIngredient(drink.ingredients, ['Aquafaba', 'Matcha', 'Turmeric', 'Butterfly Pea Flower', 'Miso', 'Kombucha'])) originalityScore += 2;
  originalityScore = Math.min(10, Math.max(1, originalityScore));

  // Difficulty
  let difficultyScore = 3;
  if (ingredientCount > 5) difficultyScore += 2;
  if (drink.preparation && drink.preparation.length > 20) difficultyScore += 1;
  if (hasCreamy) difficultyScore += 1;
  if (hasIngredient(drink.ingredients, ['Egg White', 'Whole Egg'])) difficultyScore += 2;
  if (drink.preparation?.toLowerCase().includes('flame') || drink.preparation?.toLowerCase().includes('smoke') || drink.preparation?.toLowerCase().includes('flamb')) difficultyScore += 2;
  difficultyScore = Math.min(10, Math.max(1, difficultyScore));

  // Professionalism
  let professionalismScore = 4;
  if (hasGarnish) professionalismScore += 2;
  if (drink.preparation) professionalismScore += 1;
  if (hasBitter) professionalismScore += 1;
  if (ingredientCount >= 3) professionalismScore += 1;
  if (hasAcid && hasSweet) professionalismScore += 1;
  professionalismScore = Math.min(10, Math.max(1, professionalismScore));

  // Ingredient Harmony
  let harmonyScore = 6;
  const categorySet = new Set(drink.ingredients.map(i => i.category || 'Other'));
  if (categorySet.size >= 3 && categorySet.size <= 5) harmonyScore += 2;
  if (categorySet.size > 6) harmonyScore -= 1;
  if (hasAcid && hasSweet && hasBitter) harmonyScore += 1;
  harmonyScore = Math.min(10, Math.max(1, harmonyScore));

  // Vibe Consistency
  let vibeConsistencyScore = 6;
  if (vibeCount >= 1 && vibeCount <= 2) vibeConsistencyScore += 2;
  if (vibeCount === 3) vibeConsistencyScore += 1;
  if (vibeCount > 4) vibeConsistencyScore -= 2;
  // Check contradictions
  const contradictions = [
    ['Light', 'Strong'], ['Summer', 'Winter'], ['Classic', 'Experimental'],
    ['Sweet', 'Sour'], ['Creamy', 'Refreshing']
  ];
  for (const [a, b] of contradictions) {
    if (drink.vibes.includes(a) && drink.vibes.includes(b)) vibeConsistencyScore -= 1;
  }
  vibeConsistencyScore = Math.min(10, Math.max(1, vibeConsistencyScore));

  const scores = {
    taste: tasteScore,
    balance: balanceScore,
    presentation: presentationScore,
    style: styleScore,
    originality: originalityScore,
    difficulty: difficultyScore,
    professionalism: professionalismScore,
    ingredientHarmony: harmonyScore,
    vibeConsistency: vibeConsistencyScore,
    overall: 0,
  };

  scores.overall = Math.round(
    (scores.taste * 0.15 +
      scores.balance * 0.15 +
      scores.presentation * 0.1 +
      scores.style * 0.1 +
      scores.originality * 0.1 +
      scores.professionalism * 0.1 +
      scores.ingredientHarmony * 0.15 +
      scores.vibeConsistency * 0.1 +
      scores.difficulty * 0.05) * 10
  ) / 10;

  // Generate feedback (French)
  const pros: string[] = [];
  const cons: string[] = [];
  const servingTips: string[] = [];
  const suggestedImprovements: string[] = [];
  const possibleVariations: string[] = [];

  if (balanceScore >= 7) pros.push('Excellent équilibre sucré-acidulé');
  if (balanceScore < 5) {
    cons.push('Profil de saveurs déséquilibré');
    if (!hasAcid) suggestedImprovements.push('Ajouter un élément d\'agrume pour l\'acidité');
    if (!hasSweet) suggestedImprovements.push('Ajouter un sucrant pour équilibrer');
  }

  if (tasteScore >= 7) pros.push('Profil de saveurs riche et complexe');
  if (presentationScore >= 7) pros.push('Excellente présentation visuelle');
  if (presentationScore < 5) {
    cons.push('Manque d\'attrait visuel');
    suggestedImprovements.push('Ajouter une garniture pour améliorer la présentation');
  }

  if (styleScore >= 7) pros.push('Style cohérent et bien défini');
  if (originalityScore >= 7) pros.push('Recette créative et originale');
  if (originalityScore < 4) cons.push('Assez conventionnel – envisagez des ajouts uniques');
  if (professionalismScore >= 7) pros.push('Cocktail de niveau professionnel');
  if (harmonyScore >= 7) pros.push('Les ingrédients se marient parfaitement');
  if (vibeConsistencyScore >= 7) pros.push('Les ambiances correspondent parfaitement à la boisson');
  if (vibeConsistencyScore < 5) cons.push('Les ambiances sélectionnées sont contradictoires');

  if (ingredientCount < 3) {
    cons.push('Très peu d\'ingrédients – peut sembler simple');
    suggestedImprovements.push('Envisagez d\'ajouter un modificateur ou un ingrédient d\'accent');
  }
  if (ingredientCount > 8) {
    cons.push('Beaucoup d\'ingrédients – peut être trop complexe');
    suggestedImprovements.push('Envisagez de simplifier pour laisser briller les saveurs principales');
  }

  if (!hasGarnish) {
    suggestedImprovements.push('Ajouter une garniture appropriée');
  }

  if (hasHerbs) pros.push('Les herbes fraîches ajoutent de merveilleux arômes');
  if (hasCreamy) {
    servingTips.push('Servir immédiatement – les boissons crémeuses se séparent rapidement');
    if (hasAcid) servingTips.push('Faire un dry shake d\'abord (sans glace) pour mieux émulsionner');
  }

  servingTips.push('Utilisez des ingrédients frais et de qualité pour de meilleurs résultats');
  if (drink.type === 'cocktail') servingTips.push('Refroidissez votre verre au préalable');

  // Glass recommendation (French)
  let glassRecommendation = 'Verre Old Fashioned';
  if (drink.vibes.includes('Elegant') || drink.vibes.includes('Luxury')) glassRecommendation = 'Coupe';
  else if (drink.vibes.includes('Tropical') || drink.vibes.includes('Party')) glassRecommendation = 'Verre Hurricane';
  else if (drink.vibes.includes('Refreshing') || drink.vibes.includes('Light')) glassRecommendation = 'Verre Highball';
  else if (drink.vibes.includes('Classic')) glassRecommendation = 'Verre Old Fashioned';
  else if (drink.vibes.includes('Winter') || drink.vibes.includes('Dessert')) glassRecommendation = 'Verre Irish Coffee';
  else if (drink.vibes.includes('Modern')) glassRecommendation = 'Nick & Nora';
  else if (hasCreamy) glassRecommendation = 'Coupe';
  else if (names.includes('Tonic Water') || names.includes('Soda Water')) glassRecommendation = 'Verre Highball';

  // Suggested garnish (French)
  let suggestedGarnish = 'Rondelle d\'agrume';
  if (hasIngredient(drink.ingredients, ['Mint'])) suggestedGarnish = 'Brin de menthe fraîche';
  else if (drink.vibes.includes('Tropical')) suggestedGarnish = 'Quartier d\'ananas avec ombrelle';
  else if (drink.vibes.includes('Elegant')) suggestedGarnish = 'Fleur comestible ou zeste de citron';
  else if (drink.vibes.includes('Smoky')) suggestedGarnish = 'Zeste d\'orange flambé';
  else if (drink.vibes.includes('Winter')) suggestedGarnish = 'Bâton de cannelle avec anis étoilé';
  else if (drink.vibes.includes('Dessert')) suggestedGarnish = 'Muscade râpée ou copeaux de chocolat';
  else if (names.includes('Cucumber')) suggestedGarnish = 'Ruban de concombre';
  else if (hasIngredient(drink.ingredients, acidIngredients)) suggestedGarnish = 'Rondelle ou zeste d\'agrume';

  // Variations (French)
  if (drink.type === 'cocktail') {
    possibleVariations.push('Essayez une version mocktail');
  } else {
    possibleVariations.push('Essayez une version cocktail');
  }
  if (!drink.vibes.includes('Spicy')) possibleVariations.push('Ajoutez du piquant avec du jalapeño ou du gingembre');
  if (!drink.vibes.includes('Smoky') && drink.type === 'cocktail') possibleVariations.push('Essayez une touche fumée avec du mezcal ou du sel fumé');
  if (!hasCreamy) possibleVariations.push('Créez une version crémeuse avec de la crème de coco ou du blanc d\'œuf');
  if (!drink.vibes.includes('Frozen')) possibleVariations.push('Mixez avec de la glace pour une version frozen');

  return {
    scores,
    pros,
    cons,
    servingTips,
    suggestedGarnish,
    glassRecommendation,
    suggestedImprovements,
    possibleVariations
  };
}
