<template>
  <el-main class="kp-main">
    <section class="page-body">
      <div class="page-title">
        <el-button
          cid="form-header-back"
          class="back-button"
          icon="mdi mdi-arrow-left-circle-outline"
          v-on:click="$router.push('/idp/schedular-list')"
        >
        </el-button>
        <span class="page-title-text"> {{ pageTitle }}</span>
        <span> Add new schedular and edit existing </span>
      </div>

      <section class="form-page-container">
        <div class="panel">
          <div class="panel-body">
            <el-form
              :model="form"
              :rules="formRules"
              ref="form"
              label-position="left"
              label-width="100px"
            >
              <div class="grouping-tile">General configuration</div>
              <el-row :gutter="40">
                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item prop="name" label="Name">
                      <el-input
                        name="name"
                        cid="schedular-name"
                        v-model="form.name"
                        placeholder="schedular name"
                      ></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item
                      prop="schedule_format"
                      label="Schedule format"
                    >
                      <el-input
                        name="schedule_format"
                        cid="schedule-format-name"
                        v-model="form.schedule_format"
                        placeholder="Schedule format "
                      ></el-input>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="40">
                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item
                      class="control-label col-sm-2"
                      prop="customer_name"
                      label="Customer"
                    >
                      <el-select
                        @change="onCustomerChange"
                        v-model = "selectedCustomers"
                        class="select-box"
                        multiple
                        clearable
                        id="schedular-form-customer-select"
                        collapse-tags
                        placeholder="Select customer"
                        filterable
                      >
                        <el-option
                          v-for="(item, index) in customerList"
                          :cid="'schedular-form-customer' + index"
                          :key="item._id"
                          :label="item.customer_name"
                          :value="item.customer_name"
                          label-width="170px"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item
                      class="control-label col-sm-2"
                      prop="ends_on"
                      label="Ends on"
                    >
                      <div class="ends-on-date-picker">
                        <el-collapse>
                          <el-date-picker
                            v-model="form.ends_on"
                            cid="schedular-form-ends-on"
                            type="date"
                            placeholder="pick a day"
                            :picker-options="pickerOptions"
                          >          
                          </el-date-picker>
                        </el-collapse>
                      </div>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="40">

                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item prop="active" label="Active">
                      <el-checkbox
                        class="active-input"
                        prop="active"
                        v-model="form.active"
                      ></el-checkbox>
                    </el-form-item>
                  </div>
                </el-col>
                 <!-- Check box to export connector script in schedular script -->
                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item prop="script_export" label="Is script export allowed?">
                      <el-checkbox
                        class="script_export"
                        prop="script_export"
                        v-model="form.script_export"
                      ></el-checkbox>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="24">
                  <div class="kp-form-group schedular-script">
                    <el-form-item prop="script" label="Script">
                      <!-- <codemirror
                        cid="schedular-form-script"
                        :value="form.script"
                        v-model="form.script"
                        :options="editorOptions"
                      ></codemirror> -->
                      <KanverseEditor
                        :options="{'width':'100%', 'height':'500px','language': 'businessRule'}"  
                        :content="form.script" 
                        :refreshModel="form._id !== undefined"
                        v-model="form.script" 
                        @onDidChangeModelContent="handleContentChange">
                      </KanverseEditor>
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
              <el-button
                v-on:click="$router.push('/idp/schedular-list')"
                cid="schedular-form-cancel"
                size="small"
              >
                Cancel
              </el-button>
            </div>
            <div>
              <el-button
                v-on:click="runSchedular"
                cid="schedular-form-run"
                size="small"
              >
                Run
              </el-button>
            </div>
            <div>
              <el-button
                cid="schedular-form-save"
                id="save-btn"
                v-on:click="save"
                size="small"
                type="primary"
              >
                Save
              </el-button>
            </div>
          </footer>
        </div>
        <!-- | panel -->
      </section>
      <!-- | form-page-container -->
    </section>
    <VersionRelatedList v-if="showVersionList" :id="form._id"  title="Schedular versions"></VersionRelatedList>
  </el-main>
</template>

<script>
import constants from "@/resources/Constants";
import Codemirror from "@/components/Codemirror";
import Validator from "@/services/Validator";
import KanverseEditor from "@/components/KanverseEditor";
import EventBus from "@/EventBus";
import SchedularService from "@/idp/services/SchedularService";
import CustomerService from "@/idp/services/CustomerService";
import VersionRelatedList from "@/idp/components/VersionRelatedList.vue";
import _ from "lodash";
export default {
  name: "SchedularForm",
  components: {
    Codemirror,
    VersionRelatedList,
    KanverseEditor
  },
  data() {
    var EmptyValueValidator = (rule, value, callback) => {
      if (value && ("" + value).trim() === "") {
        callback(new Error("Please enter valid label name"));
      } else {
        callback();
      }
    };
    return {
      customerList: [],
      endpoint: constants.SCHEDULAR_ENDPOINT,
      selectedCustomers: [],
      form: {
        name: "",
        active: true,
        script_export: false,
        script: "",
        schedule_format: "",
        customer_id: [],
        ends_on:''
      },
      editorOptions: {
        mode: "text/javascript",
        theme: "default",
      },
      fields_message_mapping: {
        name: "Please provide Name",
        script: "Script cannot be empty",
        schedule_format: "Schedule format cannot be empty",
      },
      pageTitle: "Schedular",
      rules: {},
      showVersionList:true,
      formRules: {
        name: [
          {
            validator: EmptyValueValidator,
            trigger: "blur",
            message: "Please provide Name",
          },
          {
            required: true,
            message: "Please provide Name",
            trigger: "blur",
          },
        ],
        script: [
          {
            validator: Validator.scriptValidator,
            trigger: "blur",
            message: "Syntax errors found.", // This message replaced with actual sytanx error 
          },
          {
            required: true,
            message: "Script cannot be empty",
            trigger: "blur",
          },
        ],

        script: [
          {
            validator: EmptyValueValidator,
            trigger: "blur",
            message: "Script cannot be empty",
          },
          {
            required: true,
            message: "Script cannot be empty",
            trigger: "blur",
          },
        ],

        schedule_format: [
          {
            validator: EmptyValueValidator,
            trigger: "blur",
            message: "Schedule format cannot be empty",
          },
          {
            required: true,
            message: "Schedule format cannot be empty",
            trigger: "blur",
          },
        ],
      },
      pickerOptions: {
        disabledDate: (time) => {
          // Disable dates before today, as the end date cannot be a past date.
          // Here 8.64e7 - The number of milliseconds in a day
          // The purpose of subtracting 8.64e7 from the current time (Date.now()) is to disable dates before today
          return time.getTime() < Date.now() - 8.64e7;
        },
      }
    };
  },

  methods: {
    handleContentChange(event, content){
      this.form.script = content;
    },
    onCustomerChange() {
      const customerIds = []
      this.customerList.forEach((customer) => {
         if(this.selectedCustomers.includes(customer.customer_name)){
           customerIds.push(customer._id)
         }
      })
      this.form.customer_id = customerIds
    },

    async getCustomerList() {
      try {
        const params = { select: ["customer_name"] };
        const customerList = await CustomerService.find({ type: "IDP" }, params);
        this.customerList = _.sortBy(customerList,'customer_name','asc');
      } catch (e) {
        console.log(e);
      }
    },

    async init(recordId) {
      try {
        let schedularData = await SchedularService.fetchById(recordId);
        this.form = Object.assign({}, this.form, schedularData);
        this.customerList.forEach((customer) => {
          if (this.form.customer_id.includes(customer._id)) {
            this.selectedCustomers.push(customer.customer_name)
          }
        })
      } catch (error) {
        this.notifyError("Error");
      }
    },

    async save() {
      this.showVersionList = false;
      let valid = await this.$refs.form.validate().catch((error) => {});
      if (!valid) {
        return;
      }
      return this.insertRecord();
    },
    async runSchedular() {
      try {
        const schedulerId = _.get(this.$route, 'query.id');
        const response = await SchedularService.runSchedulerById(schedulerId)
        response.data.status ? this.notifySuccess(response.data.message) : this.notifyError(response.data.message)
      } catch (error) {
        this.notifyError('An error occurred while running the scheduler');
      }
    },
    async insertRecord() {
      await SchedularService.save(this.form)
        .then((response) => {
          this.form = response.data;
          this.notifySuccess("Record saved successfully");
          // this.$router.push({
          //   path: "/idp/schedular-list",
          // });
          return;
        })
        .catch((error) => {
          this.notifyError("Error while processing");
        }).finally(() => {
          this.showVersionList = true;
        })
    },

    addFormRules() {
      let rules = {};
      _.each(this.fields_message_mapping, (message, field) => {
        let ruleArr = [];
        ruleArr.push({
          validator: this.EmptyValueValidator,
          trigger: "blur",
          message: message,
        });
        ruleArr.push({
          required: true,
          message: message,
          trigger: "blur",
        });
        rules[field] = ruleArr;
      });
      this.rules = rules;
    },
  },
  async beforeMount() {
    await this.getCustomerList();
    this.$store.commit("setDisplayIdpTree",false);
    this.$store.commit("setDisplayIdpNavbar",true);
    let recordId = this.$route.query.id;
    this.addFormRules();
    if (recordId) this.init(recordId);
  },
};
</script>

<style lang="scss" >
@import "../_idpGlobal";
.schedular-script .CodeMirror {
  height: 350px;
}
</style>

 