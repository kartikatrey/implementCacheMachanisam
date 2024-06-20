<template>
  <el-main class="kp-main">
    <section class="page-body">
      <div class="page-title">
        <el-button
          class="back-button"
          cid="form-header-back"
          icon="mdi mdi-arrow-left-circle-outline"
          v-on:click="$router.push('/idp/error-code')"
        >
        </el-button>
        <span class="page-title-text" v-if="isEditMode">Edit error code </span>
        <span class="page-title-text" v-else>Add error code</span>
      </div>

      <section class="form-page-container">
        <div class="panel" v-loading="loading">
          <div class="panel-body">
            <el-form
              :model="form"
              :rules="formRules"
              ref="form"
              label-position="left"
              label-width="120px"
            >
            <div class="grouping-tile">General configuration</div>
               <el-row :gutter="40">
                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item prop="name" label="Name">
                      <el-input
                        cid="error-code-form-code"
                        name="name"
                        v-model="form.name"
                        placeholder="Error code"
                      ></el-input>
                    </el-form-item>
                  </div>
                </el-col>
             
                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item prop="code" label="Code">
                      <el-input
                        cid="error-code-form-code"
                        name="code"
                        v-model="form.code"
                        placeholder="Error code"
                      ></el-input>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>

              <el-row :gutter="40">
                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item prop="meesage" label="Message">
                      <el-input
                        cid="error-code-form-message"
                        name="message"
                        v-model="form.message"
                        placeholder="Error message"
                      ></el-input>
                    </el-form-item>
                  </div>
                </el-col>
              
                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item
                      class="control-label col-sm-2"
                      prop="type"
                      label="Type"
                    >
                      <el-select
                        class="select-box"
                        size="large"
                        cid="error-code-form-error-type-select"
                        v-model="form.type"
                        filterable
                        reserve-keyword
                        placeholder="Please select error type"
                      >
                        <el-option
                          v-for="(error_type, index) in error_types"
                          :cid="'error-code-form-error-type_' + index"
                          :key="error_type.value"
                          :label="error_type.label"
                          :value="error_type.value"
                          label-width="170px"
                        ></el-option>
                      </el-select>
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
                cid="error-code-form-cancel"
                size="small"
                v-on:click="onBack"
                >Cancel</el-button
              >
            </div>
            <div>
              <el-button
                v-if="isSaveActionAllowed"
                :disabled="disableSave"
                cid="error-code-form-save"
                size="small"
                v-on:click="save"
                type="primary"
                >Save</el-button
              >
            </div>
          </footer>
        </div>
        <!-- | panel -->
      </section>
    </section>
  </el-main>
</template>

<style lang="scss">
@import "../_idpGlobal.scss";
</style>

<script>
import Constants from "@/resources/Constants";
import EventBus from "@/EventBus";
import VueQueryBuilder from "vue-query-builder";
import _ from "lodash";
import ErrorCodeService from "@/idp/services/ErrorCodeService";
import formMixin from "@/mixins/formMixin.js";

export default {
  name: "ErrorCodeForm",
  components: { VueQueryBuilder },
  mixins: [formMixin],
  computed: {},
  data() {
    var EmptyValueValidator = (rule, value, callback) => {
      if (value && value.trim() === "") {
        callback(new Error(`Please enter valid label name`));
        return;
      }
      callback();
    };
    return {
      disableSave: false,
      isSaveActionAllowed: true,
      isEditMode: false,
      loading: false,
      pageTitle: "Add Error code",
      form: {
        name:"",
        code: "",
        message: "",
        type: "",
      },
      error_types: Constants.DOCEX.ERROR_TYPES,
      formRules: {
        name: [
          {
            validator: EmptyValueValidator,
            trigger: "blur",
            message: "Name is madatory",
          },
          {
            required: true,
            message: "Please provide name",
            trigger: "blur",
          },
        ],
        code: [
          {
            validator: EmptyValueValidator,
            trigger: "blur",
            message: "Error code is madatory",
          },
          {
            required: true,
            message: "Please provide error code name",
            trigger: "blur",
          },
        ],
        message: [
          {
            validator: EmptyValueValidator,
            trigger: "blur",
            message: "Error message is madatory",
          },
          {
            required: true,
            message: "Please provide error message",
            trigger: "blur",
          },
        ],
        type: [
          {
            validator: EmptyValueValidator,
            trigger: "blur",
            message: "Error type is madatory",
          },
          {
            required: true,
            message: "Please provide error type",
            trigger: "blur",
          },
        ],
      },
      rules: [],
    };
  },
  methods: {
    onBack() {
      this.$router.push("/idp/error-code");
    },
    async init(recordId) {
      try {
        let data = await ErrorCodeService.fetchById(recordId,  ["-updated_by","-updated_at","-created_by","-created_at"]);
        this.form = Object.assign({}, this.form, data);
      } catch (error) {
        this.notifyError("Error while displaying record");
      }
      this.loading = false;
    },
    async save() {
      this.disableSave = true;
      let isValid = await this.$refs.form.validate().catch((error) => {});
      if (!isValid) {
        this.disableSave = false;
        return;
      }
      let res = await ErrorCodeService.save(this.form).catch((errorMessage) => {
        this.notifyError(errorMessage);
      });
      if (res) {
        this.form = res;
        this.$router.push("/idp/error-code");
        this.notifySuccess("Records saved successfully");
      }
      this.disableSave = false;
    },
  },
  async beforeMount() {
    this.isSaveActionAllowed = await this.isSaveActionPermitted('de_code');
    let recordId = this.$route.query.id;
    if (!recordId) return;
    this.isEditMode = true;
    this.loading = true;
    this.isEditMode = true;
    await this.init(recordId);
    this.registerEvents();
    this.$store.commit("setDisplayIdpTree",false);
    this.$store.commit("setDisplayIdpNavbar",true);
  },
};
</script>

<style lang="scss">
@import "../_idpGlobal.scss";
@import "../_idpVariables.scss";
</style>
