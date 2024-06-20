<template>
  <el-main class="kp-main">
    <section class="page-body">
      <div class="page-title">
        <el-button
          class="back-button"
          cid="form-header-back" 
          icon="mdi mdi-arrow-left-circle-outline"
          v-on:click="$router.push('/idp/roles')"
        >
        </el-button>
        <span class="page-title-text"> {{ pageTitle }}</span>
        <span> Add policy to role </span>
      </div>

      <section class="form-page-container" v-loading="loader">
        <div class="panel">
          <div class="panel-body">
            <el-form
              :model="form"
              :rules="formRules"
              ref="form"
              label-position="left"
              label-width="150px"
            >
              <el-row :gutter="180">
                <el-col :span="10">
                  <div class="kp-form-group">
                    <el-form-item prop="label" label="Label">
                      <el-input
                      cid="roles-form-label"
                        name="label"
                        v-model="form.label"
                        disabled
                        placeholder="Label name"
                      ></el-input>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="180">
                <el-col :span="10">
                  <div class="kp-form-group">
                    <el-form-item prop="name" label="Name">
                      <el-input
                        name="name"
                        cid="roles-form-name"
                        v-model="form.name"
                        placeholder="Name"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>

              <el-row :gutter="180">
                <el-col :span="14">
                  <div class="kp-form-group">
                    <el-form-item
                      class="control-label col-sm-2"
                      prop="policies"
                      label="Policies"
                    >
                      <el-select
                        v-model="form.policies"
                        class="select-box"
                        multiple
                        cid="roles-form-policies-select"
                        collapse-tags
                        placeholder="Select Policies"
                      >
                        <el-option
                          v-for="(_policy,index) in policyList"
                          :cid="'roles-form-policies_'+index"
                          :key="_policy.value"
                          :label="_policy.label"
                          :value="_policy.value"
                          label-width="170px"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
              <!-- Removed user domain dependancy -->
               <!-- <el-row :gutter="180">
                <el-col :span="14">
                  <div class="kp-form-group">
                    <el-form-item
                      class="control-label col-sm-2"
                      prop="domains"
                      label="Domain"
                    >
                      <el-select
                        v-model="form.domains"
                        class="select-box"
                        cid="roles-form-domains-select"
                        collapse-tags
                        placeholder="Select Domain"
                      >
                        <el-option
                          v-for="(_domain,index) in domainList"
                          :cid="'roles-form-domain_'+index"
                          :key="_domain.value"
                          :label="_domain.label"
                          :value="_domain.value"
                          label-width="170px"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row> -->

            </el-form>
          </div>
          <footer>
            <div></div>
            <div>
              <el-button cid="roles-form-cancel" v-on:click="$router.push('/idp/roles')" size="small">
                Cancel
              </el-button>
            </div>
            <div>
              <el-button
              cid="roles-form-save"
                id="save-btn"
                :disabled="disableSave"
                v-on:click="save"
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
     <!-- Added datatable for Role-Field-Access -->
    <section class="page-body">
      <div class="table-wrap role-access-table">
        <DataTable :parameters="tableParamsForFieldAccess"></DataTable>
      </div>
    </section>
    <section class="page-body">
      <div class="table-wrap tab-access-list-table">
          <DataTable :parameters="tableParamsForTabAccess"></DataTable>
      </div>
    </section>
  </el-main>
</template>
<script>
import RolesService from "@/idp/services/RoleService";
import UserService from "@/idp/services/UserService";
import EventBus from "@/EventBus";
import DataTable from "@/components/DataTable.vue";
import _ from "lodash";

export default {
  name: "RolesForm",
  components: {
     DataTable
   },
  data() {
    return {
      form: {
        vendor_name: "",
        domain: "",
        policies: [],
      },
      loader: false,
      pageTitle: "Role",
      disableSave: false,
      rules: {},
      policyList: [],
      // domainList: [],
      formRules: {
        label: [
          {
            required: true,
            message: "Please enter label",
            trigger: "blur",
          },
        ],
        name: [
          {
            required: true,
            message: "Please enter name",
            trigger: "blur",
          },
        ],
      },
        //Define tableParamsForFieldAccess
        tableParamsForFieldAccess : {
        apiName: `/portal/api/de-role-access`,
        tableName: "de_field_role_access",
        pageTitle: "Field Access",
        isRegxSearch: true,
        queryParam: { active:true, type:"fields", role_id:this.$route.query.id },
        isRestify: false,
        showSortOptions: false,
        customfilter: false,
        limit: 5,
        aggregation: true,
        showPaginationOptions: true,
        addButtonConfig: {
          path: `/idp/role-field-access-form`, 
          name: "Add Role Fields"
        },  
        /** 
         * 'refreshEventName' is used to pass the event name to refresh the datatable.
         * This allows for updating a specific datatable when there are two or more datatables on the same page
         * Example usage: EventBus.$on("refreshTable__" + refreshEventName)
         * */
        refreshEventName: "de_field_role_access"
      },
      tableParamsForTabAccess : {
        apiName: `/portal/api/de-role-access`,
        tableName: "de_tab_role_access",
        pageTitle: "Tab Access",
        isRegxSearch: true,
        queryParam: { active: true, type: "tabs", role_id: this.$route.query.id },
        isRestify: false,
        limit: 5,
        addButtonConfig: {
          path: `/idp/role-tab-access-form`, 
          name: "Add Role Tabs"
        },
        /** 
         * 'refreshEventName' is used to pass the event name to refresh the datatable.
         * This allows for updating a specific datatable when there are two or more datatables on the same page
         * Example usage: EventBus.$on("refreshTable__" + refreshEventName)
         * */
        refreshEventName: "de_tab_role_access"
      }
    };
  },
  methods: {
    async init(recordId) {
      try {
        const projection=["label", "name", "policies"]
        let roleFieldsData = await RolesService.fetchById(recordId, projection);
        this.form = Object.assign({}, this.form, roleFieldsData); 
        // storing record in store for future use       
        this.$store.commit('userAccessStore/setCurrentRecord', roleFieldsData);
      } catch (error) {
        this.notifyError("Error : ",error);
      }
    },
   
    async fetchPolicies() {
      this.loader = true;
      try {
        const policies = await UserService.getPolicies({active:true});
        this.policyList = (policies || []).map((policy) => {
          return { value: "" + policy._id, label: "" + policy.name };
        });
      } catch (e) {
        console.error(e);
      }
      this.loader = false;
    },
    // Removed user domain dependancy
    //  async fetchDomains() {
    //   this.loader = true;
    //   try {
    //     const domains = await UserService.getDomains();
    //     this.domainList = (domains || []).map((domain) => {
    //       return { value: "" + domain._id, label: "" + domain.name };
    //     });
    //   } catch (e) {
    //     console.error(e);
    //   }
    //   this.loader = false;
    // },
    async save() {
      this.disableSave = true;
      this.$setLoader({
        target: "#save-btn",
        spinner: "el-icon-loading",
      });
      let valid = await this.$refs.form.validate().catch((error) => {
        this.notifyError(error);
      });
      if (!valid) {
        this.$resetLoader();
        this.disableSave = false;
        return;
      }
      return this.insertRecord();
    },
    insertRecord() {
      this.loader = true;
      RolesService.save(this.form)
        .then((response) => {
          this.$router.push({ path: "/idp/roles" });
          this.notifySuccess("Record saved successfully");
        })
        .catch((error) => {
          this.notifyError("Error while processing");
        })
        .finally(() => {
          this.$resetLoader();
          this.loader = false;
          this.disableSave = false;
        });
    },
  },
  beforeMount() {
    this.$store.commit("setDisplayIdpTree", false);
    this.$store.commit("setDisplayIdpNavbar", true);
    this.fetchPolicies();
    // this.fetchDomains();
    let recordId = this.$route.query.id;
    if (recordId){
      this.init(recordId);
    }
  },
};
</script>

<style lang="scss">
@import "../_idpGlobal";
.tab-access-list-table{
  .table-toolbar .export-btn{
    margin-left: 0rem;
  }
}
//added style for top spacing for datatable
.role-access-table{
    margin-top: 5rem;
    margin-bottom: 5rem;
  }
</style>
