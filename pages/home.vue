<template>
  <div class="wiki-home">
    <section1/>
    <section2/>
  </div>
</template>

<script>
import { defineComponent, onMounted } from 'vue'

import section1 from './home/section1'
import section2 from './home/section2'


export default defineComponent({
  components: {
    section1,
    section2
  },
  setup() {
    useHead({
      title: 'yangoogle'
    })
    onMounted(() => {
    })
    
    return {
    }
  }
})

</script>

<style lang="scss">
.wiki-home {
  position: relative;
  width: 100%;
  overflow-x: hidden;
  .section {
    height: 100vh;
  }
}
</style>