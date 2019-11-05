<template>
  <div class="index">
    <head-nav></head-nav>
    <left-meau></left-meau>
    <div class="rightContainer">
      <router-view></router-view>
    </div> 
  </div>
</template>

<script>
import HeadNav from '../components/HeadNav'
import leftMeau from '../components/leftMeau'
export default {
  name: 'index',
  components: {
    HeadNav,
    leftMeau
  }
}
</script>
<style scoped>
.index{
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.rightContainer{
  position: relative;
  top:0;
  left: 180px;
  width: calc(100% - 180px);
  height: calc(100% - 71px);
  overflow: auto;
}
</style>

