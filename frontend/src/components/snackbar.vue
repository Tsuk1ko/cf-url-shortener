<template>
  <v-snackbar v-model="isShow" v-bind="$attrs">{{ text }}</v-snackbar>
</template>

<script>
export default {
  name: 'snackbar',
  data: () => ({
    isShow: false,
    text: '',
  }),
  methods: {
    show(text) {
      this.text = text;
      this.isShow = true;
    },
  },
};
</script>
