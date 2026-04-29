const express = require('express');
const router = express.Router();
const { getUser, createUser, updateUser } = require('../controllers/userController');

router.get('/', getUser);
router.post('/', createUser);
router.put('/', updateUser);

module.exports = router;