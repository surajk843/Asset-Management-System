const express = require('express');

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/roleMiddleware");

const {
    getUsers,
    createUser,
    updateUser,
    deleteUser
} = require('../controllers/userController');

router.get('/', verifyToken, getUsers);

router.post('/', verifyToken, authorizeRole(1), createUser);

router.put('/:id', verifyToken, authorizeRole(1), updateUser);

router.delete('/:id', verifyToken, authorizeRole(1), deleteUser);

module.exports = router;