'use_strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable(
      'Notes',
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
        text: Sequelize.TEXT,
        scrollX: Sequelize.FLOAT,
        scrollY: Sequelize.FLOAT,        
        nodeIndex: Sequelize.INTEGER,        
        clientSideId: Sequelize.STRING,
        title: Sequelize.STRING,
        deletedAt: {
          type: Sequelize.DATE
        },
        SessionId: {
          type: Sequelize.BIGINT,
          references: { model: "Sessions", key: "id" },          
          onUpdate: "CASCADE",
          onDelete: "RESTRICT"
        }        
      }
    )
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Notes')
  }
}
