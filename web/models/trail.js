module.exports = function(sequelize, DataTypes) {
    var Trail = sequelize.define('Trail', {
        name: DataTypes.STRING        
    }, {
        classMethods: {
            associate: function(models) {                
                Trail.hasMany(models.Session);
            }
        }
    })

    return Trail
}

