const router = require('express').Router();
const routerCards = require('./cards');
const routerUsers = require('./users');

const errNotFound = (request, response) => response.status(404).send({message: 'Запрашиваемый ресурс не найден'});

router.use(routerCards);
router.use(routerUsers);

router.use('/', errNotFound);

module.exports = router;
