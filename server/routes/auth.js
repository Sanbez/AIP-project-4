import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { pool } from '../db.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '7d' },
  )
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body
  if (!name || !email || !password)
    return res.status(400).json({ error: 'Заполните все поля' })
  if (password.length < 6)
    return res.status(400).json({ error: 'Пароль минимум 6 символов' })

  try {
    const existing = await pool.query('SELECT id FROM users WHERE email=$1', [email])
    if (existing.rowCount > 0)
      return res.status(409).json({ error: 'Этот email уже зарегистрирован' })

    const hash = await bcrypt.hash(password, 10)
    const { rows } = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1,$2,$3) RETURNING id, name, email',
      [name, email, hash],
    )
    res.json({ token: signToken(rows[0]), user: rows[0] })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE email=$1', [email])
    const user = rows[0]
    if (!user) return res.status(401).json({ error: 'Неверный email или пароль' })

    const ok = await bcrypt.compare(password, user.password_hash)
    if (!ok) return res.status(401).json({ error: 'Неверный email или пароль' })

    res.json({
      token: signToken(user),
      user: { id: user.id, name: user.name, email: user.email },
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

// GET /api/auth/me
router.get('/me', requireAuth, async (req, res) => {
  const { rows } = await pool.query('SELECT id, name, email FROM users WHERE id=$1', [req.user.id])
  rows[0] ? res.json(rows[0]) : res.status(404).json({ error: 'Не найден' })
})

export default router
