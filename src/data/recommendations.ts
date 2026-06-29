import type { IngredientSuggestion } from '../types';
import { ingredientCategories } from './ingredients';

type CompatibilityMap = Record<string, Record<string, number>>;

const baseCompatibility: CompatibilityMap = {
  'Vodka': {
    'Cranberry Juice': 5, 'Lime Juice': 5, 'Lemon Juice': 4, 'Orange Juice': 4,
    'Grapefruit Juice': 4, 'Tomato Juice': 4, 'Passion Fruit Juice': 4,
    'Simple Syrup': 3, 'Soda Water': 4, 'Tonic Water': 3, 'Ginger Beer': 4,
    'Mint': 3, 'Cucumber': 4, 'Espresso': 4, 'Kahlúa': 4, 'Cointreau': 3,
    'Heavy Cream': 3, 'Angostura Bitters': 2, 'Elderflower Syrup': 3,
    'St-Germain': 4, 'Basil': 3, 'Watermelon Juice': 4, 'Honey Syrup': 3,
    'Mango Puree': 3, 'Peach Puree': 3, 'Lemonade': 4
  },
  'Gin': {
    'Tonic Water': 5, 'Lime Juice': 5, 'Lemon Juice': 5, 'Cucumber': 5,
    'Elderflower Syrup': 5, 'St-Germain': 5, 'Mint': 4, 'Basil': 4,
    'Rosemary': 4, 'Grapefruit Juice': 4, 'Angostura Bitters': 3,
    'Orange Bitters': 4, 'Simple Syrup': 3, 'Soda Water': 4,
    'Campari': 5, 'Dry Vermouth': 5, 'Lavender': 4, 'Thyme': 3,
    'Cranberry Juice': 3, 'Champagne': 3, 'Aperol': 4, 'Egg White': 4,
    'Maraschino': 3, 'Honey Syrup': 3, 'Chartreuse': 3
  },
  'Rum (White)': {
    'Lime Juice': 5, 'Mint': 5, 'Simple Syrup': 4, 'Soda Water': 4,
    'Coconut Cream': 5, 'Pineapple Juice': 5, 'Orange Juice': 4,
    'Passion Fruit Juice': 4, 'Grapefruit Juice': 3, 'Angostura Bitters': 3,
    'Grenadine': 3, 'Coconut Water': 4, 'Mango Juice': 4,
    'Cointreau': 3, 'Maraschino': 3, 'Honey Syrup': 3, 'Agave Syrup': 3,
    'Ginger Beer': 3, 'Lemon Juice': 4, 'Strawberry Puree': 3
  },
  'Rum (Dark)': {
    'Lime Juice': 5, 'Angostura Bitters': 5, 'Demerara Syrup': 5,
    'Ginger Beer': 5, 'Orange Juice': 4, 'Pineapple Juice': 4,
    'Coconut Cream': 4, 'Cinnamon': 4, 'Nutmeg': 4, 'Vanilla Syrup': 4,
    'Cola': 4, 'Honey Syrup': 4, 'Maple Syrup': 3, 'Coffee': 3,
    'Banana': 3, 'Cloves': 3, 'Allspice': 3, 'Chocolate': 3,
    'Grenadine': 3, 'Falernum': 4
  },
  'Tequila': {
    'Lime Juice': 5, 'Grapefruit Juice': 5, 'Agave Syrup': 5,
    'Orange Juice': 4, 'Cointreau': 5, 'Salt': 4, 'Jalapeño': 4,
    'Mango Puree': 4, 'Pineapple Juice': 4, 'Tomato Juice': 3,
    'Cilantro': 3, 'Passion Fruit Juice': 3, 'Watermelon Juice': 4,
    'Ginger Beer': 3, 'Soda Water': 3, 'Grenadine': 3,
    'Cucumber': 3, 'Strawberry Puree': 3, 'Honey Syrup': 3,
    'Campari': 3
  },
  'Whiskey': {
    'Angostura Bitters': 5, 'Simple Syrup': 5, 'Honey Syrup': 5,
    'Lemon Juice': 5, 'Orange Peel': 5, 'Cherry': 5, 'Egg White': 4,
    'Maple Syrup': 4, 'Ginger Beer': 4, 'Cinnamon': 3,
    'Apple Juice': 4, 'Mint': 4, 'Peychaud\'s Bitters': 4,
    'Demerara Syrup': 4, 'Orange Bitters': 4, 'Cointreau': 3,
    'Soda Water': 3, 'Vanilla Syrup': 3, 'Cola': 3
  },
  'Bourbon': {
    'Angostura Bitters': 5, 'Simple Syrup': 5, 'Honey Syrup': 5,
    'Lemon Juice': 5, 'Orange Peel': 5, 'Cherry': 5, 'Mint': 5,
    'Peach Puree': 4, 'Maple Syrup': 4, 'Ginger Beer': 4,
    'Apple Juice': 4, 'Cinnamon': 4, 'Egg White': 4,
    'Demerara Syrup': 4, 'Cola': 3, 'Vanilla Syrup': 3,
    'Orange Bitters': 4, 'Cointreau': 3
  },
  'Scotch': {
    'Honey Syrup': 5, 'Lemon Juice': 5, 'Ginger': 4, 'Islay Mist': 4,
    'Drambuie': 5, 'Orange Bitters': 4, 'Cherry': 3,
    'Angostura Bitters': 4, 'Demerara Syrup': 4, 'Soda Water': 3,
    'Egg White': 3, 'Smoked Salt': 3, 'Cinnamon': 3,
    'Maple Syrup': 3, 'Orange Peel': 4
  },
  'Cognac': {
    'Lemon Juice': 5, 'Simple Syrup': 4, 'Cointreau': 5,
    'Angostura Bitters': 4, 'Orange Peel': 4, 'Champagne': 4,
    'Honey Syrup': 4, 'Egg White': 3, 'Peychaud\'s Bitters': 4,
    'Demerara Syrup': 4, 'Cinnamon': 3, 'Nutmeg': 3
  },
  'Brandy': {
    'Lemon Juice': 4, 'Simple Syrup': 4, 'Orange Juice': 4,
    'Cointreau': 4, 'Angostura Bitters': 4, 'Egg White': 3,
    'Cinnamon': 3, 'Nutmeg': 3, 'Apple Juice': 4, 'Heavy Cream': 3
  },
  'Triple Sec': {
    'Lime Juice': 5, 'Lemon Juice': 4, 'Cranberry Juice': 4,
    'Orange Juice': 4, 'Soda Water': 3, 'Simple Syrup': 3
  },
  'Amaretto': {
    'Lemon Juice': 5, 'Egg White': 4, 'Simple Syrup': 3,
    'Cherry': 3, 'Cola': 3, 'Heavy Cream': 3, 'Espresso': 4
  },
  'Baileys': {
    'Espresso': 5, 'Heavy Cream': 4, 'Kahlúa': 4,
    'Chocolate': 4, 'Vanilla Syrup': 3, 'Cinnamon': 3,
    'Nutmeg': 3, 'Condensed Milk': 3, 'Whole Milk': 3
  },
  'Absinthe': {
    'Simple Syrup': 5, 'Soda Water': 4, 'Lemon Juice': 3,
    'Egg White': 3, 'Mint': 3, 'Chartreuse': 3
  },
  'Champagne': {
    'St-Germain': 5, 'Peach Puree': 5, 'Chambord': 4,
    'Angostura Bitters': 4, 'Sugar': 4, 'Orange Juice': 4,
    'Raspberry Puree': 3, 'Lemon Juice': 3, 'Simple Syrup': 3
  },
  'Prosecco': {
    'Aperol': 5, 'Peach Puree': 5, 'St-Germain': 4,
    'Strawberry Puree': 4, 'Soda Water': 3, 'Elderflower Syrup': 4,
    'Lemon Juice': 3, 'Campari': 3
  },
  'Mezcal': {
    'Lime Juice': 5, 'Agave Syrup': 5, 'Grapefruit Juice': 4,
    'Pineapple Juice': 4, 'Orange Juice': 3, 'Jalapeño': 4,
    'Campari': 3, 'Mango Puree': 3, 'Cucumber': 3,
    'Sal de Gusano': 3, 'Smoked Salt': 4
  },
  'Sake': {
    'Lime Juice': 4, 'Cucumber': 5, 'Ginger': 4,
    'Lemon Juice': 4, 'Yuzu': 5, 'Lychee': 4,
    'Simple Syrup': 3, 'Soda Water': 3, 'Mint': 3
  },
  'Beer': {
    'Lime Juice': 4, 'Tomato Juice': 4, 'Hot Sauce': 3,
    'Ginger Beer': 3, 'Lemonade': 3, 'Salt': 3
  },
  'Wine': {
    'Orange Juice': 4, 'Brandy': 4, 'Fruits': 4,
    'Simple Syrup': 3, 'Soda Water': 3, 'Cinnamon': 3,
    'Cloves': 3, 'Star Anise': 3
  }
};

const vibeIngredients: Record<string, Record<string, number>> = {
  'Refreshing': {
    'Mint': 5, 'Cucumber': 5, 'Soda Water': 5, 'Lime Juice': 5,
    'Lemon Juice': 4, 'Tonic Water': 4, 'Ginger Ale': 3, 'Basil': 3,
    'Elderflower Syrup': 3, 'Sparkling Water': 4, 'Watermelon Juice': 4
  },
  'Fruity': {
    'Passion Fruit Juice': 5, 'Mango Juice': 5, 'Pineapple Juice': 5,
    'Strawberry Puree': 5, 'Orange Juice': 4, 'Peach Puree': 4,
    'Raspberry Puree': 4, 'Grenadine': 3, 'Cranberry Juice': 4,
    'Blueberry': 3, 'Cherry': 3, 'Guava Juice': 4
  },
  'Sweet': {
    'Simple Syrup': 5, 'Honey Syrup': 5, 'Grenadine': 4,
    'Vanilla Syrup': 4, 'Coconut Syrup': 3, 'Agave Syrup': 4,
    'Maple Syrup': 3, 'Condensed Milk': 3, 'Chocolate': 3,
    'Caramel': 3, 'Orgeat': 4
  },
  'Sour': {
    'Lime Juice': 5, 'Lemon Juice': 5, 'Grapefruit Juice': 5,
    'Cranberry Juice': 4, 'Passion Fruit Juice': 3, 'Egg White': 4,
    'Apple Cider Vinegar': 2, 'Tamarind': 3, 'Yuzu': 4
  },
  'Tropical': {
    'Coconut Cream': 5, 'Pineapple Juice': 5, 'Mango Juice': 5,
    'Passion Fruit Juice': 5, 'Coconut Water': 4, 'Lime Juice': 4,
    'Guava Juice': 4, 'Banana': 3, 'Papaya': 3, 'Orgeat': 4,
    'Grenadine': 3, 'Mint': 3
  },
  'Creamy': {
    'Heavy Cream': 5, 'Coconut Cream': 5, 'Baileys': 4,
    'Egg White': 4, 'Condensed Milk': 4, 'Whole Milk': 4,
    'Oat Milk': 3, 'Yogurt': 3, 'Vanilla Syrup': 3,
    'Whipped Cream': 4, 'Coconut Milk': 4
  },
  'Spicy': {
    'Jalapeño': 5, 'Ginger': 5, 'Cayenne Pepper': 4,
    'Hot Sauce': 4, 'Black Pepper': 3, 'Cinnamon': 3,
    'Chili Flakes': 4, 'Habanero': 3, 'Ginger Beer': 4,
    'Horseradish': 3
  },
  'Smoky': {
    'Mezcal': 5, 'Smoked Salt': 5, 'Cinnamon': 3,
    'Lapsang Souchong': 4, 'Smoked Paprika': 3,
    'Islay Scotch': 4, 'Charred Wood': 3, 'Angostura Bitters': 3
  },
  'Elegant': {
    'Champagne': 5, 'St-Germain': 5, 'Elderflower Syrup': 5,
    'Rose Syrup': 4, 'Lavender': 4, 'Edible Flower': 4,
    'Egg White': 3, 'Prosecco': 4, 'Orange Bitters': 3,
    'Cointreau': 3, 'Chambord': 3
  },
  'Classic': {
    'Angostura Bitters': 5, 'Simple Syrup': 5, 'Cherry': 4,
    'Orange Peel': 4, 'Lemon Juice': 4, 'Lime Juice': 4,
    'Egg White': 3, 'Soda Water': 3, 'Demerara Syrup': 4,
    'Orange Bitters': 4, 'Peychaud\'s Bitters': 3
  },
  'Modern': {
    'Passion Fruit Juice': 4, 'Aquafaba': 4, 'Matcha': 4,
    'Activated Charcoal': 3, 'Butterfly Pea Flower': 3,
    'Yuzu': 4, 'Turmeric': 3, 'Cold Brew': 3,
    'Oat Milk': 3, 'Lavender': 3, 'St-Germain': 4
  },
  'Party': {
    'Energy Drink': 4, 'Blue Curaçao': 5, 'Grenadine': 4,
    'Pineapple Juice': 4, 'Cranberry Juice': 3, 'Cola': 3,
    'Midori': 4, 'Soda Water': 3, 'Lime Juice': 3,
    'Lemon Juice': 3, 'Vodka': 3
  },
  'Summer': {
    'Watermelon Juice': 5, 'Mint': 5, 'Lime Juice': 5,
    'Cucumber': 4, 'Soda Water': 4, 'Lemonade': 4,
    'Strawberry Puree': 4, 'Mango Juice': 4, 'Basil': 3,
    'Grapefruit Juice': 4, 'Rosé': 3, 'Peach Puree': 4
  },
  'Winter': {
    'Cinnamon': 5, 'Nutmeg': 5, 'Cloves': 4, 'Star Anise': 4,
    'Honey Syrup': 5, 'Maple Syrup': 4, 'Hot Toddy Mix': 4,
    'Apple Juice': 4, 'Egg Nog': 3, 'Ginger': 4,
    'Vanilla Syrup': 3, 'Heavy Cream': 3, 'Chocolate': 4
  },
  'Dessert': {
    'Vanilla Syrup': 5, 'Chocolate': 5, 'Heavy Cream': 5,
    'Kahlúa': 5, 'Baileys': 5, 'Espresso': 4,
    'Condensed Milk': 4, 'Coconut Cream': 3, 'Nutmeg': 3,
    'Cinnamon': 3, 'Whipped Cream': 4, 'Caramel': 4
  },
  'Exotic': {
    'Passion Fruit Juice': 5, 'Mango Juice': 5, 'Lychee': 5,
    'Yuzu': 4, 'Dragon Fruit': 4, 'Coconut Cream': 4,
    'Guava Juice': 4, 'Tamarind': 3, 'Turmeric': 3,
    'Cardamom': 3, 'Sake': 3, 'Orgeat': 4
  },
  'Luxury': {
    'Champagne': 5, 'Truffle': 3, 'Saffron': 4,
    'Gold Leaf': 3, 'Dom Perignon': 3, 'Caviar': 2,
    'St-Germain': 4, 'Cointreau': 3, 'Grand Marnier': 4,
    'Rose Syrup': 3, 'Edible Flower': 4, 'Prosecco': 4
  },
  'Light': {
    'Soda Water': 5, 'Tonic Water': 4, 'Cucumber': 4,
    'Lime Juice': 4, 'Lemon Juice': 4, 'Mint': 3,
    'Elderflower Syrup': 3, 'Sparkling Water': 5,
    'Ginger Ale': 3, 'Basil': 3, 'Watermelon Juice': 3
  },
  'Strong': {
    'Angostura Bitters': 4, 'Absinthe': 3, 'Chartreuse': 4,
    'Campari': 4, 'Fernet': 3, 'Demerara Syrup': 3,
    'Orange Peel': 3, 'Cherry': 3, 'Peychaud\'s Bitters': 3
  },
  'Experimental': {
    'Aquafaba': 5, 'Activated Charcoal': 4, 'Butterfly Pea Flower': 4,
    'Dry Ice': 3, 'Liquid Nitrogen': 2, 'Smoke Gun': 3,
    'Sous Vide': 3, 'Fat Wash': 3, 'Kombucha': 3,
    'Shrub': 4, 'Turmeric': 3, 'Miso': 3
  }
};

export function getIngredientSuggestions(
  base: string,
  selectedVibes: string[],
  currentIngredients: string[]
): IngredientSuggestion[] {
  const scoreMap: Record<string, { score: number; reasons: string[]; category: string }> = {};

  // Add base compatibility scores
  const baseScores = baseCompatibility[base] || {};
  for (const [ingredient, score] of Object.entries(baseScores)) {
    if (!scoreMap[ingredient]) {
      scoreMap[ingredient] = { score: 0, reasons: [], category: getCategoryForIngredient(ingredient) };
    }
    scoreMap[ingredient].score += score * 2;
    scoreMap[ingredient].reasons.push(`Pairs well with ${base}`);
  }

  // Add vibe scores
  for (const vibe of selectedVibes) {
    const vibeScores = vibeIngredients[vibe] || {};
    for (const [ingredient, score] of Object.entries(vibeScores)) {
      if (!scoreMap[ingredient]) {
        scoreMap[ingredient] = { score: 0, reasons: [], category: getCategoryForIngredient(ingredient) };
      }
      scoreMap[ingredient].score += score;
      scoreMap[ingredient].reasons.push(`Matches ${vibe} vibe`);
    }
  }

  // Boost ingredients that synergize with already selected ones
  const synergies: Record<string, string[]> = {
    'Lime Juice': ['Simple Syrup', 'Mint', 'Soda Water', 'Agave Syrup'],
    'Lemon Juice': ['Simple Syrup', 'Egg White', 'Honey Syrup'],
    'Mint': ['Lime Juice', 'Simple Syrup', 'Soda Water', 'Cucumber'],
    'Coconut Cream': ['Pineapple Juice', 'Lime Juice', 'Crushed Ice'],
    'Espresso': ['Kahlúa', 'Vanilla Syrup', 'Heavy Cream'],
    'Egg White': ['Lemon Juice', 'Simple Syrup', 'Angostura Bitters'],
    'Ginger Beer': ['Lime Juice', 'Mint', 'Angostura Bitters'],
    'Pineapple Juice': ['Coconut Cream', 'Lime Juice', 'Grenadine'],
    'Cranberry Juice': ['Lime Juice', 'Cointreau', 'Orange Juice'],
    'Simple Syrup': ['Lime Juice', 'Lemon Juice', 'Soda Water'],
    'Angostura Bitters': ['Simple Syrup', 'Orange Peel', 'Cherry'],
    'Cucumber': ['Lime Juice', 'Soda Water', 'Mint', 'Elderflower Syrup'],
    'Campari': ['Sweet Vermouth', 'Orange Peel', 'Soda Water'],
    'Passion Fruit Juice': ['Lime Juice', 'Simple Syrup', 'Vanilla Syrup'],
    'Honey Syrup': ['Lemon Juice', 'Ginger', 'Cinnamon'],
  };

  for (const selected of currentIngredients) {
    const synList = synergies[selected] || [];
    for (const syn of synList) {
      if (!currentIngredients.includes(syn)) {
        if (!scoreMap[syn]) {
          scoreMap[syn] = { score: 0, reasons: [], category: getCategoryForIngredient(syn) };
        }
        scoreMap[syn].score += 3;
        scoreMap[syn].reasons.push(`Synergizes with ${selected}`);
      }
    }
  }

  // Remove already selected ingredients
  for (const selected of currentIngredients) {
    delete scoreMap[selected];
  }

  // Convert to array, normalize scores to 1-5, sort by score
  const suggestions = Object.entries(scoreMap)
    .map(([name, data]) => ({
      name,
      category: data.category,
      rating: Math.min(5, Math.max(1, Math.round(data.score / 3))),
      reason: data.reasons.slice(0, 2).join('; ')
    }))
    .filter(s => s.rating >= 2)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 20);

  return suggestions;
}

function getCategoryForIngredient(name: string): string {
  for (const [category, items] of Object.entries(ingredientCategories)) {
    if ((items as string[]).includes(name)) return category;
  }
  return 'Other';
}


