<template>
  <div id="app">
    <GooglePhotos thumnailWidth="200" thumnailHeight="200" @upload="getPhoto"/>
  </div>
</template>

<script>
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import GooglePhotos from './components/google-photos/GooglePhotos.vue'
Vue.use(BootstrapVue);

export default {
  name: 'App',
  components: {
    GooglePhotos
  },
  methods: {
    getPhoto(src){
      console.log(src);
    },
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
