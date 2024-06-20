<template>
  <div>
    <v-chart :class="name" :option="options" autoresize @click="onClick" />
  </div>
</template>

<script>


export default {
  name: "DoughnutChart",
  props: ["options", "name"],
  data() {
    return {
      auto: true,
    };
  },
  methods: {
    onClick(data) {
      if(this.isLoggedInAsKanAdmin())return;
      this.$emit("onClick", data, this.name);
    },
  },
  mounted() {
    let that = this;
    // setTimeout(() => {
    //   document.getElementsByClassName(that.name)[0].style.width = "100%";
    // }, 0);
  },
};
</script>
<style lang="scss" >
</style>


