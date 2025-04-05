import { celebrate, Joi, Segments } from 'celebrate';
import urlPattern from '../utils/url.pattern';

export const validateCreateUser = celebrate({
  [Segments.BODY]: Joi.object({
    name: Joi.string().optional(),
    about: Joi.string().optional(),
    avatar: Joi.string().pattern(urlPattern).optional().messages({
      'string.pattern.base': 'Некорректный URL изображения',
    }),
    email: Joi.string().required().messages({
      'any.required': 'Поле email обязательно',
    }),
    password: Joi.string().min(8).required().messages({
      'any.required': 'Поле password обязательно',
      'string.min': 'Пароль должен быть не менее 8 символов',
    }),
  }),
});

export const validateFindUserById = celebrate({
  [Segments.PARAMS]: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }),
});

export const validateUpdateUser = celebrate({
  [Segments.BODY]: Joi.object({
    name: Joi.string().required().messages({
      'any.required': 'Поле name обязательно',
    }),
    about: Joi.string().required().messages({
      'any.required': 'Поле about обязательно',
    }),
  }),
});

export const validateUpdateUserAvatar = celebrate({
  [Segments.BODY]: Joi.object({
    avatar: Joi.string().required().messages({
      'any.required': 'Поле avatar обязательно',
    }),
  }),
});

export const validateLogin = celebrate({
  [Segments.BODY]: Joi.object({
    email: Joi.string().required().messages({
      'any.required': 'Поле email обязательно',
    }),
    password: Joi.string().required().messages({
      'any.required': 'Поле password обязательно',
    }),
  }),
});
