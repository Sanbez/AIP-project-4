<template>
  <div>
    <!-- ──────────────────────────────────────────────────────
         Hero Carousel — full-bleed фото с градиентным оверлеем
         (аналог карусели из главы 5 пособия, но в Apple-стиле)
    ────────────────────────────────────────────────────────── -->
    <v-carousel
      height="460"
      hide-delimiter-background
      show-arrows="hover"
      :interval="5500"
      cycle
      color="white"
    >
      <v-carousel-item v-for="slide in heroSlides" :key="slide.id">
        <!-- Полноэкранное фото как фон -->
        <v-img :src="slide.bgImage" height="460" cover>
          <!-- Тёмный градиент слева для читаемости текста -->
          <div
            class="h-100"
            :style="`background: linear-gradient(
              to right,
              rgba(0,0,0,.78) 0%,
              rgba(0,0,0,.50) 45%,
              rgba(0,0,0,.08) 80%,
              transparent 100%
            )`"
          >
            <v-container class="h-100">
              <v-row class="h-100" align="center">
                <v-col cols="12" md="6">
                  <div class="text-overline text-white mb-2" style="opacity:.75;letter-spacing:2px">
                    {{ slide.label }}
                  </div>
                  <h1
                    class="font-weight-bold text-white mb-4"
                    style="font-size:clamp(2rem,5vw,3rem);line-height:1.1;white-space:pre-line"
                  >
                    {{ slide.title }}
                  </h1>
                  <p class="text-body-1 text-white mb-6" style="opacity:.85;max-width:380px">
                    {{ slide.subtitle }}
                  </p>
                  <div class="d-flex align-center ga-3 flex-wrap">
                    <v-btn
                      :to="{ name: 'product-detail', params: { id: slide.productId } }"
                      color="white"
                      size="large"
                      rounded="pill"
                      style="color:#1d1d1f;font-weight:600;min-width:160px"
                    >
                      {{ formatPrice(slide.price) }} ₽
                    </v-btn>
                    <span class="text-caption text-white" style="opacity:.7">
                      {{ slide.condition }}
                    </span>
                  </div>
                </v-col>
              </v-row>
            </v-container>
          </div>
        </v-img>
      </v-carousel-item>
    </v-carousel>

    <!-- ──────────────────────────────────────────────────────
         Каталог товаров (grid из главы 5 пособия)
    ────────────────────────────────────────────────────────── -->
    <v-container class="py-8">

      <!-- Фильтр по категориям -->
      <div class="d-flex flex-wrap ga-2 mb-3">
        <v-chip
          v-for="cat in productsStore.categories"
          :key="cat"
          :color="productsStore.selectedCategory === cat ? 'primary' : undefined"
          :variant="productsStore.selectedCategory === cat ? 'flat' : 'tonal'"
          rounded="pill"
          size="small"
          style="cursor:pointer;font-weight:500"
          @click="productsStore.setCategory(cat)"
        >
          {{ cat }}
        </v-chip>
      </div>

      <p class="text-caption text-medium-emphasis mb-5">
        Найдено {{ productsStore.filteredProducts.length }} объявлений
      </p>

      <!-- Скелетоны загрузки -->
      <v-row v-if="productsStore.loading">
        <v-col v-for="n in 8" :key="n" cols="12" sm="6" md="4" lg="3">
          <v-skeleton-loader type="card" rounded="xl" />
        </v-col>
      </v-row>

      <!-- Сетка товаров -->
      <v-row v-else>
        <v-col
          v-for="product in productsStore.filteredProducts"
          :key="product.id"
          cols="12" sm="6" md="4" lg="3"
        >
          <ProductCard :product="product" />
        </v-col>

        <v-col v-if="!productsStore.filteredProducts.length" cols="12">
          <div class="text-center py-16">
            <v-icon size="64" color="grey-lighten-2">mdi-apple</v-icon>
            <p class="text-h6 text-medium-emphasis mt-4">
              Объявлений в этой категории пока нет
            </p>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useProductsStore } from '@/stores/products'
import ProductCard from '@/components/ProductCard.vue'

const productsStore = useProductsStore()

// Lifestyle-фото Apple продуктов с Unsplash — отлично смотрятся как full-bleed фон
const heroSlides = [
  {
    id: 1,
    label: 'iPhone · Новинка 2024',
    title: 'iPhone 15\nPro Max',
    subtitle: 'Титановый корпус. Чип A17 Pro. Камера 48 МП с оптическим зумом 5×.',
    bgImage: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=1400&q=85',
    price: 120000,
    condition: 'Новый',
    productId: 'demo-1',
  },
  {
    id: 2,
    label: 'Mac · Для профессионалов',
    title: 'MacBook Pro\n14" M3 Pro',
    subtitle: 'Чип M3 Pro с 12‑ядерным процессором. До 22 часов работы.',
    bgImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1400&q=85',
    price: 185000,
    condition: 'Б/У — отличное',
    productId: 'demo-2',
  },
  {
    id: 3,
    label: 'iPad · Твой рабочий инструмент',
    title: 'iPad Pro\n12.9" M2',
    subtitle: 'Жидкокристаллический дисплей ProMotion. Производительность Mac в твоих руках.',
    bgImage: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1400&q=85',
    price: 89000,
    condition: 'Б/У — хорошее',
    productId: 'demo-3',
  },
  {
    id: 4,
    label: 'Apple Watch · Будь готов к всему',
    title: 'Apple Watch\nUltra 2',
    subtitle: 'Самые мощные часы Apple. Титан. 60 часов автономной работы.',
    bgImage: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1400&q=85',
    price: 79000,
    condition: 'Б/У — отличное',
    productId: 'demo-4',
  },
  {
    id: 5,
    label: 'AirPods · Чистый звук',
    title: 'AirPods Pro 2\nUSB‑C',
    subtitle: 'Адаптивное шумоподавление. Пространственный звук с динамическим отслеживанием головы.',
    bgImage: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=1400&q=85',
    price: 24000,
    condition: 'Новый',
    productId: 'demo-5',
  },
]

function formatPrice(p) {
  return Number(p).toLocaleString('ru-RU')
}

onMounted(() => {
  productsStore.fetchProducts()
})
</script>
