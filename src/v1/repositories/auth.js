const Session = require('../models/session');
const User = require('../models/user');

module.exports = {
   removeSessionById: async(id) => {
     if (!id) {
       return;
     }

     return await (new Session).remove(id);
   },

   createSession: async(userId, uuid, ip) => {
     if (!userId || !uuid || !ip) {
       return;
     }

     await (new Session).create(userId, uuid, ip);
   },

   getSessionByUUID: async(uuid) => {
     if (!uuid) {
       return;
     }

     const session = await (new Session).getByUUID(uuid);

     return session;
   },

   getUserByCredentials: async(username, password) => {
     if (!username || !password) {
       return;
     }

     const user = await (new User).getByCredentials(username, password);

     return user;
   }
};