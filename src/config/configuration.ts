export default () => ({
  environment: process.env.ENVIRONMENT,
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  database: {
    mongodb: {
      uri: process.env.MONGODB_URI,
    },
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
    apiKey: process.env.CLOUDINARY_API_KEY,
    url: process.env.CLOUDINARY_URL,
  },
  jwt: {
    secretKey: process.env.JWT_SECRET_KEY,
    resetPasswordSecretKey: process.env.JWT_RESET_PASSWORD_SECRET_KEY,
  },
  mail: {
    service: process.env.MAIL_SERVICE,
    username: process.env.MAIL_USERNAME,
    password: process.env.MAIL_PASSWORD,
  },
});
