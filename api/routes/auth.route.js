import express from 'express'
import { login, logout, register } from '../controllers/auth.controller.js'
const router = express.Router()

router.post('/register', register)
router.post('/login', logout)
router.post('/logout', login)

export default router