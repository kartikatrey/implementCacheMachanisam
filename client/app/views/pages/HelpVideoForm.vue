<template>
<el-main>
    <div class="kp-back-to-parent">
        <el-button class="kp-btn-back" icon="el-icon-back" v-on:click="displayList"></el-button>
        <h1 class="kp-page-title">{{pageTitle}}</h1>
    </div>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/help-video-list' }">Help videos</el-breadcrumb-item>
        <el-breadcrumb-item>{{pageTitle}}</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- Form  Page -->

    <div class="kp-form-area">
        <div class="kp-form-panel">
            <el-row>
                <el-col>
                  <el-form :label-position="labelPosition" label-width="100px" :model="help_video" :rules="validationRules" ref="ruleForm">
                  
                    <ConfirmModel ref="model"></ConfirmModel>
                    <el-row :gutter="72">
                        <el-col :span="8">
                            <div class="kp-form-input-1 kp-form-field">
                                <el-form-item label="Statement" prop="statement" class="kp-form-field-label">
                        <el-input v-model="help_video.statement" placeholder=""></el-input>
                    </el-form-item>
                            
                            </div>
                           

                            <div class="kp-form-select-1 kp-form-field">

                                     <el-form-item label="Link" prop="link" class="kp-form-field-label">
                        <el-input v-model="help_video.link" placeholder=""></el-input>
                    </el-form-item>
                            </div>
                                               
                        </el-col>

                        <el-col :span="8">
                              <div class="kp-form-select-1 kp-form-field">
                                <el-form-item prop="customer_id" label="Customer" class="kp-form-field-label">
                        <el-select placeholder="Please select customer" v-model="help_video.customer_id" filterable>
                            <el-option v-for="customer in customers" :value="customer._id" :key="customer._id" :label="customer.customer_name"></el-option>
                        </el-select>
                    </el-form-item>
                                 
                            </div>  
         
                        </el-col>
                    </el-row>
                      
                    </el-form>
                </el-col>
            </el-row>
        </div>
        <el-button v-on:click.once="save" :key="buttonKey" class="kp-btn-form-primary" type="primary"> Save</el-button>
        <el-button v-on:click="displayList" class="kp-btn-form-outline">Cancel</el-button>
        <div v-if="!isFormValid" class="kp-form-error">
            * Please check field with errors
        </div>

    </div>
    </el-main>
</template>



<script>
import _ from "lodash";
import Json from "@/util/Json";
import CommonService from "@/services/CommonService";
import constants from "@/resources/Constants";
import CustomerService from "@/services/CustomerService";
import ConfirmModel from "@/components/ConfirmModel";

export default {
  name: "HelpVideoFrom",
  components: {
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
      requiredParam: {},
      pageTitle: "New video",
      editorOptions: {
        mode: "text/javascript",
        theme: "default"
      },
      help_video: {},
      customers: [],
      buttonKey: 1,
      endpoint: constants.HELP_VIDEO_ENDPOINT,
      validationRules: this.setValidationRules()
    };
  },
  watch: {
    help_video: {
      handler(newVal, oldVal) {
        if (this.cacheDataModal.isNewForm || this.cacheDataModal.isEditForm) {
          this.cacheDataModal.isFormEdited =
            JSON.stringify(this.cacheDataModal.cachedForm) !=
            JSON.stringify(this.help_video);
        }
      },
      deep: true
    }
  },
  methods: {
    async init() {
      const videoId = this.getVideoIdFromUrl();
      if (videoId) {
        let help_video = await CommonService.fetchById(
          this.endpoint,
          videoId
        ).catch(error => {
          this.notifyError("Error while fetching video data");
        });

        this.help_video =
          (help_video && _.defaultsDeep(help_video, this.help_video)) ||
          this.help_video;

        this.cacheDataModal.isNewForm = true;
        this.cacheDataModal.isFormEdited = false;
        this.cacheDataModal.cachedForm = { ...this.help_video };
        this.pageTitle = "Edit video";
      } else {
        this.cacheDataModal.isNewForm = true;
        this.cacheDataModal.isFormEdited = false;
        this.cacheDataModal.cachedForm = { ...this.help_video };
      }
    },
    getVideoIdFromUrl() {
      return this.$route.query.id || "";
    },

    async save() {
      let isValid = await this.$refs.ruleForm.validate().catch(error => {});
      this.isFormValid = isValid;
      this.cacheDataModal.isFormEdited = false;
      let help_video =
        isValid &&
        (await CommonService.save(this.endpoint, this.help_video).catch(
          error => {
            this.isFormValid = false;
            this.notifyError("Error while saving video data!!");
          }
        ));
      if (help_video) {
        this.help_video._id = help_video._id; // add service id after first request to existing service object to avoid duplicate service entries
        this.notifySuccess("Video saved successfully!!");
        this.displayList();
      }
      this.buttonKey++;
    },
    async fetchCustomers() {
      this.customers = await CustomerService.find().catch(error => {
        this.notifyError("Error while fetching customer");
      });
    },

    displayList() {
      this.$router.push({
        path: "/help-video-list"
      });
    },
    setValidationRules() {
      return {
        statement: [
          {
            required: true,
            message: "Please input statement",
            trigger: "change"
          }
        ],
        link: [
          {
            required: true,
            message: "Please input link",
            trigger: "change"
          }
        ],
        customer_id: [
          {
            required: true,
            message: "Please input link",
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

  beforeMount() {
    let user = this.$store.getters.user;
    if (user.roles.includes("admin")) {
      this.showList = true;
    }
    this.init();
    this.fetchCustomers();
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
</style>