<template>
  <!-- Диалог редактирования объявления (глава 19 пособия) -->
  <v-dialog model-value max-width="580" @update:model-value="$emit('close')">
    <v-card rounded="xl">
      <v-card-title class="pa-6 pb-3 d-flex align-center">
        <span class="text-h6 font-weight-bold">Редактировать объявление</span>
        <v-spacer />
        <v-btn icon="mdi-close" variant="text" size="small" @click="$emit('close')" />
      </v-card-title>

      <v-card-text class="px-6 pb-6">
        <v-form ref="formRef" @submit.prevent="submit">
          <v-text-field
            v-model="form.title"
            label="Название"
            variant="outlined"
            rounded="lg"
            :rules="[v => !!v || 'Введите название']"
            class="mb-3"
          />
          <v-row>
            <v-col cols="12" sm="6">
              <v-select
                v-model="form.category"
                :items="categories"
                label="Категория"
                variant="outlined"
                rounded="lg"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-select
                v-model="form.condition"
                :items="conditions"
                label="Состояние"
                variant="outlined"
                rounded="lg"
              />
            </v-col>
          </v-row>
          <v-text-field
            v-model="form.price"
            label="Цена"
            type="number"
            variant="outlined"
            rounded="lg"
            suffix="₽"
            :rules="[v => !!v || 'Введите цену']"
            class="mb-3"
          />
          <v-textarea
            v-model="form.description"
            label="Описание"
            variant="outlined"
            rounded="lg"
            rows="4"
            class="mb-5"
          />
          <div class="d-flex ga-3">
            <v-btn
              variant="tonal"
              rounded="lg"
              style="flex:1"
              @click="$emit('close')"
            >
              Отмена
            </v-btn>
            <v-btn
              type="submit"
              color="primary"
              variant="flat"
              rounded="lg"
              style="flex:1"
              :loading="ui.loading"
            >
              Сохранить
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useProductsStore } from '@/stores/products'
import { useUiStore } from '@/stores/ui'

const props = defineProps({
  product: { type: Object, required: true },
})
const emit = defineEmits(['close', 'updated'])

const productsStore = useProductsStore()
const ui = useUiStore()

const categories = ['iPhone', 'iPad', 'Mac', 'Watch', 'AirPods', 'Аксессуары']
const conditions = ['Новый', 'Б/У — отличное', 'Б/У — хорошее', 'Б/У — удовлетворительное']

const formRef = ref(null)
const form = reactive({
  title: props.product.title,
  category: props.product.category,
  condition: props.product.condition,
  price: props.product.price,
  description: props.product.description,
})

async function submit() {
  const { valid } = await formRef.value.validate()
  if (!valid) return
  const ok = await productsStore.updateProduct(props.product.id, form)
  if (ok) emit('updated')
}
</script>
