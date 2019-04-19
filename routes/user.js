const express = require('express'),
  router = express.Router();

const apiUser = require('../api/user');

router.post('/cadastrar', async (req, res) => {
  try {
    const { newUser, msg } = await apiUser.createUser(req.body);
    res.status(201).json({ newUser, msg });
  } catch (error) {
    return res.status(404).json(error);
  }
});

router.post('/login', async (req, res) => {
  try {
    const { user, msg } = await apiUser.login(req.body);
    res.status(200).json(user);
  } catch (error) {
    return res.status(404).json(error);
  }
});

module.exports = router;
