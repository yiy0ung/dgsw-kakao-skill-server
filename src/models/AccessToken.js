module.exports = (sequelize, DataTypes) => {
  const AccessToken = sequelize.define('AccessToken', {
    idx: {
      field: 'idx',
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    key: {
      field: 'key',
      type: DataTypes.STRING,
      allowNull: null,
    },
  }, {
    tableName: 'access_token',
    timestamps: false,
  });

  AccessToken.getToken = key => AccessToken.findOne({
    where: {
      key,
    },
    raw: true,
  });

  return AccessToken;
}