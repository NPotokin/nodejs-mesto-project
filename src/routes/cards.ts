import { Router } from 'express';
import {
  createCard, findAllCards, deleteCardById, addLikeToCard, removeLikeFromCard,
} from '../controllers/cards';
import { validateCardId, validateCardLike, validateCreateCard } from '../requestValidators/cardValidator';

const cardsRouter = Router();
cardsRouter.post('/cards', validateCreateCard, createCard);
cardsRouter.delete('/cards/:id', validateCardId, deleteCardById);
cardsRouter.get('/cards', findAllCards);
cardsRouter.put('/cards/:cardId/likes', validateCardLike, addLikeToCard);
cardsRouter.delete('/cards/:cardId/likes', validateCardLike, removeLikeFromCard);

export default cardsRouter;
