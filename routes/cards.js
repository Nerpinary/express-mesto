const router = require('express').Router();
const {getCards, getCard, createCard, deleteCard} = require('../controllers/cards');

router.get('/cards', getCards);
router.get('/cards/:_id', getCard);
router.post('/cards', createCard);
router.delete('/cards/:_id', deleteCard);

module.exports = router;
