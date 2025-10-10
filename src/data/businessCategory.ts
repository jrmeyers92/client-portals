// Define the categories as a const assertion for better type safety
export const businessCategories = {
  "Wedding Planners": "wedding-planners",
  "Day-of Coordinators": "day-of-coordinators",
  Venues: "venues",
  Photographers: "photographers",
  Videographers: "videographers",
  Florists: "florists",
  Caterers: "caterers",
  "Cake Designers": "cake-designers",
  DJs: "djs",
  "Live Bands": "live-bands",
  "Ceremony Musicians": "ceremony-musicians",
  Officiants: "officiants",
  "Transportation Services": "transportation-services",
  "Bridal Shops": "bridal-shops",
  "Hair/Makeup Artists": "hair-makeup-artists",
  "Jewelry Stores": "jewelry-stores",
  "Decor Rental Companies": "decor-rental-companies",
  "Lighting Specialists": "lighting-specialists",
  "Photo Booth Providers": "photo-booth-providers",
  "Hotels for Guests": "hotels-for-guests",
  "Rehearsal Dinner Venues": "rehearsal-dinner-venues",
  "Bartending Services": "bartending-services",
  "Rental Companies": "rental-companies",
  "Tailors & Alterations": "tailors-alterations",
  "Mobile Bars": "mobile-bars",
} as const;

// Create reverse lookup object (slug to category)
const categorySlugMap = Object.fromEntries(
  Object.entries(businessCategories).map(([category, slug]) => [slug, category])
) as Record<string, BusinessCategory>;

// Export type for the category names
export type BusinessCategory = keyof typeof businessCategories;
export type BusinessCategorySlug =
  (typeof businessCategories)[BusinessCategory];

// Export array of category names for iteration (e.g., in forms)
export const businessCategoryNames = Object.keys(
  businessCategories
) as BusinessCategory[];

// Export array of slugs for iteration
export const businessCategorySlugs = Object.values(businessCategories);

// Helper function to get slug from category name
export function getCategorySlug(category: string): string {
  return (
    (businessCategories as Record<string, string>)[category] ||
    category.toLowerCase().replace(/\s+/g, "-")
  );
}

// Helper function to get category name from slug
export function getCategoryFromSlug(slug: string): BusinessCategory | null {
  return categorySlugMap[slug] || null;
}

// Helper function to check if a category exists
export function isValidCategory(
  category: string
): category is BusinessCategory {
  return category in businessCategories;
}

// Helper function to check if a slug exists
export function isValidCategorySlug(
  slug: string
): slug is BusinessCategorySlug {
  return slug in categorySlugMap;
}

// Helper function to get all categories as an array of objects
export function getAllCategories(): Array<{
  name: BusinessCategory;
  slug: string;
}> {
  return businessCategoryNames.map((name) => ({
    name,
    slug: businessCategories[name],
  }));
}

// Example usage:
//
// // Get slug from category:
// const slug = getCategorySlug("Wedding Planners"); // "wedding-planners"
//
// // Get category from slug:
// const category = getCategoryFromSlug("wedding-planners"); // "Wedding Planners"
//
// // For form dropdowns:
// businessCategoryNames.map(category => (
//   <SelectItem key={category} value={category}>
//     {category}
//   </SelectItem>
// ))
//
// // For URL routing:
// const allCategories = getAllCategories();
// allCategories.forEach(({ name, slug }) => {
//   console.log(`${name} -> ${slug}`);
// });
//
// // Validation:
// if (isValidCategory(userInput)) {
//   // Safe to use userInput as BusinessCategory
// }
//
// if (isValidCategorySlug(params.slug)) {
//   // Safe to use params.slug as BusinessCategorySlug
// }
