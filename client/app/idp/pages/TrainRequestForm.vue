<template>
  <el-main class="kp-main">
    <section class="page-body">
      <div class="page-title">
        <el-button
          class="back-button"
          cid="form-header-back"
          icon="mdi mdi-arrow-left-circle-outline"
          v-on:click="$router.push('/idp/train-requests')"
        >
        </el-button>
        <span class="page-title-text"> {{ pageTitle }}</span>
      </div>

      <section class="form-page-container" v-loading="loader">
        <div class="panel">
          <div class="panel-body">
            <div class="trainRequest-menu">
              <el-form
                ref="form"
                :model="form"
                label-width="120px"
                :rules="formRules"
              >
                <el-row :gutter="180">
                  <el-col :span="10">
                    <div class="kp-form-group">
                      <el-form-item label="Customer">
                        <el-select
                          v-model="form.customer_name"
                          placeholder="Select customer"
                        >
                          <el-option
                            v-for="item in customers"
                            :key="item.customer_name"
                            :label="item.customer_name"
                            :value="item.customer_name"
                          >
                            {{ item.customer_name }}
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                  </el-col>
                </el-row>

                <el-row :gutter="180">
                  <el-col :span="10">
                    <div class="kp-form-group">
                      <el-form-item label="Document Type">
                        <el-select
                          v-model="form.document_type"
                          placeholder="Select Document Type"
                          @change="onSelectDocumentType(form.document_type)"
                        >
                          <el-option
                            v-for="item in document_types"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          >
                            {{ item.label }}
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                  </el-col>
                </el-row>

                <el-row :gutter="180">
                  <el-col :span="10">
                    <div class="kp-form-group">
                      <el-form-item label="Model Type">
                        <el-select
                          v-model="form.model_subtype"
                          placeholder="Select Model Type"
                        >
                          <el-option
                            v-for="item in sub_types"
                            :key="item.sub_types"
                            :label="item.model_subtype"
                            :value="item.model_subtype"
                          >
                            {{ item.model_subtype }}
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </div>
          <footer>
            <div></div>
            <div>
              <el-button
                cid=""
                v-on:click="$router.push('/idp/train-requests')"
                size="small"
              >
                Cancel
              </el-button>
            </div>
            <div>
              <el-button
                cid=""
                id="save-btn"
                @click="onSubmit()"
                size="small"
                type="primary"
              >
                Save
              </el-button>
            </div>
          </footer>
        </div>
      </section>
    </section>
  </el-main>
</template>

<script>
import MasterModelConfigService from "@/idp/services/MasterModelConfigService";
import TrainRequestService from "@/idp/services/TrainRequestService";
import Constants from "@/resources/Constants";
import EventBus from "@/EventBus";
import CustomerService from "@/idp/services/CustomerService";
import _ from "lodash";

export default {
  name: "TrainRequestForm",
  data() {
    return {
      form: {
        customer_id: "",
        customer_name: "",
        model_subtype: "",
        document_type: "",
        master_model_config_id: "",
        status: "New",
      },
      loader: false,
      pageTitle: "Add TrainRequest",
      document_types: Constants.DOCEX.DOCUMENT_TYPE_LIST,
      sub_types: [],
      jsonData: [],
      formRules: {},
      customers: [],
    };
  },
  methods: {
    async init() {
      this.loader=true;
      let customers = await CustomerService.find({ type: "IDP" }, ["customer_name"]);
      this.customers = _.sortBy(customers, "customer_name");
      this.loader=false;
    },

    async onSelectDocumentType(document_type) {
       this.loader=true;
      let MasterModelConfig = await MasterModelConfigService.get(
        { document_type: document_type },
        ["_id", "model_subtype"]
      );
      this.sub_types = MasterModelConfig;
      this.form.model_subtype = "";
      this.loader=false;
    },

    async onSubmit() {
      let subType = _.filter(this.sub_types ,{model_subtype : this.form.model_subtype});
      this.form.master_model_config_id = subType._id;
      this.loader=true;
      let res = await TrainRequestService.save(this.form).catch(() => {
        this.notifyError(Constants.TABLE_DATA_SAVE_ERROR);
      });
      if (res) {
        this.notifySuccess(Constants.TABLE_DATA_SAVE_SUCCESS);
        this.$router.push({ path: "/idp/train-requests" });
      }
      this.loader=false;
    },
  },

  beforeMount() {
    this.$store.commit("setDisplayIdpTree",false);
    this.$store.commit("setDisplayIdpNavbar",true);
    this.init();
  },
};
</script>

<style lang="scss">
// @import "../../assets/scss/_variables";
@import "../_idpGlobal";
</style>