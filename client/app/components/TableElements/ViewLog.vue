<template>
  <div class="key-value-input-container">
    <a @click="open">View</a>

    <el-dialog top="5vh" v-if="dialogVisible" title="Tips" :visible.sync="dialogVisible" width="95%" destroy-on-close="true">
      <el-row>
        <el-col :span="12">
          <b>Request</b>
          <div class="data-container">
            <span v-if="loadingData">Loading...</span>
            <vue-json-pretty :data="data.request" v-else></vue-json-pretty>
          </div>
        </el-col>
        <el-col :span="12">
          <b>Response</b>
          <div class="data-container">
            <span v-if="loadingData">Loading...</span>
            <vue-json-pretty :data="data.response" v-else></vue-json-pretty>
          </div>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">
          Cancel
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import VueJsonPretty from "vue-json-pretty";
export default {
  name: "ViewLog",
  components: { VueJsonPretty },
  props: ["props", "propData"],
  data() {
    return { dialogVisible: false, data: {} ,loadingData:true};
  },
  methods: {
    open() {
      this.dialogVisible = !this.dialogVisible;
    },
  },
  beforeMount() {
    const field = this.propData.column.field;
    setTimeout(_=>{
      this.data = this.propData.row[field];
      this.loadingData = false;
    },1000)
  },
};
</script>

<style lang="scss">
@import "../../idp/_idpVariables";

.el-dialog {
  .data-container {
    height: 400px;
    overflow: auto;
    margin: 10px;
  }

  .data-container::-webkit-scrollbar {
    width: 6px;
    background-color: var(--white);
  }

  .data-container::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px var(--dark-06);
    background-color: var(--white);
  }

  .data-container::-webkit-scrollbar-thumb {
    background-color: var(--dark-05);
  }

  .row-border {
    border-bottom: var(--border-base) solid var(--dark-07);
    padding: var(--space-lg) 0;
  }
}
</style>
