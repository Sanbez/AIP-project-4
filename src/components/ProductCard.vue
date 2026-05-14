<template>
  <v-card
    rounded="xl"
    elevation="0"
    border
    hover
    :to="{ name: 'product-detail', params: { id: product.id } }"
    style="text-decoration:none;height:100%;display:flex;flex-direction:column"
  >
    <!-- Фото товара на фоне Apple Light Gray #f5f5f7 -->
    <div style="background:#f5f5f7;border-radius:20px 20px 0 0;overflow:hidden;position:relative">
      <v-img
        :src="product.imageUrl"
        height="200"
        contain
        class="pa-3"
      >
        <template #placeholder>
          <div class="d-flex align-center justify-center h-100">
            <v-progress-circular indeterminate color="grey-lighten-3" size="32" />
          </div>
        </template>
        <template #error>
          <div class="d-flex align-center justify-center h-100 flex-column ga-2">
            <v-icon size="40" color="grey-lighten-2">mdi-apple</v-icon>
            <span class="text-caption text-disabled">{{ product.category }}</span>
          </div>
        </template>
      </v-img>

      <!-- Бейдж состояния -->
      <div style="position:absolute;top:10px;left:10px">
        <v-chip
          size="x-small"
          :color="conditionColor(product.condition)"
          variant="flat"
          rounded="pill"
          style="font-weight:600;font-size:10px"
        >
          {{ product.condition }}
        </v-chip>
      </div>
    </div>

    <v-card-text class="pa-4" style="flex:1">
      <p class="text-caption text-medium-emphasis mb-1 text-uppercase" style="letter-spacing:.6px">
        {{ product.category }}
      </p>
      <p
        class="text-body-2 font-weight-semibold mb-3"
        style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;line-height:1.45"
      >
        {{ product.title }}
      </p>
      <div class="d-flex align-center justify-space-between">
        <span class="text-subtitle-1 font-weight-bold" style="color:#0071e3">
          {{ formatPrice(product.price) }} ₽
        </span>
        <span class="text-caption text-medium-emphasis">{{ product.sellerName }}</span>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
defineProps({
  product: { type: Object, required: true },
})

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
