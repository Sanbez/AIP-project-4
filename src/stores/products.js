import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/api'
import { useAuthStore } from './auth'
import { useUiStore } from './ui'

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
    description: 'Использовался 3 месяца для работы. Царапин и вмятин нет.\nВ наличии оригинальная коробка и зарядное устройство 96W.',
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
    description: 'Работает идеально. Небольшие царапины на задней крышке.\nИдёт с Apple Pencil 2-го поколения.',
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
    description: 'Носил 2 месяца. Состояние отличное.\nКомплект полный: коробка, Alpine Loop (L), Ocean Band.',
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
    description: 'Запечатанная коробка, новые. Куплены в Apple Store.\nЕсть чек.',
    image_url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQTP3?wid=800&hei=800&fmt=jpeg&qlt=90&bgc=F5F5F7&.v=1660803972',
    seller_id: 'demo-seller',
    seller_name: 'Наташа О.',
    created_at: null,
  },
  {
    id: 'demo-6',
    title: 'MacBook Air 15" M3 — Starlight 8GB/256GB',
    category: 'Mac',
    condition: 'Новый',
    price: 132000,
    description: 'Новый, нераспакованный. Куплен как подарок, не пригодился.\nЧек из Apple Store.',
    image_url: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=85',
    seller_id: 'demo-seller',
    seller_name: 'Иван К.',
    created_at: null,
  },
  {
    id: 'demo-7',
    title: 'Apple Pencil Pro — для iPad Air / iPad Pro M4',
    category: 'Аксессуары',
    condition: 'Новый',
    price: 12000,
    description: 'Новый в коробке. Поддерживает Squeeze и Find My.',
    image_url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MUWA3?wid=800&hei=800&fmt=jpeg&qlt=90&bgc=F5F5F7&.v=1706732846',
    seller_id: 'demo-seller',
    seller_name: 'Диана Л.',
    created_at: null,
  },
  {
    id: 'demo-8',
    title: 'iPhone 14 — 128GB Midnight',
    category: 'iPhone',
    condition: 'Б/У — хорошее',
    price: 58000,
    description: 'Использовался год. Корпус идеальный. Защитное стекло в комплекте.',
    image_url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-14-finish-select-202209-6-1inch-midnight?wid=800&hei=800&fmt=p-jpg&bgc=F5F5F7&.v=1660803972',
    seller_id: 'demo-seller',
    seller_name: 'Максим Г.',
    created_at: null,
  },
]

// Приводим строки БД (snake_case) к формату компонентов (camelCase)
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
  const myProducts = ref([])
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

  async function fetchMyProducts() {
    const auth = useAuthStore()
    if (!auth.user) return
    loading.value = true
    try {
      const data = await api.getProducts()
      myProducts.value = data
        .filter(p => String(p.seller_id) === String(auth.user.uid))
        .map(mapProduct)
    } catch {
      myProducts.value = []
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

  async function createProduct({ title, category, condition, price, description, imageFile }) {
    const ui = useUiStore()
    ui.setLoading(true)
    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('category', category)
      formData.append('condition', condition)
      formData.append('price', price)
      formData.append('description', description)
      if (imageFile) formData.append('image', imageFile)

      await api.createProduct(formData)
      ui.showSuccess('Объявление опубликовано!')
      return true
    } catch {
      ui.showError('Ошибка при публикации. Попробуйте снова.')
      return false
    } finally {
      ui.setLoading(false)
    }
  }

  async function updateProduct(id, data) {
    const ui = useUiStore()
    ui.setLoading(true)
    try {
      await api.updateProduct(id, data)
      ui.showSuccess('Объявление обновлено.')
      return true
    } catch {
      ui.showError('Ошибка при обновлении.')
      return false
    } finally {
      ui.setLoading(false)
    }
  }

  async function deleteProduct(id) {
    const ui = useUiStore()
    ui.setLoading(true)
    try {
      await api.deleteProduct(id)
      myProducts.value = myProducts.value.filter(p => p.id !== id)
      ui.showSuccess('Объявление удалено.')
    } catch {
      ui.showError('Ошибка при удалении.')
    } finally {
      ui.setLoading(false)
    }
  }

  function setCategory(cat) {
    selectedCategory.value = cat
  }

  return {
    products, currentProduct, myProducts, loading,
    filteredProducts, categories, selectedCategory,
    fetchProducts, fetchMyProducts, fetchProduct,
    createProduct, updateProduct, deleteProduct, setCategory,
  }
})
