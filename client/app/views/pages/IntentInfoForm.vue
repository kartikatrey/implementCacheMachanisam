      <template>
        <el-main>
          <div class="kp-back-to-parent">
            <el-button class="kp-btn-back" icon="el-icon-back" v-on:click="displayList"></el-button>
            <h1 class="kp-page-title">{{pageTitle}}</h1>
          </div>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/intent-info-list' }">Intent Info</el-breadcrumb-item>
            <el-breadcrumb-item>{{pageTitle}}</el-breadcrumb-item>
          </el-breadcrumb>

          <!-- Form  Page -->

          <div class="kp-form-area">
            <div class="kp-form-panel">
              <el-row>
                <el-col>
                  <el-form
                    :label-position="labelPosition"
                    label-width="100px"
                    :model="intent_info"
                    :rules="validationRules"
                    ref="ruleForm"
                  >
                  <ConfirmModel ref="model"></ConfirmModel>
                    <el-row :gutter="72">
                      <el-col :span="8">
                        <div class="kp-form-input-1 kp-form-field">
                          <el-form-item label="Domain" prop="domain" class="kp-form-field-label">
                            <el-select placeholder="Please select domain" v-model="intent_info.domain"  @change="onDomainChange(intent_info.domain)">
                              <el-option
                                v-for="domain in domainList"
                                :label="domain.domain"
                                :value="domain.domain"
                                :key="domain.domain"
                              ></el-option>
                            </el-select>
                          </el-form-item>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col>
                        <div v-for="(obj,index) in intent_info.OBJECT_LIST" :key="index">
                          <div class="kp-attribute-wrap">
                            <div class="kp-title">
                              <el-row :gutter="72">
                                <el-col :span="15">
                                  <span>Object {{index+1}}</span>
                                </el-col>
                                <el-col :span="4">
                                  <el-button
                                    class="kp-blank-btn el-icon-delete el-button--default"
                                    v-on:click="removeObjectBlock(index)"
                                  ></el-button>
                                </el-col>
                              </el-row>
                            </div>

                            <el-row :gutter="72">
                              <el-col :span="8">
                                <div class="kp-form-input-1 kp-form-field">
                                  <el-form-item class="kp-form-field-label" label="Object">
                                    <el-input v-model.trim="obj.object" placeholder="Please enter Object"></el-input>
                                  </el-form-item>
                                </div>
                              </el-col>
                              <el-col>
                                <!-- <tag-list></tag-list> -->
                                <tag-list
                                  :value="obj.tagList"
                                  v-model="obj.tagList"
                                  :key="index"
                                  @change="onChangeTags(obj.object)"
                                ></tag-list>
                              </el-col>
                            </el-row>
                          </div>
                        </div>
                      </el-col>
                    </el-row>
                    <el-button class="kp-btn-primary" type="primary" v-on:click="addObjectBlock()">
                      <i class="el-icon-plus"></i> Add Object
                    </el-button>
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
import _ from "lodash";
import Json from "@/util/Json";
import CommonService from "@/services/CommonService";
import IntentInfoService from "@/services/IntentInfoService";
import TagList from "@/components/TagList";
import constants from "@/resources/Constants";
import ConfirmModel from "@/components/ConfirmModel";
export default {
  name: "IntentInfoForm",
  components: {
    TagList,
    ConfirmModel
  },
  data() {
    return {
      tags: [],
      newObjectName: "",
      labelPosition: "top",
      isFormValid: true,
      cacheDataModal: {
        cachedForm: {},
        isFormEdited: false
      },
      isEditForm: false,
      endPoint: "/portal/api/table/intent_info",
      pageTitle: "New intent info",
      intent_info: { OBJECT_LIST: [{ object: "", tagList: [] }] },
      buttonKey: 1,
      domainList: [],
      domain_intent_info: {},
      validationRules: this.setValidationRules()
    };
  },
  watch: {
    intent_info: {
      handler(newVal, oldVal) {
        let cachedForm = _.pickBy(this.cacheDataModal.cachedForm, _.identity);
        let intent_info = _.pickBy(this.intent_info, _.identity);

        cachedForm = JSON.stringify(cachedForm).replace(/\\n|\\t|\\r/g, "");
        intent_info = JSON.stringify(intent_info).replace(/\\n|\\t|\\r/g, "");

        this.cacheDataModal.isFormEdited = cachedForm != intent_info;
      },
      deep: true
    }
  },
  methods: {
    async init() {
      const recordId = this.getServiceIdFromUrl();
      if (recordId) {
        let intent_info = await IntentInfoService.fetchById(recordId).catch(
          error => {
            this.notifyError("Error while fetching Intent data");
          }
        );
        this.intent_info =
          intent_info && _.defaultsDeep(intent_info, this.intent_info.domain);
        // this.intent_info;
        this.intent_info.OBJECT_LIST = this.transformRecord(
          intent_info.OBJECT_LIST
        );
        this.pageTitle = "Edit intent info";

        // (service && `Edit Info`) || this.pageTitle;
        this.domain = this.intent_info.domain;
        this.OBJECT_LIST = this.intent_info.OBJECT_LIST;
        this.cacheDataModal.cachedForm = _.cloneDeep(this.intent_info);
        this.isEditForm = true;
      } else {
        this.cacheDataModal.cachedForm = _.cloneDeep(this.intent_info);
      }
    },
    async getDomain() {
      this.domainList = await IntentInfoService.fetchDomainList().catch(
        error => {
          this.notifyError("Error while fetching domains");
        }
      );
    },
    transformRecord(objectList) {
      let newObjectArray = [];
      _.forEach(objectList, function(value, key) {
        let newObject = { object: key, tagList: value };
        newObjectArray.push(newObject);
      });
      return newObjectArray;
    },

    transformToDBStructure(intentInfo) {
      let newObject = {};
      _.forEach(intentInfo.OBJECT_LIST, function(item) {
        newObject[item.object] = item.tagList;
      });
      intentInfo.OBJECT_LIST = newObject;
      return intentInfo;
    },

    displayList() {
      this.$router.push({
        path: "/intent-info-list"
      });
    },
    addObjectBlock() {
      this.intent_info.OBJECT_LIST.push({ object: "", tagList: [] });
    },
    removeObjectBlock(index) {
      this.intent_info.OBJECT_LIST.splice(index, 1);
    },
    onChangeTags(tag, object) {
      this.tags.push(tag);
      this.intent_info.OBJECT_LIST[object] = this.tags;
    },
    async onDomainChange(domain) {
      this.domain_intent_info = await IntentInfoService.fetchByDomain(
        this.intent_info.domain
      );
    },

    mergeByProperty(d_object_list, f_object_list, prop, prop1) {
      _.each(f_object_list, function(arr2obj) {
        let arr1obj = _.find(d_object_list, function(arr1obj) {
          return arr1obj[prop].toUpperCase() === arr2obj[prop].toUpperCase();
        });
        if (arr1obj) {
          if (!arr1obj[prop1]) {
            arr1obj[prop1] = [];
          }
          arr1obj[prop1] = _.union(arr1obj[prop1], arr2obj[prop1]);
        } else {
          d_object_list.push(arr2obj);
        }
      });
      d_object_list = _.uniqBy(d_object_list, function(arr1obj) {
        return arr1obj[prop].toUpperCase();
      });
      return d_object_list;
    },

    async save() {
      this.cacheDataModal.isFormEdited = false;
      let isValid = await this.$refs.ruleForm.validate().catch(error => {});
      this.isFormValid = isValid;
      let trecord;
      if (!this.isEditForm) {
        if (!this.domain_intent_info) {
          this.domain_intent_info = _.cloneDeep(this.intent_info);
          trecord = this.domain_intent_info.OBJECT_LIST;
        } else {
          trecord = this.transformRecord(this.domain_intent_info.OBJECT_LIST);
        }
        this.domain_intent_info.OBJECT_LIST = this.mergeByProperty(
          trecord,
          _.cloneDeep(this.intent_info.OBJECT_LIST),
          "object",
          "tagList"
        );
      } else {
        this.domain_intent_info = _.cloneDeep(this.intent_info);
        this.domain_intent_info.OBJECT_LIST = this.mergeByProperty(
          _.cloneDeep(this.domain_intent_info.OBJECT_LIST),
          _.cloneDeep(this.intent_info.OBJECT_LIST),
          "object",
          "tagList"
        );
      }

      intent_info = this.transformToDBStructure(this.domain_intent_info);

      let intent_info =
        isValid &&
        (await CommonService.save(this.endPoint, intent_info).catch(error => {
          this.isFormValid = false;
          this.notifyError("Error while saving  data!!");
        }));
      if (intent_info) {
        this.intent_info._id = intent_info._id; // add intent id after first request to existing intent object to avoid duplicate service entries
        this.notifySuccess("Record saved successfully!");
        this.displayList();
      }
      // });
    },

    getServiceIdFromUrl() {
      return this.$route.query.id || "";
    },

    setValidationRules() {
      return {
        domain: [
          {
            required: true,
            message: "Please input domain name",
            trigger: "change"
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
    this.getDomain();
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

.kp-page-title {
  font-size: 28px;
  color: #005da6;
  margin: 0;
  display: inline-block;
}

.kp-blank-btn {
  border: none;
  background: transparent;
}
.kp-btn-back {
  background: transparent;
  border-color: #005da6;
  color: #005da6;
  padding: 12px;
}

.kp-form-panel {
  background: #fff;
  padding: 32px;
  border-radius: 7px;
  margin-top: 32px;
  box-shadow: 0 0px 6px 1px rgba(0, 0, 0, 0.1);
  margin-bottom: 32px;
}

.kp-form-field {
  margin-bottom: 22px;

  input,
  select {
    background: #f5f6fa;
  }
}

.kp-form-field-invalid {
  input,
  select {
    border: 1px solid #ff4343;
  }

  .kp-form-field-invalid-label {
    color: #ff4343;
    font-size: 12px;
    margin-top: 4px;

    &:before {
      content: "* ";
    }
  }
}

.kp-form-field-label {
  color: #77787b;
  font-size: 14px;
  margin-bottom: 8px;
}

.kp-form-field-checkbox1 {
  .el-checkbox__inner {
    width: 22px;
    height: 22px;
    background: #f5f6fa;
  }

  .el-checkbox__label {
    color: #77787b;
  }
}

.kp-btn-form-primary {
  background: #005da6;
  color: #ffffff;
  font-weight: bold;
}

.kp-btn-form-outline {
  background: transparent;
  border-color: #005da6;
  color: #005da6;
}

.kp-btn-form-disabled {
  background: transparent;
  border-color: rgba(0, 93, 166, 0.4);
  color: rgba(0, 93, 166, 0.4);
}

.kp-form-error {
  display: inline-block;
  margin-left: 16px;
  color: #ff4343;
  font-size: 14px;
}
/// breadcome style

.el-breadcrumb {
  line-height: 21px;
  .el-breadcrumb__inner.is-link,
  .el-breadcrumb__inner a {
    color: #bcbec0;
    font-weight: 300;
    &:hover {
      color: #000;
    }
  }
  span {
    color: #bcbec0;

    .el-breadcrumb__inner {
      color: #bcbec0 !important;
    }
  }
}

// end breadcome style

el-menu-item {
  font-weight: bold;
  color: #212121;
}
.kp-btn-primary {
  background: #005da6;
  color: #ffffff;
  margin-top: 26px;
  i {
    color: #ffffff;
    font-size: 16px;
  }
}
.kp-attribute-wrap {
  .kp-title {
    background: #fafafa;
    border-top: 0.5px solid rgba(196, 196, 196, 0.5);
    border-bottom: 0.5px solid rgba(196, 196, 196, 0.5);
    margin-bottom: 16px;
    span {
      font-weight: 700;
      font-size: 14px;
      display: inline-block;
      padding: 10px;
    }
    button {
      display: inline-block;
      padding: 12px 8px;
      margin: 0;
    }
  }
}
</style>