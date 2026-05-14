import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import 'vuetify/styles'

export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#0071e3',
          secondary: '#6e6e73',
          background: '#f5f5f7',
          surface: '#ffffff',
          error: '#ff3b30',
          success: '#34c759',
          warning: '#ff9f0a',
        },
      },
    },
  },
  defaults: {
    VBtn: { style: 'text-transform: none; letter-spacing: 0;' },
    VCard: { rounded: 'xl' },
  },
})
