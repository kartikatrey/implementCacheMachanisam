<template>
  <el-main>
    <div class="kp-back-to-parent">
      <el-button
        class="kp-btn-back"
        icon="el-icon-back"
        v-on:click="$router.push('/knowledge-base')"
      ></el-button>
      <h1 class="kp-page-title">Knowledge base</h1>
    </div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/knowledge-base' }">Knowledge base</el-breadcrumb-item>
      <el-breadcrumb-item>{{pageTitle}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="kp-form-panel kp-toolbar-filter">
      <el-row>
        <el-col>
          <el-form
            :label-position="labelPosition"
            label-width="100px"
            :model="form"
            ref="form"
            :rules="formRules"
          >
           <ConfirmModel ref="model"></ConfirmModel>
            <el-row :gutter="72">
              <el-col :span="8">
                <div class="kp-form-input-1 kp-form-field">
                  <el-form-item class="kp-form-field-label" prop="title" label="Title">
                    <el-input v-model="form.title" placeholder="E.g. KB Article"></el-input>
                  </el-form-item>
                </div>
                <div class="kp-form-select-1 kp-form-field">
                  <el-form-item class="kp-form-field-label" prop="system_name" label="System">
                    <el-select
                      @change="onSystemChange"
                      placeholder="Select System"
                      v-model="form.system_name"
                      clearable
                    >
                      <el-option
                        v-for="system in systemList"
                        :value="system.system_name"
                        :key="system.system_name"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </el-col>

              <el-col :span="8">
                <div class="kp-form-select-1 kp-form-field">
                  <el-form-item class="kp-form-field-label" prop="domain" label="Domain">
                    <el-select v-model="form.domain" placeholder="Please select Domain" clearable>
                      <el-option
                        v-for="domain in domainList"
                        :value="domain.name"
                        :key="domain.name"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="kp-form-select-1 kp-form-field">
                  <el-form-item class="kp-form-field-label" prop="entites" label="Entites">
                    <el-select v-model="form.entities" multiple placeholder="Select entities">
                      <el-option v-for="entity in entityList" :key="entity" :value="entity"></el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="72">
              <el-col :span="16">
                <div class="kp-form-select-1 kp-form-field">
                  <el-form-item class="kp-form-field-label" label="Pretext">
                    <el-input
                      type="textarea"
                      row="10"
                      placeholder="Pretext"
                      v-model="form.pretext"
                      line-height="28px"
                    ></el-input>
                  </el-form-item>
                </div>

                <el-checkbox
                  class="kp-form-field-checkbox1"
                  v-model="form.isExternal"
                  @change="setFlag"
                >External URL</el-checkbox>
                <div class="kp-form-select-1 kp-form-field">
                  <el-form-item class="kp-form-field-label" v-if="isExternal">
                    <el-input v-model="form.url" placeholder="URL"></el-input>
                  </el-form-item>
                </div>
                <div v-if="!isExternal">
                  <div
                    class="object-container"
                    v-for="(content,index) in form.content"
                    :key="index"
                  >
                    <div class="obj-name obj-name-container">
                      <span class="obj-noneditable">Step {{index+1}}</span>
                      <div class="right-icon-set">
                        <!-- <button class="kp-from-actions kp-blank-btn el-icon-delete " v-if="index>0" @click="removeStep(index)"></button> -->
                        <i class="mdi mdi-delete" v-on:click="removeStep(index)"></i>
                      </div>
                    </div>
                    <div class="object-body">
                      <vue-editor v-model="form.content[index]"></vue-editor>
                    </div>
                  </div>
                </div>
                <div class="left-block" v-if="!isExternal">
                  <el-button class="kp-btn-primary" type="primary" @click="addStep()">
                    <!-- <i class="el-icon-plus"></i> -->
                    ADD STEP
                  </el-button>
                </div>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <el-button
      class="kp-btn-form-primary btn-save"
      type="primary"
      v-on:click.once="save"
      :key="buttonKey"
    >Save</el-button>
    <el-button v-on:click="$router.push('/knowledge-base')" class="kp-btn-form-outline">Cancel</el-button>

    <div v-if="!isFormValid" class="kp-form-error">* Please check field with errors</div>
  </el-main>
</template>

<script>
import KnowledgeBaseService from "../../services/KnowledgeBaseService";
import _ from "lodash";
import { VueEditor } from "vue2-editor";
import SystemService from "@/services/SystemService";
import DialogFlowService from "@/dialogflow/services/DialogFlowService";
import EntityService from "@/services/EntityService";
// import EntityTagListService from "@/services/EntityTagListService";
import ConfirmModel from "@/components/ConfirmModel";
import EventBus from "@/EventBus";

export default {
  name: "KnowledgeBaseForm",
  components: {
    VueEditor,
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
      isExternal: false,
      content: [""],
      form: {},
      domainList: [],
      systemList: [],
      ObjectListParam:{},
      // objectList: [],
      entityList: [],
      domain: "",
      buttonKey: 1,
      system_name: "",
      pageTitle: "",
      isSaveData:false,
      formRules: {
        title: [
          {
            required: true,
            message: "Please enter title",
            trigger: "change"
          }
        ],
        domain: [
          {
            required: true,
            message: "Please select domain",
            trigger: "change"
          }
        ],
        system_name: [
          {
            required: true,
            message: "Please select system",
            trigger: "change"
          }
        ]
        // object : [{
        //   required: true,
        //   message: 'Please select object',
        //   trigger: 'change'
        // }]
      }
    };
  },
  watch: {
    form: {
      handler(newVal, oldVal) {
        if (!this.isSaveData && (this.cacheDataModal.isNewForm || this.cacheDataModal.isEditForm)) {
          this.cacheDataModal.isFormEdited =
            JSON.stringify(this.cacheDataModal.cachedForm) !=
            JSON.stringify(this.form);
        }
      },
      deep: true
    }
  },
  methods: {
    async save() {
      let isValid = await this.$refs.form.validate().catch(error => {});
      this.isFormValid = isValid;
      this.isSaveData = true;
      this.form.object = "KNOLEDGE_BASE";
      this.cacheDataModal.isFormEdited = false;
      this.form.domain = isValid && `${this.form.domain}-${this.form.system_name}`;
      let form =
        isValid &&
        (await  KnowledgeBaseService.save(this.form).catch(
          error => {
            this.isFormValid = false;
            this.notifyError("Error while saving knowledge base data!!");
          }
        ));
      if (form) {
        this.form._id = form._id; // add service id after first request to existing service object to avoid duplicate service entries
        this.notifySuccess("Record saved successfully");
        this.$router.push({ path: "/knowledge-base" });
      }
      this.buttonKey++;
    },

    fetchRecordId() {
      return this.$route.query.id;
    },

    async init() {
      let recordId = this.fetchRecordId();
      this.domainList = await DialogFlowService.fetchDomains();
      this.systemList = await SystemService.fetchMasterSystems();
      if (recordId) {
        let response = await KnowledgeBaseService.fetchKnowledgeBaseById(
          recordId
        ).catch(error => {
          this.notifyError("There is an error in fetching KnowledgeBase data");
        });

        this.form =
        (response && _.defaultsDeep(response, this.form)) || this.form;
        this.isExternal = this.form.isExternal;
        this.pageTitle = "Edit Knowledge base";
        this.form.domain = _.split(response["domain"], "-")[0];
        this.form.system_name = response["system_name"];
        
        this.cacheDataModal.isEditForm = true;
        this.cacheDataModal.isFormEdited = false;
        this.cacheDataModal.cachedForm = { ...this.form };
         this.form.system_domain = `${this.form.domain}-${this.form.system_name}`;
         this.fetchEntities();
        this.ObjectListParam.entities = this.form.entities;
        EventBus.$emit("ASSIGN_ENTITIES", this.ObjectListParam);
        return;
      } else {
        this.cacheDataModal.isNewForm = true;
        this.cacheDataModal.isFormEdited = false;
        this.cacheDataModal.cachedForm = { ...this.form };
      }

      this.pageTitle = "New Knowledge Base";
      this.form.content = [""];
    },
    setFlag() {
      this.isExternal = this.form.isExternal;
    },

    async fetchEntities() {
      if (!this.form.system_domain) {
        return;
      }
      this.entityList = await EntityService.fetchTagListByDomain(
        this.form.system_domain
      ).catch(error => {
        this.notifyError("Error while fetching entities!!");
      });
    },

    addStep() {
      this.form.content.push("");
      this.$forceUpdate();
    },
    removeStep(index) {
      this.form.content.splice(index, 1);
      this.$forceUpdate();
    },
    onDomainChange(domain) {
      this.form.domain = domain;
      this.form.system_domain = `${domain}-${this.form.system_name}`;
      this.$forceUpdate();
    },
    onSystemChange(system_name) {
      this.form.system_name = system_name;
      this.form.system_domain = `${this.form.domain}-${system_name}`;
      this.fetchEntities();
      this.$forceUpdate();
    },
    onChangeEntities(entities) {
      this.form.entities = entities;
    }
  },

  beforeMount() {
    this.init();
    window.addEventListener("beforeunload", event => {
      if (!this.cacheDataModal.isFormEdited) return;
      event.preventDefault();
      event.returnValue = "";
    });
  },

  beforeRouteLeave: function(to, from, next) {
    if (this.cacheDataModal.isFormEdited) {
      return this.$refs.model.open(next);
    } else {
      return next();
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/scss/_variables";


.ql-snow .ql-tooltip {
  top: -10px !important;
  left: 30% !important;
}
.object-container {
  background: $color-white;
  overflow: hidden;
  margin-bottom: 10px;
  .btn-addtag {
    margin-bottom: 20px;
  }
  .obj-name {
    background: #f3f7fa;
    padding: 5px 16px;
    margin: 0;
    font-weight: bold;
    text-transform: uppercase;
    font-size: $font-size-14;
  }

  .obj-name-container {
    i {
      cursor: pointer;
    }
    .obj-noneditable {
      font-weight: bold;
      font-size: $font-size-14;
      display: inline-block;
      line-height: 28px;
    }
    .right-icon-set {
      span {
        cursor: pointer;
        font-size: 17px;
        padding: 0 5px;
      }
      display: inline-block;
      // float: right;
      padding: 4px;
    }
  }
  .obj-noneditable {
    font-weight: bold;
    font-size: $font-size-14;
    display: inline-block;
    line-height: 28px;
  }
  .right-icon-set {
    span {
      cursor: pointer;
      font-size: 17px;
      padding: 0 5px;
    }
    display: inline-block;
    float: right;
    padding: 4px;
  }
}

.el-button--text {
  font-weight: bold;
}
.object-body {
  padding: 16px;
  .el-form-item {
    margin-bottom: 10px;
  }
  .tagname-container {
    border-bottom: 1px solid #dcdfe6;
    padding: 10px 0;
    margin-bottom: 10px;
    .el-input {
      width: auto;
      margin-right: 20px;
    }
    .tagname-code-area-container {
      // background: #e4e7ed;
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
//   } // Default Condition
// } // end form section
.add-btn {
  margin-top: 10px !important;
}
.inline-label-item .el-form-item__label {
  background: transparent !important;
}

.right-icon-set {
  cursor: pointer;
  font-size: 17px;
  padding: 0 5px;
  display: inline-block;
  float: right;
  //padding: 4px;
}
</style>
