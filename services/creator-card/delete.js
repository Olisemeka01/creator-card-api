const validator = require('@app-core/validator');
const { throwAppError, ERROR_CODE } = require('@app-core/errors');
const { appLogger } = require('@app-core/logger');
const CreatorCardRepository = require('@app/repository/creator-card');
const { CreatorCardMessages } = require('@app/messages');
const { parsedDeleteSpec } = require('./validation-schema');
const { transformRecord } = require('./utils');

/**
 * Delete a Creator Card by slug
 * @param {Object} serviceData - Data containing slug and creator_reference
 * @param {string} serviceData.slug - The slug of the card to delete
 * @param {string} serviceData.creator_reference - The creator reference for verification
 * @param {Object} options - Optional parameters
 * @returns {Promise<Object>} - The deleted card
 */
async function deleteCreatorCard(serviceData, options = {}) {
  const { slug, creator_reference: creatorReference } = serviceData;
  let response;

  try {
    // Validate creator_reference
    validator.validate({ creator_reference: creatorReference }, parsedDeleteSpec);

    // Find the card
    const card = await CreatorCardRepository.findOne({
      query: { slug, deleted: null },
    });

    // Business rule: NF01 - Card not found
    if (!card) {
      throwAppError(CreatorCardMessages.CARD_NOT_FOUND, ERROR_CODE.NF01);
    }

    // Soft delete the card by setting deleted timestamp
    const deletedTimestamp = Date.now();
    await CreatorCardRepository.updateOne({
      query: { slug, deleted: null },
      updateValues: {
        deleted: deletedTimestamp,
        updated: deletedTimestamp,
      },
    });

    // Return the card with deleted field set
    const deletedCard = {
      ...card,
      deleted: deletedTimestamp,
    };

    response = transformRecord(deletedCard, true);
  } catch (error) {
    appLogger.error(error, 'delete-creator-card-error');
    throw error;
  }

  return response;
}

module.exports = deleteCreatorCard;
