<template>
  <el-main>
      <div class="kp-back-to-parent">
        <button class="kp-btn-back" v-on:click="displayList">
          <span class="material-icons">arrow_back</span>
        </button>
        <h1 class="kp-page-title">{{pageTitle}}</h1>
    </div>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: 'business-rules' }">Business Rule</el-breadcrumb-item>
        <el-breadcrumb-item>{{pageTitle}}</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- <h3 class="configuration-title">Business Rule</h3> -->
    <el-form :model="form" :rules="formRules" ref="form" label-width="150px">
      <!-- basic content -->
      <div
        data-v-step="1"
        id="basic-details"
        class="form-section card-base card-shadow--medium demo-box bg-white"
      >
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item prop="name" label="Name">
              <el-input v-model="form.name" placeholder="Business Rule name..."></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="active" label="Active">
              <el-checkbox class="active-input" prop="active" v-model="form.active"></el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          
          <el-col :span="12" class="type">
            <el-form-item prop="document_type" label="Document Type">
              <!-- v-on:change="onTypeChange" -->
              <el-select clearable filterable v-model="form.document_type" placeholder="Document Type">
                <el-option
                  v-for="value in doucument_types"
                  :key="value.value"
                  :value="value.value"
                  :label="value.label"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>          
        </el-row>
        <el-row>
            <el-col :span="24" >
            <el-form-item prop="advanced_script" label="Script">
                <codemirror :value="form.advanced_script" v-model="form.advanced_script" :options="editorOptions"></codemirror>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
            <el-col :span="24" class="mt-20">
                <el-button style="{margin-top: 36px}" v-on:click="save" :key="buttonKey" class="btn-save" type="primary">
                    <i class="mdi mdi-check"></i> Save
                </el-button>
                <el-button v-on:click="$router.push('/business-rules')" class="kp-btn-form-outline">Cancel</el-button>

            </el-col>
        </el-row>
      </div>
    </el-form>
  </el-main>
</template>

<script>
import Constants from "@/resources/Constants";
import navigation from "@/mixins/navigation.js";
import Codemirror from "@/components/Codemirror";
import BusinessRuleService from "@/doc-ex/services/BusinessRule";
import $ from "jquery";

export default {
  name: "BusinessRuleForm",
  components: {
        Codemirror        
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
      form: {
        name: "",
        document_type: "",
        active: true,
        advanced_script: ""
      },
      editorOptions: {
                mode: "text/javascript",
                theme: "default"
            },
      doucument_types: Constants.DOCEX.DOCUMENT_TYPE_LIST,
      fields_message_mapping: {
        name: "Please provide Business Rule Name",
        document_type: "Please select Document Type",
        advanced_script: "Script cannot be empty"
      },
      pageTitle:"Business Rule",
      rules: {},

      formRules: {
        name: [
          {
            validator: EmptyValueValidator,
            trigger: "blur",
            message: "Please provide Business Rule Name"
          },
          {
            required: true,
            message: "Please provide Business Rule Name",
            trigger: "blur"
          }
        ],

        document_type: [
          {
            validator: EmptyValueValidator,
            trigger: "blur",
            message: "Please select Document Type"
          },
          {
            required: true,
            message: "Please select Document Type",
            trigger: "blur"
          }
        ],
        advanced_script: [
          {
            validator: EmptyValueValidator,
            trigger: "blur",
            message: "Script cannot be empty"
          },
          {
            required: true,
            message: "Script cannot be empty",
            trigger: "blur"
          }
        ]
      }
    };
  },

  methods: {
    async init(recordId) {
         try {
                let brData = await BusinessRuleService.fetchById(recordId);     
                this.form = Object.assign({}, this.form, brData);
            } catch (error) {
                this.notifyError("Error");

            }

    },

        displayList() {
            this.$router.push({
                path: "/business-rules"
            });
        },
    async save() {
      let valid = await this.$refs.form.validate().catch(error => {
        // this.notifyError(error);
      });
      if (!valid) {
        return;
      }
      return this.insertRecord();
    },
    insertRecord() {
      BusinessRuleService.save(this.form)
        .then(response => {
          this.notifySuccess("Record saved successfully");
        //   this.$router.push({
        //     path: "/business-rule-list"
        //   });
        })
        .catch(error => {
          this.notifyError("Error while processing");
        });
    },    

    addFormRules() {
      let rules = {};
      _.each(this.fields_message_mapping, (message, field) => {
        let ruleArr = [];
        ruleArr.push({
          validator: this.EmptyValueValidator,
          trigger: "blur",
          message: message
        });
        ruleArr.push({
          required: true,
          message: message,
          trigger: "blur"
        });
        rules[field] = ruleArr;
      });
      this.rules = rules;
    }
  },
  beforeMount() {
    let recordId = this.$route.query.id;
    // recordId = "5f846fab170f0436a441385f";
    this.addFormRules();

    if (recordId) this.init(recordId);
  }
};
</script>

<style lang="scss">
.modal-dropdown {
  margin-bottom: 34px;

  .sub-heading {
    font-weight: 700;
    text-transform: uppercase;
    font-size: 0.875rem;
    display: block;
    margin-bottom: 7px;
  }
}

.active-input {  
    margin-top: 8px;  
}

// Temporart CSS ---------------------------

.page-info-container .el-col {
  border: none;
}

.form-section {
  padding: 18px;
}

.type {
  label {
    line-height: 1.3 !important;
  }
}

</style>
