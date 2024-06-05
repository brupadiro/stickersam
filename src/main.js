/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'
import * as cv from 'opencv.js'
// Composables
import { createApp } from 'vue'
import './styles/style.scss' // Importa los estilos globales

const app = createApp(App)
app.config.globalProperties.$cv = cv

registerPlugins(app)

app.mount('#app')
