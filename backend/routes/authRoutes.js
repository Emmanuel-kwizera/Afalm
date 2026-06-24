const express = require('express');
const { register, login, registerAdmin } = require('../controllers/authController');

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

module.exports = router;
