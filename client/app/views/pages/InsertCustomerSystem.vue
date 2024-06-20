<template>
  <el-main v-scroll="onScroll">
    <el-form
      :model="service"
      ref="form"
      :gutter="20"
    >
      <el-tabs class="service-config-container">
        <!-- basic -->
        <el-tab-pane>
          <span slot="label">Basic</span>

          <el-col :span="12">
            <el-form-item
              :rules="[ { required: true, message: 'Please select system', trigger: 'blur' } ] "
              prop="master_system"
            >
              <label class="el-form-item__label">SYSTEM</label>
              <el-select
                v-model="service.master_system"
                @change="setMasterSystemData"
                placeholder="Select"
              >
                <el-option
                  v-for="system in masterSystemList"
                  :label="system.system_name"
                  v-bind:value="system"
                  :key="system._id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :rules="[ { required: true, message: 'Please select customer', trigger: 'blur' } ]"
              v-show="user_roles =='admin'"
              prop="selectedCustomer"
            >
              <label class="el-form-item__label">CUSTOMER</label>
              <el-select
                v-model="service.selectedCustomer"
                @change="setCustomerId($event)"
                placeholder="Select"
              >
                <el-option
                  v-for="customer in customerList"
                  :label="customer.customer_name"
                  v-bind:value="customer"
                  :key="customer._id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :rules="[ { required: true, message: 'Please enter host', trigger: 'blur' } ]"
              prop="host"
              label="HOST NAME"
            >
              <el-input
                v-model="service.host"
                placeholder="E.g. jadeglobalchat-dev-ed.my.salesforce.com"
              ></el-input>
            </el-form-item>
            <el-form-item
              :rules="[ { required: true, message: 'Please enter url', trigger: 'blur' } ]"
              prop="url"
              label="LOGIN URL"
            >
              <el-input
                v-model="service.url"
                placeholder="E.g. https://www.salesforce.com/login"
              ></el-input>
            </el-form-item>
            <el-form-item
              :rules="[ { required: true, message: 'Please enter domain url', trigger: 'blur' } ]"
              prop="domain"
              label="DOMAIN URL"
            >
              <el-input
                v-model="service.domain"
                placeholder="E.g. https://www.salesforce.com"
              ></el-input>
            </el-form-item>
            <el-form-item
              :rules="[ { required: true, message: 'Please enter url', trigger: 'blur' } ]"
              prop="threshold"
              label="THRESHOLD"
            >
              <el-input
                v-model="service.threshold"
                type="number"
                placeholder="E.g. https://www.salesforce.com"
              ></el-input>
            </el-form-item>
          </el-col>

        </el-tab-pane>
        <!-- end basic -->
        <!-- Auth -->
        <el-tab-pane>
          <span slot="label">Auth</span>

          <el-col :span="12">
            <el-form-item
              :rules="[ { required: true, message: 'Please select auth type', trigger: 'blur' } ]"
              prop="oauth_version"
            >
              <label class="el-form-item__label">auth type</label>
              <el-select
                v-model="service.oauth_version"
                placeholder="Select"
              >
                <el-option
                  v-for="authtype in authTypes"
                  v-bind:value="authtype.value"
                  :label="authtype.name"
                  v-bind:key="authtype.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :rules="[ { required: true, message: 'Please enter consumer key', trigger: 'blur' } ]"
              prop="consumer_key"
              label="CONSUMER KEY"
            >
              <el-input
                v-model="service.consumer_key"
                placeholder="E.g. 28.299.29"
              ></el-input>
            </el-form-item>
            <el-form-item
              :rules="[ { required: true, message: 'Please enter secret key', trigger: 'blur' } ]"
              prop="secret_key"
              label="SECRET KEY"
            >
              <el-input
                v-model="service.secret_key"
                placeholder="E.g. 2883-3883-3883-3384"
              ></el-input>
            </el-form-item>
            <el-form-item
              :rules="[ { required: true, message: 'Please enter callback url', trigger: 'blur' } ]"
              prop="callback_url"
              label="CALLBACK URL"
            >
              <el-input
                v-model="service.callback_url"
                placeholder="E.g.https://www.salesforce.com"
              ></el-input>
            </el-form-item>
            <el-form-item
              :rules="[ { required: true, message: 'Please enter api key', trigger: 'blur' } ]"
              prop="api_key"
              label="API KEY"
            >
              <el-input
                v-model="service.api_key"
                placeholder="E.g. Y2XNKNijaIIjn"
              ></el-input>
            </el-form-item>
            <el-form-item
              :rules="[ { required: true, message: 'Please enter auth code endpoint', trigger: 'blur' } ]"
              prop="auth_code_endpoint"
              label="AUTH CODE ENDPOINT"
            >
              <el-input
                v-model="service.auth_code_endpoint"
                placeholder="E.g. 288.38.33"
              ></el-input>
            </el-form-item>
            <el-form-item
              :rules="[ { required: true, message: 'Please enter auth token endpoint', trigger: 'blur' } ]"
              label="AUTH TOKEN ENDPOINT"
            >
              <el-input
                v-model="service.auth_token_endpoint"
                placeholder="E.g. 288.38.33"
              ></el-input>
            </el-form-item>
            <el-form-item
              :rules="[ { required: true, message: 'Please enter signature method', trigger: 'blur' } ]"
              label="SIGNATURE METHOD"
            >
              <el-input
                v-model="service.signature_method"
                placeholder="E.g. 288.38.33"
              ></el-input>
            </el-form-item>
            <el-form-item
              :rules="[ { required: true, message: 'Please enter auth request token endpoint', trigger: 'blur' } ]"
              label="AUTH REQUEST TOKEN ENDPOINT"
            >
              <el-input
                v-model="service.auth_request_token_endpoint"
                placeholder="E.g. 288.38.33"
              ></el-input>
            </el-form-item>
            <el-checkbox v-model="service.login_hint">LOGIN HINT</el-checkbox>
          </el-col>

        </el-tab-pane>
        <el-tab-pane>
          <span slot="label">Headers</span>

          <el-col :span="12">
            <el-form-item label="HEADER CODE">
              <codemirror v-model="service.header"></codemirror>
            </el-form-item>
          </el-col>

        </el-tab-pane>
        <!-- end Headers -->
        <!-- Default Condition  -->
        <el-tab-pane>
          <span slot="label">Default Condition</span>
          <field-tag-mapping-card
            ref="mapingCard"
            v-for="(item, index) in FieldTagMapping"
            :item="item"
            :key="item"
            @addTag="addTag"
            @deleteObject="deleteObject"
            @saveObject="saveObject"
            @removeTag="removeTag"
          > </field-tag-mapping-card>
          <el-row
            :gutter="20"
            class="add-object"
          >
            <el-col :span="12">
              <el-input
                v-model="objectName"
                placeholder="E.g. INCIDENT"
              ></el-input>
            </el-col>
            <el-col :span="12">
              <el-button
                class="btn-addtag"
                type="primary"
                v-on:click="addObject"
              >+ ADD OBJECT</el-button>
            </el-col>
          </el-row>
          <!-- end add object button -->

        </el-tab-pane>
        <!-- end Default Condition -->

        <!-- Web Chat Validation Config -->
        <el-tab-pane>
          <span slot="label">Web Chat Enable Config</span>
          <el-col
            :span="24"
            class="webchat-validation"
          >
            <el-checkbox
              class="webchat-chekboxupdate"
              v-model="enableWebchatValidation"
              @change="onEnableWebchatValidation($event)"
            >ENABLE WEBCHAT VALIDATION CONFIG</el-checkbox>
          </el-col>
          <div
            v-if="enableWebchatValidation"
            :gutter="20"
          >
            <el-col :span="12">
              <el-form-item
                :rules="[ { required: false, message: 'Please enter validation url', trigger: 'blur' } ]"
                label="URL"
              >
                <el-input
                  v-model="service.web_chat_conf.validation_url"
                  placeholder="E.g. json"
                ></el-input>
              </el-form-item>
              <el-form-item
                :rules="[ { required: false, message: 'Please enter validation params', trigger: 'blur' } ]"
                label="PARAMETERS"
              >
                <el-input
                  v-model="service.web_chat_conf.validation_params"
                  placeholder="E.g. json"
                ></el-input>
              </el-form-item>
              <el-form-item
                :rules="[ { required: false, message: 'Please enter validation action', trigger: 'blur' } ]"
                label="ACTION"
              >
                <el-input
                  v-model="service.web_chat_conf.validation_action"
                  placeholder="E.g. json"
                ></el-input>
              </el-form-item>
              <el-form-item
                :rules="[ { required: false, message: 'Please enter headers', trigger: 'blur' } ]"
                label="HEADERS"
              >
                <codemirror v-model="service.web_chat_conf.validation_headers"></codemirror>
              </el-form-item>
            </el-col>
          </div>
          </el-col>
        </el-tab-pane>
        <!-- end Web Chat Validation Config -->
      </el-tabs>
    </el-form>
    <el-button
      v-on:click.once="updateCustomerSystem"
      :key="buttonKey"
      class="btn-save"
      type="primary"
    >
      <i class="mdi mdi-check"></i> Save
    </el-button>
  </el-main>
</template>

<script>
import TableAPIService from "@/services/TableAPIService";
import AjaxService from "@/services/AjaxService";
import fieldTagMappingCard from "@/views/pages/fieldTagMappingCard.vue";
import _ from "underscore";
import lodash from "lodash";
import Codemirror from "../../components/Codemirror.vue";
let tableAPI = new TableAPIService();
export default {
  name: "InsertCustomerSystem",
  components: {
    fieldTagMappingCard,
    Codemirror
  },
  data() {
    return {
      requiredParam: {},
      buttonKey:1,
      service: {
        master_system: "",
        master_system_id: "",
        system_name: "",
        selectedCustomer: "",
        host: "",
        url: "",
        domain: "",
        threshold: 0,
        oauth_version: "",
        consumer_key: "",
        secret_key: "",
        callback_url: "",
        api_key: "",
        auth_code_endpoint: "",
        auth_token_endpoint: "",
        signature_method: "",
        login_hint: "",
        auth_request_token_endpoint: "",
        header: "",
        customer_id: "",
        field_tag_mapping: {},
        web_chat_conf: null
      },
      form: {},
      master_system: "",
      user_roles: "",
      masterSystemList: [],
      customerList: [],
      selectedCustomer: "",
      enableWebchatValidation: "",
      authTypes: [
        {
          name: "OAuth1",
          value: "1.0"
        },
        {
          name: "OAuth2",
          value: "2.0"
        }
      ],
      objectName: "",
      FieldTagMapping: []
    };
  },
  methods: {
    getmasterSystemList(queryParams, callback) {
      let apiEndpoint = "/portal/api/table/JgcMasterSystem";
      tableAPI = new TableAPIService();
      tableAPI.addQuery(queryParams);
      tableAPI.find(apiEndpoint, (error, response) => {
        callback(error, response);
      });
    },

    getCustomerList(queryParams, callback) {
      let apiEndpoint = "/portal/api/table/JgcCustomer";
      tableAPI = new TableAPIService();
      tableAPI.addQuery(queryParams);
      tableAPI.find(apiEndpoint, (error, response) => {
        callback(error, response);
      });
    },
    addTag(item) {
      _.findWhere(this.FieldTagMapping, { ObjectName: item.ObjectName })[
        "Mapping"
      ].push({ tag: "", value: "" });
    },

    removeTag(tagTovalue, item) {
      console.log(tagTovalue);
      console.log(item);
      var objectName = item.ObjectName;
      var newarr = _.findWhere(this.FieldTagMapping, {
        ObjectName: objectName
      })["Mapping"];
      _.findWhere(this.FieldTagMapping, { ObjectName: objectName })[
        "Mapping"
      ] = _.reject(newarr, function(d) {
        return d.tag == tagTovalue.tag;
      });
    },
    addObject() {
      if (this.objectName.trim() === "") {
        this.$notify.error({
          title: "Error",
          message: "Object name can not be blank"
        });
        return false;
      }
      var obj = {
        ObjectName: this.objectName,
        Mapping: [{ tag: "", value: "" }]
      };
      this.FieldTagMapping.push(obj);
    },

    updateCustomerSystem() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.service.field_tag_mapping = {};
          if (this.FieldTagMapping.length > 0) {
            if (!this.validateAndSaveCustomerFieldMapping()) {
              return false;
            }
          }
          let formData = this.createFormData(this.service);
          let apiEndpoint = "/portal/api/table/JgcCustomerSystem";

          if (this.service._id) {
            apiEndpoint = `${apiEndpoint}/${this.service._id}`;
          }

          AjaxService.postJson(apiEndpoint, formData, (error, response) => {
            if (response.data) {
              this.handleFetchCustomerSystemResponse(response.data, this);
              this.$notify({
                title: "Success",
                message: "Data saved successfully",
                type: "success"
              });
            } else {
              this.$notify.error({
                title: "Error",
                message: "There is an error"
              });
            }
          });
        } else {
          this.$notify.error({
            title: "Error",
            message: "Please fill the mandatory fields"
          });
        }
        this.buttonKey++;
      });
    },

    setMasterSystemData() {
      this.service.system_name = this.service.master_system.system_name;
      this.service.master_system_id = this.service.master_system._id;
    },

    setCustomerId(event) {
      this.service.customer_id = event._id;
    },

    deleteObject(item) {
      this.FieldTagMapping = _.reject(this.FieldTagMapping, function(d) {
        return d.ObjectName == item.ObjectName;
      });
    },

    saveObject(item) {
      if (item.ObjectName.trim() === "") {
        this.$notify.error({
          title: "Error",
          message: "Object name can not be blank"
        });
        return false;
      }
    },

    getCustomerSystemDetails(recordId) {
      let apiEndpoint = "/portal/api/table/JgcCustomerSystem";
      let self = this;
      let tableAPI = new TableAPIService();
      tableAPI.findById(apiEndpoint, recordId, (error, response) => {
        if (response._id === recordId) {
          this.handleFetchCustomerSystemResponse(response, self);
        } else {
          this.$notify.error({
            title: "Error",
            message: "Error while fetching service data"
          });
        }
      });
    },
    initializeUserRole() {
      let user = this.$store.getters.user;
      if (user.roles == "customer" || user.roles.includes("customer")) {
        this.service.customer_id = user.customer_id;
        this.user_roles = "customer";
      } else {
        this.user_roles = "admin";
        this.getCustomerList({}, (err, res) => {
          this.customerList = res;
        });
      }
    },

    onEnableWebchatValidation(event) {
      if (this.enableWebchatValidation) {
        this.$set(this.service, "web_chat_conf", {
          validation_url: "",
          validation_params: "",
          validation_action: "",
          validation_headers: ""
        });
      } else {
        this.$set(this.service, "web_chat_conf", null);
      }
    },

    handleFetchCustomerSystemResponse(response, self) {
      let fieldTagMappingRes = response.field_tag_mapping;
      var clone = Object.assign({}, response);
      delete clone.field_tag_mapping;
      self.service = lodash.defaultsDeep(clone, self.service);
      let fieldTagMapping = [];
      this.getmasterSystemList(
        { _id: response.master_system_id },
        (err, res) => {
          if (res) {
            self.service.master_system = res[0].system_name;
          } else {
            this.$notify.error({
              title: "Error",
              message: "Error while fetching systems"
            });
          }
        }
      );
      this.getCustomerList({ _id: response.customer_id }, (err, res) => {
        if (res) {
          self.service.selectedCustomer = res[0].customer_name;
        } else {
          // this.$notify.error({
          //     title: "Error",
          //     message: 'Error while fetching customer'
          // });
        }
      });

      if (!_.isEmpty(fieldTagMappingRes)) {
        Object.keys(fieldTagMappingRes).forEach(ele => {
          let obj = {};

          obj["ObjectName"] = ele;
          obj["Mapping"] = [];
          for (var key in fieldTagMappingRes[ele]) {
            let fieldTotag = {};
            fieldTotag["tag"] = key;
            fieldTotag["value"] = fieldTagMappingRes[ele][key];
            obj["Mapping"].push(fieldTotag);
          }

          fieldTagMapping.push(obj);
        });
      }

      self.FieldTagMapping = fieldTagMapping;
      if (response.web_chat_conf) {
        this.enableWebchatValidation = true;
      }
    },
    validateAndSaveCustomerFieldMapping() {
      var isempty = this.FieldTagMapping.some(ele => {
        return ele.Mapping.some(element => {
          var res = Object.values(element).some(
            x => x === null || x.trim() == ""
          );
          return res;
        });
      });

      var isObjectWithoutMapping = this.FieldTagMapping.some(ele => {
        return ele.Mapping.length == 0;
      });

      if (isObjectWithoutMapping) {
        this.$notify.error({
          title: "Error",
          message: "Add at least one field tag mapping"
        });
        return false;
      }

      if (isempty) {
        this.$notify.error({
          title: "Error",
          message: "Tag value mapping can not be blank"
        });
        return false;
      }

      var iseditable = this.$refs.mapingCard.some(element => {
        return element._data.objectEditable;
      });

      if (iseditable) {
        this.$notify.error({
          title: "Error",
          message: "Please save the object"
        });
        return false;
      }
      let field_tag_mapping = {};
      this.FieldTagMapping.forEach(element => {
        let object = element.ObjectName;
        field_tag_mapping[object] = {};

        element.Mapping.forEach(mapping => {
          var tag = mapping.tag;
          var value = mapping.value;
          field_tag_mapping[object][tag] = value;
        });
      });
      this.service.field_tag_mapping = field_tag_mapping;
      return true;
    },

    createFormData(service) {
      var formData = Object.assign({}, service);
      delete formData.selectedCustomer;
      delete formData.master_system;
      return formData;
    }
  },
  beforeMount() {
    let recordId = this.$route.query.id;
    if (recordId) {
      this.getCustomerSystemDetails(recordId);
    }

    this.getmasterSystemList({}, (err, res) => {
      this.masterSystemList = res;
    });

    this.initializeUserRole();
  }
};
</script>

<style lang="scss">
@import "../../assets/scss/_variables";
.CodeMirror-focused .cm-matchhighlight {
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFklEQVQI12NgYGBgkKzc8x9CMDAwAAAmhwSbidEoSQAAAABJRU5ErkJggg==);
  background-position: bottom;
  background-repeat: repeat-x;
}

.service-config-container {
  .el-select {
    display: block;
  }
  .btn-save {
    text-transform: uppercase;
    font-weight: 700;
    display: block;
    margin-left: 0;
  }
  .el-input__suffix {
    top: 20px;
  }
  .el-form-item__label {
    font-weight: 700;
    text-transform: uppercase;
    font-size: $font-size-14;
  }
  .sub-head {
    font-weight: bold;
    text-transform: uppercase;
    font-size: $font-size-14;
  }
  .code-area-container {
    background: #e4e7ed;
    padding: 25px;
    min-height: 300px;
    margin-bottom: 20px;
  }
  .enter-code-indicator {
    font-weight: bold;
    text-transform: uppercase;
    font-size: $font-size-28;
    opacity: 0.5;
  }

  // Tag Filed mapping
  .el-tabs__content,
  .el-tabs__header {
    padding: 15px;
  }

  .object-container {
    background: $color-white;
    border-radius: 5px;
    overflow: hidden;
    margin-bottom: 40px;
    .btn-addtag {
      margin-bottom: 20px;
    }
    .obj-name {
      background: #e4e7ed;
      padding: 10px 16px;
      margin: 0;
      font-weight: bold;
      text-transform: uppercase;
      font-size: $font-size-14;
    }
    .obj-name-container {
      .el-input {
        width: auto;
      }
      .editable {
        .el-input__inner {
          width: auto !important;
          background: $color-white !important;
        }
      }
      .el-input__inner {
        background: none;
        border: 0;
        color: #657483;
        text-transform: uppercase;
        font-weight: bold;
        height: 30px;
        padding: 0 5px;
        width: 120px;
        &::placeholder {
          color: #657483;
          font-weight: normal;
        }
      }
      i {
        cursor: pointer;
        //  color:$color-white;
      }
      .right-icon-set {
        span {
          cursor: pointer;
          font-size: 17px;
          padding: 0 5px;
        }

        display: inline-block;
        float: right;
        padding: 7px;
      }
    }

    .el-button--text {
      font-weight: bold;
    }
    .object-body {
      padding: 16px;
      .tagname-container {
        border-bottom: 1px solid #dcdfe6;
        padding: 10px 0 20px 0;
        margin-bottom: 10px;

        .el-input {
          width: auto;
          margin-right: 20px;
        }
        .tagname-code-area-container {
          background: #e4e7ed;
          padding: 15px;
          min-height: 100px;
          vertical-align: top;
          width: 55%;
          display: inline-block;
          margin-left: 20px;
          .enter-code-indicator {
            opacity: 0.5;
          }
        }
      }
    }
  } // object

  .add-object {
    margin-top: 20px;
  }

  .webchat-chekbox {
    font-weight: 700;
    text-transform: uppercase;
    font-size: $font-size-14;
    margin-bottom: 25px;
    line-height: 18px;
  }
}
</style>
