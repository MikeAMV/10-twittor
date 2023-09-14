// Routes.js - Módulo de rutas
var express = require('express');
var router = express.Router();

let messages = [
  {
    _id: new Date().getTime(),
    user: 'Spiderman',
    message: 'Hola mundo',
  },
];

// Get mensajes
router.get('/', function (req, res) {
  try {
    console.log(messages);
    res.json({ messages });
  } catch (error) {
    res.json({ message: 'Error' });
  }
});

router.post('/', function (req, res) {
  try {
    const { message, user } = req.body;
    const payload = { message, user };
    messages.push(payload);
    console.log(messages);
    res.json({ message, ok: true });
  } catch (error) {
    res.json({ message: 'Error' });
  }
});

module.exports = router;
