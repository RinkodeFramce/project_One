import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dialog from 'primevue/dialog'
import Toast from 'primevue/toast'
import Password from 'primevue/password'
import Menubar from 'primevue/menubar'
import Menu from 'primevue/menu'
import Tooltip from 'primevue/tooltip'
import App from './App.vue'
import router from './router'

// Import styles
import './assets/main.scss'

const app = createApp(App)

// Create Pinia instance
const pinia = createPinia()

// Use plugins
app.use(pinia as any)
app.use(router as any)
app.use(PrimeVue as any, {
  ripple: true,
  inputStyle: 'filled'
})
app.use(ToastService as any)

// Register PrimeVue components
app.component('Button', Button)
app.component('InputText', InputText)
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('Dialog', Dialog)
app.component('Toast', Toast)
app.component('Password', Password)
app.component('Menubar', Menubar)
app.component('Menu', Menu)

// Register directives
app.directive('tooltip', Tooltip as any)

app.mount('#app')
