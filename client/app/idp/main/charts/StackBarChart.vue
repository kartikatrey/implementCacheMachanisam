<template>
  <div class="charts-contrainer">
    <v-chart :class="name" :option="options" @click="onClick" autoresize />
  </div>
</template>

<script>

export default {
  name: "StackBarChart",
  props: ["options", "name"],
   
  data() {
    return {
      grid: {
          left: '15%',
          right: '10%',
          bottom: '0%',
          top: '20%',
      }
    };
  },
  methods: {
    onClick(data) {
      console.log("Pi Click", data, this.name);
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
<style lang="scss">
// .charts-contrainer {
//     .echarts {
//       height: 26rem;
//       width: auto;
//     }
// }
// .charts-contrainer{
//      .echarts {
//     height: 400px;
//     width: 600px
// }
//   }
// .vendor-wise-error-chart {
//   .echarts {
//     height: 20rem;
//     width: auto;
//   }

.charts-contrainer {
     .echarts {
          height: 26rem;
          width: auto;
      }
  }
    

    

// }
</style>