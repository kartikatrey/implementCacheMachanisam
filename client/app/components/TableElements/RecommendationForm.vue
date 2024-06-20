<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :destroy-on-close="true"
      width="30%"
      class="kp-modal-wrap"
      :before-close="handleDialogClose"
      title="Add button"
      :visible.sync="show"
    >
      <el-form
        label-position="top"
        :model="form"
        :rules="rules"
        ref="form"
        label-width="178px"
        class="demo-form"
      >
        <el-row>
          <el-col :span="18">
            <div class="kp-form-input-1 kp-form-field">
              <el-form-item
                prop="key"
                label="Display text"
              >
                <el-input
                  placeholder="Schedule a demo"
                  v-model="form['key']"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <div class="kp-form-input-1 kp-form-field">
              <el-form-item
                prop="type"
                label="Text type"
              >
                <el-radio-group
                  @change="handleTypeChange"
                  v-model="form.type"
                >
                  <el-radio label="NER">NER</el-radio>
                  <el-radio label="QNA">QnA</el-radio>
                  <el-radio label="workflow">Workflow</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <div class="kp-form-input-1 kp-form-field">
              <el-form-item
                ref="value"
                prop="value"
                label="Link to"
              >
                <el-select
                  class="select-box"
                  size="large"
                  v-model="form.value"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="Please enter a keyword"
                  :remote-method="getStatements"
                  @change="handleStatementChange"
                >
                  <span v-if="form.type!=suggesion_button_type.workflow">
                    <el-option
                      v-for="item in statements"
                      :key="item"
                      :label="item"
                      :value="item"
                      label-width="170px"
                    >
                    </el-option>
                  </span>
                  <span v-else>
                    <el-option
                      v-for="item in statements"
                      :key="item._id"
                      :label="item.name"
                      :value="item._id"
                      label-width="170px"
                    >
                    </el-option>
                  </span>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="5">
            <el-button
              class="kp-btn-form-primary"
              @click="saveRecommendation"
              type="primary"
            >Ok</el-button>
          </el-col>
          <el-col :span="6">
            <el-button
              class="kp-btn-form-outline"
              @click="handleDialogClose"
            >Cancel</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import lodash from "lodash";
import Constants from "@/resources/Constants";
import QnaService from "../../services/QnaService";
import NerService from "../../services/NerService";
import DialogFlowService from "@/dialogflow/services/DialogFlowService";

export default {
  name: "RecommendationForm",
  props: ["show", "recommendationObject"],
  data() {
    return {
      form: {},
      statements: [],
      suggesion_button_type: { workflow: "workflow" },
      rules: {
        key: [
          {
            required: true,
            message: "Please enter display text",
            trigger: "blur",
          },
        ],
        type: [
          {
            required: true,
            message: "Please select button type",
            trigger: "change",
          },
        ],
        value: [
          {
            required: true,
            message: "Please select link to value",
            trigger: "blur",
          },
        ],
      },
    };
  },
  watch: {
    show: {
      handler: function (val, oldval) {
        if (!val) {
          this.resetDialog();
          return;
        }
        this.form = !lodash.isEmpty(this.recommendationObject)
          ? lodash.cloneDeep(this.recommendationObject)
          : {
              key: "",
              type: "QNA",
              value: "",
            };
        if (this.form.type == this.suggesion_button_type.workflow) {
          this.getWorkflowList();
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    async getWorkflowList() {
      this.statements = await DialogFlowService.fetchWorkflowList();
    },
    handleStatementChange(value) {
      if (this.form.type == "workflow") {
        this.form.value = {
          workflow_id: value,
        };
      }
    },
    handleTypeChange(labelValue) {
      this.$refs["value"].resetField();
      this.form["value"] = "";
      this.statements = [];
    },

    handleDialogClose() {
      this.$emit("hide");
    },

    resetDialog() {
      this.$refs["form"] && this.$refs["form"].resetFields();
      this.statements = [];
      this.form = {};
    },

    saveRecommendation() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return;
        }
        this.$emit("save-form-data", lodash.cloneDeep(this.form));
      });
    },

    async getStatements(query) {
      if (query == "") {
        this.statements = [];
        return;
      }
      let typeServiceMapping = {
        [Constants.TRANING_MODEL_TYPES.QNA_MODEL_TYPE]: {
          service: QnaService.fetchAll,
          field: "question",
          formatter: this.formatQnaData,
        },
        [Constants.TRANING_MODEL_TYPES.NER_MODEL_TYPE]: {
          service: NerService.fetchAll,
          field: "statement",
          formatter: this.formatNerData,
        },
        [this.suggesion_button_type.workflow]: {
          service: DialogFlowService.fetchWorkflowList,
          field: "name",
          formatter: this.formatWorkflowData,
        },
      };
      let type = this.form.type;
      let response = await typeServiceMapping[[type]]["service"](
        {
          [[typeServiceMapping[[type]]["field"]]]: {
            $regex: query,
            $options: "i",
          },
          active: true,
        },
        [[typeServiceMapping[[type]]["field"]]]
      );
      this.statements = typeServiceMapping[[type]]["formatter"](response);
      console.log(this.statements);
    },

    formatNerData(response) {
      return lodash.uniq(lodash.map(response, "statement"));
    },
    formatWorkflowData(response) {
      // return lodash.uniq(lodash.map(response, 'name'))
      return response;
    },
    formatQnaData(response) {
      let questionArr = [];
      lodash.each(response, (element) => {
        questionArr.push(lodash.compact(lodash.map(element.question, "value")));
      });
      return lodash.uniq(lodash.flattenDeep(questionArr));
    },
  },
};
</script>

<style lang="scss">
.kp-form-panel {
  background: #fff;
  padding: 32px;
  border-radius: 7px;
  margin-top: 32px;
  -webkit-box-shadow: 0 0px 11px rgba(0, 0, 0, 0.02);
  box-shadow: 0 0px 11px rgba(0, 0, 0, 0.02);
  margin-bottom: 32px;
}

.kp-form-field {
  margin-bottom: 22px;

  input,
  select,
  textarea {
    background: #f5f6fa;
  }
}

.select-box {
  width: 100%;
}
</style>
