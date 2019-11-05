<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import jwt_decode from 'jwt-decode';

export default {
  name: 'app',
  components: {},
  created() {
    if(localStorage.pantoken) {
      const decoded = jwt_decode(localStorage.pantoken)
      // 存储到vuex中
      this.$store.dispatch("setAuthenticated",!this.isEmpty(decoded))
      this.$store.dispatch("setUser",decoded)
    }
  },
  methods: {
      isEmpty(value) {
          return (
            value == undefined ||
            value == null ||
            (typeof value === "object" && Object.keys(value).length === 0) ||
            (typeof value === "string" && value.trim().length === 0)
          )
      }
    },
}
</script>
<style lang="scss">
html,
body,
#app {
  width: 100%;
  height: 100%;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
