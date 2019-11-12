module.exports = (sequelize, DataTypes) => {
  const Weather = sequelize.define('Weather', {
    idx: {
      field: 'idx',
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    condition: {
      field: 'condition',
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    temp: {
      field: 'temp',
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    windChill: { // 체감 온도
      field: 'wind_chill',
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    humidity: {
      field: 'humidity',
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createDate: {
      field: 'create_date',
      type: DataTypes.DATE,
      allowNull: null,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
  }, {
    tableName: 'weather',
    timestamps: false,
  });

  Weather.createWeather = data => Weather.create(data);
  
  Weather.getTodayWeather = () => Weather.findAll({
    order: [
      ['create_date', 'DESC'],
    ],
    limit: 1,
    raw: true,
  });

  return Weather;
};
