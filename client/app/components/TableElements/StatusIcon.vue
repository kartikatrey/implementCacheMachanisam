<template>
  <div class="icon-container">
    <el-tooltip class="item" effect="dark" :content="tooltip_text" placement="top">
         <i :class="icon"></i>
    </el-tooltip>
  </div>
</template>

<script>
import _ from "lodash";

export default {
  name: "StatusIcon",
  props: ["propData", "options"],
  watch: {
    propData() {
      this.setStatus();
    },
  },
  computed:{
    tooltip_text(){
      let messageValue = this.propData.row[this.options.message_key];

      if(messageValue &&  _.includes(this.options.errorValues,this.propData.row[this.options.key])) return messageValue;
      return this.propData.row[this.options.key]
    }
  },
  methods: {
    setStatus() {
      if ( _.includes(this.options.successValues,this.propData.row[this.options.key])) {
        this.icon = "el-icon-success";
      } else if ( _.includes(this.options.errorValues,this.propData.row[this.options.key])) {
        this.icon = "el-icon-error";
      } else if ( _.includes(this.options.inProgressValues,this.propData.row[this.options.key])) {
        this.icon = "el-icon-loading";
      }else{
        this.icon = 'el-icon-warning'
      }
    },
  },
  data() {
    return {
      icon: "el-icon-loading",
      icons: ["el-icon-loading", "el-icon-success", "el-icon-error"],
    };
  },
  beforeMount() {
    this.setStatus();
  },
};
</script>
<style lang="scss">
.icon-container {
  font-size: 20px;
  .el-icon-error  {
    color: red;
  }
  .el-icon-success {
    color: green;
  }
  .el-icon-warning{
    color: red;
  }
}
</style>
