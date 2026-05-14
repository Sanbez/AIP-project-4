import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import { pool } from '../db.js'
import { requireAuth } from '../middleware/auth.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const router = Router()

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../uploads'),
  filename: (_req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`),
})
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } })

// GET /api/products
router.get('/', async (_req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM products ORDER BY created_at DESC',
    )
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM products WHERE id=$1', [req.params.id])
    rows[0] ? res.json(rows[0]) : res.status(404).json({ error: 'Не найдено' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

// POST /api/products  (auth required)
router.post('/', requireAuth, upload.single('image'), async (req, res) => {
  const { title, category, condition, price, description } = req.body
  const imageUrl = req.file
    ? `/uploads/${req.file.filename}`
    : `https://placehold.co/600x400/0071e3/ffffff?text=${encodeURIComponent(title)}`

  try {
    const { rows } = await pool.query(
      `INSERT INTO products (title, category, condition, price, description, image_url, seller_id, seller_name)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [title, category, condition, Number(price), description, imageUrl, req.user.id, req.user.name],
    )
    res.status(201).json(rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

// PUT /api/products/:id  (auth + owner)
router.put('/:id', requireAuth, async (req, res) => {
  const { title, category, condition, price, description } = req.body
  try {
    const check = await pool.query('SELECT seller_id FROM products WHERE id=$1', [req.params.id])
    if (!check.rows[0]) return res.status(404).json({ error: 'Не найдено' })
    if (check.rows[0].seller_id !== req.user.id)
      return res.status(403).json({ error: 'Нет доступа' })

    const { rows } = await pool.query(
      `UPDATE products SET title=$1, category=$2, condition=$3, price=$4, description=$5
       WHERE id=$6 RETURNING *`,
      [title, category, condition, Number(price), description, req.params.id],
    )
    res.json(rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

// DELETE /api/products/:id  (auth + owner)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const check = await pool.query('SELECT seller_id FROM products WHERE id=$1', [req.params.id])
    if (!check.rows[0]) return res.status(404).json({ error: 'Не найдено' })
    if (check.rows[0].seller_id !== req.user.id)
      return res.status(403).json({ error: 'Нет доступа' })

    await pool.query('DELETE FROM products WHERE id=$1', [req.params.id])
    res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

export default router
