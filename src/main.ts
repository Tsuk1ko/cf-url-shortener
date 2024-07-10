import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
import { createApp } from 'vue';
import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import App from './App.vue';

createApp(App)
  .use(
    createVuetify({
      icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
          mdi,
        },
      },
    }),
  )
  .mount('#app');
