<template>
  <div id="url-input">
    <v-text-field
      ref="textFieldRef"
      v-model="url"
      :rules="[urlRule]"
      :disabled="loading"
      :density="xs ? 'compact' : 'default'"
      type="url"
      placeholder="http(s)://"
      autocomplete="off"
      validate-on="blur"
      rounded
      clearable
      @keypress.enter="shortenUrl"
    >
      <template #append>
        <v-btn
          color="light-blue"
          :loading="loading"
          :disabled="canNotShorten"
          :size="xs ? undefined : 'x-large'"
          rounded
          variant="flat"
          @click="shortenUrl"
          >shorten</v-btn
        >
      </template>
    </v-text-field>
  </div>
  <div id="shorten-result" :class="{ 'no-result': !shortenedUrl }">
    <v-text-field
      :value="shortenedUrl"
      type="text"
      readonly
      density="comfortable"
      variant="underlined"
      append-icon="mdi-content-copy"
      @click:append="copyResult"
      @focus="onShortResultFocus"
    >
    </v-text-field>
    <v-tooltip activator="#shorten-result .v-input__append .v-icon" location="end">
      <span>{{ showCopiedTooltip ? (copySuccess ? 'Copied' : 'Copy failed') : 'Copy' }}</span>
    </v-tooltip>
  </div>
  <v-snackbar v-model="snackbarOpen">
    {{ snackbarText }}
  </v-snackbar>
</template>

<script setup lang="ts">
import { copyText } from '@/utils/clipboard';
import type { ShortenRes } from 'types/shorten';
import { computed, ref, watch } from 'vue';
import { useDisplay } from 'vuetify';
import type { VTextField } from 'vuetify/components';

const urlReg = /^https?:\/\/[\w_-]+(\.[\w_-]+)*[!-~]*$|^$/;

let lastUrl = '';
let copiedTooltipTimeout: number | null = null;

const { xs } = useDisplay();

watch(
  xs,
  val => {
    console.log('xs', val);
  },
  { immediate: true },
);

const textFieldRef = ref<InstanceType<typeof VTextField>>();

const loading = ref(false);
const url = ref('');
const shortenedUrl = ref('');
const showCopiedTooltip = ref(false);
const copySuccess = ref(true);

const trimmedUrl = computed(() => (url.value || '').trim());
const isUrlValid = computed(() => urlReg.test(trimmedUrl.value));
const canNotShorten = computed(() => loading.value || !trimmedUrl.value || !isUrlValid.value);

const urlRule = () => isUrlValid.value || 'Not a valid URL';

const shortenUrl = async () => {
  const curUrl = trimmedUrl.value;
  if (canNotShorten.value || curUrl === lastUrl) return;
  shortenedUrl.value = '';
  loading.value = true;
  try {
    const { code, msg, url }: ShortenRes = await fetch('/shorten', {
      method: 'POST',
      body: JSON.stringify({ url: curUrl }),
      headers: { 'content-type': 'application/json' },
    }).then(r => r.json());
    if (code === 0) {
      shortenedUrl.value = url!;
      lastUrl = curUrl;
    } else throw new Error(msg);
  } catch (error) {
    openSnackbar(String(error));
  } finally {
    loading.value = false;
  }
};

const copyResult = async () => {
  copySuccess.value = await copyText(shortenedUrl.value);
  showCopiedTooltip.value = true;
  if (copiedTooltipTimeout) clearTimeout(copiedTooltipTimeout);
  copiedTooltipTimeout = setTimeout(() => {
    showCopiedTooltip.value = false;
    copiedTooltipTimeout = null;
  }, 3000);
};

const onShortResultFocus = () => {
  const $input = textFieldRef.value;
  if (!$input) return;
  $input.selectionStart = 0;
  $input.selectionEnd = $input.value.length;
};

const snackbarOpen = ref(false);
const snackbarText = ref('');

const openSnackbar = (text: string) => {
  snackbarText.value = text;
  snackbarOpen.value = true;
};
</script>

<style lang="scss" scoped>
.v-input--density {
  &-default {
    --border-radius: 28px;
  }
  &-compact {
    --border-radius: 20px;
  }
}

#url-input {
  width: 100%;
  max-width: 800px;
  :deep(.v-field) {
    border-radius: var(--border-radius) 0 0 var(--border-radius);
  }
  :deep(.v-field__outline) {
    display: none;
  }
  :deep(.v-input__append) {
    margin: 0;
    padding: 0;
    .v-btn {
      border-radius: 0 var(--border-radius) var(--border-radius) 0;
      height: 100%;
      transition: all 0.3s;
      letter-spacing: normal;
    }
  }
}

#shorten-result {
  width: 100%;
  max-width: 300px;
  &.no-result {
    opacity: 0;
    pointer-events: none;
  }
  .v-input {
    input {
      text-align: center;
    }
  }
}
</style>
