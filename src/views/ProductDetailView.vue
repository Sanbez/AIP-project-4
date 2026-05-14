<template>
  <!-- Детальный просмотр объявления (глава 9 пособия) -->
  <v-container class="py-8" max-width="960">
    <v-btn
      variant="text"
      prepend-icon="mdi-arrow-left"
      class="mb-5"
      rounded="lg"
      @click="$router.back()"
    >
      Назад
    </v-btn>

    <!-- Скелетоны загрузки -->
    <v-row v-if="productsStore.loading">
      <v-col cols="12" md="6">
        <v-skeleton-loader type="image" height="400" rounded="xl" />
      </v-col>
      <v-col cols="12" md="6">
        <v-skeleton-loader type="article" />
      </v-col>
    </v-row>

    <v-row v-else-if="product">
      <!-- Фото -->
      <v-col cols="12" md="6">
        <v-card rounded="xl" elevation="0" border style="background:#f5f5f7">
          <v-img :src="product.imageUrl" height="420" contain class="pa-6">
            <template #placeholder>
              <div class="d-flex align-center justify-center h-100">
                <v-progress-circular indeterminate color="grey-lighten-3" size="48" />
              </div>
            </template>
            <template #error>
              <div class="d-flex align-center justify-center h-100 flex-column ga-3">
                <v-icon size="72" color="grey-lighten-2">mdi-apple</v-icon>
                <span class="text-body-2 text-disabled">Фото недоступно</span>
              </div>
            </template>
          </v-img>
        </v-card>
      </v-col>

      <!-- Информация -->
      <v-col cols="12" md="6">
        <!-- Теги -->
        <div class="d-flex align-center ga-2 mb-4">
          <v-chip size="small" variant="tonal" rounded="pill">
            {{ product.category }}
          </v-chip>
          <v-chip
            size="small"
            :color="conditionColor(product.condition)"
            variant="tonal"
            rounded="pill"
          >
            {{ product.condition }}
          </v-chip>
        </div>

        <h1 class="text-h5 font-weight-bold mb-3" style="line-height:1.3">
          {{ product.title }}
        </h1>

        <div class="text-h4 font-weight-bold text-primary mb-5">
          {{ formatPrice(product.price) }} ₽
        </div>

        <!-- Продавец -->
        <v-card rounded="lg" elevation="0" color="grey-lighten-5" class="mb-5">
          <v-card-text class="d-flex align-center ga-3 pa-4">
            <v-avatar color="primary" size="40">
              <span class="text-body-2 text-white font-weight-bold">
                {{ product.sellerName?.charAt(0)?.toUpperCase() }}
              </span>
            </v-avatar>
            <div>
              <p class="text-caption text-medium-emphasis">Продавец</p>
              <p class="text-body-1 font-weight-medium">{{ product.sellerName }}</p>
            </div>
          </v-card-text>
        </v-card>

        <!-- Описание -->
        <p class="text-body-1 mb-6" style="white-space:pre-line;line-height:1.8;color:#1d1d1f">
          {{ product.description }}
        </p>

        <!-- Кнопки действий -->
        <div class="d-flex flex-column ga-3">
          <v-btn
            v-if="!isOwner && auth.isLoggedIn"
            color="primary"
            size="x-large"
            rounded="lg"
            block
            prepend-icon="mdi-lightning-bolt"
            @click="buyDialog = true"
          >
            Купить сейчас
          </v-btn>
          <v-btn
            v-if="!auth.isLoggedIn"
            color="primary"
            size="x-large"
            rounded="lg"
            block
            :to="{ name: 'login' }"
          >
            Войдите, чтобы купить
          </v-btn>
          <v-btn
            v-if="isOwner"
            color="primary"
            variant="tonal"
            size="large"
            rounded="lg"
            block
            prepend-icon="mdi-pencil-outline"
            @click="editDialog = true"
          >
            Редактировать объявление
          </v-btn>
          <v-btn
            v-if="!isOwner"
            variant="tonal"
            size="large"
            rounded="lg"
            block
            prepend-icon="mdi-share-variant-outline"
            @click="share"
          >
            Поделиться
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Не найдено -->
    <div v-else class="text-center py-16">
      <v-icon size="72" color="grey-lighten-2">mdi-alert-circle-outline</v-icon>
      <p class="text-h6 text-medium-emphasis mt-4">Объявление не найдено</p>
      <v-btn :to="{ name: 'home' }" class="mt-4" rounded="lg">На главную</v-btn>
    </div>

    <!-- Модальное окно покупки (глава 21 пособия) -->
    <BuyDialog
      v-if="product && buyDialog"
      :product="product"
      @close="buyDialog = false"
    />

    <!-- Диалог редактирования (глава 19 пособия) -->
    <EditProductDialog
      v-if="product && editDialog && isOwner"
      :product="{ ...product }"
      @close="editDialog = false"
      @updated="onUpdated"
    />
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import { useAuthStore } from '@/stores/auth'
import BuyDialog from '@/components/BuyDialog.vue'
import EditProductDialog from '@/components/EditProductDialog.vue'

const route = useRoute()
const productsStore = useProductsStore()
const auth = useAuthStore()

const buyDialog = ref(false)
const editDialog = ref(false)

const product = computed(() => productsStore.currentProduct)
const isOwner = computed(() =>
  auth.user && product.value?.sellerId === auth.user.uid,
)

onMounted(() => productsStore.fetchProduct(route.params.id))

function formatPrice(p) {
  return Number(p).toLocaleString('ru-RU')
}

function conditionColor(c) {
  if (c === 'Новый') return 'success'
  if (c?.includes('отличное')) return 'primary'
  if (c?.includes('хорошее')) return 'warning'
  return 'default'
}

function share() {
  if (navigator.share) {
    navigator.share({ title: product.value.title, url: window.location.href })
  } else {
    navigator.clipboard.writeText(window.location.href)
  }
}

function onUpdated() {
  editDialog.value = false
  productsStore.fetchProduct(route.params.id)
}
</script>
