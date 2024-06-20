<template>
  <el-main id="container">
    <div class="kp-back-to-parent">
      <el-button class="kp-btn-back" icon="el-icon-back" v-on:click="displayList"></el-button>
      <h1 class="kp-page-title">Scheduler</h1>
    </div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/schedular-list'}">Schedulers</el-breadcrumb-item>
      <el-breadcrumb-item>{{pageTitle}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="kp-form-area">
      <div class="kp-form-panel">
        <el-row>
          <el-col>
            <el-form
              :label-position="labelPosition"
              label-width="100px"
              :model="schedular"
              :rules="validationRules"
              ref="ruleForm"
            >
            <ConfirmModel ref="model"></ConfirmModel>
              <el-row :gutter="72">
                <el-col :span="8">
                  <div class="kp-form-input-1 kp-form-field">
                    <el-form-item class="kp-form-field-label" label="Name" prop="name">
                      <el-input v-model="schedular.name" placeholder="Enter Name"></el-input>
                    </el-form-item>
                  </div>
                  <div class="kp-form-input-1 kp-form-field">
                    <el-form-item class="kp-form-field-label" label="Format" prop="schedule_format">
                      <el-input v-model="schedular.schedule_format" placeholder="Format"></el-input>
                    </el-form-item>
                  </div>
                </el-col>

                <el-col :span="8">
                  <div class="kp-form-input-1 kp-form-field">
                    <el-form-item class="kp-form-field-label" label="Ends On" prop="ends_on">
                      <calender
                        :value="schedular.ends_on"
                        v-model="schedular.ends_on"
                        type="datetime"
                        placeholder="Select date and time"
                      ></calender>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="72">
                <el-col :span="24">
                  <div class="kp-form-input-1 kp-form-field">
                    <el-form-item class="kp-form-field-label" label="Script" prop="script">
                      <codemirror
                        v-model="schedular.script"
                        :value="schedular.script"
                        :options="editorOptions"
                      ></codemirror>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
              <!-- </el-tab-pane>
              </el-tabs>-->
            </el-form>
          </el-col>
        </el-row>
      </div>
      <el-button v-on:click.once="save" :key="buttonKey" class="kp-btn-form-primary" type="primary">Save</el-button>
      <el-button v-on:click="displayList" class="kp-btn-form-outline">Cancel</el-button>
      <div v-if="!isFormValid" class="kp-form-error">* Please check field with errors</div>
    </div>
  </el-main>
</template>

<script>
import _ from "lodash";
import Json from "@/util/Json";
//import Element from "element-ui";
import Codemirror from "@/components/Codemirror";
import CommonService from "@/services/CommonService";
import constants from "@/resources/Constants";
import Calender from "@/components/Calender";
import moment from "moment";
import ConfirmModel from "@/components/ConfirmModel";
//import datepicker from "@/components/datepicker";
// import Datepicker from 'vuejs-datepicker';
//  import VueMaterialDateTimePicker from 'vue-material-date-time-picker'
const inputDateFormat = "YYYY-mm-dd THH:MM:ssZ";
// const outputDateFormat = 'YYYY-mm-dd THH:MM:ssZ';

export default {
  name: "SchedularFrom",
  components: {
    Codemirror,
    Calender,
    ConfirmModel
  },
  data() {
    return {
      time: "",
      cacheDataModal: {
        cachedForm: {},
        isFormEdited: false,
        isEditForm: false,
        isNewForm: false,
      },
      labelPosition: "top",
      requiredParam: {},
      pageTitle: "New Scheduler",
      editorOptions: {
        mode: "text/javascript",
        theme: "default"
      },

      schedular: { ends_on: "" },
      schema: [
        {
          fieldType: "el-date-picker",
          name: "ends_on",
          type: "date",
          placeholder: "Enter Date",
          format: "yyyy/MM/dd"
        }
      ],
      buttonKey: 1,
      endpoint: constants.SCHEDULAR_ENDPOINT,
      isFormValid: true,
      validationRules: this.setValidationRules()
    };
  },
   watch: {
    schedular: {
      handler(newVal, oldVal) {
    
          let cachedForm = _.pickBy(this.cacheDataModal.cachedForm , _.identity);
          let schedular = _.pickBy(this.schedular , _.identity);

         cachedForm = JSON.stringify(cachedForm).replace(/\\n|\\t|\\r/g,"");
          schedular = JSON.stringify(schedular).replace(/\\n|\\t|\\r/g,"");


            this.cacheDataModal.isFormEdited = cachedForm != schedular;
            
      },
      deep: true
    }
  },
  methods: {
    async init() {
      const schedularId = this.getSchedularIdFromUrl();
      if (schedularId) {
        let schedular = await CommonService.fetchById(
          this.endpoint,
          schedularId
        ).catch(error => {
          this.notifyError("Error while fetching schedular data");
        });
        this.schedular.ends_on = {
          ends_on: moment(schedular.ends_on, "yyyy/MM/DD").format("yyyy/MM/DD")
        };
       
        
        this.schedular =
          (schedular && _.defaultsDeep(schedular, this.schedular)) ||
          this.schedular;
        //  this.cacheDataModal.isEditForm = true;
        //  this.cacheDataModal.isFormEdited = false;
        this.cacheDataModal.cachedForm = { ...this.schedular};
        this.pageTitle = "Edit scheduler";
      }
      else {
        // this.cacheDataModal.isNewForm = true;
        // this.cacheDataModal.isFormEdited = false;
        this.cacheDataModal.cachedForm = { ...this.schedular};
      }
    },
    getSchedularIdFromUrl() {
      return this.$route.query.id || "";
    },

    async save() {
       this.isFormEdited = false;
      let isValid = await this.$refs.ruleForm.validate().catch(error => {});
      this.isFormValid = isValid;
      this.cacheDataModal.isFormEdited = false;
      let schedular =
        isValid &&
        (await CommonService.save(this.endpoint, this.schedular).catch(
          error => {
            this.isFormValid = false;
            this.notifyError("Error while saving schedular data!!");
          }
        ));
      if (schedular) {
        this.schedular._id = schedular._id;
        this.notifySuccess("Schedular saved successfully!!");
        this.displayList();
      }
      this.buttonKey++;
    },

    displayList() {
      this.$router.push({
        path: "/schedular-list"
      });
    },
    setValidationRules() {
      return {
        name: [
          {
            required: true,
            message: "Please  input name",
            trigger: "change"
          }
        ],
        // ends_on: [
        //   {
        //    // required: true,
        //    // message: "Please input schedular ends on",
        //     //trigger: "blur"
        //   }
        // ],
        schedule_format: [
          {
            required: true,
            message: "Please input schedule format",
            trigger: "change"
          }
        ],
        script: [
          {
            // required: true,
            message: "Please input script",
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
