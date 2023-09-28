import * as Joi from 'joi';

const validationSchema = Joi.object({
  // TODO: add all .env variables here for validation!
  PORT: Joi.number().default(5000),
  INTRA_CLIENT_ID: Joi.string().required(),
  INTRA_CLIENT_SECRET: Joi.string().required(),
  INTRA_CALLBACK_URL: Joi.string().uri().required(),
  FRONTEND_ORIGIN: Joi.string().uri().required(),
  JWT_SECRET: Joi.string(),

  // redis validation
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required().default(6379),
  REDIS_PASSWORD: Joi.string().required(),
});
const validationOptions: Joi.ValidationOptions = {
  abortEarly: true,
  allowUnknown: true,
};

export { validationSchema, validationOptions };
