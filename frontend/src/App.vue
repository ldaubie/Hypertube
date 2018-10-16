<template>
  <div id="app">
    <div class="ui active dimmer" v-if="load.data.loading">
      <div class="loader ui"></div>      
    </div>
    <my-header />
    <notifications />
    <router-view />
    <my-footer />
  </div>
</template>

<script>
  import myHeader from "./components/Header.vue"
  import myFooter from "./components/Footer.vue"
  import notifications from "./components/Notifications.vue"
  import load from "./services/Loading.js"
  export default {
    data() {
      return {
        load
      }
    },
    components: {
      myHeader,
      myFooter,
      notifications,
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }

  body {
    background-color: black;
  }

</style>