<template>
  <v-app>
    <headerComponent></headerComponent>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import headerComponent from '@/components/headerComponent.vue'
export default {
  components:[
  headerComponent
  ]
}
</script>