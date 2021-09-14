const router = require('express').Router();
const {getCards, getCard, createCard, deleteCard, likeCard, dislikeCard} = require('../controllers/cards');

router.get('/cards', getCards);
router.get('/cards/:_id', getCard);
router.post('/cards', createCard);
router.delete('/cards/:_id', deleteCard);
router.put('/cards/:_id/likes', likeCard);
router.delete('/cards/:_id/likes', dislikeCard);

module.exports = router;
