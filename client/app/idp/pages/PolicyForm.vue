<template>
  <el-main class="kp-main">
    <section class="page-body">
      <div class="page-title">
        <el-button
          class="back-button"
          cid="form-header-back" 
          icon="mdi mdi-arrow-left-circle-outline"
          v-on:click="$router.push('/idp/policy/list')"
        >
        </el-button>
        <span class="page-title-text"> {{ pageTitle }}</span>
      </div>

      <section class="form-page-container">
        <div class="panel" v-loading="loading">
          <div class="panel-body">
            <el-form
              :model="form"
              :rules="formRules"
              ref="form"
              label-position="left"
              label-width="120px"
            >
            <div class="grouping-tile">General  configuration</div>
              <el-row :gutter="40">
                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item prop="name" label="Name">
                      <el-input
                      cid="policy-form-name"
                        name="name"
                        v-model="form.name"
                        placeholder="Policy name"
                      ></el-input>
                    </el-form-item>
                  </div>
                </el-col>

                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item prop="org" label="Select Hierarchy">
                      <org-hierarchy-list :onSelectEventName="onSelectEventName" cid="policy-form-hierarchy" :hideHigherThanLevel="hideHigherThanLevel" :selectedValue="form.org" v-model="form.org" ref = "orgComp"></org-hierarchy-list>  
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>

              <el-row :gutter="40">
                 <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item
                      class="control-label col-sm-2"
                      prop="type"
                      label="Document type"
                    >
                      <el-select
                        class="select-box"
                        size="large"
                        cid="policy-form-document-type-select"
                        v-model="form.document_type"
                        @change="onDocumentTypeChange"
                        filterable
                        reserve-keyword
                        placeholder="Please select document Type"
                      >
                        <el-option
                          v-for="(document_type,index) in document_types"
                          :cid="'policy-form-document-type_'+index"
                          :key="document_type.value"
                          :label="document_type.label"
                          :value="document_type.value"
                          label-width="170px"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </el-col>

                <el-col :span="12">
                    <div class="kp-form-group">
                        <el-form-item class="control-label col-sm-2" prop="active" label="Active">
                            <el-checkbox cid="policy-form-active" v-model="form.active"></el-checkbox>
                        </el-form-item>
                    </div>
                </el-col>
              </el-row>

            
              <el-row
                :gutter="40"
                v-if="form.document_type"
                v-loading="queryLoading"
              >
                <el-col :span="24">
                  <div class="kp-form-group">
                    <el-form-item
                      id="query-builder"
                      prop="field_condition"
                      label="Match condition"
                    >
                      <vue-query-builder
                        cid="policy-form-match-condition"
                        :rules="rules"
                        v-model="form.client_query"
                        :labels="labels"
                      ></vue-query-builder>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <!-- | panel body -->
          <footer>
            <div></div>
            <div>
              <el-button cid="policy-form-cancel" size="small" v-on:click="onBack">Cancel</el-button>
            </div>
            <div>
              <el-button v-if="isSaveActionAllowed" cid="policy-form-save" size="small" v-on:click="saveField" type="primary"
                >Save</el-button
              >
            </div>
          </footer>
        </div>
        <!-- | panel -->
      </section>

      <!-- |  form-page-container  -->

      <!-- | form-page-container -->
    </section>
  </el-main>
</template>

<style lang="scss">
@import "../_idpGlobal.scss";
</style>

<script>
import Constants from "@/resources/Constants";
import EventBus from "@/EventBus";
import PolicyService from "@/idp/services/IdpPolicyService";
import OrgHierarchyList from "@/idp/components/OrgHierarchyList.vue";

import CustomerConfig from "@/idp/services/DeCustomerConfig";
import moment from "moment";
import VueQueryBuilder from "vue-query-builder";
import _ from "lodash";
const uuidv4 = require("uuid/v4");
import formMixin from "@/mixins/formMixin.js";
const currentYear = moment().year();

export default {
  name: "PolicyForm",
  mixins: [formMixin],
  components: { VueQueryBuilder,OrgHierarchyList },
  computed: {},
  data() {
     var EmptyValueValidator = (rule, value, callback) => {
      if (value && value.trim() === "") {
        callback(new Error(`Please enter valid label name`));
        return;
      }
      callback();
    };
    const storage = JSON.parse(localStorage.getItem('vuex'))
    const userOrg = storage["user"] && storage["user"]["org"] ? storage["user"]["org"]: null;
    
    return {
      loading: false,
      hideHigherThanLevel: userOrg,
      userOrg: userOrg,
      queryLoading: false,
      authorizedAccess: true,
      isSaveActionAllowed: true,
      pageTitle: "Policy",
      form: {
        name:'',
        org:userOrg,
        document_type:'',
        active : true
      },
      document_types: [],
      labels: {
        matchType: "",
        matchTypes: [
          { id: "all", label: "All should match" },
          { id: "any", label: "Atleast one should match" },
        ],
        addRule: "Add rule",
        removeRule: "&times;",
        addGroup: "Add Group",
        removeGroup: "&times;",
        textInputPlaceholder: "value",
      },
      formRules: {
         name: [
          {
            validator: EmptyValueValidator,
            trigger: "blur",
            message: "Please select policy name",
          },
          {
            required: true,
            message: "Please provide policy name",
            trigger: "blur",
          },
        ],
         document_type: [
          {
            validator: EmptyValueValidator,
            trigger: "blur",
            message: "Please select document type",
          },
          {
            required: true,
            message: "Please provide document type",
            trigger: "blur",
          },
        ],
         org: [
          {
            validator: EmptyValueValidator,
            trigger: "blur",
            message: "Please select org hierarchy",
          },
          {
            required: true,
            message: "Please provide org hierarchy",
            trigger: "blur",
          },
        ]
    },
      rules: [],
      onSelectEventName : "POLICY_FORM"
    };
  },
  methods: {
    async getDocumentTypes(){
        const docTypeConfig = await CustomerConfig.getAllDocsCustConfiguration({document_type:{$exists:true}});
        this.document_types =CustomerConfig.getDocumentTypeList(docTypeConfig,true);
    },
    async init() {
      const policyId = this.getPolicyId();
      console.log("Policy id : ", policyId);
      if (policyId) {
        this.loading = true;
        const policy = await this.fetchPolicy(policyId);
        await this.fetchPolicyConditionMeta("" + policy["document_type"]);

        this.form = {
          _id: "" + policy["_id"],
          name: "" + policy["name"],
          document_type: "" + policy["document_type"],
          org: "" + policy["org"],
          client_query: policy["client_query"] && JSON.parse(policy["client_query"]),
          active: policy["active"]
        };
        this.loading = false;
      }
    },

    onBack() {
      this.$router.push('/idp/policy/list');
    },

    async saveField() {
      this.loading = true;
      try {
      let valid = await this.$refs.form.validate().catch((error) => {
      });
      if (!valid) {
        this.loading = false;
        return;
      }
      let response={}
      if (!this.form._id) {
        response = await PolicyService.addPolicy(this.form);
      }else{
        response = await PolicyService.updatePolicy(this.form);
      }
      if(response.data.status){
        this.notifySuccess(response.data.message);
        this.$router.push("/idp/policy/list");
      }else{
        this.notifyError(response.data.message);
      }
      }catch (e) {
        this.notifyError("Error while saving data");
        console.error("Error ", e);
      }
      this.loading = false;
    },

    getPolicyId() {
      let policyId = null;
      try {
        const urlParams = new URLSearchParams(window.location.search);
        policyId = urlParams.get("id");
      } catch (e) {}
      return policyId;
    },

    async fetchPolicy(policyId) {
      const policy = await PolicyService.getPolicy(policyId);
      return policy;
    },

    async fetchPolicyConditionMeta(doc_type) {
      this.queryLoading = true;
      const document_type = doc_type || this.form.document_type;
      try {
        const response = await PolicyService.getPolicyMeta({ document_type });
        this.rules = JSON.parse(JSON.stringify(response["rules"])) || [];
      } catch (e) {
        this.rules = [];
      }
      this.queryLoading = false;
    },
    onDocumentTypeChange() {
      console.log(
        "####### On Document type change ",
        JSON.stringify(this.form)
      );

      this.fetchPolicyConditionMeta();
    },
  },
  beforeDestroy() {
    EventBus.$off(["ON_SELECT_ORG_HIERARCHY_"+this.onSelectEventName]);
  },
  async beforeMount() {
    this.isSaveActionAllowed = await this.isSaveActionPermitted('de_policy');
    this.$store.commit("setDocumentType", Constants.DOCEX.DOCUMENT_TYPES.INVOICE);
    this.$store.commit("setDisplayIdpTree",false);
    this.$store.commit("setDisplayIdpNavbar",true);
     EventBus.$on("ON_SELECT_ORG_HIERARCHY_"+this.onSelectEventName, (data) => {
        this.form.org = data && data.org
    })
    this.init();
    this.getDocumentTypes();
  },
};
</script>

<style lang="scss">
@import "../_idpGlobal.scss";
@import "../_idpVariables.scss";
</style>
