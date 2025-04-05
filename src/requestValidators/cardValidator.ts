import { celebrate, Joi, Segments } from 'celebrate';
import urlPattern from '../utils/url.pattern';

export const validateCreateCard = celebrate({
  [Segments.BODY]: Joi.object({
    name: Joi.string().required().messages({
      'any.required': 'Поле name обязательно',
    }),
    link: Joi.string().pattern(urlPattern).required().messages({
      'any.required': 'Поле link обязательно',
      'string.pattern.base': 'Некорректный URL изображения',
    }),
  }),
});

export const validateCardId = celebrate({
  [Segments.PARAMS]: Joi.object({
    id: Joi.string().hex().length(24).required()
      .messages({
        'any.required': 'ID карточки обязателен',
        'string.hex': 'ID карточки должен быть в формате HEX',
        'string.length': 'ID карточки должен содержать 24 символа',
      }),
  }),
});

export const validateCardLike = celebrate({
  [Segments.PARAMS]: Joi.object({
    cardId: Joi.string().hex().length(24).required()
      .messages({
        'any.required': 'ID карточки обязателен',
        'string.hex': 'ID карточки должен быть в формате HEX',
        'string.length': 'ID карточки должен содержать 24 символа',
      }),
  }),
});
