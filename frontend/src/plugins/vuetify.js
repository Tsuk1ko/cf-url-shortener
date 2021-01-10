import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import colors from 'vuetify/lib/util/colors';

Vue.use(Vuetify);

export default new Vuetify({
  // https://vuetifyjs.com/zh-Hans/features/theme/
  theme: {
    themes: {
      light: {
        primary: colors.lightBlue.base,
      },
    },
  },
});
