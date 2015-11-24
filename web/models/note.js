module.exports = function(sequelize, DataTypes) {
    var Note = sequelize.define('Note', {
        text: DataTypes.TEXT,
        scrollX: DataTypes.FLOAT,
        scrollY: DataTypes.FLOAT,        
        nodeIndex: DataTypes.INTEGER,        
        title: DataTypes.STRING,
        deleted: DataTypes.BOOLEAN
    }, {
        paranoid: true,
        classMethods: {
            associate: function(models) {                
                Note.belongsTo(models.Session);
            }
        }
    })

    return Note
}
