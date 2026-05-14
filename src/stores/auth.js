import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/api'
import { useUiStore } from './ui'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isLoggedIn = computed(() => !!user.value)

  function init() {
    const token = localStorage.getItem('token')
    if (!token) return
    api.me()
      .then(u => { user.value = { uid: u.id, email: u.email, displayName: u.name } })
      .catch(() => localStorage.removeItem('token'))
  }

  async function register({ name, email, password }) {
    const ui = useUiStore()
    ui.setLoading(true)
    try {
      const { token, user: u } = await api.register({ name, email, password })
      localStorage.setItem('token', token)
      user.value = { uid: u.id, email: u.email, displayName: u.name }
      ui.showSuccess('Аккаунт создан! Добро пожаловать.')
      const redirect = router.currentRoute.value.query.redirect || '/'
      router.push(redirect)
    } catch (err) {
      ui.showError(err.message)
    } finally {
      ui.setLoading(false)
    }
  }

  async function login({ email, password }) {
    const ui = useUiStore()
    ui.setLoading(true)
    try {
      const { token, user: u } = await api.login({ email, password })
      localStorage.setItem('token', token)
      user.value = { uid: u.id, email: u.email, displayName: u.name }
      const redirect = router.currentRoute.value.query.redirect || '/'
      router.push(redirect)
    } catch (err) {
      ui.showError(err.message)
    } finally {
      ui.setLoading(false)
    }
  }

  async function logout() {
    localStorage.removeItem('token')
    user.value = null
    router.push('/')
  }

  return { user, isLoggedIn, init, register, login, logout }
})
