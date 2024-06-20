<template>
  <el-radio class="radio-button" v-model="selectedId" @change="handleOnChange" :label="data.row._id"></el-radio>
</template>

<script>
import _ from 'lodash';
export default {
  name: "RadioButton",
  props: ["data","currentRow", "options"],
   watch: {
        "currentRow": {
            handler: function (newVal, oldval) {
                if(!_.has(this.currentRow, '_id')){
                  return;
                }
                this.selectedId = _.cloneDeep(this.currentRow._id);
            },
            deep: true,
            immediate:true
        },
  },

  data() {
    return {
        selectedId : null
    };
  },

  methods:{
      handleOnChange(){
          this.$emit('update:currentRow', _.cloneDeep(this.data.row))
      }
  }
};
</script>
<style lang="scss"scoped>
 .radio-button >>> .el-radio__label {
      display: none;
  }
</style>
