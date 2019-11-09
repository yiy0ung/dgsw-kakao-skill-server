const models = require('../models');

module.exports = async (req, res, next) => {
  const { token } = req.headers;

  if (!token) {
    console.log('permission denied : 권한이 안보내졌습니다');
    const result = {
      version: '2.0',
      data: {
        message: 'permission denied',
      },
    };

    res.status(400).json(result);
    return;
  }

  try {
    const permission = await models.AccessToken.getToken(token);

    if (!permission) {
      console.log('permission denied : 존재하지 않는 권한');
      const result = {
        version: '2.0',
        data: {
          message: 'permission denied',
        },
      };

      res.status(400).json(result);
      return;
    }
  } catch (error) {
    console.error(error);
    const result = {
      version: '2.0',
      data: {
        message: 'permission denied',
      },
    }

    res.status(500).json(result);
    return;
  }

  next();
}