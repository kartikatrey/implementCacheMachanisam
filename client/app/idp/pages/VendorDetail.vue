<template>
    <el-main class="vendor-detail kp-main">
    <section class="page-body back-button">
      <div class="page-title">
        <el-button
          cid="form-header-back"
          icon="mdi mdi-arrow-left-circle-outline"
          v-on:click="onBack"
        ></el-button>
        <span class="page-title-text">
          Edit Vendor Detail
        </span>
      </div>
    </section>
    <section class="page-body">
      <section class="form-page-container">
        <div class="divider-body">
          <el-divider content-position="left">Vendor Detail</el-divider>
        </div>
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
                  <div class="kp-form-group">
                    <el-form-item
                      class="control-label col-sm-2"
                      prop="name"
                      label="Vendor Name"
                    >
                      <el-input
                        cid="vendor-detail-vendor-name"
                        class="form-control"
                        prop="name"
                        v-model="form.name"
                        placeholder
                      ></el-input>
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
                        cid="vendor-detail-vendor-id"
                        class="form-control"
                        prop="vendor_id"
                        v-model="form.vendor_id"
                        placeholder
                        disabled
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
                :disabled="disableSave"
                type="primary"
                >Save</el-button
              >
            </div>
          </footer>
        </div>
      </section>
      <div class="table-wrap vendor-site-table">
        <DataTable :parameters="tableParams" :key="dataTableKey"></DataTable>
      </div>
      </section>
   </el-main>
 </template>

 <script>
 import DataTable from "@/components/DataTable.vue";
 import VendorService from "@/idp/services/VendorService";
 import ConfirmModel from "@/components/ConfirmModel";
 let defaultForm = {
    vendor_id: '',
    name: ''
 }  

 export default{
   name: "VendorDetail",
   components: {
     DataTable,
     ConfirmModel
   },
   data() {
     return {
      dataTableKey: 0,
      form:{...defaultForm},
      isFormEdited: false,
      disableSave: false,
      formRules: {
        name: [
          {
            required: true,
            message: "Please enter vendor name",
            trigger: "blur",
          },
        ],
        vendor_id: [
          {
            required: true,
            message: "Please enter vendor id",
            trigger: "blur",
          },
        ]
      },
      //Vendor sites list
      tableParams: {
        apiName: `/portal/api/table/ap_vendor_sites`,
        tableName: "ap_vendor_sites",
        pageTitle: "Vendor Sites",
        isRegxSearch:true,
        initialSort: "-created_at",
        queryParam: {},
        isRestify: true,
        limit: 10,
        addButtonConfig: true,
        addButtonConfig: {
          path: "/idp/vendor/vendor-site-detail",
          name: "Add Vendor Site",
        },
      },
     };
   },
   methods: {
    checkIfFormEdited(){
      this.isFormEdited = Object.keys(this.form).some(field => 
      this.form[field] !== defaultForm[field]
      )
    },
    reRenderDataTable() {
      this.dataTableKey += 1;
    },
    async init(vendorRecordId){
      try {
         const projection = ['vendor_id', 'name']
         const vendorRecord = await VendorService.fetchVendorDetailsById(vendorRecordId, projection);
         //Store vendor details in 'vendor store'
         if (vendorRecord) {
           this.$store.commit('vendorStore/setVendor', vendorRecord);
         }
         this.form = Object.assign({}, this.form, vendorRecord);
         //Updating defaultForm with the latest state of form
         defaultForm = {...this.form}
       } catch (error) {
         this.notifyError("Error while fetching vendor record");
       }

      //Pass vendor_id to tableParams
      this.tableParams.queryParam["vendor_id"] = this.form.vendor_id;
      //Rerender DataTable after updating tableParams
      this.reRenderDataTable();
    },
    onBack() {
      this.$router.push("/idp/vendor/list");
    },
    async onSave() {
      this.disableSave = true;
      this.$setLoader({
        target: "#register-btn",
        spinner: "el-icon-loading",
      });
      const isFormValid = await this.$refs.form.validate().catch((error) => {});
      if (!isFormValid) {
        this.$resetLoader();
        this.disableSave = false;
        return;
      }
      return await this.updateVendorRecord();
    },
    async updateVendorRecord() {
      try{
        const vendorDetailResponse = await VendorService.saveVendorDetails(this.form);
        if(vendorDetailResponse){
          const successMessage = "Vendor data updated successfully."
          this.form = vendorDetailResponse;
          //Updating defaultForm with the latest state of form
          defaultForm = {...this.form}
          this.isFormEdited = false;
          this.notifySuccess(successMessage);
          //Update store values after updating 'vendor' record
          this.$store.commit('vendorStore/setVendor', vendorDetailResponse);
          this.onBack();
        }
      }catch(error){
        this.notifyError(error);
      }finally{
          this.$resetLoader();
          this.disableSave = false;
        };
    }
   },

   beforeMount() {
     this.$store.commit("setDisplayIdpTree", false);
     this.$store.commit("setDisplayIdpNavbar", true);
     const recordId = this.$route.query.id;
     this.init(recordId);
   },

   //It will ask confirmation for discarding changes if any done
   beforeRouteLeave: function (to, from, next) {
      if (this.isFormEdited) {
        return this.$refs.model.open(next);
      }
        return next();
    },
 };
 </script>


 <style lang="scss">
  @import "../_idpGlobal";

  .vendor-detail {
      .page-title {
     margin-left: 0 !important;
     margin-right: auto !important;
     .page-title-text {
       font-style: normal;
       font-weight: 600;
       font-size: var(--font-lg) !important;
       line-height: 27px;
       color: #4a5568 !important;
     }
   }
  }

  .back-button{
    margin-bottom: 2rem;
  }
  .divider-body{
    padding: 0px 10px;
  }
  .vendor-site-table{
    margin-top: 5rem;
    .table-toolbar .export-btn{
      margin-left: 0rem;
    }
  }
  .kp-form-group {
    .el-input.is-disabled .el-input__inner{
      background-color: var(--dark-10) !important;
      color: var(--dark-04) !important;
    }
  }
 </style>
