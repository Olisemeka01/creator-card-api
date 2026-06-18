const { createHandler } = require('@app-core/server');
const { deleteCreatorCard } = require('@app/services/creator-card');

module.exports = createHandler({
  path: '/creator-cards/:slug',
  method: 'delete',
  async handler(rc, helpers) {
    const { slug } = rc.params;
    const response = await deleteCreatorCard({
      slug,
      creator_reference: rc.body.creator_reference,
    });
    return {
      status: helpers.http_statuses.HTTP_200_OK,
      message: 'Creator Card Deleted Successfully.',
      data: response,
    };
  },
});
