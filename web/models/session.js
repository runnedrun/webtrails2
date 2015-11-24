module.exports = function(sequelize, DataTypes) {
    var Session = sequelize.define('Session', {
        htmlArchiveLocation: DataTypes.STRING,
        savedResources: DataTypes.STRING,
        index: DataTypes.INTEGER
    }, {
        classMethods: {
            associate: function(models) {
                Session.hasMany(models.Note);
                Session.belongsTo(models.Trail);
            }
        }
    })

    return Session
}