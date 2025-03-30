import { Router } from 'express';
import {
  createCard, findAllCards, deleteCardById, addLikeToCard, removeLikeFromCard,
} from '../controllers/cards';

const cardsRouter = Router();
cardsRouter.post('/cards', createCard);
cardsRouter.delete('/cards/:id', deleteCardById);
cardsRouter.get('/cards', findAllCards);
cardsRouter.put('/cards/:cardId/likes', addLikeToCard);
cardsRouter.delete('/cards/:cardId/likes', removeLikeFromCard);

export default cardsRouter;
