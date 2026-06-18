const validator = require('@app-core/validator');
const { throwAppError, ERROR_CODE } = require('@app-core/errors');
const { appLogger } = require('@app-core/logger');
const CreatorCardRepository = require('@app/repository/creator-card');
const { CreatorCardMessages } = require('@app/messages');
const { parsedCreateSpec } = require('./validation-schema');
const { generateSlugFromTitle } = require('./slug-generator');
const { transformRecord } = require('./utils');

/**
 * Create a new Creator Card
 * @param {Object} serviceData - The card data to create
 * @param {Object} options - Optional parameters
 * @returns {Promise<Object>} - The created card
 */
async function createCreatorCard(serviceData, options = {}) {
  const validatedData = validator.validate(serviceData, parsedCreateSpec);
  let response;

  try {
    // Set default access_type to 'public' if not provided
    const accessType = validatedData.access_type || 'public';

    // Business rule: AC05 - access_code can only be set on private cards
    if (accessType !== 'private' && validatedData.access_code) {
      throwAppError(CreatorCardMessages.ACCESS_CODE_PUBLIC_ONLY, ERROR_CODE.AC05);
    }

    // Business rule: AC01 - access_code is required when access_type is private
    if (accessType === 'private' && !validatedData.access_code) {
      throwAppError(CreatorCardMessages.ACCESS_CODE_REQUIRED, ERROR_CODE.AC01);
    }

    // Handle slug - auto-generate if not provided
    let { slug } = validatedData;
    if (!slug) {
      // Get existing slugs to check uniqueness
      const existingCards = await CreatorCardRepository.findMany({
        query: { deleted: null },
        projections: { slug: 1 },
        options: {},
      });
      const existingSlugs = existingCards.map((card) => card.slug);

      slug = generateSlugFromTitle(validatedData.title, existingSlugs);
    } else {
      // Business rule: SL02 - If slug is provided, check uniqueness
      const existingCard = await CreatorCardRepository.findOne({
        query: { slug, deleted: null },
      });
      if (existingCard) {
        throwAppError(CreatorCardMessages.SLUG_EXISTS, ERROR_CODE.SL02);
      }
    }

    // Prepare data for creation
    const cardToCreate = {
      ...validatedData,
      slug,
      access_type: accessType,
      access_code: accessType === 'private' ? validatedData.access_code : null,
    };

    // Create the card
    const createdCard = await CreatorCardRepository.create(cardToCreate);

    response = transformRecord(createdCard, true);
  } catch (error) {
    appLogger.error(error, 'create-creator-card-error');
    throw error;
  }

  return response;
}

module.exports = createCreatorCard;
