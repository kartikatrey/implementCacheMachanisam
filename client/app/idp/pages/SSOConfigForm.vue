<template v-loading="loading">
  <el-main class="kp-main">
      <section class="page-body">
          <div class="page-title">
              <el-button icon="mdi mdi-arrow-left-circle-outline" cid="form-header-back" v-on:click="onBack"></el-button>
              <span class="page-title-text" v-if="form._id">Edit {{ pageTitle }}
              </span>
              <span class="page-title-text" v-else>Add {{ pageTitle }}</span>
          </div>

          <section class="form-page-container">
            <div class="panel">
                <div class="panel-body">
                    <el-form :model="form" ref="form" label-width="120px" :rules="formRules">
                        <div class="grouping-tile">
                            General configuration
                        </div>

                        <el-row :gutter="40">
                          <el-col :span="12">
                            <div class="kp-form-group">
                              <el-form-item prop="entryPoint" label="Entry Point">
                                <el-input
                                  cid="sso-config-form-entry-point"
                                  name="entryPoint"
                                  v-model="form.entryPoint"
                                  type="input"
                                  :rows="2"
                                  placeholder="Enter the entry point"
                                ></el-input>
                              </el-form-item>
                            </div>
                          </el-col>
                          <el-col :span="12">
                            <div class="kp-form-group">
                              <el-form-item prop="callbackUrl" label="Callback URL">
                                <el-input
                                  cid="sso-config-form-callback-url"
                                  name="callbackUrl"
                                  v-model="form.callbackUrl"
                                  type="input"
                                  :rows="2"
                                  placeholder="Enter the Callback URL"
                                ></el-input>
                              </el-form-item>
                            </div>
                          </el-col>
                        </el-row>

                        <el-row :gutter="40">
                          <el-col :span="12">
                            <div class="kp-form-group">
                                <el-form-item class="control-label col-sm-2" prop="issuer" label="Issuer">
                                    <el-input 
                                      :disabled="form.is_platform" 
                                      cid="sso-config-form-issuer"
                                      class="form-control" 
                                      prop="issuer" 
                                      v-model="form.issuer"
                                      placeholder="Enter the issuer name"></el-input>
                                </el-form-item>
                            </div>
                          </el-col>
                        </el-row>

                        <el-row :gutter="40">
                          <el-col>
                            <div class="kp-form-group">
                              <el-form-item prop="cert" label="Certificate">
                                <el-input
                                  name="Certificate"
                                  cid="sso-config-form-certificate"
                                  v-model="form.cert"
                                  type="textarea"
                                  :autosize="{ minRows: 6, maxRows: 6 }"
                                  placeholder="Enter the Certificate"
                                ></el-input>
                              </el-form-item>
                            </div>
                          </el-col>
                        </el-row>
                    </el-form>
                </div>
                <footer>
                    <div></div>
                    <div>
                        <el-button cid="sso-config-form-cancel" size="small" v-on:click="onBack">Cancel</el-button>
                    </div>
                    <div>
                        <el-button size="small" v-on:click="saveForm" type="primary">Save</el-button>
                    </div>
                </footer>
            </div>
          </section>
      </section>
  </el-main>
</template>

<script>
import SSOService from '@/idp/services/SSOService'
export default {
  name: "SSOConfigForm",
  data() {
    return {
      form: {
        entryPoint: "",
        issuer: "",
        callbackUrl: "",
        cert: "",
        active: true
      },
      pageTitle: "SSO Configuration",
      loading: false,
      formRules: {
        entryPoint: [
          {
            required: true,
            message: "Entry point is a mandatory field",
            trigger: "blur"
          }
        ],
        issuer: [
          {
            required: true,
            trigger: "blur",
            message: "Issuer is a mandatory field"
          }
        ],
        callbackUrl: [
          {
            required: true,
            message: "Callback URL is a mandatory field",
            trigger: "blur"
          }
        ],
        cert: [
          {
            required: true,
            trigger: "blur",
            message: "Certificate is a mandatory field"
          }
        ]
      }
    };
  },
  methods: {
    onBack(){
      this.$router.push("/idp/sso-config-list");
    },
    displayList(){
      this.$router.push({ path: "/idp/sso-config-list" });
    },
    async saveForm(){
      let valid = await this.$refs.form.validate().catch(error => {});
      if(!valid){
        return;
      }
      this.showVersionList = false;
      this.loading = true;
      try{
        const configurationResponse = await SSOService.saveConfiguration(this.form);
        const statusCode = _.get(configurationResponse, 'status')
        if(statusCode==200 || statusCode==201){
          this.notifySuccess("Configuration saved successfully!")
        }
        this.displayList();
      }catch(err){
        this.notifyError("Error while saving data");
      }
      this.loading = false;
    },
    async init(){
      try{
        this.loading = true;
        const recordId = this.$route.query.id;
        if(recordId){
          const response = await SSOService.getConfigurationById(recordId);
          this.form = response;
        }
      }catch(err){
        this.notifyError(err);
      }
      this.loading = false;
    }
  },
  beforeMount(){
    this.$store.commit("setDisplayIdpTree", false);
    this.$store.commit("setDisplayIdpNavbar", true);
    this.init();
  }
};
</script>

<style lang="scss" scoped>
@import "../_idpVariables";
@import "../_idpGlobal";
</style>
