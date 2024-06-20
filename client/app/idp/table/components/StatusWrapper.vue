<template>
    <div>
      <ExcelStatus v-if="isExcelStatus && !excelConfig.is_excel_form_type" :documentId="data.row._id" :document="data.row"></ExcelStatus>
      <Status v-else :data="data" :options="options"></Status>
    </div>
  </template>
  
  <script>
  import ExcelStatus from "@/idp/table/components/ExcelStatus";
  import Status from "@/idp/table/components/Status";
  import Constants from "@/resources/Constants";
  import IdpSheetService from "@/idp/services/excel/IdpSheetService";
  
  export default {
    name: "StatusWrapper",
    props: ["data", "options"],
    components: {
          ExcelStatus,
          Status
    },
    data() {
      return {
        isExcelStatus:false
      };
    },
    async beforeMount(){
      await this.getExcelConfig();
      this.getExcelStatus();
    },
    methods: {
      async getExcelConfig(){
        const documentType = this.data.row.document_type;
        this.excelConfig = await IdpSheetService.getExcelConfig(documentType);        
      },
      isDocumentFailed(){
        return [Constants.DOCEX.STATE_UPLOADED.FAILED].includes(this.data.row.state)
      },
      getExcelStatus(){
        if(this.data.row && this.data.row.file_type=='excel'){       
          // if File type is excel for the document, show Excel status component   
          let isExcelStatus = true;          
          // However, in case of excel failed(should show failed resason on hover) OR in case of excel form type
          // don't show excel status component
          if(this.isDocumentFailed() || IdpSheetService.isExcelFormType(this.excelConfig)){            
            isExcelStatus = false;
          }          
          this.isExcelStatus = isExcelStatus;
        }
      }
    }
  };
  </script>
  