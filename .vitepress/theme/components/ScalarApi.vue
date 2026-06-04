<script setup>
import { ApiReference } from '@scalar/api-reference'
import '@scalar/api-reference/style.css'
</script>

<template>
  <div class="scalar-container">
    <ApiReference
      :configuration="{
        spec: {
          url: '/billmora-api-v1.json',
        },
        theme: 'default',
        showSidebar: true,
        darkMode: true,
      }"
    />
  </div>
</template>