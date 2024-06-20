<template>
  <el-main class="kp-main">
    <section class="page-body">
      <div class="page-title">
        <el-button
          class="back-button"
          cid="form-header-back"
          icon="mdi mdi-arrow-left-circle-outline"
          v-on:click="$router.push('/idp/bucket-list')"
        >
        </el-button>
        <span class="page-title-text"> {{ pageTitle }}</span>
        <span> Create new bucket or edit existing </span>
      </div>

      <section class="form-page-container">
        <div class="panel">
          <div class="panel-body">
            <el-form
              :model="form"
              :rules="formRules"
              :disabled = "disableForm"
              ref="form"
              label-position="left"
              label-width="120px"
            >
             <div class="grouping-tile" >General configuration</div>
              <el-row :gutter="40">
                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item prop="name" label="Name">
                      <el-input
                        name="name"
                        cid="bucket-form-name"
                        v-model="form.name"
                        placeholder="bucket name"
                        :disabled="disabledButton"
                      ></el-input>
                    </el-form-item>
                  </div>
                </el-col>
           
                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item prop="description" label="Description">
                      <el-input
                        name="description"
                        cid="bucket-form-description"
                        v-model="form.description"
                        placeholder="bucket description"
                        :disabled="disabledButton"
                      ></el-input>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>

               <el-row :gutter="40">
                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item prop="status" label="Status">
                      <el-select
                        name="status"
                        clearable
                        filterable
                        cid="bucket-form-status-select"
                        v-model="form.status"
                        placeholder="Select"
                        :disabled="disabledButton"
                      >
                        <el-option
                          v-for="(value,index) in bucket_status"
                          :key="value.value"
                          :cid="'bucket-form-bucket-status_'+index"
                          :value="value.value"
                          :label="value.label"
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
                v-on:click="$router.push('/idp/bucket-list')"
                size="small"
                cid="bucket-form-cancel"
              >
                Cancel
              </el-button>
            </div>
            <div>
              <el-button
                class="commit-btn"
                v-if="showCommitBtn"
                v-on:click="commit('check_conflict')"
                size="small"
                cid="bucket-form-commit"
                type="primary"
              >
                Commit
              </el-button>
            </div>
            <div>
              <el-button
                
                v-if="isSaveActionAllowed && !showCommitBtn"
                
                v-on:click="save"
                size="small"
                cid="bucket-form-save"
                type="primary"
              >
                Save
              </el-button>
            </div>
            <div>
              <el-button
                v-if="showSaveAssignBtn && !showCommitBtn"
                id="save-assign-btn"
                
                v-on:click="saveAssign"
                size="small"
                cid="bucket-form-save-assign"
                type="primary"
              >
                Save and assign
              </el-button>
              <el-button
                v-if="showRevertBtn"
                id="revert-bucket-btn"
                
                v-on:click="revertBucket"
                size="small"
                cid="revert-bucket-btn"
                type="primary"
              >
                Revert Bucket
              </el-button>
            </div>
          </footer>
        </div>
        <!-- | panel -->
      </section>
      <!-- | form-page-container -->
    </section>
    <div v-if="showBucketItemList">
    <h3 class="page-title">
        Bucket items
      </h3>
      <div class="grid-content bg-purple">
        <div data-v-step="2" class="table-wrap">
          <data-table :parameters="BucketItemTableParams" ref="datatable"></data-table>
        </div>
      </div>
    </div>

    <el-dialog
        width="65%"
        :show-close="false"
        :destroy-on-close="true"
        class="folder-modal-container"
        title="Conflict bucket items"
        :visible.sync="displayConflictDialog"
        :append-to-body="true"
        center
      >
        <section class="accordian-container">
          {{conflictMsg}}
          <div class="accordian-bar">
            <div class="grid-content bg-purple">
              <div data-v-step="2" class="table-wrap">
                <data-table :parameters="BucketItemConflictParams" ref="datatable" @selectionChanged="handleSelectionChanged"></data-table>
              </div>
            </div>
            
            <footer>
              <div></div>
              
                <el-button
                  type="primary"
                  size="small"
                  @click="commit('commit')"
                  class = "commit-btn"
                >
                  Commit
                </el-button>
              
              <div>
                <el-button
                  type="primary"
                  size="small"
                  @click="commitCancel"
                >
                  Cancel
                </el-button>
              </div>
            </footer>
            
          </div>
        </section>
    </el-dialog>

    </el-main>
</template>

<script>
import Constants from "@/resources/Constants";
import BucketService from "@/idp/services/BucketService";
import EventBus from "@/EventBus";
import DataTable from "@/components/DataTable.vue";
import formMixin from "@/mixins/formMixin.js";


export default {
  name: "BucketForm",
  mixins: [formMixin],
  components: {
    DataTable
 
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
      displayConflictDialog : false,
      form: {
        name: "",
        description: "",
        status: "",
        active: true,        
      },
      isSaveActionAllowed: true,        
      disableForm: false,
      showSaveAssignBtn: false,
      showRevertBtn: false,
      showCommitBtn : false,
      disabledButton : false,
      bucket_status : Constants.BUCKET_STATUS,
      fields_message_mapping: {
        name: "Please provide Business Rule Name",
        document_type: "Please select Document Type",
        type: "Please select  Business Rule Type",
        advanced_script: "Script cannot be empty",
      },
      pageTitle: "Bucket",
      showBucketItemList:false,
      //disableSave: false,
      ingonedBucketIds : [],
      conflictMsg : "",
    

      formRules: {
        name: [
          {
            validator: EmptyValueValidator,
            trigger: "blur",
            message: "Please provide Bucket Name",
          },
          {
            required: true,
            message: "Please provide Bucket Name",
            trigger: "blur",
          },
        ],

        description: [
          {
            validator: EmptyValueValidator,
            trigger: "blur",
            message: "Please provide Bucket description",
          },
          {
            required: true,
            message: "Please provide Bucket description",
            trigger: "blur",
          },
        ],

        status: [
          {
            validator: EmptyValueValidator,
            trigger: "blur",
            message: "Please select Bucket status",
          },
          {
            required: true,
            message: "Please select Bucket status",
            trigger: "blur",
          },
        ]
      },
    };
  },
  computed: {
    BucketItemTableParams() {
      return {
        apiName: `/portal/api/table/bucket_item`,
        isRegxSearch:true,
        aggregation: true,
        tableName: "bucket_item",
        tableHeaderConfigParams: {
        },
        isRestify: true,
        queryParam: {
          bucket_id: this.$route.query.id || this.form._id,
          active : true
        },
        limit: 10,
        hideAddButton: true,
        initialSort : "-created_at"
      };
    },
    BucketItemConflictParams(){
      return {
        apiName: `/portal/api/table/bucket_item`,
        aggregation: true,
        tableName: "bucket_item_conflict",
        tableHeaderConfigParams: {
        },
        isRestify: true,
        queryParam: {
          bucket_id: this.$route.query.id || this.form._id,
          status:"Conflict"
        },
        limit: 10,
        hideAddButton: true,
        initialSort : "-created_at",
        showSelectOptions : true,
        globalSearch:false,
        customfilter:false
      };
    }
  },

  methods: {

    async revertBucket() {
        const revertConfirm = await this.$confirm("Are you sure to revert this bucket?","Confirmation", {
          confirmButtonText : "Confirm",
          cancelButtonText : "Cancel",
          type : "warning"
        })
        if(!revertConfirm){
          return;
        }
        try {
            // Check if bucket is in "Closed" status
            if (this.form.status !== "Closed") {
                this.notifyError("Only closed buckets can be reverted");
                return;
            }

            let filter = _.pick(this.form,['_id', 'active'])
            filter.action = "revert"

            const revertResponse = await BucketService.processBucketAction(filter);
            if (_.get(revertResponse, 'data.status') !== false) {
                this.$router.push({path:"/idp/bucket-list"})
                EventBus.$emit("refreshTable", {});
                return this.notifySuccess("Bucket reverted successfully");
            }
            return this.notifyError(_.get(revertResponse, 'data.message',"Error while reverting bucket"));
        } catch (error) {
            this.notifyError("An error occurred while reverting the bucket: " + error);
        }
    }, 

    registerEvents(){
      
    },

    commitCancel(){
      this.displayConflictDialog = false;
    },
    handleSelectionChanged(selectedRows){
      this.ingonedBucketIds = selectedRows.map(obj => obj._id)
    },

    async init(recordId) {
      try {
        this.showCommitBtn = false
        this.showSaveAssignBtn = true
        let brData = await BucketService.fetchById(recordId);
        if(brData.status=="Closed"){
          this.showRevertBtn = true
        }
        if(brData.status=="Reverted"){
          this.disabledButton = true;
        }
        this.form = Object.assign({}, this.form, brData);
        if(Constants.DEFAULT_BUCKET==recordId){
            this.disableForm = true;
            // this.disableSave = true;
        }
        if(this.form["status"] == "Pending review"){
          this.showCommitBtn = true
        }
        this.showBucketItemList = true
      } catch (error) {
        this.notifyError("Error");
      }
    },
    async save() {
      // this.disableSave = true;
      this.$setLoader({
        target: "#save-btn",
        spinner: "el-icon-loading",
      });
      let valid = await this.$refs.form.validate().catch((error) => {
        // this.notifyError(error);
      });
      if (!valid) {
        this.$resetLoader();
        // this.disableSave = false;
        return;
      }
      
      return this.insertRecord();
    },
    async saveAssign(){
      if(this.form.status !== "Open"){
        return this.notifyError("Only an open bucket can be assigned.")
      }
        this.form["assign"] = true;
        await this.save()
        this.form["assign"] = false;
    },
    async commit(action){
      this.$setLoader({
        target: "#commit-btn",
        spinner: "el-icon-loading",
      });
      let bucketId = this.$route.query.id;
      let res;
      let params = {}
      
      params["conflict_ids"] = this.ingonedBucketIds
      params["bucket_id"] = bucketId
      params["action"] = action
      res = await BucketService.commit(params);
      this.displayConflictDialog = false;     
      console.log(res)
      // if(res.data.status){
      //   this.notifySuccess("Bucket commited successfully");
      // }
      if(res.data.message=="CONFLICT_FOUND"){
        this.conflictMsg = "Found conflict, select record to replace"
        EventBus.$emit("refreshTable",{})
        this.displayConflictDialog = true;
        this.$resetLoader();
        return;
      }
      else if(res.data.message=="CONFLICT_NOT_FOUND"){
        this.conflictMsg = "No conflict found, click commit to proceed"
        EventBus.$emit("refreshTable",{})
        this.displayConflictDialog = true;
        this.$resetLoader();
        return;
      }
      else if(res.data.message=="COMMITED"){
        this.displayConflictDialog = false;
        EventBus.$emit("refreshTable",{})
        this.init(bucketId);
        this.$resetLoader();
        this.notifySuccess("Bucket commited successfully");
        return
      }
      else{
        this.notifyError(res.data.message);
        this.$resetLoader();
        return
      }
      
      
     
    },
    
    insertRecord() {
      BucketService.save(this.form)
        .then((response) => {
            this.form = response.data;
            this.notifySuccess("Record saved successfully");
            this.showSaveAssignBtn = true
            this.showBucketItemList = true
            if(this.form.status == "Closed") this.showRevertBtn = true
            // this.disableSave = false;
            this.$resetLoader();
            
        })
        .catch((error) => {
          this.notifyError("Error while processing");
        })
        .finally(() => {
          this.$resetLoader();
          // this.disableSave = false;
        });
    },

    addFormRules() {
      let rules = {};
      _.each(this.fields_message_mapping, (message, field) => {
        let ruleArr = [];
        ruleArr.push({
          validator: this.EmptyValueValidator,
          trigger: "blur",
          message: message,
        });
        ruleArr.push({
          required: true,
          message: message,
          trigger: "blur",
        });
        rules[field] = ruleArr;
      });
      this.rules = rules;
    },
  },
  async mounted(){
    this.registerEvents()
  },
  async beforeMount() {
    this.isSaveActionAllowed = await this.isSaveActionPermitted('bucket');
    this.$store.commit("setDisplayIdpTree",false);
    this.$store.commit("setDisplayIdpNavbar",true);
    let recordId = this.$route.query.id;
    this.addFormRules();
    if (recordId) this.init(recordId);
  },
  beforeDestroy(){
    
  }
};
</script>

<style lang="scss">
@import "../_idpGlobal";
</style>
