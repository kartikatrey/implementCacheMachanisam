<template>
  <div class="global-search">
        <span class="mdi mdi-magnify search-icon"></span>
        <el-input size="mini" class="kp-toolbar-input" placeholder="All fields" cid="idp-doc-list-global-search" v-model="searchText" @change="onSearchTextChange" clearable></el-input>
 </div>
</template>

<script>


export default {
  name: "GlobalSearch",
  watch: {},
  data() {
    return {
      searchText:'',
    };
  },
  
  computed: {
    componentName(){
      return Constants.DOCEX.FIELD_COMPONENT_MAPPING[this.props.field_config.type];
    }
  },
  methods: {
      onSearchTextChange(){
          this.$emit("update:searchText", this.searchText)
      }
  },

  created() {},
  mounted() {
    
  },
  beforeDestroy() {},
  beforeMount() {  },
};
</script>
<style lang="scss">
@import "../_idpVariables";
@import "../_idpGlobal";
.global-search{
        position: relative;
        .el-input__inner{
            padding-left: 2.5rem;
            background: var(--dark-07);
        }
        .search-icon {
            position: absolute;
            z-index: 1;
            color: #a0aec0;
            left: 6px;
            top: 1px;
            bottom: 17px;
            font-size: 18px;
    }
 }
</style>


