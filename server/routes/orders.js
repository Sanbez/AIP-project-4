import { Router } from 'express'
import { pool } from '../db.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// GET /api/orders  (только свои)
router.get('/', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM orders WHERE buyer_id=$1 ORDER BY created_at DESC',
      [req.user.id],
    )
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

// POST /api/orders
router.post('/', requireAuth, async (req, res) => {
  const { productId, productTitle, productImage, productPrice, sellerId, sellerName, buyerName, buyerPhone, buyerAddress } = req.body
  try {
    const { rows } = await pool.query(
      `INSERT INTO orders
        (product_id, product_title, product_image, product_price, seller_id, seller_name,
         buyer_id, buyer_name, buyer_phone, buyer_address)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [productId, productTitle, productImage, productPrice, sellerId, sellerName,
       req.user.id, buyerName, buyerPhone, buyerAddress],
    )
    res.status(201).json(rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

// PATCH /api/orders/:id  (отметить получен)
router.patch('/:id', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'UPDATE orders SET done=$1 WHERE id=$2 AND buyer_id=$3 RETURNING *',
      [req.body.done, req.params.id, req.user.id],
    )
    rows[0] ? res.json(rows[0]) : res.status(404).json({ error: 'Не найдено' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

export default router
