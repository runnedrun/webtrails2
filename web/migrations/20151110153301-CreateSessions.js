'use_strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable(
      'Sessions',
      {
        id: {
          type: Sequelize.BIGINT,
          primaryKey: true,
          autoIncrement: true
        },
        createdAt: {
          type: Sequelize.DATE
        },
        updatedAt: {
          type: Sequelize.DATE
        },       
        htmlArchiveLocation: {
          type: Sequelize.STRING
        },
        savedResources: {
          type: Sequelize.TEXT
        },
        index: {
          type: Sequelize.SHORT
        },
        TrailId: {
          type: Sequelize.BIGINT,
          references: { model: "Trails", key: "id" },          
          onUpdate: "CASCADE",
          onDelete: "RESTRICT"
        }        
      }
    )
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Sessions')
  }
}
