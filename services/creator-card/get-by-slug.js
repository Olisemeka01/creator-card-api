const { throwAppError, ERROR_CODE } = require('@app-core/errors');
const { appLogger } = require('@app-core/logger');
const CreatorCardRepository = require('@app/repository/creator-card');
const { CreatorCardMessages } = require('@app/messages');
const { transformRecord } = require('./utils');

/**
 * Get a Creator Card by slug
 * @param {Object} serviceData - Data containing slug and optional access_code
 * @param {string} serviceData.slug - The slug to look up
 * @param {string} [serviceData.access_code] - The access code for private cards
 * @param {Object} options - Optional parameters
 * @returns {Promise<Object>} - The card data
 */
async function getCreatorCardBySlug(serviceData, options = {}) {
  const { slug, access_code: accessCode } = serviceData;
  let response;

  try {
    // Find card by slug where deleted is null
    const card = await CreatorCardRepository.findOne({
      query: { slug, deleted: null },
    });

    // Business rule: NF01 - Card not found
    if (!card) {
      throwAppError(CreatorCardMessages.CARD_NOT_FOUND, ERROR_CODE.NF01);
    }

    // Business rule: NF02 - Card is in draft status
    if (card.status === 'draft') {
      throwAppError(CreatorCardMessages.CARD_IS_DRAFT, ERROR_CODE.NF02);
    }

    // Business rule: AC03 - Access code required for private cards
    if (card.access_type === 'private' && !accessCode) {
      throwAppError(CreatorCardMessages.ACCESS_CODE_REQUIRED_RETRIEVAL, ERROR_CODE.AC03);
    }

    // Business rule: AC04 - Invalid access code
    if (card.access_type === 'private' && card.access_code !== accessCode) {
      throwAppError(CreatorCardMessages.INVALID_ACCESS_CODE, ERROR_CODE.AC04);
    }

    // Return card without access_code field
    response = transformRecord(card, false);
  } catch (error) {
    appLogger.error(error, 'get-creator-card-by-slug-error');
    throw error;
  }

  return response;
}

module.exports = getCreatorCardBySlug;
