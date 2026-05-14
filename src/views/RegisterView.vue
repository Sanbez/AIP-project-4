<template>
  <!-- Страница регистрации (глава 4 пособия) -->
  <v-container
    class="d-flex align-center justify-center"
    style="min-height:calc(100vh - 56px)"
  >
    <v-card width="440" rounded="xl" elevation="0" border>
      <v-card-text class="pa-8">
        <div class="text-center mb-8">
          <v-icon size="44" color="primary" class="mb-3">mdi-apple</v-icon>
          <h2 class="text-h5 font-weight-bold">Создать аккаунт</h2>
          <p class="text-body-2 text-medium-emphasis mt-1">
            Начните продавать технику Apple
          </p>
        </div>

        <!-- lazy-validation (раздел 4.3 пособия) -->
        <v-form ref="formRef" lazy-validation @submit.prevent="submit">
          <v-text-field
            v-model="form.name"
            label="Ваше имя"
            prepend-inner-icon="mdi-account-outline"
            variant="outlined"
            rounded="lg"
            :rules="nameRules"
            class="mb-3"
          />
          <v-text-field
            v-model="form.email"
            label="Email"
            type="email"
            prepend-inner-icon="mdi-email-outline"
            variant="outlined"
            rounded="lg"
            :rules="emailRules"
            class="mb-3"
          />
          <v-text-field
            v-model="form.password"
            label="Пароль"
            :type="showPass ? 'text' : 'password'"
            prepend-inner-icon="mdi-lock-outline"
            :append-inner-icon="showPass ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
            @click:append-inner="showPass = !showPass"
            variant="outlined"
            rounded="lg"
            :rules="passwordRules"
            class="mb-3"
          />
          <!-- Confirm Password (раздел 4.2 пособия) -->
          <v-text-field
            v-model="form.confirmPassword"
            label="Подтвердите пароль"
            :type="showPass ? 'text' : 'password'"
            prepend-inner-icon="mdi-lock-check-outline"
            variant="outlined"
            rounded="lg"
            :rules="confirmRules"
            class="mb-6"
          />
          <v-btn
            type="submit"
            color="primary"
            block
            size="large"
            rounded="lg"
            :loading="ui.loading"
          >
            Зарегистрироваться
          </v-btn>
        </v-form>

        <div class="text-center mt-5">
          <span class="text-body-2 text-medium-emphasis">Уже есть аккаунт?</span>
          <v-btn :to="{ name: 'login' }" variant="text" color="primary" size="small">
            Войти
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'

const auth = useAuthStore()
const ui = useUiStore()

const formRef = ref(null)
const showPass = ref(false)
const form = reactive({ name: '', email: '', password: '', confirmPassword: '' })

const nameRules = [v => !!v || 'Введите ваше имя']
const emailRules = [
  v => !!v || 'Email обязателен',
  v => /.+@.+\..+/.test(v) || 'Введите корректный email',
]
const passwordRules = [
  v => !!v || 'Пароль обязателен',
  v => v.length >= 6 || 'Минимум 6 символов',
]
const confirmRules = [
  v => !!v || 'Подтвердите пароль',
  v => v === form.password || 'Пароли не совпадают',
]

async function submit() {
  const { valid } = await formRef.value.validate()
  if (!valid) return
  await auth.register(form)
}
</script>
