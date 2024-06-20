<template>
  <span>
    <i  v-if="propData.row.feedback == 'thumbsUp'" style="color:rgba(66, 240, 153, 0.7);margin-left: 16px;" class="mdi mdi-thumb-up"></i>
    <i  v-if="propData.row.feedback == 'thumbsDown'" style="color:red;margin-left: 16px;" class="mdi mdi-thumb-down"></i>  
  </span>
</template>

<script>
export default {
  name: "ThumbsUpDownButtons",
  props: ["propData"],
  data() {
    return {};
  },
  methods: {

  }
};
</script>
<style lang="scss">

</style>
