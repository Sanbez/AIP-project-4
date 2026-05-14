<template>
  <!-- Страница создания объявления (глава 7 пособия) -->
  <v-container class="py-8" max-width="700">
    <h1 class="text-h5 font-weight-bold mb-1">Разместить объявление</h1>
    <p class="text-body-2 text-medium-emphasis mb-6">Продайте свою технику Apple</p>

    <v-card rounded="xl" elevation="0" border>
      <v-card-text class="pa-6 pa-sm-8">
        <v-form ref="formRef" @submit.prevent="submit">

          <!-- Загрузка фото (глава 18 пособия) -->
          <p class="text-caption font-weight-bold text-medium-emphasis mb-2 text-uppercase">
            Фото товара
          </p>
          <div
            class="upload-zone rounded-xl d-flex align-center justify-center flex-column"
            :class="{ 'upload-zone--active': imagePreview }"
            @click="fileInput.click()"
            @dragover.prevent
            @drop.prevent="onDrop"
          >
            <v-img
              v-if="imagePreview"
              :src="imagePreview"
              max-height="240"
              contain
            />
            <template v-else>
              <v-icon size="52" color="grey-lighten-2">mdi-image-plus-outline</v-icon>
              <p class="text-body-2 text-medium-emphasis mt-2">
                Нажмите или перетащите фото
              </p>
              <p class="text-caption text-disabled">JPG, PNG — до 5 МБ</p>
            </template>
          </div>
          <v-btn
            v-if="imagePreview"
            variant="text"
            color="error"
            size="small"
            class="mt-1 mb-4"
            prepend-icon="mdi-delete-outline"
            @click="clearImage"
          >
            Удалить фото
          </v-btn>
          <div v-else class="mb-5" />
          <input ref="fileInput" type="file" accept="image/*" hidden @change="onFileChange" />

          <!-- Название -->
          <v-text-field
            v-model="form.title"
            label="Название товара"
            placeholder="Например: iPhone 15 Pro 256GB Natural Titanium"
            variant="outlined"
            rounded="lg"
            :rules="[v => !!v || 'Введите название']"
            class="mb-4"
          />

          <!-- Категория и состояние -->
          <v-row>
            <v-col cols="12" sm="6">
              <v-select
                v-model="form.category"
                :items="categories"
                label="Категория"
                variant="outlined"
                rounded="lg"
                prepend-inner-icon="mdi-tag-outline"
                :rules="[v => !!v || 'Выберите категорию']"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-select
                v-model="form.condition"
                :items="conditions"
                label="Состояние"
                variant="outlined"
                rounded="lg"
                prepend-inner-icon="mdi-star-circle-outline"
                :rules="[v => !!v || 'Выберите состояние']"
              />
            </v-col>
          </v-row>

          <!-- Цена -->
          <v-text-field
            v-model="form.price"
            label="Цена"
            type="number"
            variant="outlined"
            rounded="lg"
            prepend-inner-icon="mdi-currency-rub"
            suffix="₽"
            :rules="[
              v => !!v || 'Введите цену',
              v => Number(v) > 0 || 'Цена должна быть больше 0',
            ]"
            class="mb-4"
          />

          <!-- Описание -->
          <v-textarea
            v-model="form.description"
            label="Описание"
            placeholder="Опишите состояние товара, комплектацию, причину продажи..."
            variant="outlined"
            rounded="lg"
            rows="4"
            :rules="[v => !!v || 'Добавьте описание']"
            class="mb-6"
          />

          <v-btn
            type="submit"
            color="primary"
            block
            size="x-large"
            rounded="lg"
            :loading="ui.loading"
            prepend-icon="mdi-check-circle-outline"
          >
            Опубликовать
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import { useUiStore } from '@/stores/ui'

const productsStore = useProductsStore()
const ui = useUiStore()
const router = useRouter()

const formRef = ref(null)
const fileInput = ref(null)
const imagePreview = ref(null)
const imageFile = ref(null)

const categories = ['iPhone', 'iPad', 'Mac', 'Watch', 'AirPods', 'Аксессуары']
const conditions = ['Новый', 'Б/У — отличное', 'Б/У — хорошее', 'Б/У — удовлетворительное']

const form = reactive({
  title: '',
  category: '',
  condition: '',
  price: '',
  description: '',
})

function onFileChange(e) {
  const file = e.target.files[0]
  if (file) setImageFile(file)
}

function onDrop(e) {
  const file = e.dataTransfer.files[0]
  if (file?.type.startsWith('image/')) setImageFile(file)
}

function setImageFile(file) {
  if (file.size > 5 * 1024 * 1024) {
    ui.showError('Файл слишком большой. Максимум 5 МБ.')
    return
  }
  imageFile.value = file
  imagePreview.value = URL.createObjectURL(file)
}

function clearImage() {
  imageFile.value = null
  imagePreview.value = null
  fileInput.value.value = ''
}

async function submit() {
  const { valid } = await formRef.value.validate()
  if (!valid) return
  const ok = await productsStore.createProduct({ ...form, imageFile: imageFile.value })
  if (ok) router.push({ name: 'my-listings' })
}
</script>

<style scoped>
.upload-zone {
  border: 2px dashed #d2d2d7;
  min-height: 180px;
  cursor: pointer;
  background: #fafafa;
  transition: border-color .2s, background .2s;
  margin-bottom: 8px;
}
.upload-zone:hover {
  border-color: #0071e3;
  background: #f0f7ff;
}
.upload-zone--active {
  border-style: solid;
  border-color: #0071e3;
  background: #fff;
  min-height: 260px;
}
</style>
