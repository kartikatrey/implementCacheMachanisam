<template>
    <el-main class="kp-main">
      <section class="page-body">
        <div class="page-title">
        <el-button
          cid="form-header-back"
          class="back-button"
          icon="mdi mdi-arrow-left-circle-outline"
          v-on:click="$router.push('/idp/db_cluster')"
        >
        </el-button>
          <span class="page-title-text"> {{ pageTitle }}</span>
          <span> Add new DB Cluster and edit existing </span>
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
                      <el-form-item prop="cluster_name" label="Cluster Name">
                        <el-input
                          name="cluster_name"
                          cid="cluster_name"
                          v-model="form.cluster_name"
                          placeholder="Cluster Name"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div class="kp-form-group">
                      <el-form-item
                        prop="host"
                        label="Host"
                      >
                        <el-input
                          name="host"
                          cid="host"
                          v-model="form.host"
                          placeholder="Host"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </el-col>
                </el-row>

                <el-row :gutter="40">
                  <el-col :span="12">
                    <div class="kp-form-group">
                      <el-form-item prop="username" label="Username">
                        <el-input
                          name="username"
                          cid="username"
                          v-model="form.username"
                          placeholder="Username"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div class="kp-form-group">
                      <el-form-item
                        prop="password"
                        label="Password"
                      >
                        <el-input
                          name="password"
                          cid="password"
                          type="password"
                          v-model="form.password"
                          placeholder="Password"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </el-col>
                </el-row>

                <el-row :gutter="40">
                  <el-col :span="12">
                    <div class="kp-form-group">
                      <el-form-item label="Active">
                        <toggle-button :sync="true" :color="{
                          checked: '#5f8fdf',
                          unchecked: '#DCDFE6',
                          disabled: '#CCCCCC',
                        }" :labels="{ checked: 'YES', unchecked: 'NO' }" cid="db-cluster-form-enable-ative" v-model="form.active"></toggle-button>
                        
                      </el-form-item>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div class="kp-form-group">
                      <el-form-item label="Master">
                        <toggle-button :sync="true" :color="{
                          checked: '#5f8fdf',
                          unchecked: '#DCDFE6',
                          disabled: '#CCCCCC',
                        }" :labels="{ checked: 'YES', unchecked: 'NO' }" cid="db-cluster-form-enable-is_master" v-model="form.is_master"></toggle-button>
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
                  v-on:click="$router.push('/idp/db_cluster')"
                  cid="dbcluster-form-cancel"
                  size="small"
                >
                  Cancel
                </el-button>
              </div>
              <div>
                <el-button
                  cid="dbcluster-form-save"
                  id="save-btn"
                  v-on:click="saveDbCluster"
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
    </el-main>
  </template>
  
  <script>
  import constants from "@/resources/Constants";
  import Codemirror from "@/components/Codemirror";
  import EventBus from "@/EventBus";
  import DbClusterService from "@/idp/services/DbClusterService";
  import CustomerService from "@/idp/services/CustomerService";
  import VersionRelatedList from "@/idp/components/VersionRelatedList.vue";
  import _ from "lodash";
  export default {
    name: "DbClusterForm",
    components: {
      Codemirror,
      VersionRelatedList,
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
        form: {
          cluster_name: "",
          host: "",
          active: false,
          username: "",
          password: "",
          is_master: false
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
        pageTitle: "DB Clusters",
        rules: {},
        showVersionList:true,
        formRules: {
          cluster_name: [
            {
              validator: EmptyValueValidator,
              trigger: "blur",
              message: "Please provide cluster name",
            },
            {
              required: true,
              message: "Please provide cluster name",
              trigger: "blur",
            },
          ],
          host: [
            {
              validator: EmptyValueValidator,
              trigger: "blur",
              message: "Please provide Host",
            },
            {
              required: true,
              message: "Please provide Host",
              trigger: "blur",
            },
          ],
          username: [
            {
              validator: EmptyValueValidator,
              trigger: "blur",
              message: "Please provide Username",
            },
            {
              required: true,
              message: "Please provide Username",
              trigger: "blur",
            },
          ],
          password: [
            {
              validator: EmptyValueValidator,
              trigger: "blur",
              message: "Please provide Password",
            },
            {
              required: true,
              message: "Please provide Password",
              trigger: "blur",
            },
          ],
          active: [
            {
              validator: EmptyValueValidator,
              trigger: "blur",
              message: "Please active true or false",
            },
            {
              required: true,
              message: "Please active true or false",
              trigger: "blur",
            },
          ],
          is_master: [
            {
              validator: EmptyValueValidator,
              trigger: "blur",
              message: "Please select if master true or false",
            },
            {
              required: true,
              message: "Please select if master true or false",
              trigger: "blur",
            },
          ]

        },
      };
    },
  
    methods: {
      async init(recordId) {
        try {
          let dbClusterData = await DbClusterService.fetchDbClusterById(recordId);
          this.form = Object.assign({}, this.form, dbClusterData);
        } catch (error) {
          this.notifyError("Error");
        }
      },
  
      async saveDbCluster() {
        let valid = await this.$refs.form.validate().catch((error) => {});
        if (!valid) {
          return;
        }
        return this.insertRecord();
      },
  
      async insertRecord() {
        try {
          let dbClusterData = await DbClusterService.saveDbCluster(this.form)
          this.form = dbClusterData.data;
          this.notifySuccess("Record saved successfully");
          this.$router.push({
            path: "/idp/db_cluster",
          });
          return;
        } catch (error) {
           this.notifyError("Error while processing DB Cluster Data");
        }
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
    beforeMount() {
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
  </style>
  
   