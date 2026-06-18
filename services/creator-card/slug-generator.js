const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';

/**
 * Generate a random 6-character alphanumeric string
 * @returns {string}
 */
function generateRandomSuffix() {
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

/**
 * Generate a slug from a title
 * @param {string} title - The title to convert to a slug
 * @param {string[]} existingSlugs - Array of existing slugs to check against
 * @returns {string} - The generated slug
 */
function generateSlugFromTitle(title, existingSlugs = []) {
  // Step 1: Lowercase the title
  let slug = title.toLowerCase();

  // Step 2: Replace whitespace with hyphens
  slug = slug.replace(/\s+/g, '-');

  // Step 3: Remove any characters that are not letters, numbers, hyphens, or underscores
  slug = slug.replace(/[^a-z0-9-_]/g, '');

  // Step 4: If result is shorter than 5 characters OR slug already exists, append random suffix
  if (slug.length < 5 || existingSlugs.includes(slug)) {
    slug = `${slug}-${generateRandomSuffix()}`;
  }

  return slug;
}

module.exports = {
  generateSlugFromTitle,
  generateRandomSuffix,
};
