module.exports = {
  mongodb: {
    connectionstring: process.env.MONGODB_CONNECTIONSTRING,
  },
  authProviders: {
    facebook: {
      appId: process.env.FACEBOOK_APP_ID,
      appSecret: process.env.FACEBOOK_APP_SECRET,
    },
  },
};
