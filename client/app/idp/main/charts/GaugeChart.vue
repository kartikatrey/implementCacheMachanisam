<template>
    <v-chart :option="options" class="gauge-chart" />
</template>

<script>


export default {
  name: "GaugeChart",
  props: ["options"],
  data() {
    return {
      auto: true,
    };
  },
  methods: {},
  mounted() {
    // let that = this;
    // setTimeout(() => {
    //   document.getElementsByClassName(that.name)[0].style.width = "100%";
    // }, 0);
  },
};
</script>
<style lang="scss" >
.gauge-chart{
    padding-top:30px;
    width: auto !important;
    // width: 300px !important;
    height: 250px !important;
}
.gauge-chart > div {
  margin: 0 auto !important;
}
</style>


