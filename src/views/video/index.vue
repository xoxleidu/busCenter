<template>
  <div class="index">
  <img src="../../assets/logo.png">
        <h1>{{ msg }}</h1>
  </div>
  
</template>

<script>

export default {
  name: 'Video',
  data () {
    return {
      msg: 'Welcome to Your BUS App'
    }
  },

  methods: {
  }
}
</script>
<style lang="css">
.index {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
