import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/api'
import { useAuthStore } from './auth'

export const useOrdersStore = defineStore('orders', () => {
  const orders = ref([])
  const loading = ref(false)

  async function fetchOrders() {
    const auth = useAuthStore()
    if (!auth.user) return
    loading.value = true
    try {
      const data = await api.getOrders()
      orders.value = data.map(d => ({
        id: d.id,
        productId: d.product_id,
        productTitle: d.product_title,
        productImage: d.product_image,
        productPrice: d.product_price,
        sellerId: d.seller_id,
        sellerName: d.seller_name,
        buyerName: d.buyer_name,
        buyerPhone: d.buyer_phone,
        buyerAddress: d.buyer_address,
        done: d.done,
        createdAt: d.created_at,
      }))
    } catch {
      orders.value = []
    } finally {
      loading.value = false
    }
  }

  async function toggleDone(orderId, done) {
    try {
      await api.toggleDone(orderId, done)
      const order = orders.value.find(o => o.id === orderId)
      if (order) order.done = done
    } catch {
      // silent fail
    }
  }

  return { orders, loading, fetchOrders, toggleDone }
})
