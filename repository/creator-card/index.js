const repositoryFactory = require('@app-core/repository-factory');
const CreatorCardModel = require('@app/models/creator-card');

module.exports = repositoryFactory(CreatorCardModel);
