<template>
  <el-main class="kp-main">
    <section class="page-body">
      <div class="page-title">
        <el-button
          class="back-button"
          cid="form-header-back"
          icon="mdi mdi-arrow-left-circle-outline"
          v-on:click="$router.push('/idp/ui-setup')"
        >
        </el-button>
        <span class="page-title-text"> {{ pageTitle }}</span>
        <span> edit existing UI Setup </span>
      </div>

      <section class="form-page-container">
        <div class="panel">
          <div class="panel-body">
            <el-form
              :model="form"
              ref="form"
              label-position="left"
              label-width="120px"
            >
              <div class="grouping-tile">General configuration</div>
              <el-row :gutter="40">
                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item prop="main_color" label="Main Color">
                      <input type="text" v-model="form.ui_config.main_color" />
                      <input
                        type="text"
                        class="ui_color_box"
                        v-bind:style="{
                          backgroundColor: form.ui_config.main_color,
                        }"
                      />
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item prop="logo" label="Logo">
                      <el-upload
                        :action="endpoint"
                        accept="image/jpeg,image/gif,image/png"
                        :on-change="onLogoUpload"
                        :auto-upload="false"
                        :show-file-list="true"
                        :multiple="false"
                        :limit="1"
                      >
                        <el-button slot="trigger" size="small" type="primary"
                          >Upload/Browse file</el-button
                        >
                      </el-upload>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="40">
                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item prop="sub_color1" label="Sub Color 1">
                      <input type="text" v-model="form.ui_config.sub_color1" />
                      <input
                        type="text"
                        class="ui_color_box"
                        v-bind:style="{
                          backgroundColor: form.ui_config.sub_color1,
                        }"
                      />
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item prop="fab_icon" label="Fab Icon">
                      <el-upload
                        :action="endpoint"
                        accept="image/jpeg,image/gif,image/png"
                        :on-change="onFabIconUpload"
                        :auto-upload="false"
                        :show-file-list="true"
                        :multiple="false"
                        :limit="1"
                        :list-type="string"
                      >
                        <el-button slot="trigger" size="small" type="primary"
                          >Upload/Browse file</el-button
                        >
                      </el-upload>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item prop="sub_color1" label="Sub Color 2">
                      <input type="text" v-model="form.ui_config.sub_color2" />
                      <input
                        type="text"
                        class="ui_color_box"
                        v-bind:style="{
                          backgroundColor: form.ui_config.sub_color2,
                        }"
                      />
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
                v-on:click="$router.push('/idp/ui-setup')"
                size="small"
                cid="ui-setup-form-cancel"
              >
                Cancel
              </el-button>
            </div>  
            <div>
              <el-button
                  id="reset-btn"
                  v-on:click="resetUiSetup"
                  size="small"
                  cid="ui-setup-form-run-reset"
                  type="primary"
                >
                  Reset
                </el-button>
            </div>
            <div>
              <el-button
                id="save-btn"
                :disabled="disableSave"
                v-on:click="save"
                size="small"
                cid="ui-setup-form-run-save"
                type="primary"
              >
                Save
              </el-button>
            </div>
          </footer>
        </div>
        <!-- | panel -->
      </section>
      <!-- | form-page-container -->
    </section>
  </el-main>
</template>

<script>
import VueUploadComponent from "vue-upload-component";
import DAService from "@/services/DAService";
import EventBus from "@/EventBus";
var reader = new FileReader();
export default {
  name: "UiSetupForm",
  components: {
    DAService,
    FileUpload: VueUploadComponent,
  },
  data() {
    return {
      base64Logo: "",
      base64FabIcon: "",
      endpoint: "/portal/api/process-image",
      selectedFiles: {},
      fileList: [],
      logoData: "",
      fabIconData: "",
      form: {
        ui_config: {
          main_color: "",
          sub_color1: "",
          sub_color2: "",
          fab_icon: "",
          logo: "",
        },
      },

      pageTitle: "UI Setup",
      disableSave: false,
      image: {
        size: "",
        height: "",
        width: "",
      },
    };
  },

  methods: {
    async onLogoUpload(file) {
      this.onUploadChange(file);
      let self = this;
      console.log(typeof file);
      reader.readAsDataURL(file.raw);
      reader.onload = async function (e) {
        await self.resizeImage(this.result);
      };
    },
    async onFabIconUpload(file) {
      let self = this;
      this.onUploadChange(file);
      reader.readAsDataURL(file.raw);
      reader.onload = await function (e) {
        self.base64FabIcon = this.result;
      };
    },
    async onUploadChange(file) {
      //checkFileSize
      const isIMAGE =
        file.raw.type === "image/jpeg" ||
        file.raw.type === "image/png" ||
        file.raw.type === "image/gif";
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (!isIMAGE) {
        this.$notify.error("Uploaded files can only be in picture format!");
        return false;
      }
      if (!isLt1M) {
        this.$notify.error("Upload file size cannot exceed 1 MB!");
        return false;
      }
    },
    async resizeImage(base64Str) {
      let img = new Image();
      img.src = base64Str;
      img.onload = () => {
        let canvas = document.createElement("canvas");
        let width = 303;
        let height = 39;
        canvas.width = width;
        canvas.height = height;
        let ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        this.base64Logo = canvas.toDataURL();
        this.form.ui_config.logo = this.base64Logo;
      };
    },
    async init(recordId) {
      try {
        let uiSetupData = await DAService.fetchById(recordId);
        this.form = Object.assign({}, this.form, uiSetupData);
        if (this.form._id) {
          this.base64Logo = this.form.ui_config.logo;
          this.base64FabIcon = this.form.ui_config.fab_icon;
        }
      } catch (error) {
        this.notifyError("Error");
      }
    },

    async save() {
      this.form.ui_config.fab_icon = this.base64FabIcon;
      await DAService.save(this.form)
        .then((response) => {
          this.form = response;
          this.notifySuccess("Record saved successfully");

          this.$store.commit("setUiConfig", {
            mainColor: this.form.ui_config.main_color || "",
            subColor1: this.form.ui_config.sub_color1 || "",
            subColor2: this.form.ui_config.sub_color2 || "",
            logo: this.form.ui_config.logo || "",
            fabIcon: this.form.ui_config.fab_icon || "",
          });

          this.$router.push({
            path: "/idp/ui-setup",
          });

          return;
        })
        .catch((error) => {
          console.log(error);
          this.notifyError("Error while processing");
        });
    },
    async resetUiSetup() {
      let confirmText = `Are you sure you want to reset UI Setup?`;
      this.$confirm(confirmText, "Confirmation", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        type: "warning",
      }).then(async () => {
        this.form.ui_config = {
          main_color: "",
          sub_color1: "",
          sub_color2: "",
          fab_icon: "",
          logo: "",
        };
        await DAService.save(this.form)
          .then((response) => {
            this.form = response;
            this.notifySuccess("Record saved successfully");

            this.$store.commit("setUiConfig", {
              mainColor: "",
              subColor1: "",
              subColor2: "",
              logo: "",
              fabIcon: "",
            });

            this.$router.push({
              path: "/idp/ui-setup",
            });

            return;
          })
          .catch((error) => {
            console.log(error);
            this.notifyError("Error while processing");
          });
      });
    },
  },
  beforeMount() {
    this.$store.commit("setDisplayIdpTree",false);
    this.$store.commit("setDisplayIdpNavbar",true);
    let recordId = this.$route.query.id;
    if (recordId) this.init(recordId);
  },
};
</script>

<style lang="scss" >
@import "../_idpGlobal";

.ui_color_box {
  width: 30px;
}
</style>