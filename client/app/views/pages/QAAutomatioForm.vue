<template>
  <el-main >
 <el-row :gutter="12">
    <el-col :span="3">
      <el-select  v-model="customer" placeholder="Select" @change="onCustomerSelect">
                                            <el-option
                                            v-for="customer in customers"
                                            :key="customer._id"
                                            :label="customer.customer_name"
                                            :value="customer._id">
                                            </el-option>
                                        </el-select>
      </el-col>
    <el-col :span="3">
      <file-upload
        class="btn btn-primary"
        post-action="/portal/api/process-file"
        accept=".csv"
        :multiple="false"
        :size="fileSize"
        v-model="fileList"
        @input-file="fileInput"
        :data ="formData"
         @input="updatetValue"
        ref="upload"
        :disabled="!isUploadAllow"
      > <el-button type="primary">Select file</el-button>
      </file-upload>
      </el-col>
      <el-col :span="3">
        <span v-for="(file) in fileList" :key="file.id">
          <span>{{file.name}}</span> 
        </span>
        </el-col>
   
      
    <el-col :span="3">
       <el-button type="primary" @click.prevent="$refs.upload.active = true">submit</el-button>
      </el-col>
   
</el-row>
  </el-main>
</template>

<script>


import _ from 'lodash'
import QAUploadService from "@/services/QAUploadService";
import VueUploadComponent from "vue-upload-component";

export default {
  name: "QAAutomatioForm",
  components: { FileUpload: VueUploadComponent },
  data() {
    return {
          endPoint : "api/test-qa-automation",
           file: "",
           customers : [],
           customer : "",
           formData: {service_name:"qaAutomation"},
           fileList:[],
           fileSize:0,
           isUploadAllow:false
    }
  },
  methods: {
  
  onCustomerSelect(){
    this.formData["customer"]= this.customer
    this.isUploadAllow =  this.customer ? true : false

  },
  fileInput(newFile, oldFile){
    if(!this.customer){
              this.notifyError("Please selcet customer");

    }
     if(!newFile)
        return
      this.formData["customer"]= this.customer
      if(newFile && !oldFile){

          return

      }
       if ( (newFile.error !== oldFile.error)) {
        this.notifyError("Error while processing");
        return
        }

        // Uploaded successfully
        if (newFile.success !== oldFile.success) {
          console.log('success', newFile.success, newFile)
          this.fileList = []
          window.open(`${window.location.origin}/api/process-file?fileName=${newFile.response.data}&alloweDelete=${true}`,"_self");

        }


  },
  updatetValue(){
    this.formData["customer"]= this.customer
    }
  },
    beforeMount() {
    
         QAUploadService.getCustomer().then((customers)=>{
           this.customers= customers
           
        }).catch((err) => {
               this.notifyError("Error while loading page");     

        })
    }

}
</script>

<style lang="scss">
@import "../../assets/scss/_variables";



.upload-file-container {

  .el-dialog__body {
        text-align: center;
         .file-name-container {
              border: 1px dashed;
              padding: 20px;
              border-radius:5px;
              margin-bottom:20px;
         }
        
          .inner {
             width:70%;
             margin:0 auto;
             margin-bottom: 30px;
                 .el-button {
                    width:100%;
                  }
           }
           .modal-bottom-btns {
             text-align: right;
           }
    }
} 
</style>


