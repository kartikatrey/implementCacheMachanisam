<template>
  <span>
    <span :class="getIconByFileType(data.row.file_type,data.row.file_name)" :style="getStyleByFileType(data.row.file_type)" class="file-icon"></span>
  </span>
</template>

<script>
import Constants from "@/resources/Constants";

export default {
  name: "FileIcon",
  props: ["data"],
  data() {
    return {
      fileType:"",
      logo: null,
      fileTypeMap : {
        image: {
          icon: "mdi mdi-image-outline",
          style: {
            color: "blue"
          }
        },
        pdf: {
          icon: "mdi mdi-file-pdf-box",
          style: {
            color: "red"
          }
        },
        excel: {
          icon: "mdi mdi-microsoft-excel",
          style: {
            color: "green"
          }
        },
        email:{
          icon: "mdi mdi-email-outline",
          style:{
            color: "blue"
          }
        },
        doc:{
          icon: "mdi mdi-file-word-box-outline",
          style:{
            color: "blue"
          }
        },
        html:{
          icon: "mdi mdi-language-html5",
          style:{
            color: "red"
          }
        },
        form:{
          icon : "mdi mdi-file-document-outline",
          style:{
            color : "#744ABD"
          }
        }
      }
    };
  },
  methods: {
    getIconByFileType(fileType,fileName) {
      if(!fileType){
        const fileExtension = fileName.split('.').pop().toLowerCase()
        this.fileType = this.getFileTypeByExtension(fileExtension)
        return this.fileTypeMap[this.fileType]["icon"];
      }
        const kanvTheme = this.$store.getters.selectedTheme;
        if (kanvTheme === Constants.DOCEX.THEMES.DARK) {
          this.fileTypeMap.pdf.icon =  "mdi mdi-file-pdf-box";
        }
      return this.fileTypeMap[fileType]["icon"];
    },
    getStyleByFileType(fileType){
      if(!fileType){
        return this.fileTypeMap[this.fileType]["style"];
      }
      return this.fileTypeMap[fileType]["style"];
    },
    getFileTypeByExtension(fileExtension){
       const extensionFileTypeMap = {
                pdf:"pdf",
                jpg:"image",
                "png":"image",
                "jpeg":"image",
                "tif":"image",
                "tiff":"image",
                "bmp":"image",
                "x-ms-bmp":"image",
                "xlsx":"excel",
                "xls":"excel",
                "csv":"excel",
                "msg":"email",
                "doc":"doc",
                "docx":"doc",
                "html":"html",
                "htm":"html"
            }
        return extensionFileTypeMap[fileExtension]
    },
  },
};
</script>

<style lang="scss" >
@import "../../_idpVariables";
@import "../../_idpGlobal";

.file-icon {
  font-size: 1.3rem;
}
.file-icon.mdi-microsoft-excel {
  color: var(--green-06);
}
.file-icon.mdi-pdf-box {
   color: var(--red-06);
}
.file-icon.mdi-image-outline {
   color: var(--brand-06);
}

</style>
