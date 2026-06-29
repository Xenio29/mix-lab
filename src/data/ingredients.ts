export const alcoholBases = [
  'Vodka', 'Gin', 'Rum (White)', 'Rum (Dark)', 'Tequila', 'Whiskey',
  'Bourbon', 'Scotch', 'Cognac', 'Brandy', 'Triple Sec', 'Amaretto',
  'Baileys', 'Absinthe', 'Champagne', 'Prosecco', 'Beer', 'Wine',
  'Sake', 'Mezcal', 'Other'
];

export const mocktailBases = [
  'Orange Juice', 'Apple Juice', 'Pineapple Juice', 'Cranberry Juice',
  'Lemonade', 'Sparkling Water', 'Tonic', 'Coconut Water', 'Tea',
  'Coffee', 'Milk', 'Oat Milk', 'Almond Milk', 'Coconut Milk',
  'Energy Drink', 'Cola', 'Ginger Beer', 'Ginger Ale', 'Smoothie Base', 'Other'
];

export const vibes = [
  'Refreshing', 'Fruity', 'Sweet', 'Sour', 'Tropical', 'Creamy',
  'Spicy', 'Smoky', 'Elegant', 'Classic', 'Modern', 'Party',
  'Summer', 'Winter', 'Dessert', 'Exotic', 'Luxury', 'Light',
  'Strong', 'Experimental'
];

export const vibeEmojis: Record<string, string> = {
  'Refreshing': '💧', 'Fruity': '🍓', 'Sweet': '🍯', 'Sour': '🍋',
  'Tropical': '🌴', 'Creamy': '🥛', 'Spicy': '🌶️', 'Smoky': '🔥',
  'Elegant': '✨', 'Classic': '🎩', 'Modern': '🔮', 'Party': '🎉',
  'Summer': '☀️', 'Winter': '❄️', 'Dessert': '🍰', 'Exotic': '🦜',
  'Luxury': '💎', 'Light': '🪶', 'Strong': '💪', 'Experimental': '🧪'
};

export const ingredientCategories: Record<string, string[]> = {
  'Juices': [
    'Lime Juice', 'Lemon Juice', 'Orange Juice', 'Grapefruit Juice',
    'Pineapple Juice', 'Cranberry Juice', 'Apple Juice', 'Pomegranate Juice',
    'Passion Fruit Juice', 'Mango Juice', 'Tomato Juice', 'Celery Juice',
    'Watermelon Juice', 'Guava Juice', 'Peach Juice'
  ],
  'Syrups': [
    'Simple Syrup', 'Honey Syrup', 'Agave Syrup', 'Grenadine',
    'Orgeat', 'Vanilla Syrup', 'Lavender Syrup', 'Rose Syrup',
    'Cinnamon Syrup', 'Ginger Syrup', 'Maple Syrup', 'Demerara Syrup',
    'Passion Fruit Syrup', 'Elderflower Syrup', 'Coconut Syrup'
  ],
  'Liqueurs': [
    'Cointreau', 'Grand Marnier', 'Kahlúa', 'Chambord',
    'Chartreuse', 'Maraschino', 'Campari', 'Aperol',
    'St-Germain', 'Frangelico', 'Creme de Cassis', 'Blue Curaçao',
    'Midori', 'Galliano', 'Drambuie'
  ],
  'Soft Drinks': [
    'Cola', 'Ginger Beer', 'Ginger Ale', 'Tonic Water',
    'Soda Water', 'Lemonade', 'Sprite', 'Energy Drink',
    'Root Beer', 'Cream Soda'
  ],
  'Herbs': [
    'Mint', 'Basil', 'Rosemary', 'Thyme',
    'Cilantro', 'Sage', 'Lavender', 'Dill',
    'Tarragon', 'Lemongrass'
  ],
  'Fruits': [
    'Lime', 'Lemon', 'Orange', 'Grapefruit',
    'Strawberry', 'Raspberry', 'Blueberry', 'Blackberry',
    'Cherry', 'Pineapple', 'Mango', 'Passion Fruit',
    'Peach', 'Watermelon', 'Coconut', 'Banana',
    'Apple', 'Kiwi', 'Fig', 'Pomegranate'
  ],
  'Bitters': [
    'Angostura Bitters', 'Orange Bitters', 'Peychaud\'s Bitters',
    'Chocolate Bitters', 'Aromatic Bitters', 'Celery Bitters',
    'Lavender Bitters', 'Mole Bitters'
  ],
  'Cream & Dairy': [
    'Heavy Cream', 'Half and Half', 'Coconut Cream',
    'Whipped Cream', 'Egg White', 'Egg Yolk',
    'Whole Egg', 'Cream Cheese', 'Yogurt'
  ],
  'Milk': [
    'Whole Milk', 'Oat Milk', 'Almond Milk',
    'Coconut Milk', 'Soy Milk', 'Condensed Milk'
  ],
  'Tea & Coffee': [
    'Black Tea', 'Green Tea', 'Earl Grey', 'Chamomile',
    'Hibiscus Tea', 'Matcha', 'Espresso', 'Cold Brew',
    'Chai', 'Jasmine Tea'
  ],
  'Ice': [
    'Cubed Ice', 'Crushed Ice', 'Ice Sphere',
    'Dry Ice', 'Shaved Ice', 'No Ice'
  ],
  'Spices': [
    'Cinnamon', 'Nutmeg', 'Cardamom', 'Star Anise',
    'Black Pepper', 'Cayenne Pepper', 'Vanilla Bean',
    'Cloves', 'Ginger', 'Turmeric', 'Salt', 'Smoked Salt'
  ],
  'Garnishes': [
    'Lime Wheel', 'Lemon Twist', 'Orange Peel', 'Cherry',
    'Olive', 'Cocktail Onion', 'Cucumber Ribbon', 'Mint Sprig',
    'Rosemary Sprig', 'Edible Flower', 'Sugar Rim', 'Salt Rim',
    'Cinnamon Stick', 'Pineapple Wedge', 'Umbrella', 'Dehydrated Citrus'
  ],
  'Purees': [
    'Strawberry Puree', 'Mango Puree', 'Peach Puree',
    'Raspberry Puree', 'Passion Fruit Puree', 'Banana Puree',
    'Blackberry Puree', 'Guava Puree'
  ],
  'Other': [
    'Coconut Water', 'Aquafaba', 'Honey', 'Jam',
    'Marmalade', 'Chocolate', 'Peanut Butter', 'Hot Sauce',
    'Worcestershire Sauce', 'Olive Brine'
  ]
};

export const units = [
  'ml', 'cl', 'oz', 'dash', 'drops', 'splash',
  'top up', 'fill', 'whole', 'slice', 'wedge',
  'leaf', 'sprig', 'pinch', 'tbsp', 'tsp', 'cup', 'piece'
];

export const preparationSuggestions = [
  'Shake vigorously', 'Double strain', 'Dry shake', 'Stir gently',
  'Build over ice', 'Flame orange peel', 'Blend', 'Serve chilled',
  'Muddle ingredients', 'Layer carefully', 'Swizzle', 'Throw technique',
  'Fat wash', 'Smoke with wood chips', 'Express citrus oils', 'Strain over fresh ice'
];

export const glassTypes = [
  'Coupe', 'Martini Glass', 'Rocks Glass', 'Highball',
  'Collins Glass', 'Nick & Nora', 'Copper Mug', 'Hurricane Glass',
  'Wine Glass', 'Champagne Flute', 'Shot Glass', 'Tiki Mug',
  'Snifter', 'Julep Cup', 'Irish Coffee Glass', 'Tumbler'
];
