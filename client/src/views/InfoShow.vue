<template>
    <div class="home">
        <div class="container">
            <h1 class="title"> 登陆用户：{{user.name}}</h1>
            <p class="lead">身份：{{user.identity}}</p>           
        </div>
    </div>
</template>
<script> 
  export default {
    components: {
    },
    computed:{
        user(){
            return this.$store.getters.user
        }
    },
  }
</script>
<style scoped>
.home {
  width: 100%;
  height: 100%;
  background-image: linear-gradient(to right, rgba(42, 49, 112, 0), rgb(179, 13, 179));
  background-size: 100% 100%;
}
.container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding-top: 100px;
  background-color: rgba(0, 0, 0, 0.7);
  text-align: center;
  color: white;
}
.title {
  font-size: 30px;
}
.lead {
  margin-top: 50px;
  font-size: 22px;
}
</style>