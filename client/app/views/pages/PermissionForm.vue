<template>
  <el-main>
    <div class="kp-back-to-parent">
      <el-button class="kp-btn-back" icon="el-icon-back" v-on:click="displayList"></el-button>
      <h1 class="kp-page-title">{{pageTitle}}</h1>
    </div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/permission-list' }">Permission</el-breadcrumb-item>
      <el-breadcrumb-item>{{pageTitle}}</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- Form  Page -->

    <div class="kp-form-area">
      <div class="kp-form-panel">
        <el-row>
          <el-col>
            <el-form
              :label-position="labelPosition"
              label-width="100px"
              :model="cp_permission"
              :rules="validationRules"
              ref="ruleForm"
            >
              <ConfirmModel ref="model"></ConfirmModel>
              <el-row :gutter="72">
                <el-col :span="8">
                  <div class="kp-form-input-1 kp-form-field">
                    <el-form-item
                      label="Permission name"
                      prop="permission_name"
                      class="kp-form-field-label"
                    >
                      <el-input v-model="cp_permission.permission_name" placeholder></el-input>
                    </el-form-item>
                  </div>
                  <div class="kp-form-input-1 kp-form-field">
                    <el-form-item
                      label="Resource name"
                      prop="resource_name"
                      class="kp-form-field-label"
                    >
                      <el-input v-model="cp_permission.resource_name" placeholder></el-input>
                    </el-form-item>
                  </div>
                  <div class="kp-form-input-1 kp-form-field">
                    <el-form-item label="Roles" prop="roles" class="kp-form-field-label">
                      <el-select
                            v-model="cp_permission.roles"
                            multiple
                            default-first-option
                            clearable
                            placeholder="Select Role"
                      >
                        <el-option
                            v-for="role in roles"
                            :key="role.value"
                            :label="role.label"
                            :value="role.value"
                          >
                        </el-option>
                      </el-select>
                   </el-form-item>
                </div>
                </el-col>

                <el-col :span="8">
                  <div class="kp-form-input-1 kp-form-field">
                    <el-form-item label="Operation" prop="operation" class="kp-form-field-label">
                      <el-select
                        v-model="cp_permission.operation"
                        @change="onOperationChange"
                        placeholder="Select"
                        label="Operation"
                      >
                        <el-option label="Read" value="read"></el-option>
                        <el-option label="Write" value="write"></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                  <div class="kp-form-input-1 kp-form-field">
                    <el-form-item
                      label="Column name"
                      prop="column_name"
                      class="kp-form-field-label"
                    >
                      <el-input v-model="cp_permission.column_name" placeholder></el-input>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
            </el-form>
          </el-col>
        </el-row>
      </div>
      <el-button v-if="isSaveActionAllowed" v-on:click.once="save" :key="buttonKey" class="kp-btn-form-primary" type="primary">Save</el-button>
      <el-button v-on:click="displayList" class="kp-btn-form-outline">Cancel</el-button>
      <div v-if="!isFormValid" class="kp-form-error">* Please check field with errors</div>
    </div>
  </el-main>
</template>


<script>
import _ from "lodash";
import Json from "@/util/Json";
import CommonService from "@/services/CommonService";
import constants from "@/resources/Constants";
import ConfirmModel from "@/components/ConfirmModel";
import formMixin from "@/mixins/formMixin.js";

export default {
  name: "PermissionFrom",
  mixins: [formMixin],
  components: {
    ConfirmModel
  },
  data() {
    return {
      labelPosition: "top",
      isFormValid: true,
      isSaveActionAllowed: true,
      cacheDataModal: {
        cachedForm: {},
        isFormEdited: false,
        // isEditForm: false,
        // isNewForm: false,
      },
      requiredParam: {},
      pageTitle: "New permission",
      cp_permission: {},
      buttonKey: 1,
      endpoint: constants.PERMISSION_ENDPOINT,
      validationRules: this.setValidationRules(),
      roles: constants.ROLES,
    };
  },
  watch: {
    cp_permission: {
      handler(newVal, oldVal) {
          let cachedForm = _.pickBy(this.cacheDataModal.cachedForm , _.identity);
          let cp_permission = _.pickBy(this.cp_permission , _.identity);
        
        cachedForm = JSON.stringify(cachedForm).replace(/\\n|\\t|\\r/g,"");

          cp_permission = JSON.stringify(cp_permission).replace(/\\n|\\t|\\r/g,"");
          
            this.cacheDataModal.isFormEdited =  cachedForm !=
            cp_permission ;
        
      },
      deep: true
    }
  },
  methods: {
    async init() {
      const permissionId = this.$route.query.id;

      if (permissionId) {
        let cp_permission = await CommonService.fetchById(
          this.endpoint,
          permissionId
        ).catch(error => {
          this.notifyError("Error while fetching menu data");
        });
       
        this.cp_permission =
          (cp_permission &&
            _.defaultsDeep(cp_permission, this.cp_permission)) ||
          this.cp_permission;
        //this.cp_permission.roles = cp_permission.roles.join(",");
        this.cp_permission.roles = cp_permission.roles;//added beacause of multiple permission selection
        //  this.cacheDataModal.isEditForm = true;
        // this.cacheDataModal.isFormEdited = false;
        this.cacheDataModal.cachedForm = { ...this.cp_permission };
        this.pageTitle = "Edit permission";
      } else {
        // this.cacheDataModal.isNewForm = true;
        // this.cacheDataModal.isFormEdited = false;
        this.cacheDataModal.cachedForm = { ...this.cp_permission };
      }
    },
    getPermissionIdFromUrl() {
      return this.$route.query.id || "";
    },

    async save() {
      let isValid = await this.$refs.ruleForm.validate().catch(error => {});
      this.isFormValid = isValid;
      let clone_cp_permission = _.cloneDeep(this.cp_permission);
      
      clone_cp_permission.roles = _.isString(this.cp_permission.roles) ? this.cp_permission.roles.split(","):this.cp_permission.roles;
      this.cacheDataModal.isFormEdited = false;
      let cp_permission =
        isValid &&
        (await CommonService.save(this.endpoint, clone_cp_permission).catch(
          error => {
            this.isFormValid = false;
            this.notifyError("Error while saving permission data!!");
          }
        ));
      if (cp_permission) {
        this.cp_permission._id = cp_permission._id; // add service id after first request to existing service object to avoid duplicate service entries
        this.notifySuccess("Permission saved successfully!!");
        this.displayList();
      }
      this.buttonKey++;
    },

    displayList() {
      this.$router.push({
        path: "/permission-list"
      });
    },
    setValidationRules() {
      return {
        permission_name: [
          {
            required: true,
            message: "Please input permission name",
            trigger: "change"
          }
        ],
        resource_name: [
          {
            required: true,
            message: "Please input resource name",
            trigger: "change"
          }
        ],
        roles: [
          {
            required: true,
            message: "Please input roles",
            trigger: "blur"
          }
        ],
        operation: [
          {
            required: true,
            message: "Please input operation",
            trigger: "change"
          }
        ]
      };
    },
    validateRequestHeader(rule, value, callback) {
      if (_.isEmpty(value)) {
        callback();
      }
      Json.isJson(value)
        ? callback()
        : callback(new Error("Please input correct JSON format!!"));
    }
  },
  onOperationChange(operation) {
    this.cp_permission.operation = operation;
  },

  async beforeMount() {
    this.isSaveActionAllowed = await this.isSaveActionPermitted('cp_permission');
    let user = this.$store.getters.user;
    if (user.roles.includes("admin")) {
      this.showList = true;
    }
    this.init();
    window.addEventListener("beforeunload", event => {
      if (!this.cacheDataModal.isFormEdited) return;
      event.preventDefault();
      event.returnValue = "";
    });
  },
  beforeRouteLeave: function(to, from, next) {
    if (this.cacheDataModal.isFormEdited) {
      //    return window.confirm('Do you really want to leave? you have unsaved changes!')
      return this.$refs.model.open(next);
    } else {
      return next();
    }
  }
};
</script>




<style lang="scss">
// Global Components

@import "../../assets/scss/_variables";
</style>