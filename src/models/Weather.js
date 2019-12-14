module.exports = (sequelize, DataTypes) => {
  const Weather = sequelize.define('Weather', {
    idx: {
      field: 'idx',
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    schoolCode: {
      field: 'school_code',
      type: DataTypes.STRING(30),
      allowNull: false,
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
  
  Weather.getTodayWeather = (schoolCode) => Weather.findAll({
    order: [
      ['create_date', 'DESC'],
    ],
    where: {
      schoolCode,
    },
    limit: 1,
    raw: true,
  }).then(result => result[0]);

  return Weather;
};
