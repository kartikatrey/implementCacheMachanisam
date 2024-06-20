<template>
  <span>
    <el-dropdown-item
      v-if="!propData.row.active"
      :command="onApprove"
    ><i class="mdi mdi-check-circle-outline"></i>Activate</el-dropdown-item>
    <el-dropdown-item
      v-if="propData.row.active"
      :command="onReject"
    ><i class="mdi mdi-minus-circle-outline"></i>Reject</el-dropdown-item>
  </span>
</template>

<script>
import EventBus from "@/EventBus";
export default {
  name: "ApproveRejectButtons",
  props: ["propData"],
  methods: {
    onApprove() {
      EventBus.$emit("approveRequest", this.propData);
    }
  }
};
</script>
<style lang="scss">
.button-style {
  font-size: 26px !important;
  padding: 0 !important;
}
</style>
