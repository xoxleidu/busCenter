<template>
  <div class="m-part">
        <mapBusLine @drag="dragMap" class="mapboxli"></mapBusLine>
  </div>
  
</template>

<script>


import mapBusLine from '../../components/Map/mapBusLine'

export default {
  name: 'Dashboard',
  components: {
    mapBusLine
  },
  data () {
    return {
    }
  },

  methods: {
  }
}


</script>

<style lang="css">
  .m-part{ margin-bottom: 30px; }
</style>
