<template>
  <!-- Страница моих объявлений (глава 8 пособия) -->
  <v-container class="py-8" max-width="900">
    <div class="d-flex align-center mb-6">
      <h1 class="text-h5 font-weight-bold">Мои объявления</h1>
      <v-spacer />
      <v-btn
        :to="{ name: 'new-product' }"
        color="primary"
        variant="flat"
        rounded="lg"
        prepend-icon="mdi-plus"
      >
        Добавить
      </v-btn>
    </div>

    <!-- Скелетоны -->
    <v-row v-if="productsStore.loading">
      <v-col v-for="n in 3" :key="n" cols="12">
        <v-skeleton-loader type="list-item-avatar-three-line" rounded="xl" />
      </v-col>
    </v-row>

    <template v-else>
      <v-card
        v-for="product in productsStore.myProducts"
        :key="product.id"
        rounded="xl"
        elevation="0"
        border
        class="mb-4"
      >
        <v-row no-gutters align="center">
          <v-col cols="12" sm="3">
            <v-img
              :src="product.imageUrl"
              height="130"
              contain
              rounded="xl"
              class="ma-3 bg-white"
            />
          </v-col>
          <v-col cols="12" sm="9" class="px-4 py-3 pl-sm-2">
            <div class="d-flex align-center ga-2 mb-2">
              <v-chip
                size="x-small"
                :color="conditionColor(product.condition)"
                variant="tonal"
                rounded="pill"
              >
                {{ product.condition }}
              </v-chip>
              <v-chip size="x-small" variant="tonal" rounded="pill">
                {{ product.category }}
              </v-chip>
            </div>
            <p class="text-subtitle-1 font-weight-semibold">{{ product.title }}</p>
            <p class="text-h6 font-weight-bold text-primary mt-1">
              {{ formatPrice(product.price) }} ₽
            </p>
            <div class="d-flex flex-wrap ga-2 mt-3">
              <v-btn
                size="small"
                variant="tonal"
                prepend-icon="mdi-eye-outline"
                rounded="lg"
                :to="{ name: 'product-detail', params: { id: product.id } }"
              >
                Просмотр
              </v-btn>
              <v-btn
                size="small"
                color="primary"
                variant="tonal"
                prepend-icon="mdi-pencil-outline"
                rounded="lg"
                @click="editingProduct = { ...product }"
              >
                Изменить
              </v-btn>
              <v-btn
                size="small"
                color="error"
                variant="tonal"
                prepend-icon="mdi-delete-outline"
                rounded="lg"
                @click="askDelete(product)"
              >
                Удалить
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-card>

      <!-- Пустое состояние -->
      <div v-if="!productsStore.myProducts.length" class="text-center py-16">
        <v-icon size="72" color="grey-lighten-2">mdi-tag-off-outline</v-icon>
        <p class="text-h6 text-medium-emphasis mt-4">У вас пока нет объявлений</p>
        <v-btn
          color="primary"
          :to="{ name: 'new-product' }"
          class="mt-4"
          rounded="lg"
          prepend-icon="mdi-plus"
        >
          Разместить первое
        </v-btn>
      </div>
    </template>

    <!-- Диалог редактирования (глава 19 пособия) -->
    <EditProductDialog
      v-if="editingProduct"
      :product="editingProduct"
      @close="editingProduct = null"
      @updated="onUpdated"
    />

    <!-- Диалог подтверждения удаления -->
    <v-dialog v-model="deleteDialog" max-width="380">
      <v-card rounded="xl">
        <v-card-title class="pa-6 pb-2 text-h6">Удалить объявление?</v-card-title>
        <v-card-text class="px-6">
          <strong>"{{ deletingProduct?.title }}"</strong> будет удалено без возможности
          восстановления.
        </v-card-text>
        <v-card-actions class="pa-6 pt-2">
          <v-spacer />
          <v-btn variant="text" @click="deleteDialog = false">Отмена</v-btn>
          <v-btn
            color="error"
            variant="flat"
            rounded="lg"
            :loading="ui.loading"
            @click="doDelete"
          >
            Удалить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useProductsStore } from '@/stores/products'
import { useUiStore } from '@/stores/ui'
import EditProductDialog from '@/components/EditProductDialog.vue'

const productsStore = useProductsStore()
const ui = useUiStore()

const editingProduct = ref(null)
const deleteDialog = ref(false)
const deletingProduct = ref(null)

onMounted(() => productsStore.fetchMyProducts())

function askDelete(product) {
  deletingProduct.value = product
  deleteDialog.value = true
}

async function doDelete() {
  await productsStore.deleteProduct(deletingProduct.value.id)
  deleteDialog.value = false
  deletingProduct.value = null
}

function onUpdated() {
  editingProduct.value = null
  productsStore.fetchMyProducts()
}

function formatPrice(p) {
  return Number(p).toLocaleString('ru-RU')
}

function conditionColor(c) {
  if (c === 'Новый') return 'success'
  if (c?.includes('отличное')) return 'primary'
  if (c?.includes('хорошее')) return 'warning'
  return 'default'
}
</script>
