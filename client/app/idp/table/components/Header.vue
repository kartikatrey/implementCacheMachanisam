<template>
<el-tooltip :content="headerName" placement="left" effect="light">
  <span class="title">
    {{ headerName }}
  </span>
</el-tooltip>
</template>

<script>
export default {
  name: "Header",
  props: ["data"],
  data() {
    return {
      headerName: "",
    };
  },
  beforeMount() {
    this.headerName =
      this.data && this.data["column"] && this.data["column"]["label"];
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" >
.title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding:0;
}
</style>
