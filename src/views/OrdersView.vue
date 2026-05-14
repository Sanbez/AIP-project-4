<template>
  <!-- Страница заказов (глава 6 и 22 пособия) -->
  <v-container class="py-8" max-width="820">
    <h1 class="text-h5 font-weight-bold mb-6">Мои заказы</h1>

    <v-row v-if="ordersStore.loading">
      <v-col v-for="n in 3" :key="n" cols="12">
        <v-skeleton-loader type="list-item-avatar-three-line" rounded="xl" />
      </v-col>
    </v-row>

    <template v-else>
      <v-card
        v-for="order in ordersStore.orders"
        :key="order.id"
        rounded="xl"
        elevation="0"
        border
        class="mb-4"
        :style="order.done ? 'opacity:.6' : ''"
      >
        <v-row no-gutters align="center">
          <v-col cols="auto">
            <v-img
              :src="order.productImage"
              width="100"
              height="100"
              cover
              rounded="xl"
              class="ma-3"
            />
          </v-col>
          <v-col class="pa-3 pl-0">
            <div class="d-flex align-start justify-space-between flex-wrap ga-2">
              <div class="flex-grow-1">
                <p class="text-subtitle-2 font-weight-semibold">
                  {{ order.productTitle }}
                </p>
                <p class="text-h6 font-weight-bold text-primary mt-1">
                  {{ formatPrice(order.productPrice) }} ₽
                </p>
                <p class="text-caption text-medium-emphasis mt-1">
                  Продавец: {{ order.sellerName }}
                </p>
                <p class="text-caption text-medium-emphasis">
                  {{ formatDate(order.createdAt) }}
                </p>
                <p class="text-caption mt-1">
                  <v-icon size="12" class="mr-1">mdi-map-marker-outline</v-icon>
                  {{ order.buyerAddress }}
                </p>
              </div>
              <!-- Чекбокс "получен" (раздел 6.3 пособия) -->
              <v-checkbox
                :model-value="order.done"
                label="Получен"
                color="success"
                hide-details
                density="compact"
                @update:model-value="val => ordersStore.toggleDone(order.id, val)"
              />
            </div>
          </v-col>
        </v-row>
      </v-card>

      <!-- Пустое состояние -->
      <div v-if="!ordersStore.orders.length" class="text-center py-16">
        <v-icon size="72" color="grey-lighten-2">mdi-package-variant-closed</v-icon>
        <p class="text-h6 text-medium-emphasis mt-4">Заказов пока нет</p>
        <v-btn color="primary" :to="{ name: 'home' }" class="mt-4" rounded="lg">
          Перейти в каталог
        </v-btn>
      </div>
    </template>
  </v-container>
</template>

<script setup>
import { onMounted } from 'vue'
import { useOrdersStore } from '@/stores/orders'

const ordersStore = useOrdersStore()

onMounted(() => ordersStore.fetchOrders())

function formatPrice(p) {
  return Number(p).toLocaleString('ru-RU')
}

function formatDate(ts) {
  if (!ts) return ''
  const d = ts?.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}
</script>
