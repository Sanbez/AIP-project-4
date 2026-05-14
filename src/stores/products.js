import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/api'

const DEMO_PRODUCTS = [
  {
    id: 'demo-1',
    title: 'iPhone 15 Pro Max — 256GB Natural Titanium',
    category: 'iPhone',
    condition: 'Новый',
    price: 120000,
    description: 'Только что распакован. Полный комплект: коробка, кабель USB-C, документы.\nГарантия Apple до 2025 года. Чек в наличии.',
    image_url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-naturaltitanium?wid=800&hei=800&fmt=p-jpg&bgc=F5F5F7&.v=1692923791',
    seller_id: 'demo-seller',
    seller_name: 'Алексей М.',
    created_at: null,
  },
  {
    id: 'demo-2',
    title: 'MacBook Pro 14" M3 Pro — 18GB/512GB Space Black',
    category: 'Mac',
    condition: 'Б/У — отличное',
    price: 185000,
    description: 'Использовался 3 месяца для работы. Царапин и вмятин нет.',
    image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=85',
    seller_id: 'demo-seller',
    seller_name: 'Дмитрий С.',
    created_at: null,
  },
  {
    id: 'demo-3',
    title: 'iPad Pro 12.9" M2 — Wi-Fi + Cellular 256GB',
    category: 'iPad',
    condition: 'Б/У — хорошее',
    price: 89000,
    description: 'Работает идеально. Небольшие царапины на задней крышке.',
    image_url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=85',
    seller_id: 'demo-seller',
    seller_name: 'Кристина В.',
    created_at: null,
  },
  {
    id: 'demo-4',
    title: 'Apple Watch Ultra 2 — Titanium 49mm',
    category: 'Watch',
    condition: 'Б/У — отличное',
    price: 79000,
    description: 'Носил 2 месяца. Состояние отличное.',
    image_url: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=85',
    seller_id: 'demo-seller',
    seller_name: 'Артём Р.',
    created_at: null,
  },
  {
    id: 'demo-5',
    title: 'AirPods Pro 2 (USB-C) — MagSafe Case',
    category: 'AirPods',
    condition: 'Новый',
    price: 24000,
    description: 'Запечатанная коробка, новые. Куплены в Apple Store.',
    image_url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQTP3?wid=800&hei=800&fmt=jpeg&qlt=90&bgc=F5F5F7&.v=1660803972',
    seller_id: 'demo-seller',
    seller_name: 'Наташа О.',
    created_at: null,
  },
]

function mapProduct(d) {
  return {
    id: d.id,
    title: d.title,
    category: d.category,
    condition: d.condition,
    price: d.price,
    description: d.description,
    imageUrl: d.image_url,
    sellerId: d.seller_id,
    sellerName: d.seller_name,
    createdAt: d.created_at,
  }
}

export const useProductsStore = defineStore('products', () => {
  const products = ref([])
  const currentProduct = ref(null)
  const loading = ref(false)
  const selectedCategory = ref('Все')

  const categories = ['Все', 'iPhone', 'iPad', 'Mac', 'Watch', 'AirPods', 'Аксессуары']

  const filteredProducts = computed(() => {
    if (selectedCategory.value === 'Все') return products.value
    return products.value.filter(p => p.category === selectedCategory.value)
  })

  async function fetchProducts() {
    loading.value = true
    try {
      const data = await api.getProducts()
      products.value = data.length ? data.map(mapProduct) : DEMO_PRODUCTS.map(mapProduct)
    } catch {
      products.value = DEMO_PRODUCTS.map(mapProduct)
    } finally {
      loading.value = false
    }
  }

  async function fetchProduct(id) {
    if (String(id).startsWith('demo-')) {
      currentProduct.value = mapProduct(DEMO_PRODUCTS.find(p => p.id === id) ?? null)
      return
    }
    loading.value = true
    try {
      const data = await api.getProduct(id)
      currentProduct.value = mapProduct(data)
    } catch {
      currentProduct.value = null
    } finally {
      loading.value = false
    }
  }

  function setCategory(cat) {
    selectedCategory.value = cat
  }

  return {
    products, currentProduct, loading,
    filteredProducts, categories, selectedCategory,
    fetchProducts, fetchProduct, setCategory,
  }
})
