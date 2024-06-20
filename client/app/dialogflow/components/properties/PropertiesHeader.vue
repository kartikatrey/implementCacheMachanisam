<template>
  <div class="property-heading">
    <!-- <el-button round type="clear" v-on:click="hidePropertyWindow">
      <i class="mdi mdi-toggle mdi mdi-chevron-right"></i
    ></el-button> -->
    {{ heading }}
  </div>
</template>

<script>
import EventBus from "@/EventBus";

export default {
  name: "PropertiesHeader",
  props: ["dialogFlowData", "currentNode", "title"],
  data() {
    return {
      heading: "",
    };
  },

  methods: {
    hidePropertyWindow() {
      EventBus.$emit("VISIBLE_SLIDEOUT", false);
      this.$emit("update:loading", false);
    },
  },
  mounted() {
    this.heading = this.title
      ? this.title
      : this.dialogFlowData.workflow_data.nodes[this.currentNode.id].name + " Properties";
  },
};
</script>
<style lang="scss" >
</style>
