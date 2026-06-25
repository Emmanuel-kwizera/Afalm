const express = require('express');
const { register, login, registerAdmin, getAllUsers, resetPassword } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new farmer
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - phoneNumber
 *               - email
 *               - password
 *             properties:
 *               fullName:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               mainCrop:
 *                 type: string
 *     responses:
 *       201:
 *         description: Successfully registered
 *       400:
 *         description: Validation or bad request error
 */
router.post('/register', register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login an existing user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully logged in
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', login);

/**
 * @swagger
 * /api/auth/register-admin:
 *   post:
 *     summary: Register a new admin (Requires adminSecret)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - phoneNumber
 *               - email
 *               - password
 *               - adminSecret
 *             properties:
 *               fullName:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               adminSecret:
 *                 type: string
 *                 description: Secret key required to register as admin
 *     responses:
 *       201:
 *         description: Successfully registered admin
 *       403:
 *         description: Invalid admin secret
 *       400:
 *         description: Validation or bad request error
 */
router.post('/register-admin', registerAdmin);

/**
 * @swagger
 * /api/auth/users:
 *   get:
 *     summary: Get all registered users
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users
 *       401:
 *         description: Not authorized, token failed
 *       403:
 *         description: Not authorized, user is not admin
 */
router.get('/users', protect, authorize('admin'), getAllUsers);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset password via email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       404:
 *         description: User not found
 *       400:
 *         description: Validation error
 */
router.post('/reset-password', resetPassword);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current logged in user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *   put:
 *     summary: Update user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               mainCrop:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated user profile
 */
router.get('/me', protect, require('../controllers/authController').getUserProfile);
router.put('/me', protect, require('../controllers/authController').updateUserProfile);

module.exports = router;
