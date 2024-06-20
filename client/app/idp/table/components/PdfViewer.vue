<template>
      <div>
        <a @click.stop.prevent="handleClick" :href="documentLink">{{ value }}</a>
      </div>
      
  </template>
  
  <script>
  import _ from "lodash";
  import DocumentService from "../../services/DocumentService";
  
  export default {
    name: "PdfViewer",
    props: ["data"],
    data() {
      return {
        columnName: null,
        row: null,
        value: "",
        documentLink: "",
        fieldPredictionData: {},
        docImageElementId: "docImage",
      };
    },
    methods: {
        async handleClick() {         
          await this.getDocumentUrl();
          if (this.documentLink) {
            const newTab = window.open("", "_blank");
            newTab.document.title = "Document"
            const image = new Image();
            image.src = this.documentLink;
            image.onload = function () {
            newTab.document.body.appendChild(image);
            };
            image.onerror = function () {
              fetch(url)
                .then((response) => response.text())
                .then((content) => {
                  newTab.document.body.innerHTML = content;
                })
                .catch((error) => {
                  this.notifyError(_.get(error, 'error.data.message', "Something went wrong while loading the document"));
                });
            };
          }
        },
        async getDocumentUrl() {
            try {
                let documentId = this.row._id;
                let fileUrl = await DocumentService.getFileUrl({
                  id: documentId
                })
                this.documentLink = fileUrl[0];              
            } catch (error) {
              this.notifyError(_.get(error, 'error.data.message', "URL not found"));
            }
        },
    },
    beforeMount() {
      this.columnName = _.get(this.data, "column.property");
      this.row = this.data && this.data["row"];
      this.value = this.row[this.columnName];
    },
  };
  </script>

<style>
  img {
    transform: scale(1);
    background-color: #ffffff;
    display: flex;
    justify-content: center;
  }
</style>
  