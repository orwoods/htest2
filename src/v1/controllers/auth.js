const repository = require('../repositories/auth');
const jwt = require('jsonwebtoken');
const uuid = require('uuid/v4');
const sha1 = require('sha1');

const getIp = (req) => {
  return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
};

const extractToken = (req) => {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    if (bearer.length > 1) {
      return bearer[1];
    }
  }

  return false;
};

const createSession = async(id, ip, ua) => {
  const userData = {
    id,
    ip,
    uaSha1: sha1(ua)
  };

  const refreshData = { uuid: uuid() };

  const access = jwt.sign(userData, process.env.PRIVATE_KEY_ACCESS, {
    expiresIn: 1800
  });

  const refresh = jwt.sign(refreshData, process.env.PRIVATE_KEY_REFRESH, {
    expiresIn: '30d'
  });

  await repository.createSession(userData.id, refreshData.uuid, ip);

  return { access, refresh };
};

module.exports = {
  createToken: async(req, res) => {
    const user = await repository.getUserByCredentials(req.body.username, req.body.password);
    if (!user) {
      return res.status(400).json({
        text: 'Invalid credentials'
      });
    }

    res.json(
      await createSession(
        user.id,
        getIp(req),
        req.headers['user-agent'] || ''
      )
    );
  },

  refreshToken: (req, res) => {
    const token = extractToken(req);
    if (!token) {
      return res.status(403).json({
        text: 'Expired'
      });
    }

    jwt.verify(token, process.env.PRIVATE_KEY_REFRESH, async(err, data) => {
      if (err) {
        return res.status(403).json({
          text: 'Expired'
        });
      }

      const session = await repository.getSessionByUUID(data.uuid);
      if (!session) {
        return res.status(403).json({
          text: 'Expired'
        });
      }

      await repository.removeSessionById(session.id);

      res.json(
        await createSession(
          session.user_id,
          getIp(req),
          req.headers['user-agent'] || ''
        )
      );
    });
  },

  verifyToken: (req, res, next) => {
    const token = extractToken(req);
    if (!token) {
      return res.status(401).json({
        text: 'Forbidden'
      });
    }
  
    jwt.verify(token, process.env.PRIVATE_KEY_ACCESS, (err, data) => {
      if (err) {
        return res.status(403).json({
          text: 'Expired'
        });
      }

      req.userId = data.id;
      req.sessionData = data;
      req.ip = getIp(req);
      req.uaSha1 = sha1(req.headers['user-agent']);

      next();
    });
  }
};