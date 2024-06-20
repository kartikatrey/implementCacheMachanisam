<template>
  <el-main>
    <el-row :gutter="10" class="setting-form-container">
      <el-col :span="5">
        <label class>Publish channel</label>
        <el-select v-model="value" placeholder="Select">
          <el-option
            v-for="item in default_export_options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
    </el-row>

    <el-row :gutter="10">
      <el-col :span="24" class="mt-20">
        <el-button
          style="{margin-top: 36px}"
          v-on:click="saveDocExSetting"
          class="btn-save"
          type="primary"
        >
          <i class="mdi mdi-check"></i> Save
        </el-button>
      </el-col>
    </el-row>
  </el-main>
</template>

<script>
import EventBus from "@/EventBus";
import Constants from "@/resources/Constants";

export default {
  name: "DeSetting",
  props: [],
  data() {
    return {
      default_export_options: Constants.DE_EXPORTS_OPTIONS,
      value: "",
      workflows: [],
      systems: [],
    };
  },
  methods: {
    getSystems() {},
    getWorkflows() {},
    saveDocExSetting() {
      alert("saved");
    },
    async getCustomerConfig() {
      console.log(config);
    },
  },
  beforeMount(){
      this.getCustomerConfig();
  }
};
</script>
<style lang="scss">
.setting-form-container {
  label {
    font-size: 16px;
    color: #6d6d6d;
  }
}
</style>
