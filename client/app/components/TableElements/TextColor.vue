<template>
  <div class="el-badge mark">
       <sup  v-bind:class="_class" >{{ propData.row[this.options.field] }}</sup>
  </div>
</template>


<script>
export default {
  name: "TextColor",
  props: ["propData","options"],
  data() {
    return {
     
    };
  },
  computed:{
  _class:function(){
    
      return this.options.field_map[this.propData.row[this.options.field]];
   }
  },
  methods: {},
  beforeMount() {},
};
</script>

<style lang="scss">
@import "../../idp/_idpVariables";
// @import "../_idpGlobal.scss";
// @import "../_idpVariables.scss";
.failed {
  color: var(--red-05);
   //font-size: 12px;
   font-size: var(--font-base);
}

.completed {
  color: var(--green-04);
 // font-size: 12px;
 font-size: var(--font-base);
}

.deployed {
  color: var(--brand-06);
  //font-size: 12px;
  font-size: var(--font-base);
}

.progress {
  color: var(--yellow-03);
 // font-size: 12px;
 font-size: var(--font-base);
}



// .page-info-container {
//   border-radius: 5px;
//   -webkit-box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
//   box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
//   max-width: 420px;
//   width: 100%;
//   padding: 16px;
//   background: $color-white;
//   .el-col {
//     border-right: 0.5px solid #bbbbbb;
//     border-radius: 0;
//     &:last-child {
//       border-right: 0;
//     }
//   }
// }

// .badge-Success {
//   background-color: white;
//   border-radius: 10px;
//   color: rgba(66, 240, 153, 0.7);
//   display: inline-block;
//   font-size: 12px;
//   height: 18px;
//   line-height: 18px;
//   padding: 0 6px;
//   text-align: center;
//   white-space: nowrap;
//   border: 1px solid rgba(66, 240, 153, 0.7);
//   width: 45px;
// }

// .badge-Failed {
//   background-color: white;
//   border-radius: 10px;
//   color: rgba(254, 144, 151, 1);
//   display: inline-block;
//   font-size: 12px;
//   height: 18px;
//   line-height: 18px;
//   padding: 0 6px;
//   text-align: center;
//   white-space: nowrap;
//   border: 1px solid rgba(254, 144, 151, 0.7);
//   width: 45px;
// }

// .badge-Cancelled {
//   background-color: white;
//   border-radius: 10px;
//   color: rgba(254, 144, 151, 1);
//   display: inline-block;
//   font-size: 12px;
//   height: 18px;
//   line-height: 18px;
//   padding: 0 6px;
//   text-align: center;
//   white-space: nowrap;
//   border: 1px solid rgba(254, 144, 151, 0.7);
//   width: 90%;
// }
</style>

