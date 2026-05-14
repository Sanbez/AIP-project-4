<template>
  <!-- Модальное окно покупки (глава 21 пособия) -->
  <v-dialog model-value max-width="500" @update:model-value="$emit('close')">
    <v-card rounded="xl">
      <v-card-title class="pa-6 pb-3 d-flex align-center">
        <span class="text-h6 font-weight-bold">Оформить заказ</span>
        <v-spacer />
        <v-btn icon="mdi-close" variant="text" size="small" @click="$emit('close')" />
      </v-card-title>

      <!-- Сводка товара -->
      <v-card-text class="px-6 py-0">
        <v-card rounded="lg" elevation="0" color="grey-lighten-5" class="mb-5">
          <v-card-text class="d-flex align-center ga-3 pa-3">
            <v-img
              :src="product.imageUrl"
              width="64"
              height="64"
              cover
              rounded="lg"
              class="flex-shrink-0"
            />
            <div class="flex-grow-1 min-width-0">
              <p
                class="text-body-2 font-weight-semibold"
                style="overflow:hidden;white-space:nowrap;text-overflow:ellipsis"
              >
                {{ product.title }}
              </p>
              <p class="text-subtitle-1 font-weight-bold text-primary mt-1">
                {{ formatPrice(product.price) }} ₽
              </p>
            </div>
          </v-card-text>
        </v-card>

        <v-form ref="formRef" @submit.prevent="submit">
          <v-text-field
            v-model="form.buyerName"
            label="Ваше имя"
            prepend-inner-icon="mdi-account-outline"
            variant="outlined"
            rounded="lg"
            :rules="[v => !!v || 'Введите имя']"
            class="mb-3"
          />
          <v-text-field
            v-model="form.buyerPhone"
            label="Номер телефона"
            type="tel"
            prepend-inner-icon="mdi-phone-outline"
            variant="outlined"
            rounded="lg"
            :rules="[v => !!v || 'Введите номер']"
            class="mb-3"
          />
          <v-text-field
            v-model="form.buyerAddress"
            label="Адрес доставки"
            prepend-inner-icon="mdi-map-marker-outline"
            variant="outlined"
            rounded="lg"
            :rules="[v => !!v || 'Введите адрес']"
            class="mb-5"
          />
          <v-btn
            type="submit"
            color="primary"
            block
            size="large"
            rounded="lg"
            :loading="ui.loading"
            prepend-icon="mdi-check-circle-outline"
          >
            Подтвердить заказ
          </v-btn>
        </v-form>
      </v-card-text>
      <div class="pa-6 pt-4" />
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useOrdersStore } from '@/stores/orders'
import { useUiStore } from '@/stores/ui'

const props = defineProps({
  product: { type: Object, required: true },
})
const emit = defineEmits(['close'])

const ordersStore = useOrdersStore()
const ui = useUiStore()

const formRef = ref(null)
const form = reactive({ buyerName: '', buyerPhone: '', buyerAddress: '' })

async function submit() {
  const { valid } = await formRef.value.validate()
  if (!valid) return
  const ok = await ordersStore.createOrder({ product: props.product, ...form })
  if (ok) emit('close')
}

function formatPrice(p) {
  return Number(p).toLocaleString('ru-RU')
}
</script>
