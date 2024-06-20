<template>
<el-main>
    <div class="kp-back-to-parent">
        <el-button class="kp-btn-back" icon="el-icon-back" v-on:click="displayList"></el-button>
        <h1 class="kp-page-title">Entities</h1>
    </div>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/entities-list' }">Homepage</el-breadcrumb-item>
        <el-breadcrumb-item>{{pageTitle}}</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="kp-form-area">
        <div class="kp-form-panel">
            <el-row>
                <el-col>
                    <el-form :label-position="labelPosition" label-width="100px" :model="entities" ref="entitiesForm" :rules="validationRules">
                        <ConfirmModel ref="model"></ConfirmModel>
                        <el-row :gutter="72">
                            <el-col :span="8">
                                <div class="kp-form-select-1 kp-form-field">
                                    <el-form-item class="kp-form-field-label" prop="customer_id" label="Customer">
                                        <el-select placeholder="Please select customer" v-model="entities.customer_name" @change="onCustomerChange" clearable filterable>
                                            <el-option v-for="customer in customerList" :value="customer" :key="customer._id" :label="customer.customer_name"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </div>
                                <div class="kp-form-select-1 kp-form-field">
                                    <el-form-item class="kp-form-field-label" prop="domain" label="Domain">
                                        <el-select placeholder="Please select object" v-model="entities.domain" @change="onDomainChange" clearable filterable>
                                            <el-option v-for="value in domainList" :value="value" :key="value" :label="key"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </div>
                                <div class="kp-form-select-1 kp-form-field">
                                    <el-form-item class="kp-form-field-label" prop="object_name" label="Object">
                                        <el-select placeholder="Please select object" v-model="entities.object_name" @change="onObjectChange" clearable filterable>
                                            <el-option v-for="object in objectList" :value="object" :key="object" :label="object"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </div>
                                <div class="kp-form-select-1 kp-form-field">
                                    <el-form-item class="kp-form-field-label" label="Action" prop="action_name">
                                        <el-select v-model="entities.action_name" @change="onActionChange" placeholder="Select Action" clearable filterable>
                                            <el-option v-for="action in actionList" :label="action.label" :value="action.value" :key="action.value"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </div>
                                <div class="kp-form-select-1 kp-form-field">
                                    <el-form-item class="kp-form-field-label" label="Action Type" prop="action_type">
                                        <el-select v-model="entities.action_type" @change="onActionTypeChange" placeholder="Select Action Type" clearable filterable>
                                            <el-option v-for="actionType in actionTypeList" :label="actionType" :value="actionType" :key="actionType"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </div>
                                <div class="kp-form-input-1 kp-form-field">
                                    <el-form-item class="kp-form-field-label" prop="sort" label="Sort" placeholder="Eg. 4">
                                        <el-input v-model="entities.sort" auto-complete="off"></el-input>
                                    </el-form-item>
                                </div>
                                <div class="kp-form-input-1 kp-form-field">
                                    <el-form-item class="kp-form-field-label" prop="bot_utterance" label="Bot Utterance" placeholder="Bot Utterance">
                                        <el-input v-model="entities.bot_utterance" auto-complete="off"></el-input>
                                    </el-form-item>
                                </div>
                                <div class="kp-form-input-1 kp-form-field">
                                    <el-form-item class="kp-form-field-label" prop="tag" label="Tag Name" placeholder="Tag Name">
                                        <el-input v-model="entities.tag" auto-complete="off"></el-input>
                                    </el-form-item>
                                </div>
                                <div class="kp-form-input-1 kp-form-field">
                                    <el-checkbox v-model="entities.is_required">Required</el-checkbox>
                                </div>

                                <div class="kp-form-select-1 kp-form-field">
                                    <el-form-item class="kp-form-field-label" label="Input Type" prop="type">
                                        <el-select v-model="entities.type" @change="oninputTypeListChange" placeholder="Select Input Type" clearable filterable>
                                            <el-option v-for="inputType in inputTypeList" :label="inputType.value" :value="inputType.label" :key="inputType.label"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </div>
                            </el-col>

                            <el-col :span="16">
                                <div class="kp-form-input-1 kp-form-field">
                                    <el-form-item class="kp-form-field-label" label="Required Script" prop="script">
                                        <codemirror :value="entities.required_script" v-model="entities.required_script" :options="editorOptions"></codemirror>
                                    </el-form-item>
                                </div>
                                <div class="kp-form-input-1 kp-form-field">
                                    <el-form-item class="kp-form-field-label" label="Options Script" prop="script">
                                        <codemirror :value="entities.options_script" v-model="entities.options_script" :options="editorOptions"></codemirror>
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
        <el-button v-on:click="save" :key="buttonKey" class="kp-btn-form-primary" type="primary">Save</el-button>
        <el-button v-on:click="displayList" class="kp-btn-form-outline">Cancel</el-button>
        <div v-if="!isFormValid" class="kp-form-error">* Please check field with errors</div>
    </div>
</el-main>
</template>

<script>
import Codemirror from "@/components/Codemirror";
import EntityService from "../../services/EntityService";
import Constants from "@/resources/Constants";
import ConfirmModel from "@/components/ConfirmModel";

export default {
  name: "EntitiesForm",
  components: {
    Codemirror,
    ConfirmModel
  },
  data() {
    return {
      labelPosition: "top",
      pageTitle: "",
      key: "",
      entities: {
        is_required: false
      },
      customerList: [],
      objectList: [],
      inputTypeList: [],
      domainList: Constants.DOMAINS,
      actionList: [],
      actionTypeList: [],
      buttonKey: 1,
      isFormValid: true,
      cacheDataModal: {
        cachedForm: {},
        isFormEdited: false,
        isEditForm: false,
        isNewForm: false,
        },
      validationRules: this.setValidationRules(),
      editorOptions: {
        mode: "text/javascript",
        theme: "default"
      }
    };
  },
  watch: {
    entities: {
      handler(newVal, oldVal) {
       if (this.cacheDataModal.isNewForm || this.cacheDataModal.isEditForm) {
          this.cacheDataModal.isFormEdited =
            JSON.stringify(this.cacheDataModal.cachedForm) !=
            JSON.stringify(this.entities);
        }
      },
      deep: true
    }
  },
  methods: {
    async init() {
      let recordId = this.fetchRecordId();
      if (recordId) {
        let response = await EntityService.fetchRecordById(recordId).catch(
          error => this.notifyError("There is an error in fetching record data")
        );
        this.entities =
          (response && _.defaultsDeep(response, this.entities)) ||
          this.entities;

        this.pageTitle = (response && `Edit Entity`) || "Add Entity";
        // return;
        this.cacheDataModal.isEditForm = true;
         this.cacheDataModal.isFormEdited = false;
        this.cacheDataModal.cachedForm = { ...this.entities };
      } else {
        this.cacheDataModal.isNewForm = true;
        this.cacheDataModal.isFormEdited = false;
        this.cacheDataModal.cachedForm = { ...this.entities };
      }

      try {
        this.customerList = await EntityService.fetchAllCustomer();
        this.actionList = EntityService.getActions();
        this.actionTypeList = EntityService.getActionsType();
        this.inputTypeList = EntityService.getInputType();
      } catch (error) {
        this.notifyError("Error while initializing Entities!!");
      }

      this.pageTitle = "Add Entity";
    },

    onCustomerChange(customer) {
      this.entities.customer_id = customer._id;
      this.entities.customer_name = customer.customer_name;
      this.fetchObjects();
    },
    onDomainChange(domain) {
      this.entities.domain = domain;
      this.fetchObjects();
    },
    onObjectChange(object) {
      this.entities.object_name = object;
    },
    onActionChange(action) {
      this.entities.action_name = action;
    },
    onActionTypeChange(actionType) {
      this.entities.action_type = actionType;
    },
    oninputTypeListChange(inputType) {
      this.entities.type = inputType;
    },
    async fetchObjects() {
      if (!this.entities.domain) {
        return;
      }
      this.objectList = await EntityService.fetchObjectsByDomain(
        this.entities.domain
      ).catch(error => {
        this.notifyError("Error while fetching objects!!");
      });
    },

    displayList() {
      this.$router.push({
        path: "/entities-list"
      });
    },
    fetchRecordId() {
      return this.$route.query.id;
    },
    async save() {
      this.cacheDataModal.isFormEdited = false;
      this.$refs.entitiesForm.validate(valid => {
        this.isFormValid = valid;
        if (!valid) {
          return;
        }

        EntityService.save(this.entities)
          .then(response => {
            this.entities._id = response._id;
            this.notifySuccess("Record saved successfully");
            this.displayList();
            this.buttonKey++;
          })
          .catch(error => {
            this.isFormValid = false;
            this.notifyError("There is an error in saving entity data");
          });
      });
    },

    setValidationRules() {
      return {
        customer_id: [
          {
            required: true,
            message: "Please enter customer_id",
            trigger: "change"
          }
        ],
        customer_name: [
          {
            // required: true,
            message: "Please select customer_name",
            trigger: "blur"
          }
        ],
        object_name: [
          {
            required: true,
            message: "Please select object_name",
            trigger: "change"
          }
        ],
        tag: [
          {
            required: true,
            message: "Please enter tag",
            trigger: "blur"
          }
        ],
        type: [
          {
            required: true,
            message: "Please select type",
            trigger: "change"
          }
        ],
        action_type: [
          {
            required: true,
            message: "Please select action_type",
            trigger: "change"
          }
        ],
        action_name: [
          {
            required: true,
            message: "Please enter  action_name",
            trigger: "change"
          }
        ],
        // is_required: [
        //   {
        //     required: true,
        //     message: "Please select checkbox",
        //     trigger: "blur"
        //   }
        // ],
        active: [
          {
            required: true,
            message: "Please select active",
            trigger: "blur"
          }
        ],
        domain: [
          {
            required: true,
            message: "Please enter  domain",
            trigger: "change"
          }
        ],
        options_script: [
          {
            required: true,
            message: "Please select options_script",
            trigger: "blur"
          }
        ],
        bot_utterance: [
          {
            required: true,
            message: "Please select bot_utterance",
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
