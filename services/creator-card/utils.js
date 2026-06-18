/**
 * Transform database record to API response format
 * @param {Object} record - The database record
 * @param {boolean} includeAccessCode - Whether to include access_code in response
 * @returns {Object} - Transformed record
 */
function transformRecord(record, includeAccessCode = false) {
  const { _id, deleted, ...rest } = record;

  const transformed = {
    ...rest,
    id: _id,
  };

  if (includeAccessCode && rest.access_code) {
    transformed.access_code = rest.access_code;
  }

  if (deleted) {
    transformed.deleted = deleted;
  } else {
    transformed.deleted = null;
  }

  return transformed;
}

module.exports = { transformRecord };
