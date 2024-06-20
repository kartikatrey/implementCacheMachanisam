<template>
  <div class="properties-container" v-loading="loading">
    <PropertiesHeader
      :currentNode="currentNode"
      :dialogFlowData="dialogFlowData"
    />
    <div class="content-body">
      <el-form :model="form" ref="form" label-width="90px" :rules="formRules">
        <div class="without-tabs-container">
          <el-form-item
            class="inline-label-item"
            label="Service Name"
            prop="service_name"
          >
            <el-select
              v-model="form.service_name"
              @change="onServiceChange"
              placeholder="Select service"
            >
              <el-option
                v-for="service in serviceList"
                :label="service.service_name"
                :value="service"
                :key="service._id"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <PropertiesFooter
      :currentNode="currentNode"
      :form.sync="form"
      :dialogFlowData="dialogFlowData"
      :formRef="$refs"
    />
  </div>
</template>

<script>
import Codemirror from "@/components/Codemirror.vue";
import DialogFlowService from "@/dialogflow/services/DialogFlowService";
import _ from "lodash";
import PropertiesFooter from "@/dialogflow/components/properties/PropertiesFooter.vue";
import PropertiesHeader from "@/dialogflow/components/properties/PropertiesHeader.vue";
import wfDirty from "@/mixins/wfDirty.js";
export default {
  name: "RunScript",
  mixins: [wfDirty],
  props: ["dialogFlowData", "currentNode"],
  components: { Codemirror, PropertiesFooter, PropertiesHeader },
  data() {
    return {
      loading: false,
      form: { service_name: "", service_id: "" },
      serviceList: [],
    };
  },
  methods: {
    init() {
      let nodeData = JSON.parse(JSON.stringify(this.currentNode.data));
      this.form = {
        node_id: nodeData["node_id"],
        ...this.form,
      };
      _.size(nodeData) > 1 ? (this.form = nodeData) : null;
      // this.form.service_name =
      //   this.dialogFlowData.workflow_data.nodes[
      //     this.currentNode.id
      //   ].data.service_name;
      // this.form.service_id =
      //   this.dialogFlowData.workflow_data.nodes[
      //     this.currentNode.id
      //   ].data.service_id;

      // if (this.dialogFlowData._id && this.dialogFlowData.service_id) {
      //   let service = _.find(this.serviceList, {
      //     _id: this.dialogFlowData.service_id,
      //   });
      //   this.form = _.pick(service, ["_id", "service_name"]);
      // }
    },
    async getServiceList() {
      let queryParams = {};
      queryParams.master_system_id = this.dialogFlowData.master_system_id;
      //queryParams.object_type = this.dialogFlowData.object;
      this.serviceList = await DialogFlowService.fetchServicesByCriteria(
        queryParams
      ).catch((error) => {
        this.notifyError("Error while fetching services!!");
      });
    },
    onServiceChange(service) {
      this.form.service_name = service.service_name;
      this.form.service_id = service._id;

      // this.dialogFlowData.workflow_data.nodes[
      //   this.currentNode.id
      // ].data.service_id = service._id;
      // this.dialogFlowData.workflow_data.nodes[
      //   this.currentNode.id
      // ].data.service_name = service.service_name;
    },
  },
  async beforeMount() {
    await this.getServiceList();
    this.init();
  },
};
</script>
<style>
/* html,
body {
  height: 100%;
  margin: 0;
}
button.compile {
  z-index: 5;
  position: absolute;
  top: 10px;
  left: 10px;
} */
</style>