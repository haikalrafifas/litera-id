import { Model } from 'objection';
import { generateString } from './string';

/**
 * Generate a slug from a string
 * Converts to lowercase, replaces spaces & special chars with dashes
 * Example: "Hello World!" => "hello-world"
 */
export function generateSlug(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // remove non-alphanumeric chars except dash
    .replace(/[\s_-]+/g, '-') // replace spaces and underscores with dash
    .replace(/^-+|-+$/g, ''); // remove leading/trailing dashes
}

/**
 * Generate a unique slug for a given Objection.js model
 * 
 * @param model - Objection.js Model class
 * @param value - initial string to base slug on
 * @param slugColumn - column name in database (default 'slug')
 * @param appendLength - length of random string to append in case of conflict (default 4)
 */
export async function generateUniqueSlug<M extends Model>(
  model: typeof Model,
  value: string,
  slugColumn: keyof M = 'slug' as keyof M,
  appendLength: number = 4
): Promise<string> {
  let slug = generateSlug(value);

  // Recursive inner function
  const checkSlug = async (currentSlug: string): Promise<string> => {
    const exists = await model.query().findOne({ [slugColumn]: currentSlug } as any);
    if (!exists) {
      return currentSlug;
    }

    // Append random string and try again
    const newSlug = `${slug}-${generateString({ length: appendLength })}`;
    return checkSlug(newSlug);
  };

  return checkSlug(slug);
}
