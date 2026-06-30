import type { Drink } from "@/types";

export const COCKTAIL_MENU: Drink[] = [
  {
    id: "blackberry-gold",
    name: "Blackberry & Gold",
    description: "Blackberry liqueur, gold rum, fresh lime, simple syrup",
    price: 14,
    category: "Signature",
    ingredients: [
      "Blackberry liqueur",
      "Gold rum",
      "Fresh lime",
      "Simple syrup",
    ],
  },
  {
    id: "gilded-negroni",
    name: "Gilded Negroni",
    description: "London dry gin, sweet vermouth, Campari, gold leaf garnish",
    price: 16,
    category: "Classics",
    ingredients: ["London dry gin", "Sweet vermouth", "Campari", "Gold leaf"],
  },
  {
    id: "prohibition-sour",
    name: "Prohibition Sour",
    description: "Bourbon, fresh lemon, honey, Angostura bitters, egg white",
    price: 15,
    category: "Classics",
    ingredients: [
      "Bourbon",
      "Fresh lemon",
      "Honey",
      "Angostura bitters",
      "Egg white",
    ],
  },
  {
    id: "velvet-speak-easy",
    name: "Velvet Speak Easy",
    description: "Rye whiskey, blackberry syrup, lemon, sparkling wine",
    price: 17,
    category: "Signature",
    ingredients: ["Rye whiskey", "Blackberry syrup", "Lemon", "Sparkling wine"],
  },
  {
    id: "smoked-old-fashioned",
    name: "Smoked Old Fashioned",
    description: "Bourbon, demerara sugar, bitters, smoked cherrywood",
    price: 16,
    category: "Classics",
    ingredients: ["Bourbon", "Demerara sugar", "Bitters", "Smoked cherrywood"],
  },
  {
    id: "lavender-ramble",
    name: "Lavender Ramble",
    description: "Hendrick's gin, lavender syrup, lemon, club soda",
    price: 14,
    category: "Refreshing",
    ingredients: ["Hendrick's gin", "Lavender syrup", "Lemon", "Club soda"],
  },
  {
    id: "copper-mule",
    name: "Copper Mule",
    description: "Vodka, ginger beer, fresh lime, copper mug",
    price: 13,
    category: "Refreshing",
    ingredients: ["Vodka", "Ginger beer", "Fresh lime"],
  },
  {
    id: "midnight-manhattan",
    name: "Midnight Manhattan",
    description:
      "Rye whiskey, sweet vermouth, black cherry bitters, Luxardo cherry",
    price: 16,
    category: "Classics",
    ingredients: [
      "Rye whiskey",
      "Sweet vermouth",
      "Black cherry bitters",
      "Luxardo cherry",
    ],
  },
  {
    id: "golden-daiquiri",
    name: "Golden Daiquiri",
    description: "Gold rum, fresh lime, demerara syrup",
    price: 13,
    category: "Classics",
    ingredients: ["Gold rum", "Fresh lime", "Demerara syrup"],
  },
  {
    id: "berry-fizz",
    name: "Berry Fizz",
    description: "Gin, blackberry puree, lemon, egg white, soda",
    price: 14,
    category: "Refreshing",
    ingredients: ["Gin", "Blackberry puree", "Lemon", "Egg white", "Soda"],
  },
  {
    id: "roaring-20s-martini",
    name: "Roaring 20s Martini",
    description: "London dry gin, dry vermouth, olive brine, lemon twist",
    price: 15,
    category: "Classics",
    ingredients: [
      "London dry gin",
      "Dry vermouth",
      "Olive brine",
      "Lemon twist",
    ],
  },
  {
    id: "honeybee",
    name: "Honeybee",
    description: "Mezcal, honey syrup, fresh lemon, thyme sprig",
    price: 15,
    category: "Signature",
    ingredients: ["Mezcal", "Honey syrup", "Fresh lemon", "Thyme"],
  },
];

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  making: "Making",
  ready: "Ready",
  served: "Served",
};

export const STATUS_ORDER: string[] = ["pending", "making", "ready", "served"];
