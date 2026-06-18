const { createHandler } = require('@app-core/server');
const { getCreatorCardBySlug } = require('@app/services/creator-card');

module.exports = createHandler({
  path: '/creator-cards/:slug',
  method: 'get',
  async handler(rc, helpers) {
    const { slug } = rc.params;
    const accessCode = rc.query.access_code || null;
    const response = await getCreatorCardBySlug({
      slug,
      access_code: accessCode,
    });
    return {
      status: helpers.http_statuses.HTTP_200_OK,
      message: 'Creator Card Retrieved Successfully.',
      data: response,
    };
  },
});
