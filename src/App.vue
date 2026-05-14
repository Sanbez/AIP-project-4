<template>
  <v-app>
    <v-snackbar
      v-model="ui.snackbar.show"
      :color="ui.snackbar.color"
      timeout="4000"
      location="bottom"
      rounded="lg"
    >
      {{ ui.snackbar.message }}
      <template #actions>
        <v-btn variant="text" @click="ui.hideSnackbar">✕</v-btn>
      </template>
    </v-snackbar>

    <v-app-bar flat color="white" border="b" height="56">
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-app-bar-title>
        <router-link to="/" style="text-decoration:none;color:inherit">
          <span style="font-weight:700;letter-spacing:-0.5px;color:#1d1d1f"> Apple</span>
          <span style="color:#0071e3;font-weight:700"> Marketplace</span>
        </router-link>
      </v-app-bar-title>
      <v-spacer />

      <template v-if="!auth.isLoggedIn">
        <v-btn :to="{ name: 'login' }" variant="text" size="small">Войти</v-btn>
        <v-btn
          :to="{ name: 'register' }"
          color="primary"
          variant="flat"
          size="small"
          rounded="lg"
          class="mr-2"
        >
          Регистрация
        </v-btn>
      </template>

      <template v-else>
        <v-btn
          :to="{ name: 'new-product' }"
          color="primary"
          variant="flat"
          size="small"
          rounded="lg"
          prepend-icon="mdi-plus"
          class="mr-1"
        >
          Продать
        </v-btn>
        <v-menu>
          <template #activator="{ props }">
            <v-btn v-bind="props" icon class="mr-2">
              <v-avatar color="primary" size="32">
                <span class="text-caption text-white font-weight-bold">
                  {{ auth.user?.displayName?.charAt(0)?.toUpperCase() || 'U' }}
                </span>
              </v-avatar>
            </v-btn>
          </template>
          <v-list density="compact" nav min-width="200" rounded="xl" elevation="4">
            <v-list-item
              :title="auth.user?.displayName || 'Профиль'"
              :subtitle="auth.user?.email"
              prepend-icon="mdi-account-circle-outline"
            />
            <v-divider class="my-1" />
            <v-list-item
              title="Мои объявления"
              prepend-icon="mdi-format-list-bulleted"
              :to="{ name: 'my-listings' }"
              rounded="lg"
            />
            <v-list-item
              title="Мои заказы"
              prepend-icon="mdi-package-variant-closed"
              :to="{ name: 'orders' }"
              rounded="lg"
            />
            <v-divider class="my-1" />
            <v-list-item
              title="Выйти"
              prepend-icon="mdi-logout"
              rounded="lg"
              @click="auth.logout"
            />
          </v-list>
        </v-menu>
      </template>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" temporary width="280">
      <v-list-item
        prepend-icon="mdi-apple"
        title="Apple Marketplace"
        subtitle="Техника Apple"
        nav
        class="py-4"
      />
      <v-divider />
      <v-list nav density="compact" class="pt-2">
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :prepend-icon="item.icon"
          :title="item.title"
          :to="item.to"
          rounded="lg"
        />
      </v-list>
      <template #append>
        <v-divider />
        <v-list nav density="compact" class="pb-2">
          <v-list-item
            v-if="auth.isLoggedIn"
            prepend-icon="mdi-logout"
            title="Выйти"
            rounded="lg"
            @click="auth.logout"
          />
          <v-list-item
            v-else
            prepend-icon="mdi-login"
            title="Войти"
            :to="{ name: 'login' }"
            rounded="lg"
          />
        </v-list>
      </template>
    </v-navigation-drawer>

    <v-progress-linear
      v-if="ui.loading"
      indeterminate
      color="primary"
      height="3"
      style="position:fixed;top:56px;left:0;right:0;z-index:1000"
    />

    <v-main style="background:#f5f5f7;min-height:100vh">
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'

const auth = useAuthStore()
const ui = useUiStore()
const drawer = ref(false)

// Инициализация сессии (глава 16 — guard маршрутов + восстановление сессии)
onMounted(() => auth.init())

const menuItems = computed(() => {
  const base = [{ title: 'Главная', icon: 'mdi-home', to: '/' }]
  if (auth.isLoggedIn) {
    return [
      ...base,
      { title: 'Разместить объявление', icon: 'mdi-plus-circle-outline', to: '/new-product' },
      { title: 'Мои объявления', icon: 'mdi-format-list-bulleted', to: '/my-listings' },
      { title: 'Мои заказы', icon: 'mdi-package-variant-closed', to: '/orders' },
    ]
  }
  return [
    ...base,
    { title: 'Войти', icon: 'mdi-login', to: '/login' },
    { title: 'Регистрация', icon: 'mdi-account-plus-outline', to: '/register' },
  ]
})
</script>
