import * as Joi from 'joi';

const validationSchema = Joi.object({
  // TODO: add all .env variables here for validation!
  PORT: Joi.number().default(4000),
  INTRA_CLIENT_ID: Joi.string().required(),
  INTRA_CLIENT_SECRET: Joi.string().required(),
  INTRA_CALLBACK_URL: Joi.string().uri().required(),
  FRONTEND_ORIGIN: Joi.string().uri().required(),
  JWT_SECRET: Joi.string(),

  // redis validation
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required().default(6379),
  REDIS_PASSWORD: Joi.string().required(),

  // minio validation
  MINIO_ROOT_USER: Joi.string().required(),
  MINIO_ROOT_PASSWORD: Joi.string().required(),
  MINIO_ENDPOINT: Joi.string().required(),
  MINIO_ACCESS_KEY: Joi.string().required(),
  MINIO_SECRET_KEY: Joi.string().required(),
});
const validationOptions: Joi.ValidationOptions = {
  abortEarly: true,
  allowUnknown: true,
};

export { validationSchema, validationOptions };
