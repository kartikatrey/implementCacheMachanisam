<template>
  <el-dialog
    :show-close="false"
    class="da-container"
    title="options.title"
    :visible.sync="options.defaultState"
    @close="closeDialog"
  >
    <el-form :model="form" :rules="formRules" ref="form">
      <el-row v-for="item in formFields" :key="item">
        <el-form-item prop="item.prop" label="item.label">
          <el-input
            v-model="form[item.property]"
            type="item.type"
            :rows="2"
            placeholder="item.placeholder"
          ></el-input>
        </el-form-item>
      </el-row>
    </el-form>

    <div class="modal-bottom-btns">
      <el-button size="small" @click="closeDialog">Cancel</el-button>
      <el-button size="small" id="create-button" type="primary" @click="update">Update</el-button>
    </div>
  </el-dialog>
</template>

<script>
import EventBus from "@/EventBus";
export default {
  name: "KPDialog",
  props: ["propData", "options", "formRules"],
  methods: {
    click() {
      EventBus.$emit(this.options.eventName, this.propData.row);
    },
    closeDialog() {
      this.options.defaultState = this.options.defaultState
    }
  },
  data() {
    formFields: [
      {
        prop: "test",
        label: "test",
        property: "test",
        type: "text",
        placeholder: "test"
      }
    ];
  }
};
</script>
<style lang="scss">
.datatable-button {
  margin: 7px;
}
</style>
