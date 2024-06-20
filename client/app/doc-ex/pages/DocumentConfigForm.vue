<template>
<el-main>
    <div class="kp-back-to-parent">
        <el-button class="kp-btn-back" icon="el-icon-back" v-on:click="$router.push('documents')"></el-button>
        <h1 class="kp-page-title" v-if="form._id">Edit {{pageTitle}}</h1>
        <h1 class="kp-page-title" v-else>Add {{pageTitle}}</h1>
    </div>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: 'documents' }">Documents</el-breadcrumb-item>
        <el-breadcrumb-item v-if="form._id">Edit {{pageTitle}}</el-breadcrumb-item>
        <el-breadcrumb-item v-else>Add {{pageTitle}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="kp-form-area" v-bar="{ useScrollbarPseudo: true }" v-loading="loading">
        <div class="kp-form-panel no-m pt-0">
            <el-row>
                <el-col>
                    <el-form :label-position="labelPosition" label-width="100px" :model="form" :rules="formRules" ref="form">
                        <ConfirmModel ref="model"></ConfirmModel>
                        <el-row :gutter="72">
                            <el-col :span="6" class="kp-de-left-settings">
                                <h5 class="kp-sub-section-label">Input Settings</h5>
                                <div class="kp-form-select-1 kp-form-field">
                                    <el-form-item class="kp-form-field-label" prop="document_type" label="Document type">
                                        <el-select name="document_type" v-model="form.document_type" placeholder="Select document type">
                                            <el-option v-for="type in document_type_list" :key="type.label" :label="type.label" :value="type.value"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item class="kp-form-field-label" prop="input_channel_id" label="Input channel">
                                        <el-select name="input_channel_id" clearable filterable v-model="form.input_channel_id" placeholder="Select input channel" multiple>
                                            <el-option v-for="item in channel_list" :key="item._id" :label="item.name+'-'+item.type" :value="item._id"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item class="kp-form-field-label" prop="enable_approval">
                                        <el-checkbox v-model="form.config.enable_approval">Enable approval</el-checkbox>
                                    </el-form-item>
                                    <el-form-item
                                      class="kp-form-field-label"
                                      prop="auto_publish_enabled"
                                    >
                                      <el-checkbox v-model="form.auto_publish_enabled">Enable Autopublish</el-checkbox>
                                    </el-form-item>					
                                </div>
                            </el-col>
                            <el-col :span="8">
                                <h5 class="kp-sub-section-label">Publish Settings</h5>
                                <div class="kp-form-select-1 kp-form-field">

                                <el-form-item
                                  class="kp-form-field-label"
                                  prop="publish_to"
                                  label="Publish channel"                     
                                >
                                    <el-select
                                      name="publish_to"
                                      clearable
                                      filterable
                                      v-model="form.publish_to"
                                      v-on:change="onPublishToChange"
                                      placeholder="Select"
                                    >
                                      <el-option
                                        v-for="value in publish_to_list"
                                        :key="value.value"
                                        :value="value.value"
                                        :label="value.label"
                                      ></el-option>
                                    </el-select>
                                  </el-form-item>
                                </div>
                                <div class="kp-form-select-1 kp-form-field">
                                  <el-form-item
                                    class="kp-form-field-label"
                                    prop="system"
                                    label="System"
                                    v-if="form.publish_to == 'system'"
                                  >
                                    <el-select
                                      name="system"
                                      clearable
                                      filterable
                                      v-model="form.customer_system_id"
                                      placeholder="Select system"
                                      v-on:change="onSystemChange"
                                    >
                                      <el-option
                                        v-for="system in system_list"
                                        :key="system._id.customer_system_id"
                                        :label="system._id.system_name"
                                        v-bind:value="system._id.customer_system_id"
                                      ></el-option>
                                    </el-select>
                                  </el-form-item>
                                </div>
                                <div class="kp-form-select-1 kp-form-field">
                                  <el-form-item
                                    class="kp-form-field-label"
                                    prop="workflow"
                                    label="Workflow"
                                    v-if="form.publish_to == 'system'"
                                  >
                                    <el-select
                                      name="workflow"
                                      clearable
                                      filterable
                                      v-model="form.workflow_id"
                                      placeholder="Select workflow"
                                    >
                                      <el-option
                                        v-for="item in workflow_list"
                                        :key="item._id"
                                        :label="item.name"
                                        v-bind:value="item._id"
                                      ></el-option>
                                    </el-select>
                                  </el-form-item>
                                </div>
                                <div class="kp-form-select-1 kp-form-field">
                                  <el-form-item
                                    class="kp-form-field-label"
                                    prop="dateFormat"
                                    label="Date format"
                                  >
                                    <el-select
                                      name="dateformat"
                                      clearable
                                      filterable
                                      v-model="form.date_format"
                                      placeholder="Select date format"
                                    >
                                      <el-option
                                        v-for="item in dateFormats"
                                        :key="item"
                                        :label="item"
                                        v-bind:value="item"
                                      ></el-option>
                                    </el-select>
                                  </el-form-item>
                                </div>

                            </el-col>
                            <el-col :span="8" :pull="1" :offset="1">
                                <h5 class="kp-sub-section-label">Notifications</h5>
                                <el-form-item class="kp-form-field-label" label="Reviewer Emails">
                                    <el-input name="reviewer" v-model="form.email_notifications.reviewer" type="textarea" :rows=2 placeholder="admin@kanverse.com, user@kanverse.com"></el-input>
                                </el-form-item>
                                <el-form-item class="kp-form-field-label" label="Approver Emails">
                                    <el-input name="approver" v-model="form.email_notifications.approver" type="textarea" :rows=2 placeholder="admin@kanverse.com, user@kanverse.com"></el-input>
                                </el-form-item>
                                <el-form-item class="kp-form-field-label" label="Publisher Emails">
                                    <el-input name="publisher" v-model="form.email_notifications.publisher" type="textarea" :rows=2 placeholder="admin@kanverse.com, user@kanverse.com"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>                    
                    </el-form>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="24" class="mt-20">
                    <el-button v-on:click="onSave" style="{margin-top: 36px}" name="save" type="primary"> <i class="mdi mdi-check"></i> Save</el-button>
                    <el-button v-on:click="$router.push('documents')" class="kp-btn-form-outline">Cancel</el-button>
                </el-col>
            </el-row>
        </div>
    </div>
    <h3 class="suggestion-button-title" v-if="showDatatable && form._id">Business rule</h3>
    <div class="grid-content bg-purple">
        <div data-v-step="2" class="table-wrap">
            <data-table v-if="showDatatable && form._id" :parameters="tableParams" ref="datatable"></data-table>
        </div>
    </div>
</el-main>
</template>

<style lang="scss">
@import "../../assets/scss/_variables";

.tag-action-container {
    margin: 23px 0 0 0px;

    .el-button {
        color: #008abf;
        font-weight: 700;
        border-color: #565f70;
        background-color: #eff4fc;
        border-radius: 100px;
        margin: 0;
        padding: 10px 0px;
        width: 34px;

        &:hover {
            background-color: #d8e7ff;
        }
    }

    .kp-de-left-settings {
        border-right: 2px solid green !important;
    }

    .kp-sub-section-label {
        margin-top: 0px;
        font-size: 18px;
    }
}
</style>

<script>
import InputChannelService from "@/doc-ex/services/InputChannel";
import Constants from "@/resources/Constants";
import CustomerConfig from "@/idp/services/DeCustomerConfig";
import DataTable from "../../components/DataTable.vue";
import EventBus from "@/EventBus";
import ConfirmModel from "@/components/ConfirmModel";

import _ from "lodash";
const uuidv4 = require("uuid/v4");

export default {
  name: "DocumentConfigForm",
  components: {
    DataTable,
    ConfirmModel
  },
  computed: {
    tableParams() {
      return {
        apiName: `/portal/api/table/de_business_rule_field_map`,
        defaultData: {
          de_field_id: null,
          document_type: this.form.document_type,
          active: true
        },

        tableName: "field_business_rule_map",
        tableHeaderConfigParams: {
          document_type: this.form.document_type
        },
        isRestify: true,
        queryParam: {
          active: true,
          de_field_id: null,
          document_type: this.form.document_type
        },
      
        limit: 10,
        allowInline: true,
        inlineAddButtonConfig: {
          disable: this.form._id ? false : true
        }
      };
    }
  },
   watch: {
        form: {
            handler(newVal, oldVal) {
          let cachedForm = _.pickBy(this.cacheDataModal.cachedForm , _.identity);
          let form = _.pickBy(this.form , _.identity);

         cachedForm = JSON.stringify(cachedForm).replace(/\\n|\\t|\\r/g,"");
          form = JSON.stringify(form).replace(/\\n|\\t|\\r/g,"");


            this.cacheDataModal.isFormEdited = cachedForm != form;
        
            },
            deep: true
        }
    },
  methods: {
    onPublishToChange(publishTo) {
      this.form.showSelectOptions = publishTo === "system" ? true : false;
      this.form.system = null;
      this.form.workflow_id = null;
      this.form.customer_system_id = null;
      this.$forceUpdate();
    },
    data() {
        return {
            showDatatable: true,
            dateFormats: [],
            pageTitle: "document configuration",
            labelPosition: "top",
            showSelectOptions: true,
            document_type_list: Constants.DOCEX.DOCUMENT_TYPE_LIST,
            publish_to_list: Constants.DOCEX.PUBLISH_CHANNEL_LIST,
            system_list: [],
            channel_list: [],
            workflow_list: [],
            loading: false,
            mail_provider: Constants.DOCEX.MAIL_SERVICE_PROVIDER,
            host_port_mapping: Constants.DOCEX.EMAIL_HOST_PORT_MAPPING,
            dateFormat: Constants.DOCEX.DATE_FORMAT_MAPPING,
            form: {
                config: {
                    enable_approval: false
                },
                document_type: "",
                publish_to: "",
                customer_system_id: null,
                workflow_id: null,
                date_format: "",
                //input_channel_id: [],
                email_notifications: this.getNotificationObject(),
				auto_publish_enabled: false
            },
			cacheDataModal: {
                cachedForm: {},
                isFormEdited: false,
			},
            formRules: {
                document_type: [{
                    required: true,
                    message: "Please select document type",
                    trigger: "blur"
                }]
            },
            modified_document_types: [],
        };
    },
    methods: {
        onPublishToChange(publishTo) {
            this.form.showSelectOptions = publishTo === "system" ? true : false;
            this.form.system = null;
            this.form.workflow_id = null;
            this.form.customer_system_id = null;
            this.$forceUpdate();
        },

        async onSystemChange(system) {

            this.form.workflow_id = null;
            if (!this.form.customer_system_id) {
                this.workflow_list = [];
                return;
            }

            this.loading = true;
            let self=this;
            let systemObject=_.find(this.system_list, function(system) { 
                return system._id.customer_system_id === self.form.customer_system_id; 
                });
            let system_id=systemObject?systemObject._id.master_system_id:null;
            let workflowListResponse = await CustomerConfig.getWorkflowList({
              master_system_id: system_id
            });
            this.workflow_list=workflowListResponse?workflowListResponse.data:[]
            //   this.workflow_list = _.get(
            //     workflowListResponse.data,
            //     system_id,
            //     []
            //   );
            // this.workflow_list = workflowListResponse && workflowListResponse.data;
            this.loading = false;
            this.$forceUpdate();
        },
        reRenderDatatable() {
            this.showDatatable = false;
            this.$nextTick(() => {
                this.showDatatable = true;
            });
        },
        async onSave() {
            let isValid = await this.$refs.form.validate().catch(error => {});
            this.loading = true;
            let res =
              isValid &&
              (await CustomerConfig.save(this.form).catch(errorMessage => {
                this.loading = false;
                this.notifyError(errorMessage);
              }));
            if (res) {
              this.loading = false;
              this.notifySuccess("Record saved successfully.");
              this.tableParams.inlineAddButtonConfig.disable = false;
              this.form = res;
              this.cacheDataModal.isFormEdited = false;

              this.reRenderDatatable();
            }
        },

        getNotificationObject() {
            return {
                reviewer: "",
                approver: "",
                publisher: "",
            };
        },
        getConfigIdFromUrl() {
            return this.$route.query.id || "";
        },
        async init() {
            this.loading = true;
            try {
                const configId = this.getConfigIdFromUrl();
                if (configId) {
                    const documentConfig = await CustomerConfig.getCustomerConfigurationById(
                        configId
                    );
                    this.form = _.merge(this.form, documentConfig);
                    this.tableParams.inlineAddButtonConfig.disable = false;
                }
                //const config = await CustomerConfig.getCustConfigByDocType();
                let systemConfiguration = await CustomerConfig.getSystemConfigurations()
                this.dateFormats = _.keys(_.get(systemConfiguration, "DOCEX.MOMENT_DATEPICKER_MAPPING"));
                const customerSystems = await CustomerConfig.getCustomerSystemList({
                    docexWFSystem: true,
                });
                const workflowList = await CustomerConfig.getWorkflowList();

                if (this.form.customer_system_id) {
                    this.workflow_list = _.get(
                        workflowList["data"]["groupedWorkflows"],
                        this.form.customer_system_id,
                        []
                    );
                }
                this.channel_list = await InputChannelService.getAll({
                    active: true,
                });
                this.cacheDataModal.cachedForm = _.cloneDeep(this.form)
                this.cacheDataModal.isFormEdited = false;
                this.reRenderDatatable();
                this.system_list = customerSystems.data || [];
                this.system_list.push({
                    system_name: "OTHER",
                    master_system_id: null,
                });
            } catch (err) {
                this.notifyError("Error occured while getting data.");
                console.log(err.message);
            } finally {
                this.loading = false;
            }
        },
    },
    beforeMount() {
        this.init();
    },
    beforeRouteLeave: function (to, from, next) {
        if (this.cacheDataModal.isFormEdited) {
            //    return window.confirm('Do you really want to leave? you have unsaved changes!')
            return this.$refs.model.open(next);
        } else {
            return next();
        }
    }
}
}
</script>
