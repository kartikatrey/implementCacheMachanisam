<template>
    <el-main class="vendor-form kp-main">
      <section class="page-body">
        <div class="page-title">
          <el-button
            cid="vendor-form-header-back" 
            icon="mdi mdi-arrow-left-circle-outline"
            v-on:click="onBack"
          ></el-button>
           <span class="page-title-text">Add {{ pageTitle }}</span>
        </div>
        <section class="form-page-container">
          <div class="panel">
            <div class="panel-body">
              <el-form
                label-position="left"
                :model="form"
                ref="form"
                label-width="120px"
                :rules="formRules"
                @focusout.native="checkIfFormEdited"
              >
                <ConfirmModel ref="model"></ConfirmModel>
                <el-row :gutter="40">
                    <el-col :span="12">
                      <div class="kp-form-group vendor-action-btns">
                        <el-form-item
                            class="control-label col-sm-2"
                            prop="name"
                            label="Vendor Name"
                          >
                          <el-input
                          cid="vendor-form-name"
                          class="form-control modal-vendor-name"
                          v-model ="form.name"
                          :rows="2"
                          placeholder
                          :disabled="isVendorNameDisabled"
                          ></el-input>
                          <el-tooltip effect="light" content="Import vendor from ERP" placement="bottom">
                           <el-button cid="import-vendor-name" @click="showVendorModal" class="vendor-div-btn">
                                <i class="mdi mdi-plus-circle"></i>
                            </el-button>
                          </el-tooltip>
                          <el-tooltip effect="light" content="Reset" placement="bottom">
                           <el-button cid="reset-vendor" @click="resetVendorDetails" class="vendor-div-btn">
                                <i class="mdi mdi-refresh"></i>
                            </el-button>
                          </el-tooltip>
                          </el-form-item>     
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <div class="kp-form-group">
                        <el-form-item
                          class="control-label col-sm-2"
                          prop="vendor_id"
                          label="Vendor ID"
                        >
                          <el-input
                          cid="vendor-form-id"
                          class="form-control"
                          v-model ="form.vendor_id"
                          :rows="2"
                          placeholder
                          :disabled="isVendorIdDisabled"
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
                <el-button size="small" v-on:click="onBack">Cancel</el-button>
              </div>
              <div>
                <el-button
                  size="small"
                  id="register-btn"
                  v-on:click="onSave"
                  :disabled="disableRegister"
                  type="primary"
                  >Save</el-button
                >
              </div>
            </footer>
          </div>
        </section>
          <el-dialog 
          class="vendor-dialog"
          title="Import Vendor" 
          :visible.sync="isVendorDialogVisible"
          :close-on-click-modal="false">
          <div class="vendor-modal-body">
            <el-row :gutter="40">
                <el-col :span="12">
                  <div class="kp-form-group vendor-modal-search">
                    <el-input
                    cid="search-vendor-name"
                    class="form-control vendor-modal-search-input"
                    v-model ="vendorSearchText"
                    :rows="2"
                    placeholder="Search By Vendor Name"
                    @blur="getVendorNameList"
                    >
                    <el-button
                    size="medium"
                    slot="append" 
                    class="vendor-modal-search-btn"
                    icon="mdi mdi-magnify"
                    id="vendor-search-btn"
                    v-on:click="getVendorNameList"
                    :disabled="disableSearch"
                    type="primary"></el-button>
                  </el-input>
                  </div>
                </el-col>
            </el-row>
            <DataTable class="vendor-data-table" ref="vendor-table" :key="dataTableKey" :parameters="tableParams" @selectionChanged="handleSelectionChanged" @dataTableRowClicked="handleRowClick"></DataTable>
          </div>
          <el-divider class="vendor-modal-divider"></el-divider>
          <div class="modal-bottom-btns">
            <el-button @click="hideVendorModal"  size="small">Cancel</el-button>
            <el-button @click="importVendorDetails" size="small" type="primary">Import</el-button>
          </div>      
         </el-dialog>
      </section>
    </el-main>
  </template>
  
<script>
import VendorService from "@/idp/services/VendorService";
import _ from "lodash";
import ConfirmModel from "@/components/ConfirmModel";
import Constants from "@/resources/Constants";
import DocumentScriptService from "@/idp/services/DocumentScriptService";
import DataTable from "@/components/DataTable.vue";
let defaultForm = {
  name:"",
  vendor_id:"",
}
export default {
  name: "VendorUserForm",
  components: {
    ConfirmModel,
    DataTable
  },
  data() {
    return {
      dataTableKey: 0,
      tableParams: {
        tableMaxHeight: "250px",
        customfilter:false,
        globalSearch:false,
        showSortOptions: false,
        limit: 10,
        showSelectOptions: true,
        rows: [],
        columns: [
          {
            label: 'Vendor ID',
            field: 'key'
          },
          {
            label: 'Vendor Name',
            field: 'value'
          }
        ],
        isStaticTable: true
       },
      tableCurrentRow: {},
      tableSelectedRow: [],
      isVendorDialogVisible: false,
      systemVendorName: '',
      systemVendorId: '',
      vendorSearchText:'',
      disableSearch: false,
      constant:Constants.DOCEX,
      form: {...defaultForm},
      isFormEdited: false,
      isVendorIdDisabled: false,
      isVendorNameDisabled: false,
      pageTitle: "Vendor",
      disableRegister: false,
      formRules: {
        name: [
          {
            required: true,
            message: "Please enter vendor name",
            trigger: ["change"]
          }
        ],
        vendor_id: [
          {
            required: true,
            message: "Please enter vendor id",
            trigger: ["change"]
          }
        ]
      },
    };
  },
  methods: {
    checkIfFormEdited(){
      this.isFormEdited = Object.keys(this.form).some(field => 
      this.form[field] !== defaultForm[field]
      )
    },
    reRenderDataTable(){
      this.dataTableKey += 1;
    },
    showVendorModal(){
      this.isVendorDialogVisible = true;
    },
    hideVendorModal() {
      this.isVendorDialogVisible = false;
      this.resetVendorModalTable();
    },
    //In import vendor modal, resets vendor list selection as per original selection
    resetVendorModalTable(){
      const vendorTable = this.$refs['vendor-table'];
      for (let index = 0; index < vendorTable.rows.length; index++) {
          if (vendorTable.rows[index].key == this.form.vendor_id) {
            this.$set(vendorTable.rows[index], 'vgtSelected', true);
          } else {
            this.$set(vendorTable.rows[index], 'vgtSelected', false);
          }
          this.reRenderDataTable();
      }
    },
    handleRowClick(selectedRow) {
      this.tableCurrentRow = selectedRow;
      this.systemVendorId = selectedRow.key;
      this.systemVendorName = selectedRow.value;
    },
    
    //This is for single row selection
    //Once user tries to make multiple selection last selection only will be maintained
    //Previous selection will be removed
    handleSelectionChanged(selectedRows) {
      for (let index = 0; index < selectedRows.length; index++) {
        //Set the 'vgtSelected' as 'false' for all the rows other than the last selected one 
        if (selectedRows && selectedRows.length > 1) {
          if (selectedRows[index].originalIndex != this.tableCurrentRow.originalIndex) {
            this.$set(selectedRows[index], 'vgtSelected', false);
          }
        }
      }
      this.tableSelectedRow = selectedRows; 
    },
    importVendorDetails() {
      if(this.vendorSearchText == ''){
        this.notifyError("Please search vendor by name and select at least one vendor to import");
        return;
      }
      if(this.tableSelectedRow && this.tableSelectedRow.length == 0){
        this.notifyError("Please select at least one vendor to import");
        return;
      }
      this.isVendorDialogVisible = false;
      this.form.name = this.systemVendorName;
      this.form.vendor_id = this.systemVendorId;
      if (this.systemVendorId) {
        this.isVendorIdDisabled = true;
      }
      if (this.systemVendorName) {
        this.isVendorNameDisabled = true;
      }
    },
    resetVendorDetails(){
      this.$refs.form.resetFields();
      this.systemVendorId = '';
      this.systemVendorName = '';
      this.vendorSearchText = '';
      this.isVendorNameDisabled = false;
      this.isVendorIdDisabled = false;
      this.tableParams = {...this.tableParams, 'rows':[] };
    },
    async getVendorNameList() {
      try {
        if (this.vendorSearchText) {
          this.disableSearch = true;
          this.$setLoader({
            target: "#vendor-search-btn",
            spinner: "el-icon-loading",
          });
          //In case of vendor user we are processing only document_type as 'invoice'
          const payload = {
            'document_type': 'invoice',
            'field_name': 'vendor_name',
            'field_value': this.vendorSearchText,
            'script_type': this.constant.SCRIPT_TYPE.AUTO_COMPLETE,
            'document_id': '',
            'form': this.form
          }
          const docScriptResponse = await DocumentScriptService.run(payload);
          if (docScriptResponse) {
            const vendorData = docScriptResponse.data.body;
            const queryParam = {
              rows: vendorData
            };
            this.tableParams = { ...this.tableParams, ...queryParam };
            this.disableSearch = false;
            this.$resetLoader();
          }
        } else {
          //if there is no serch text then, reset the tableParams rows
          if (this.tableParams.rows && this.tableParams.rows.length > 0) {
            this.tableParams = { ...this.tableParams, 'rows': [] };
          }
        }
      } catch (exception) {
        console.log(exception);
        this.disableSearch = false;
        this.$resetLoader();
      }
    },
    onBack() {
      this.$router.push("/idp/vendor/list");
    },
    async onSave() {
      this.disableRegister = true;
      this.$setLoader({
        target: "#register-btn",
        spinner: "el-icon-loading",
      });
      const isFormValid = await this.$refs.form.validate().catch((error) => {});
      if (!isFormValid) {
        this.$resetLoader();
        this.disableRegister = false;
        return;
      }
      return this.insertRecord();
    },
    async insertRecord() {
      try{
        const vendorResponse = await VendorService.saveVendorDetails(this.form);
        if(vendorResponse){
          const successMessage = "Vendor data saved successfully."
          this.form = vendorResponse;
          this.notifySuccess(successMessage);
          this.isFormEdited = false;
          this.$router.push({ path: "/idp/vendor/list" });
        }
      }catch(error){
        this.notifyError(error);
      }finally{
          this.$resetLoader();
          this.disableRegister = false;
        };
    }
  },

  async beforeMount() {
    this.$store.commit("setDisplayIdpTree",false);
    this.$store.commit("setDisplayIdpNavbar",true);
  },

  //It will ask confirmation for discarding changes if any done
  beforeRouteLeave: function (to, from, next) {
    if (this.isFormEdited) {
      return this.$refs.model.open(next);
    }
    else{
      return next();
    }
  }
};
</script>

<style lang="scss">
@import "../_idpGlobal";

.vendor-form {
  .el-input__prefix, .el-input__suffix {
    top: -6px !important;
  }

  .vendor-action-btns {
    .col-sm-2 {
      .el-form-item__content {
        display: flex;
        align-items: center;
      }
    }
  }
}
.kp-form-group {
  .el-input.is-disabled .el-input__inner{
    background-color: var(--dark-10) !important;
    color: var(--dark-04) !important;
  }
}
.vendor-div-btn{
  padding: 6px;
  margin-left: 2px !important;
}
.modal-vendor-name{
  width: 80% !important;
}
.vendor-data-table{
  .table-toolbar{
    margin-bottom: 0rem;
  }
}
.vendor-dialog{
  .el-dialog {
    padding: 0rem;
  }
  .el-dialog__headerbtn{
    display: none;
  }
  .el-dialog__header {
	  display: block !important;
    padding: 14px 18px;
  }
  .modal-bottom-btns{
    padding: 14px 18px;

  }
  .el-dialog__title {
    font-size: 16px;
    font-weight: 600;
  }
  .vendor-modal-divider{
    margin-top: 14px !important;  
    margin-bottom: 0px !important;
  }
  .vendor-modal-body{
    margin: 14px 18px;
  }
  .vendor-modal-search{
    .el-input-group__append{
      border: none !important;
      background: none !important;
    }
    .vendor-modal-search-btn{
      border-radius: 0px 4px 4px 0px !important;
      padding: 6.4px 10px 5.5px 10px !important;
      border:1px solid #4A5468 !important;
      border-left: none !important;
    }
    .vendor-modal-search-input{
      .el-input__inner{
      border-radius: 0.25rem 0rem 0rem 0.25rem !important;
      }
    }
  }
}
</style>
