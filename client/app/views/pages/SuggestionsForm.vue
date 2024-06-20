<template>
  <el-main>
    <div class="kp-back-to-parent">
      <el-button class="kp-btn-back" icon="el-icon-back" v-on:click="displayList"></el-button>
      <h1 class="kp-page-title">{{pageTitle}}</h1>
    </div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/suggestions-list'}">Suggesions</el-breadcrumb-item>
      <el-breadcrumb-item>{{pageTitle}}</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="kp-form-area add-suggestion-wrap">
      <div class="kp-form-panel">
        <el-form :model="form" ref="form" :rules="formRules">
          <ConfirmModel ref="model"></ConfirmModel>
          <div class="object-name-wrap">
            <el-row :gutter="72">
              <el-col :span="8">
                <div class="kp-form-input-1 kp-form-field">
                  <el-form-item
                    prop="customer_id"
                    label="Customer name"
                    class="kp-form-field-label"
                  >
                    <el-select
                      class="el-select-blocklevel"
                      placeholder="Please select customer"
                      @change="onCustomerChange"
                      v-model="form.customer_name"
                      clearable
                      filterable
                    >
                      <el-option
                        v-for="customer in customerList"
                        :value="customer"
                        :key="customer._id"
                        :label="customer.customer_name"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="kp-form-input-1 kp-form-field">
                  <el-form-item label="Object" class="kp-form-field-label" prop="object">
                    <el-select v-model="form.object" filterable clearable placeholder="Select object">
                      <el-option
                        v-for="object in this.objectList"
                        :value="object"
                        :key="object"
                        :label="object"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
          </div>

          <el-row
            :gutter="72"
            class="mt-10"
            v-for="(condition,index) in form.tags"
            :key="index"
          >
            <h4>Suggesion {{index+1}}</h4>
            <el-col :span="8">
              <div class="kp-form-input-1 kp-form-field">
                <el-form-item label="Tag" class="kp-form-field-label">
                  <el-input v-model="condition.TAG" placeholder="tag name"></el-input>
                </el-form-item>
              </div>
            </el-col>

            <el-col :span="8">
              <div class="kp-form-input-1 kp-form-field">
                <el-form-item label="Value" class="kp-form-field-label">
                  <el-input v-model="condition.VALUE" placeholder="tag value"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-button
              v-if="index>0"
              round
              class="kp-from-actions kp-blank-btn el-icon-delete el-button--default"
              v-on:click="removeSuggestionsBlock(index)"
            ></el-button>
          </el-row>

          <el-button
            style="display: block; margin-top:32px;"
            class="kp-btn-form-outline"
            v-on:click="addSuggestionBlock()"
          >+ Add suggestion</el-button>
        </el-form>
      </div>
      <el-button v-on:click="save" :key="buttonKey" class="kp-btn-form-primary" type="primary">Save</el-button>
      <el-button v-on:click="displayList" class="kp-btn-form-outline">Cancel</el-button>
      <div v-if="!isFormValid" class="kp-form-error">* Please check field with errors</div>
    </div>
  </el-main>
</template>


<script>
import SuggestionsService from "../../services/SuggestionsService";
import EntityService from "@/services/EntityService";
import ConfirmModel from "@/components/ConfirmModel";

export default {
  name: "SuggestionsForm",
  components: {
    ConfirmModel
  },
  data() {
    return {
      isFormValid: true,
      cacheDataModal: {
        cachedForm: {},
        isFormEdited: false,
        isEditForm: false,
        isNewForm: false
      },
      labelPosition: "top",
      pageTitle: "New suggestion",
      form: {},
      customerList: [],
      customer: "",
      object: "",
      objectList: [],
      buttonKey: 1,
      formRules: {
        object: [
          {
            required: true,
            message: "Please enter object type",
            trigger: "blur"
          }
        ],
        customer_id: [
          {
            required: true,
            message: "Please select system",
            trigger: "change"
          }
        ],
        customer_name: [
          {
            // required: true,
            message: "Please select system",
            trigger: "blur"
          }
        ]
      }
    };
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
    async init() {
      this.form = { tags: [{}] };
      let recordId = this.fetchRecordId();
      if (recordId) {
        let response = await SuggestionsService.fetchRecordById(recordId).catch(
          error => this.notifyError("There is an error in fetching record data")
        );
         
        this.form =
          (response && _.defaultsDeep(response, this.form)) || this.form;
        this.cacheDataModal.cachedForm = { ...this.form };
        this.pageTitle = (response && `Edit suggestion`) || "New suggestion";
        return;
      }
      else
       {
        this.cacheDataModal.cachedForm = { ...this.form };
      }
      this.pageTitle = "New suggestion";
    },
    addSuggestionBlock() {
      this.form.tags.push({});
    },
    removeSuggestionsBlock(index) {
      this.form.tags.splice(index, 1);
    },
    displayList() {
      this.$router.push({ path: "/suggestions-list" });
    },
    fetchRecordId() {
      return this.$route.query.id;
    },
    async save() {
      this.$refs.form.validate(valid => {
        this.isFormValid = valid;
        this.cacheDataModal.isFormEdited = false;
        if (!valid) {
          return;
        }
        SuggestionsService.save(this.form)
          .then(response => {
            this.form._id = response._id;
            this.notifySuccess("Record saved successfully");

            this.displayList();
          })
          .catch(error => {
            this.isFormValid = false;
            this.notifyError("There is an error in saving suggestions data");
          });
        this.buttonKey++;
      });
    },

    async fetchAllCustomer() {
      this.customerList = await SuggestionsService.fetchAllCustomer().catch(
        error => {
          console.log(JSON.stringify(error));
          console.log(error);
          this.notifyError("Error while fetching customer list");
        }
      );
    },
    onCustomerChange(customer) {
      // console.log("this.form.customer_id : ", this.form.customer_id )
      // console.log("customer._id: ", customer._id)
      // if (this.form.customer_id != customer._id) {
      //   //this.form.object = "";
      // }
      this.form.customer_id = customer._id;
      this.form.customer_name = customer.customer_name;
      this.fetchObjectList();
    },

    fetchObjectList() {
      let queryParam = { customer_id: this.form.customer_id };
      this.objectList = EntityService.fetchObjectList(queryParam)
        .then(objectList => {
          if (objectList && objectList[0]["OBJECT_LIST"]) {
            this.objectList = _.keys(objectList[0]["OBJECT_LIST"]);
            return ["Hello"];
          }
          return [];
        })
        .catch(error => {
          console.log("error in fetch object list");
        });
    },
    clearObject() {
      this.form.object = "";
    }
  },

  beforeMount() {
    let user = this.$store.getters.user;
    if (user.roles.includes("admin")) {
      this.showList = true;
    }
    this.init();
    this.fetchAllCustomer();
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
// Global Components

@import "../../assets/scss/_variables";

// top section

// end top section

.add-suggestion-wrap {
  .object-name-wrap {
    .el-row {
      border-bottom: 0.5px solid rgba(0, 0, 0, 0.2);
      margin-left: -32px !important;
      margin-right: -32px !important;
      margin-bottom: 10pxl;
    }
  }

  h4 {
    padding-left: 34px;
    margin: 10px 0;
    font-size: 14px;
  }
  .el-icon-delete {
    padding: 5px;
    margin-top: 32px;
  }
}
</style>
</style>
