<template> 
<div>
<el-tag
  :key="tag"
  v-for="tag in dynamicTags"
  closable
  :disable-transitions="false"
  @close="handleClose(tag)"
 >
  {{tag}}
</el-tag>
<el-input
  class="input-new-tag"
  v-if="inputVisible"
  v-model="inputValue"
  ref="saveTagInput"
  size="mini"
  @keyup.enter.native="handleInputConfirm"
  @blur="handleInputConfirm"
>
</el-input>
<el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
</div>
</template>

<script>
  export default {
     name: "TagList",


      props: ["value"],
    data() {
      return {
        dynamicTags: [],
        inputVisible: false,
        inputValue: this.value,
      };
    },
    watch: {
    inputValue(val) {
      this.$emit("input", val);
    },
    value(val, oldval) {
      this.inputValue = val;
    }
  },
    methods: {
      handleClose(tag) {
          console.log("dsdasdsfnfjdsfjkfjedwfwfhwfhdfdh", this.dynamicTags);
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      },

      showInput() {
          
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {

          this.dynamicTags.push(inputValue);
          this.$emit("change",inputValue);

        }
        this.inputVisible = false;
        this.inputValue = '';
        
      }
    }
  }
</script>


<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>