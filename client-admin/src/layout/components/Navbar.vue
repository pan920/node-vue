<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <!-- <div class="right-menu-item hover-effect">meet you:{{countDownList}}</div> -->
        <search id="header-search" class="right-menu-item" />

        <error-log class="errLog-container right-menu-item hover-effect" />

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <el-tooltip content="Global Size" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>

      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/profile/index">
            <el-dropdown-item>个人中心</el-dropdown-item>
          </router-link>
          <router-link to="/">
            <el-dropdown-item>首页</el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://github.com/pan920/node-vue">
            <el-dropdown-item>Github</el-dropdown-item>
          </a>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import Search from '@/components/HeaderSearch'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    Search
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device'
    ])
  },
  data() {
　　return {
　　　　countDownList: '00天00时00分00秒',
　　　　actEndTime: '2019-12-27 18:00:00'
　　};
　},
  created() {
// 　　 this.countDown();
　},
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    timeFormat(param) {
　　　　　　return param < 10 ? '0' + param : param;
　　　　},
　　　　countDown(it) {
　　　　　　var interval = setInterval(() => {
　　　　　　　　// 获取当前时间，同时得到活动结束时间数组
　　　　　　　　let newTime = new Date().getTime();
　　　　　　　　// 对结束时间进行处理渲染到页面
　　　　　　　　let endTime = new Date(this.actEndTime).getTime();
　　　　　　　　let obj = null;
　　　　　　　　// 如果活动未结束，对时间进行处理
　　　　　　　　if (endTime - newTime > 0) {
　　　　　　　　　　let time = (endTime - newTime) / 1000;
　　　　　　　　　　// 获取天、时、分、秒
　　　　　　　　　　let day = parseInt(time / (60 * 60 * 24));
　　　　　　　　　　let hou = parseInt(time % (60 * 60 * 24) / 3600);
　　　　　　　　　　let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
　　　　　　　　　　let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
　　　　　　　　　　obj = {
　　　　　　　　　　　　day: this.timeFormat(day),
　　　　　　　　　　　　hou: this.timeFormat(hou),
　　　　　　　　　　　　min: this.timeFormat(min),
　　　　　　　　　　　　sec: this.timeFormat(sec)
　　　　　　　　　　};
　　　　　　　　} else { // 活动已结束，全部设置为'00'
　　　　　　　　　　obj = {
　　　　　　　　　　　　day: '00',
　　　　　　　　　　　　hou: '00',
　　　　　　　　　　　　min: '00',
　　　　　　　　　　　　sec: '00'
　　　　　　　　　　};
　　　　　　　　　　clearInterval(interval);
　　　　　　　　}
　　　　　　　　this.countDownList = obj.day + '天' + obj.hou + '时' + obj.min + '分' + obj.sec + '秒';
　　　　　　}, 1000);
　　　　}
　　}
  
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
