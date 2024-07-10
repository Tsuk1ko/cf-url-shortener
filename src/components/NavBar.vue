<template>
  <div class="nav-bar">
    <v-btn
      v-tooltip:start="'GitHub'"
      density="compact"
      variant="text"
      icon="mdi-github"
      :size="32"
      @click="gotoGitHub"
    />
  </div>
</template>

<script setup lang="ts">
const gotoGitHub = () => {
  window.open('https://github.com/Tsuk1ko/cf-url-shortener', '_blank');
};
</script>

<style lang="scss" scoped>
.nav-bar {
  position: absolute;
  top: 8px;
  right: 8px;
}
</style>
