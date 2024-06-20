<template>
<el-main>
    <div class="kp-back-to-parent">
        <el-button class="kp-btn-back" icon="el-icon-back" v-on:click="displayList"></el-button>
        <h1 class="kp-page-title">{{pageTitle}}</h1>
    </div>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/master-system-list' }">Master system</el-breadcrumb-item>
        <el-breadcrumb-item>{{pageTitle}}</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- Form  Page -->

    <div class="kp-form-area">
        <div class="kp-form-panel">
            <el-row>
                <el-col>
                    <el-form :label-position="labelPosition" label-width="100px" :model="form" :rules="formRules" ref="form">
                        <ConfirmModel ref="model"></ConfirmModel>
                        <el-row :gutter="72">
                            <el-col :span="8">
                                <div class="kp-form-input-1 kp-form-field">
                                    <!-- <div prop="object_type" class="kp-form-field-label">
                                    Object Type
                                </div> -->
                                    <el-form-item class="kp-form-field-label" prop="system_name" label="System name">

                                        <el-input v-model="form.system_name" placeholder="E.g. JIRA"></el-input>
                                    </el-form-item>
                                </div>
                                <div class="kp-form-input-1 kp-form-field">

                                    <el-form-item class="kp-form-field-label" prop="system_version" label="System version">
                                        <el-input v-model="form.system_version" placeholder="E.g. 1.0"></el-input>
                                    </el-form-item>
                                </div>
                                <el-checkbox class="kp-form-field-checkbox1" v-model="form.is_oauth">Oauth enabled</el-checkbox>

                            </el-col>

                            <el-col :span="8">
                                <div class="kp-form-input-1 kp-form-field">

                                    <el-form-item class="kp-form-field-label" prop="system_type" label="System type">
                                        <el-input v-model="form.system_type" placeholder="E.g. ITSM"></el-input>
                                    </el-form-item>
                                </div>
                                <div class="kp-form-input-1 kp-form-field">

                                    <el-form-item class="kp-form-field-label" prop="label" label="Label">
                                        <el-input v-model="form.label" placeholder="E.g. JIRA"></el-input>
                                    </el-form-item>
                                </div>
                                <el-checkbox class="kp-form-field-checkbox1" v-model="form.is_authentication_required">Authentication required</el-checkbox>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-col>
            </el-row>
        </div>
        <el-button class="kp-btn-form-primary" type="primary" v-on:click="save" :key="buttonKey">
            Save
        </el-button>
        <el-button v-on:click="displayList" class="kp-btn-form-outline">Cancel</el-button>
        <div v-if="!isFormValid" class="kp-form-error">
            * Please check field with errors
        </div>
    </div>  
  </el-main>
</template>

<script>
import SystemService from "../../services/SystemService";
import _ from "lodash";
import ConfirmModel from "@/components/ConfirmModel";

export default {
  name: "MasterSystemForm",
  components: {
    ConfirmModel
  },
  data() {
    return {
      labelPosition: "top",
      pageTitle: "New master system",
      form: {},
      buttonKey: 1,
      isFormValid: true,
      cacheDataModal: {
        cachedForm: {},
        isFormEdited: false,
        isEditForm: false,
        isNewForm: false,
      },
      formRules: {
        system_name: [
          {
            required: true,
            message: "Please enter system name",
            trigger: "blur"
          }
        ],
        system_type: [
          {
            required: true,
            message: "Please enter system type",
            trigger: "blur"
          }
        ],
        system_version: [
          {
            // required: true,
            message: "Please enter system version",
            trigger: "blur"
          }
        ],
        label: [
          {
            required: true,
            message: "Please enter label",
            trigger: "blur"
          }
        ]
      }
    };
  },
  watch: {
    form: {
      handler(newVal, oldVal) {
         if (this.cacheDataModal.isNewForm || this.cacheDataModal.isEditForm) {
          this.cacheDataModal.isFormEdited =
            JSON.stringify(this.cacheDataModal.cachedForm) !=
            JSON.stringify(this.form);
        }
      },
      deep: true
    }
  },
  methods: {
    save() {
      this.$refs.form.validate(valid => {
        this.isFormValid = valid;
        if (!valid) {
          return;
        }
        this.cacheDataModal.isFormEdited = false;
        SystemService.saveMasterSystem(this.form)
          .then(response => {
            this.form._id = response._id;
            this.notifySuccess("Record saved successfully");
            this.$router.push({
              path: "/master-system-list"
            });
          })
          .catch(error => {
            this.isFormValid = false;
            this.notifyError("There is an error in saving master system data");
          });
        this.buttonKey++;
      });
    },

    fetchRecordId() {
      return this.$route.query.id;
    },
    displayList() {
      this.$router.push({
        path: "/master-system-list"
      });
    },
    async init() {
      let recordId = this.fetchRecordId();
      if (recordId) {
        let response = await SystemService.fetchMasterSystemById(
          recordId
        ).catch(error => {
          this.notifyError("There is an error in fetching master system data");
        });
        this.form =
          (response && _.defaultsDeep(response, this.form)) || this.form;
        this.cacheDataModal.isEditForm = true;
        this.cacheDataModal.isFormEdited = false;
        this.cacheDataModal.cachedForm = { ...this.form };
        this.pageTitle = "Edit master system";
        return;
      } else {
        this.cacheDataModal.isNewForm = true;
        this.cacheDataModal.isFormEdited = false;
        this.cacheDataModal.cachedForm = { ...this.form };
      }
      this.pageTitle = "New master system";
    }
  },

  beforeMount() {
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
@import "../../assets/scss/_variables";
// Global Components
</style>
