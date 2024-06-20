<template>
  <div class="properties-container" v-loading="loading">
    <PropertiesHeader
      :currentNode="currentNode"
      :dialogFlowData="dialogFlowData"
    />
    <div class="content-body">
      <el-form :model="form" ref="form" label-width="120px" :rules="formRules">
        <el-tabs v-if="dialogFlowData.workflow_data.nodes[currentNode.id].data">
          <!-- general -->
          <el-tab-pane>
            <span slot="label">General</span>
            <el-form-item class="inline-label-item codemirror-item-container">
              <label class="label-name">On receive script</label>
              <codemirror v-model="form.on_receive_script"></codemirror>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane>
            <span slot="label">Channel Configuration </span>
             <el-form-item prop="name" class="inline-label-item" label="File path">
                        <el-input  @input="handleNameChange" class="upload_folder_path-input" v-model="form.name" placeholder="Upload folder path..."></el-input>
             </el-form-item>
            <el-form-item
              class="inline-label-item"
              v-if="form.type == 'FTP'"
              prop="ftp_input_dir"
              label="Source directory"
            >
              <el-input
                class="ftp_input_dir-input"
                prop="ftp_input_dir"
                v-model="form.ftp_input_dir"
                placeholder="Provide source directory..."
              ></el-input>
            </el-form-item>

          <el-form-item  class="inline-label-item" :prop="'assignmentRuleList.' + index + '.document_type'" label="Document type">
              <!-- v-on:change="onTypeChange" -->
              <el-select v-on:change="onDocumentTypeChange(index)" clearable filterable v-model="form.document_type" placeholder="Document type">
                  <el-option v-for="option in documentTypes" :key="option.value" :value="option.value" :label="option.label"></el-option>
              </el-select>
          </el-form-item>

            <el-form-item
              v-if="form.type == 'FTP'"
              class="inline-label-item"
              prop="ftp_process_dir"
              label="Process directory"
            >
              <el-input
                class="ftp_process_dir-input"
                prop="ftp_process_dir"
                v-model="form.ftp_process_dir"
                placeholder="Provide path to keep all processed files"
              ></el-input>
            </el-form-item>

            <el-form-item
              class="inline-label-item"
              label="Drive"
              v-if="form.auth_type == 'oauth2' && form.type == 'SHAREPOINT'"
            >
              <el-input
                v-model="form.drive"
                placeholder="Provide drive.."
              ></el-input>
            </el-form-item>

            <el-form-item
              v-if="form.type == 'EMAIL'"
              class="inline-label-item"
              prop="filter_by_mailbox"
              label="Folder name"
            >
              <el-input
                class="filter_by_mailbox-input"
                prop="filter_by_mailbox"
                v-model="form.filter_by_mailbox"
                placeholder="Provide folder name to filter mails..."
              ></el-input>
            </el-form-item>

            <el-form-item
              v-if="form.type == 'EMAIL'"
              class="inline-label-item"
              prop="filter_by_subject"
              label="Subject name"
            >
              <el-input
                class="filter_by_subject-input"
                prop="filter_by_subject"
                v-model="form.filter_by_subject"
                placeholder="Provide subject name to filter mails..."
              ></el-input>
            </el-form-item>

            <el-form-item
              v-if="form.type == 'EMAIL'"
              class="inline-label-item"
              prop="action_after_email_processed"
              label="After email"
            >
              <el-select
                clearable
                filterable
                v-model="form.action_after_email_processed"
                placeholder="Select action"
                v-on:change="onActionChange"
              >
                <el-option
                  v-for="item in action_on_email"
                  :key="item.value"
                  :label="item.label"
                  v-bind:value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item
              v-if="form.action_after_email_processed == 'move_to_folder'"
              class="inline-label-item"
              prop="email_move_folder_path"
              label="Move email to folder"
            >
              <el-input
                class="email_move_folder_path-input"
                v-model="form.email_move_folder_path"
                placeholder="Provide folder path"
              ></el-input>
            </el-form-item>

            <el-form-item
              v-if="form.type == 'SHAREPOINT'"
              class="inline-label-item"
              prop="read_from_folder"
              label="Read from folder"
            >
              <el-input
                prop="read_from_folder"
                v-model="form.read_from_folder"
                placeholder="Provide folder name or path to read files"
              ></el-input>
            </el-form-item>

            <el-form-item
              v-if="form.type == 'SHAREPOINT'"
              class="inline-label-item"
              prop="move_to_folder"
              label="Move to folder"
            >
              <el-input
                prop="move_to_folder"
                v-model="form.move_to_folder"
                placeholder="Provide move to folder path"
              ></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane>
            <span slot="label">Security</span>
            <el-form-item
              v-if="form.type == 'EMAIL'"
              class="inline-label-item"
              prop="auth_type"
              label="Authorization"
            >
              <el-select
                clearable
                filterable
                v-model="form.auth_type"
                v-on:change="onAuthTypeChange"
                placeholder="Select"
              >
                <el-option
                  v-for="value in auth_type_list"
                  :key="value.value"
                  :value="value.value"
                  :label="value.label"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item
              v-if="form.type == 'EMAIL'"
              class="inline-label-item"
              prop="email_service_provider"
              label="Service"
            >
              <el-select
                clearable
                filterable
                v-model="form.email_service_provider"
                placeholder="Select mail provider"
                v-on:change="onProviderChange"
              >
                <el-option
                  v-for="item in mail_provider"
                  :key="item.value"
                  :label="item.label"
                  v-bind:value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-row v-if="form.type == 'SHAREPOINT'">
              <!-- <el-col :span="10"> -->

              <el-form-item class="inline-label-item" prop="host" label="Host">
                <el-input
                  class="host-input"
                  prop="host"
                  v-model="form.host"
                  placeholder="Provide host..."
                ></el-input>
              </el-form-item>
            </el-row>
            <!-- </el-col> -->
            <!-- <el-col :span="10"> -->
            <el-row v-if="form.type == 'SHAREPOINT'">
              <el-form-item
                class="inline-label-item"
                prop="site_path"
                label="Site path"
              >
                <el-input
                  class="port-input"
                  prop="site_path"
                  v-model="form.site_path"
                  placeholder="Provide site path..."
                ></el-input>
              </el-form-item>

              <!-- </el-col> -->
            </el-row>

            <el-row
              v-if="
                showHostAndPort ||
                (form.type != 'EMAIL' && form.type != 'SHAREPOINT')
              "
            >
              <el-form-item class="inline-label-item" prop="host" label="Host">
                <el-input
                  class="host-input"
                  prop="host"
                  v-model="form.host"
                  placeholder="Provide host..."
                ></el-input>
              </el-form-item>
            </el-row>
            <el-row
              v-if="
                showHostAndPort ||
                (form.type != 'EMAIL' && form.type != 'SHAREPOINT')
              "
            >
              <!-- <el-col :span="10"> -->

              <el-form-item class="inline-label-item" prop="port" label="Port">
                <el-input
                  class="port-input"
                  prop="post"
                  type="number"
                  v-model="form.port"
                  placeholder="Provide port..."
                ></el-input>
              </el-form-item>

              <!-- </el-col> -->
            </el-row>

            <el-row v-if="form.auth_type == 'oauth2'">
              <!-- <el-col :span="10"> -->

              <el-form-item
                class="inline-label-item"
                prop="tenant_id"
                label="Tenant Id"
              >
                <el-input
                  class="tenant_id-input"
                  prop="tenant_id"
                  v-model="form.tenant_id"
                  placeholder="Provide tenant id..."
                ></el-input>
              </el-form-item>
            </el-row>
            <el-row v-if="form.auth_type == 'oauth2'">
              <el-form-item
                class="inline-label-item"
                prop="client_id"
                label="Client Id"
              >
                <el-input
                  class="client_id-input"
                  prop="client_id"
                  v-model="form.client_id"
                  placeholder="Provide client id..."
                ></el-input>
              </el-form-item>
            </el-row>

            <el-row v-if="form.auth_type != 'oauth2'">
              <el-form-item
                class="inline-label-item"
                prop="username"
                label="Email"
              >
                <el-input
                  class="username-input"
                  prop="username"
                  v-model="form.username"
                  placeholder="Provide username..."
                ></el-input>
              </el-form-item>
            </el-row>

            <el-row v-if="form.auth_type != 'oauth2'">
              <el-form-item
                class="inline-label-item"
                prop="password"
                label="Password"
              >
                <el-input
                  class="password-input"
                  prop="password"
                  v-model="form.password"
                  type="password"
                  placeholder="Provide password..."
                ></el-input>
              </el-form-item>

              <!-- </el-col> -->
            </el-row>

            <el-row
              v-if="form.auth_type == 'oauth2' && form.type != 'SHAREPOINT'"
            >
              <!-- <el-col :span="10"> -->
              <div class="kp-form-group">
                <el-form-item
                  class="inline-label-item"
                  prop="client_secret"
                  label="Client secret"
                >
                  <el-input
                    type="password"
                    class="client_secret-input"
                    prop="client_secret"
                    v-model="form.client_secret"
                    placeholder="Provide client secret..."
                  ></el-input>
                </el-form-item>
              </div>
              <!-- </el-col> -->
            </el-row>
            <el-row
              v-if="form.auth_type == 'oauth2' && form.type != 'SHAREPOINT'"
            >
              <div class="kp-form-group">
                <el-form-item
                  class="inline-label-item"
                  prop="username"
                  label="Email"
                >
                  <el-input
                    class="username-input"
                    prop="username"
                    v-model="form.username"
                    placeholder="Provide username..."
                  ></el-input>
                </el-form-item>
              </div>
              <!-- </el-col>                             -->
            </el-row>

            <el-row
              v-if="form.auth_type == 'oauth2' && form.type == 'SHAREPOINT'"
            >
              <el-form-item
                class="inline-label-item"
                prop="client_secret"
                label="Client secret"
              >
                <el-input
                  type="password"
                  class="client_secret-input"
                  prop="client_secret"
                  v-model="form.client_secret"
                  placeholder="Provide client secret..."
                ></el-input>
              </el-form-item>
            </el-row>
          </el-tab-pane>
          <el-tab-pane>
            <span slot="label">Connection</span>

            <div
              v-for="(item, index) in form.connections"
              :key="index"
              class="add-condition-container"
            >
              <el-form-item
                class="inline-label-item"
                disabled
                label="Label"
                :prop="'connections.' + index + '.label'"
                :rules="{
                  required: true,
                  message: 'description is required',
                  trigger: 'blur',
                }"
              >
                <el-input
                  placeholder="Enter label"
                  v-model="item['label']"
                ></el-input>
              </el-form-item>
              <el-form-item
                class="inline-label-item codemirror-item-container"
                disabled
                :rules="{
                  required: true,
                  message: 'description is required',
                  trigger: 'blur',
                }"
                :prop="'connections.' + index + '.script'"
              >
                <label class="label-name">Script</label>
                <codemirror v-model="item.script"></codemirror>
              </el-form-item>

              <div class="notification-delete-container">
                <el-button
                  v-on:click="removeConnection(item, index)"
                  class="btn-delete btn-delete-card"
                  size="mini"
                  >Remove
                  <!-- <i class="mdi mdi-delete"></i> -->
                </el-button>
              </div>
            </div>
            <el-button
              size="mini"
              class=""
              v-on:click="addConnection($event)"
              type="primary"
              >+ ADD condition</el-button
            >
            <!--  -->
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </div>
    <PropertiesFooter
      :currentNode="currentNode"
      :form.sync="form"
      :dialogFlowData="dialogFlowData"
      :formRef="$refs"
    />
  </div>
</template>

<script>
import EventBus from "@/EventBus";
import PropertiesFooter from "@/dialogflow/components/properties/PropertiesFooter.vue";
import Rete from "rete";
import Constants from "@/resources/Constants";
import * as Socket from "../../sockets";
import Codemirror from "@/components/Codemirror.vue";
import OrgHierarchyList from "@/idp/components/OrgHierarchyList.vue";
import InputChannelService from "@/idp/services/InputChannel";
const uuidv4 = require("uuid/v4");
import PropertiesHeader from "@/dialogflow/components/properties/PropertiesHeader.vue";
import _ from "lodash";
import wfDirty from "@/mixins/wfDirty.js";
import DialogFlowService from "@/dialogflow/services/DialogFlowService";
import Validator from "@/services/Validator";


export default {
  name: "Ingestion",
  mixins: [wfDirty],
  props: ["dialogFlowData", "currentNode", "documentTypes"],
  components: {
    Codemirror,
    OrgHierarchyList,
    PropertiesFooter,
    PropertiesHeader,
  },

  data() {
    const storage = JSON.parse(localStorage.getItem("vuex"));
    const userOrg =
      storage["user"] && storage["user"]["org"] ? storage["user"]["org"] : null;
    return {
      hideHigherThanLevel: userOrg,

      form: {
        name: "",
        upload_folder_path: "",
        type: "EMAIL",
        password: "",
        document_type:"",
        username: "",
        host: "",
        port: "",
        notification_emails: "",
        ftp_input_dir: "",
        ftp_process_dir: "",
        is_classification_required: false,
        org: "",
        auth_type: "",
        tenant_id: "",
        client_id: "",
        client_secret: "",
        email_move_folder_path: "",
        action_after_email_processed: "",
        connections: [],
      },
      mail_provider: Constants.DOCEX.MAIL_SERVICE_PROVIDER,
      host_port_mapping: Constants.DOCEX.EMAIL_HOST_PORT_MAPPING,
      action_on_email: Constants.DOCEX.ACTION_ON_EMAIL,
      input_channels: Constants.DOCEX.INPUT_CHANNEL_LIST,
      auth_type_list: Constants.DOCEX.AUTH_TYPE,
      showHostAndPort: false,
      formRules: {
        name: [
          {
              validator: Validator.EmptyValueValidator,
              trigger: "blur",
              message: "Please provide channel name",
          },
          {
            required: true,
            message: "Please provide channel name",
            trigger: "blur",
          },
        ],
        document_type: [
          {
            required: true,
            message: "Document type is required",
            trigger: "blur",
          }
        ],
        org: [
          // {
          //     validator: EmptyValueValidator,
          //     trigger: "blur",
          //     message: "Please select org hierarchy",
          // },
          {
            required: true,
            message: "Please provide org hierarchy",
            trigger: "blur",
          },
        ],

        // type: [
        //     // {
        //     //     validator: EmptyValueValidator,
        //     //     trigger: "blur",
        //     //     message: "Please provide channel type",
        //     // },
        //     {
        //         required: true,
        //         message: "Please provide channel type",
        //         trigger: "blur",
        //     },
        // ],
        username: [
          {
              validator: Validator.EmptyValueValidator,
              trigger: "blur",
              message: "Please provide email",
          },
          {
            required: true,
            trigger: "blur",
            message: "Please provide email",
          },
        ],
        password: [
          {
              validator: Validator.EmptyValueValidator,
              trigger: "blur",
              message: "Please provide password",
          },
          {
            required: true,
            message: "Please provide password",
            trigger: "blur",
          },
        ],
        host: [
          {
              validator: Validator.EmptyValueValidator,
              trigger: "blur",
              message: "Please provide host",
          },
          {
            required: true,
            message: "Please provide host",
            trigger: "blur",
          },
        ],
        port: [
          {
              validator: Validator.EmptyValueValidator,
              trigger: "blur",
              message: "Please provide port",
          },
          {
            required: true,
            message: "Please provide port",
            trigger: "blur",
          },
        ],

        notification_emails: [
          // {
          //     validator: EmptyValueValidator,
          //     trigger: "blur",
          //     message: "Please provide emails",
          // },
          {
            required: false,
            message: "Please provide emails",
            trigger: "blur",
          },
        ],
        ftp_input_dir: [
          // {
          //     validator: EmptyValueValidator,
          //     trigger: "blur",
          //     message: "Please provide source directory path",
          // },
          {
            required: true,
            message: "Please provide source directory path",
            trigger: "blur",
          },
        ],
        // filter_by_subject: [
        //   {
        //     validator: EmptyValueValidator,
        //     trigger: "blur",
        //     message: "Please provide subject to filter mailbox",
        //   },
        //   {
        //     required: true,
        //     message: "Please provide subject to filter mailbox",
        //     trigger: "blur",
        //   },
        // ],
        filter_by_mailbox: [
          // {

          //     validator: EmptyValueValidator,
          //     trigger: "blur",
          //     message: "Please provide folder to filter mailbox",
          // },
          {
            required: true,
            message: "Please provide folder to filter mailbox",
            trigger: "blur",
          },
        ],
        read_from_folder: [
          //  {
          //     validator: EmptyValueValidator,
          //     trigger: "blur",
          //     message: "Please provide folder to read from",
          // },
          // {
          //     required: true,
          //     message: "Please provide folder to read from ets",
          //     trigger: "blur",
          // },
        ],
        move_to_folder: [
          {
            validator: Validator.EmptyValueValidator,
            trigger: "blur",
            message: "Please provide folder to move to",
          },
          // {
          //     required: true,
          //     message: "Please provide folder to move to",
          //     trigger: "blur",
          // },
        ],

        email_service_provider: [
          {
            validator: Validator.EmptyValueValidator,
            trigger: "blur",
            message: "Please provide email service provider",
          },
          // {
          //     required: true,
          //     message: "Please provide email service provider",
          //     trigger: "blur",
          // },
        ],
        ftp_process_dir: [
          {
            validator: Validator.EmptyValueValidator,
            trigger: "blur",
            message: "Please provide process directory path",
          },
          // {
          //     required: true,
          //     message: "Please provide process directory path",
          //     trigger: "blur",
          // },
        ],
        client_id: [
          {
            validator: Validator.EmptyValueValidator,
            trigger: "blur",
            message: "Please provide client id",
          },
          // {
          //     required: true,
          //     message: "Please provide Please provide client id",
          //     trigger: "blur",
          // },
        ],
        tenant_id: [
          {
            validator: Validator.EmptyValueValidator,
            trigger: "blur",
            message: "Please provide tenan id",
          },
          // {
          //     required: true,
          //     message: "Please provide Please tenan id",
          //     trigger: "blur",
          // }
        ],
        client_secret: [
          {
            validator: Validator.EmptyValueValidator,
            trigger: "blur",
            message: "Please provide client secret",
          },
          // {
          //     required: true,
          //     message: "Please provide client secret",
          //     trigger: "blur",
          // }
        ],
        auth_type: [
          {
            validator: Validator.EmptyValueValidator,
            trigger: "blur",
            message: "Please provide authorization type",
          },
          {
              required: true,
              message: "Please provide authorization type",
              trigger: "blur",
          }
        ],
        email_move_folder_path: [
          // {
          //   validator: EmptyValueValidator,
          //   trigger: "blur",
          //   message: "Please provide folder path",
          // },
          // {
          //     required: true,
          //     message: "Please provide folder path",
          //     trigger: "blur",
          // }
        ],
        action_after_email_processed: [
          // {
          //   validator: EmptyValueValidator,
          //   trigger: "blur",
          //   message: "Please provide value",
          // },
          // {
          //     required: true,
          //     message: "Please provide value",
          //     trigger: "blur",
          // }
        ],
      },
      ftpRules: {},
      onSelectEventName : "EMAIL_INGESTION"
    };
  },
  methods: {
    handleNameChange(){
               this.form.upload_folder_path = this.form.name;
     },

    addConnection() {
      if (!this.form.connections) this.form.connections = [];
      this.form.connections.push({});
      this.$forceUpdate();
    },
    removeConnection(output, index) {
      this.form.connections.splice(index, 1);
    },
    
    async postProcessing() {
        let status = await this.createChannel()
        status && DialogFlowService.addOutput(this.currentNode, this.form);       
        return status
    },
    init() {
      let nodeData = JSON.parse(JSON.stringify(this.currentNode.data));
      this.form = {
        node_id: nodeData["node_id"],
        ...this.form,
      };
      _.size(nodeData) > 1 ? (this.form = nodeData) : null;
      this.form.old_password = this.form.password;
      // channelData.old_client_secret = channelData.client_secret;

      if (this.form.host) {
        _.each(this.host_port_mapping, (mapping, key) => {
          if (mapping.host === this.form.host)
            this.form.email_service_provider = key;
        });
      }
      if (!this.form.email_service_provider)
        this.form.email_service_provider = "other";
      this.addRules();
      console.log(
        "this.dialogFlowData.workflow_data.nodes" +
          JSON.stringify(this.dialogFlowData.workflow_data.nodes)
      );
      
      this.$nextTick(()=>{this.clonedForm = JSON.parse(JSON.stringify(this.form))})	

      // this.registerEvents();
    },
   
    setProperties() {
      this.form =
        this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data;
    },

     onProviderChange() {
      let formData = this.form;
      let type = this.form.type;
      let emailProvider = formData.email_service_provider;
      let mapping = this.host_port_mapping[emailProvider];
      this.showHostAndPort = false;
      if (!mapping) this.showHostAndPort = true;

      this.$set(this.form, "host", _.get(mapping, "host", ""));
      this.$set(this.form, "port", _.get(mapping, "port", ""));
    },

    onTypeChange() {
      this.addRules();
      this.showHostAndPort = true;
      if (this.form.type === "SHAREPOINT")
        this.$set(this.form, "auth_type", "oauth2");
      if (this.form.type !== "FTP") {
        this.showHostAndPort = false;
        this.$set(this.form, "tenant_id", "");
        this.$set(this.form, "client_secret", "");
        this.$set(this.form, "client_id", "");
      }
      this.$set(this.form, "host", "");
      this.$set(this.form, "port", "");
    },
    onActionChange() {
      if (this.form.action_after_email_processed == "mark_as_read") {
        this.$set(this.form, "email_move_folder_path", "");
      }
    },
   
    async createChannel() {
            try {
                let currentNode = JSON.parse(JSON.stringify(this.currentNode));
                currentNode.data["workflow_id"] = this.dialogFlowData._id;
                currentNode.data["workflow_node_id"] = currentNode.id;
                currentNode.data["endpoint"] =
                    currentNode.data["endpoint"] || new Date().valueOf();
                currentNode.data["active"] = true;
                currentNode.data = {
                    ...currentNode.data,
                    ...this.form
                };
                let status = await this.save(currentNode.data);
                return status;
            } catch (e) {
                console.log(e);
                return false;
            }
    },


    onAuthTypeChange() {},
    // handleClassificationCheckbox() {
    //     this.form.is_classification_required ? this.removeDocumentTypeValidation() : this.addDocumentTypeValidation()
    // },
    // addDocumentTypeValidation() {
    //     this.$set(this.formRules, "document_type", [{
    //             validator: this.EmptyValueValidator,
    //             trigger: "blur",
    //             message: "Please provide document type",
    //         },
    //         {
    //             required: true,
    //             message: "Please provide document type",
    //             trigger: "blur",
    //         },
    //     ])
    // },
    // removeDocumentTypeValidation() {
    //     this.$delete(this.formRules, "document_type")
    // },
       async save(data) {
            try {
                if (data.type != "FTP") return this.insertRecord(data);
                let response = await InputChannelService.testConnection(data)
                response = response.data;
                if (!response.success) {
                    this.notifyError(response.message);
                    return false
                }
                let status = await this.insertRecord(data);
                return status;
            } catch (err) {
                this.notifyError(err);
                return false
            }

    },

    setUploadFolderPath() {
      this.form.upload_folder_path = this.form.name;
    },

    async insertRecord(data) {
            this.setUploadFolderPath();
            try {
                let response = await InputChannelService.upsert(data)
                if (
                    _.get(response, "data.name") == "MongoError" &&
                    _.get(response, "data.errmsg").includes("duplicate key")
                ) {
                    this.handleError("Channel name is already present.");
                    return false
                }
                if (response.status == 200 || response.status == 201) {
                    this.form[
                        "_id"
                    ] = response.data._id;
                    if (!response.data.status && response.data.statusMessage) {
                        this.handleError(response.data.statusMessage);
                        return false
                    }

                    this.notifySuccess("Record saved successfully");
                    return true;
                }
            } catch(err) {
                this.handleError("Issue while creating channel");
                return false
            }

    },

    handleError(message) {
      this.saveClicked = false;
      this.notifyError(message);
    },
    addRules() {
      let type = this.form.type;
      let typeRules = this[`${type.toLocaleLowerCase()}Rules`];

      this.formRules = _.merge(this.formRules, typeRules);
    },

    addFormRules() {
      let rules = {};
      _.each(this.fields_message_mapping, (message, field) => {
        let ruleArr = [];
        ruleArr.push({
          validator: Validator.EmptyValueValidator,
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

  mounted() {},
  beforeDestroy() {
    EventBus.$off(["ON_SELECT_ORG_HIERARCHY_"+this.onSelectEventName]);
  },
  beforeMount() {
    // this.init();

    this.init();
    EventBus.$on("ON_SELECT_ORG_HIERARCHY_"+this.onSelectEventName, (data) => {
      this.form.org = data && data.org;
    });
  },

};
</script>

<style  lang="scss">

</style>
