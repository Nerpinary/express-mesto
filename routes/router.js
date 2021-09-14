const router = require('express').Router();
const routerCards = require('./cards');
const routerUsers = require('./users');

const errNotFound = (request, response) => response.status(404).send({message: 'Запрашиваемый ресурс не найден'});

router.use(routerCards);
router.use(routerUsers);

router.get('/', errNotFound);
router.post('/', errNotFound);
router.get('/:url', errNotFound);
router.post('/:url', errNotFound);

module.exports = router;
