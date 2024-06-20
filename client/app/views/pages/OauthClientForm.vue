<template>
 <el-main>
    <div class="kp-back-to-parent">
        <el-button class="kp-btn-back" icon="el-icon-back" v-on:click="displayList"></el-button>
        <h1 class="kp-page-title">{{pageTitle}}</h1>
    </div>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/oauth-client-list' }">Oauth client</el-breadcrumb-item>
        <el-breadcrumb-item>{{pageTitle}}</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- Form  Page -->

    <div class="kp-form-area">
        <div class="kp-form-panel">
            <el-row>
                <el-col>
                    <el-form :model="oauth_client" :rules="validationRules" ref="form">
                        <!-- basic content -->
                        <ConfirmModel ref="model"></ConfirmModel>
                        <el-row :gutter="72">
                            <el-col :span="8">
                                <div class="kp-form-input-1 kp-form-field">
                                    <el-form-item class="kp-form-field-label" label="Client Id" prop="clientId">
                                        <el-input v-model="oauth_client.clientId" placeholder=""></el-input>
                                    </el-form-item>
                                </div>
                                <div class="kp-form-select-1 kp-form-field">
                                    <el-form-item class="kp-form-field-label" label="Redirect URIs" prop="redirectUris">
                                        <el-input type="textarea" rows="4" v-model="oauth_client.redirectUris" placeholder="Eg. http://localhost:7000/oauth/callback, 
                https://www.getpostman.com/oauth2/callback"></el-input>
                                    </el-form-item>
                                </div>
                            </el-col>
                            <el-col :span="8">
                                <div class="kp-form-input-1 kp-form-field">
                                    <el-form-item class="kp-form-field-label" label="Client secret" prop="clientSecret">
                                        <el-input v-model="oauth_client.clientSecret" placeholder=""></el-input>
                                    </el-form-item>
                                </div>
                                <div class="kp-form-select-1 kp-form-field">
                                    <el-form-item class="kp-form-field-label" label="Grants" prop="grants">
                                        <el-input type="textarea" rows="4" v-model="oauth_client.grants" placeholder="Eg. authorization_code, refresh_token"></el-input>
                                    </el-form-item>
                                </div>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-col>
            </el-row>
        </div>
        <el-button v-on:click.once="save" :key="buttonKey" class="kp-btn-form-primary" type="primary">Save</el-button>
        <el-button v-on:click="displayList" class="kp-btn-form-outline">Cancel</el-button>
        <div v-if="!isFormValid" class="kp-form-error">
            * Please check field with errors
        </div>
    </div>
</el-main>
</template>

<script>
import _ from "lodash";
import Json from "@/util/Json";
import Codemirror from "@/components/Codemirror";
import CommonService from "@/services/CommonService";
import constants from "@/resources/Constants";
import ConfirmModel from "@/components/ConfirmModel";

export default {
  name: "OauthClientFrom",
  components: {
    Codemirror,
    ConfirmModel
  },
  data() {
    return {
      // state: {
      //   isSending: false
      // },
      isFormValid: true,
      labelPosition: "top",
      isFormValid: true,
      cacheDataModal: {
        cachedForm: {},
        isFormEdited: false,
        isEditForm: false,
        isNewForm: false
      },
      requiredParam: {},
      pageTitle: "New oauth client",
      editorOptions: {
        mode: "text/javascript",
        theme: "default"
      },
      oauth_client: {},
      buttonKey: 1,
      endpoint: constants.OAUTH_CLIENT_ENDPOINT,
      validationRules: this.setValidationRules()
    };
  },
  watch: {
    oauth_client: {
      handler(newVal, oldVal) {
         let cachedForm = _.pickBy(this.cacheDataModal.cachedForm , _.identity);
          let oauth_client = _.pickBy(this.oauth_client , _.identity);
      
            this.cacheDataModal.isFormEdited =  JSON.stringify(cachedForm) !=
            JSON.stringify(oauth_client);
      },
      deep: true
    }
  },
  methods: {
    async init() {
      const oauthId = this.getOauthIdFromUrl();
      if (oauthId) {
        let oauth_client = await CommonService.fetchById(
          this.endpoint,
          oauthId
        ).catch(error => {
          this.notifyError("Error while fetching oauth data");
        });
        this.oauth_client =
          (oauth_client && _.defaultsDeep(oauth_client, this.oauth_client)) ||
          this.oauth_client;

        this.cacheDataModal.cachedForm = { ...this.oauth_client };
        this.pageTitle = "Edit oauth client";
      } else {
        this.cacheDataModal.cachedForm = { ...this.oauth_client };
      }
    },
    getOauthIdFromUrl() {
      return this.$route.query.id || "";
    },

    async save() {
      // this.state.isSending = true;
       this.cacheDataModal.isFormEdited = false;
    
      let isValid = await this.$refs.form.validate().catch(error => {});
      this.isFormValid = isValid;
      let clone_oauth_client = _.cloneDeep(this.oauth_client);

     clone_oauth_client.redirectUris =  _.isString(this.oauth_client.redirectUris) ? this.oauth_client.redirectUris.split(","):this.oauth_client.redirectUris;
     clone_oauth_client.grants = _.isString(this.oauth_client.grants) ? this.oauth_client.grants.split(","):this.oauth_client.grants;
     
      let oauth_client =
        isValid &&
        (await CommonService.save(this.endpoint, clone_oauth_client).catch(
          error => {
            this.notifyError("Error while saving oauth data!!");
          }
        ));
      if (oauth_client) {
        this.oauth_client._id = oauth_client._id; // add service id after first request to existing service object to avoid duplicate service entries
        this.notifySuccess("oauth saved successfully!!");
        this.displayList();
      }
      this.buttonKey++;
    },

    displayList() {
      this.$router.push({
        path: "/oauth-client-list"
      });
    },
    setValidationRules() {
      return {
        clientId: [
          {
            required: true,
            message: "Please input clientId",
            trigger: "change"
          }
        ],
        redirectUris: [
          {
            required: true,
            message: "Please input redirectUris",
            trigger: "change"
          }
        ],
        clientSecret: [
          {
            required: true,
            message: "Please input model clientSecret",
            trigger: "change"
          }
        ],
        grants: [
          {
            required: true,
            message: "Please input grants",
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
</style>
