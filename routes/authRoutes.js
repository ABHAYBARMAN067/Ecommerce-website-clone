const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/login', authController.loginForm);
router.post('/login', authController.loginUser);
router.get('/register', authController.registerForm);
router.post('/register', authController.registerUser);
router.get('/logout', authController.logout);

// Admin: Delete user and all their data
router.delete('/user/:id', authController.deleteUser);

module.exports = router;
