<template>
  <el-main class="kp-main">
    <section class="page-body">
      <div class="table-wrap">
        <DataTable :parameters="requiredParams" @selectionChanged="handleSelectionChanged"></DataTable>
      </div>
    </section>
  
    <el-dialog
        width="65%"
        :show-close="false"
        :destroy-on-close="true"
        class="folder-modal-container"
        title="Export Bucket"
        :visible.sync="displayDeployDialog"
        :append-to-body="true"
        center
      >
        <section class="accordian-container">
          Enter details
          <div class="accordian-bar">
            <!-- <section class="form-page-container"> -->
        <div class="panel">
          <div class="panel-body">
            <el-form
              :model="deployObj"
              :rules="formRules"
              ref="form"
              label-position="left"
              label-width="150px"
            >
              <el-row :gutter="180">
                <el-col :span="14">
                  <div class="kp-form-group">
                    <el-form-item prop="host" label="Host">
                      <el-input
                        name="host"
                        cid="bucket-form-host"
                        v-model="deployObj.host"
                        placeholder="https://example.com"
                      ></el-input>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>

              <el-row :gutter="180">
                <el-col :span="14">
                  <div class="kp-form-group">
                    <el-form-item prop="user_name" label="User name">
                      <el-input
                        name="user_name"
                        cid="bucket-form-name"
                        v-model="deployObj.user_name"
                        placeholder="User name"
                      ></el-input>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>

              <el-row :gutter="180">
                <el-col :span="14">
                  <div class="kp-form-group">
                    <el-form-item prop="password" label="Password">
                      <el-input
                        name="password"
                        type="password"
                        cid="bucket-form-name"
                        v-model="deployObj.password"
                        placeholder="password"
                      ></el-input>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
              </el-form>
            </div>
        </div>
            <!-- </section> -->
            <!-- <div class="panel"> -->          
              
              
              <footer>
                <div></div>
                <div>
                  <el-button
                    id="deploy-btn"
                    type="primary"
                    size="small"
                    @click="deployBucket"
                  >
                    Deploy
                  </el-button>
                </div>
                <div>
                  <el-button
                    type="primary"
                    size="small"
                    @click="deployCancel"
                  >
                    Cancel
                  </el-button>
                </div>
              </footer>
            <!-- </div> -->
          </div>
        </section>
    </el-dialog>
    <upload
        v-if="displayUploadDialog"
        @closeDialog="closeDialog"
        :parameters="fileUploadParameters"
        :multiple="true"
        :dialogShow="displayUploadDialog"
        :accept="['application/json']"
      ></upload>
  </el-main>
</template>

<script>
import DataTable from "../../components/DataTable.vue";
import EventBus from "@/EventBus";
import BucketService from "@/idp/services/BucketService";
import Upload from "@/components/Upload";

export default {
  name: "BucketList",
  components: {
    DataTable,
    Upload
  },
  data() {
    const emptyValueValidator = (rule, value, callback) => {
      value && ("" + value).trim() === "" ? callback(new Error("Please enter valid label name")) : callback();
    };
    return {
      requiredParams: {
        apiName: "/portal/api/table/bucket",
        queryParam: {
          active: true,
        },
        showPaginationOptions: true,
        tableName: "bucket",
        initialSort: "-created_at",
        isRestify: true,
        isRegxSearch: true,
        customfilter: false,
        pageTitle: "Bucket List",
        limit: 10,
        addButtonConfig: {
          path: "/idp/bucket-form",
          name: "Create Bucket",
        },
        extraButtons :[
          {
            event: "exportBucket",
            id:"export-btn",
            name: "Export",
          },
          {
            event: "importDialog",
            name: "Import",
          },
          {
            event: "deployDialog",
            name: "Deploy",
          }          
        ],
        showSelectOptions : true
      },
      displayDeployDialog : false,
      bucketIds : [],
      displayUploadDialog : false,
      deploy: false,
      deployObj : {},
      allBusEvents : [],
      fileUploadParameters: {
        endpoint: "/portal/api/bucket",
        title:"Upload",
        valid_file_types : ['application/json']
      },
      formRules: {
        host: [
          {
            validator: emptyValueValidator,
            trigger: "blur",
            message: "Please provide host name",
          },
          {
            required: true,
            message: "Please provide host name",
            trigger: "blur",
          },
        ],
        user_name: [
          {
            validator: emptyValueValidator,
            trigger: "blur",
            message: "Please provide User name",
          },
          {
            required: true,
            message: "Please provide User name",
            trigger: "blur",
          },
        ],
        password: [
          {
            validator: emptyValueValidator,
            trigger: "blur",
            message: "Please provide password",
          },
          {
            required: true,
            message: "Please provide password",
            trigger: "blur",
          },
        ]
      },
      
    };
  },
  methods: {
    importDialog(){
      this.displayUploadDialog = true
    },
    deployDialog(){
      if(this.bucketIds.length && this.bucketIds.find(obj => obj.status != "Closed")){
        this.notifyError("Only closed buckets can be exported");
        return
      }
      this.bucketIds = this.bucketIds.map(obj => obj._id)
      if(!this.bucketIds.length){
        this.notifyError("Please select closed bucket");
        return
      }
      this.displayDeployDialog = true;
    },
    async deployBucket(){
      this.$setLoader({target: "#deploy-btn", spinner: "el-icon-loading" });
      let valid = await this.$refs.form.validate().catch((error) => {});
      if (!valid) {
        this.$resetLoader();
        return;
      }

      this.deployObj["bucketIds"] = this.bucketIds
      let deployBucketRes = await BucketService.deployBucket(this.deployObj)
      if(!deployBucketRes.data.body.data.status){
        this.notifyError(deployBucketRes.data.body.data.message);
        return;
      }

      if(deployBucketRes.data.body.data.status){
        this.displayDeployDialog = false
        this.$resetLoader();
        this.notifySuccess("Bucket deployed successfully");
        return;
      }
      
      this.notifyError("Something went wrong.");
      
    },
    handleSelectionChanged(selectedRows){;
      this.bucketIds = selectedRows
    },
  
    closeDialog() {
      EventBus.$emit("refreshTable",{})
      this.displayUploadDialog = false;
    },
    
    async exportBucket(){
      
      if(this.bucketIds.length && this.bucketIds.find(obj => obj.status != "Closed")){
        this.notifyError("Only closed buckets can be exported");
        return
      }
      this.bucketIds = this.bucketIds.map(obj => obj._id)
      if(!this.bucketIds.length){
        this.notifyError("Please select closed bucket");
        return
      }
      this.$setLoader({
        target: "#export-btn",
        spinner: "el-icon-loading",
      });
      await BucketService.exportBucket(this.bucketIds)
      this.$resetLoader();
      EventBus.$emit("refreshTable",{})
    },
    deployCancel(){
      this.displayDeployDialog = false
    },
    registerEvents(){
      this.allBusEvents = ["exportBucket","importDialog","deployDialog"]
      EventBus.$on("exportBucket",()=>{
        this.exportBucket()
      })
      EventBus.$on("importDialog",()=>{
        this.importDialog()
      })
      EventBus.$on("deployDialog",()=>{
        this.deployDialog()
      })
    },
    deRegisterEvents() {
      EventBus.$off(this.allBusEvents);
    }
  },
  beforeMount(){
    this.$store.commit("setDisplayIdpTree",false);
    this.$store.commit("setDisplayIdpNavbar",true);
    this.registerEvents()
  },
  beforeDestroy() {
    this.deRegisterEvents();
  },
};
</script>
<style lang="scss">
@import "../_idpGlobal.scss";

</style>