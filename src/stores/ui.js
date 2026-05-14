import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
  const loading = ref(false)
  const snackbar = ref({ show: false, message: '', color: 'error' })

  function setLoading(val) {
    loading.value = val
  }

  function showError(message) {
    snackbar.value = { show: true, message, color: 'error' }
  }

  function showSuccess(message) {
    snackbar.value = { show: true, message, color: 'success' }
  }

  function hideSnackbar() {
    snackbar.value.show = false
  }

  return { loading, snackbar, setLoading, showError, showSuccess, hideSnackbar }
})
