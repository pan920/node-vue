<template>
  <banner-detail :is-edit="false" />
</template>

<script>
import BannerDetail from './components/BannerDetail'

export default {
  name: 'CreateForm',
  components: { BannerDetail }
}
</script>

