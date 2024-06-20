<template>
<el-main>
    <div class="kp-back-to-parent">
        <el-button class="kp-btn-back" icon="el-icon-back" v-on:click="$router.push('notification-processor-list')"></el-button>
        <h1 class="kp-page-title">Notification processor</h1>
    </div>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/notification-processor-list' }">Notification processor</el-breadcrumb-item>
        <el-breadcrumb-item>Add Notification processor</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="kp-form-area">
        <div class="kp-form-panel">
            <el-row>
                <el-col>
                    <el-form :label-position="labelPosition" label-width="100px" :model="form" :rules="validationRules" ref="form">
                        <ConfirmModel ref="model"></ConfirmModel>
                        <el-row :gutter="72">
                            <el-col :span="8">
                                <div class="kp-form-select-1 kp-form-field">
                                    <el-form-item class="kp-form-field-label" prop="master_system_id" label="System">
                                        <el-select @change="onSystemChange" placeholder="Please select system" v-model="form.master_system_id">
                                            <el-option v-for="system in masterSystemList" :value="system._id" :key="system._id" :label="system.system_name"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </div>
                            </el-col>
                        </el-row>
                        <el-row :gutter="72">
                            <el-col :span="16">
                                <div class="kp-form-select-1 kp-form-field">
                                    <el-form-item class="kp-form-field-label" prop="script" label="Script" id="code-mirror-wrapper">
                                        <codemirror :value="form.script" v-model="form.script" :options="editorOptions"></codemirror>
                                    </el-form-item>
                                </div>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-col>
            </el-row>
        </div>
        <el-button v-on:click.once="onSave" :key="buttonKey" class="kp-btn-form-primary" type="primary">Save</el-button>
        <el-button v-on:click="$router.push('notification-processor-list')" class="kp-btn-form-outline">Cancel</el-button>
        <div v-if="!isFormValid" class="kp-form-error">* Please check field with errors</div>
    </div>
</el-main>
</template>

<script>
import _ from "lodash";
import Constants from "@/resources/Constants";
import Codemirror from "@/components/Codemirror";
import SystemService from "@/services/SystemService";
import CommonService from "@/services/CommonService";
import constants from "@/resources/Constants";
import ConfirmModel from "@/components/ConfirmModel";
import Validator from "@/services/Validator";

export default {
  name: "NotificationProcessorForm",
  components: {
    Codemirror,
    ConfirmModel
  },
  data() {
    return {
      labelPosition: "top",
      isFormValid: true,
      cacheDataModal: {
        cachedForm: {},
        isFormEdited: false,
        isEditForm: false,
        isNewForm: false
      },
      form: {
        system_name: "",
        script: ""
      },
      masterSystemList: [],
      buttonKey: 1,
      endpoint: constants.NOTIFICATION_PROCESSOR_ENDPOINT,
      editorOptions: {
        mode: "text/javascript",
        theme: "default"
      },
      validationRules: this.validationRules()
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
    async init() {
      try {
        if (!this.$route.query.id) {
          this.cacheDataModal.isNewForm = true;
          this.cacheDataModal.isFormEdited = false;
          this.cacheDataModal.cachedForm = { ...this.form };
          return;
        }
        await this.setForm();
        this.cacheDataModal.isEditForm = true;
        this.cacheDataModal.isFormEdited = false;
        this.cacheDataModal.cachedForm = { ...this.form };
      } catch (e) {
        console.log(e);
      }
    },
    async setForm() {
      this.form = await CommonService.fetchById(
        this.endpoint,
        this.$route.query.id
      ).catch(error => {
        this.notifyError("Error while fetching notification processor data");
      });
    },

    async fetchMasterSystems() {
      this.masterSystemList = await SystemService.fetchMasterSystems().catch(
        error => {
          this.notifyError("Error while fetching master system");
        }
      );
    },

    onSystemChange(master_system_id) {
      let master_system = _.find(this.masterSystemList, {
        _id: master_system_id
      });
      this.form.system_name = master_system.system_name;
    },

    async onSave() {
      this.$refs.form.validate(valid => {
        this.isFormValid = valid;
        if (!valid) {
          return;
        }
      });
      let isValid = await this.$refs.form.validate().catch(error => {});
      this.cacheDataModal.isFormEdited = false;
      let form =
        isValid &&
        (await CommonService.save(this.endpoint, this.form).catch(error => {
          this.notifyError("Error while processing");
        }));
      if (form) {
        this.form._id = form._id; // add service id after first request to existing service object to avoid duplicate service entries
        this.notifySuccess("Record saved successfully!!");
        this.$router.push({
          path: "/notification-processor-list"
        });
      }
      this.buttonKey++;
    },

    validationRules() {
      return {
        system_name: [
          {
            required: true,
            message: "Please select system",
            trigger: "blur"
          }
        ],
        script: [
          {
            // required: true,
            message: "Please provide script",
            required: true,
            validator: Validator.scriptValidator,
            // message: "Please provide script",
            trigger: "blur"
          }
        ]
      };
    }
  },

  beforeMount() {
    let user = this.$store.getters.user;
    if (user.roles.includes("admin")) {
      this.showList = true;
    }
    this.init();
    this.fetchMasterSystems();
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
</style>
