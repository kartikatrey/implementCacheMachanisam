<template>
  <a
  @click.stop.prevent="handleClick"
    :href="documentLink"
    :cid="cid"
    v-bind:class="[is_disable ? 'anchor-disabled' : '']"
    >{{ value }}</a
  >
</template>

<script>
import { getQueryFilter } from "@/util/CommonUtil";
import _ from "lodash";
import Constants from "@/resources/Constants";


export default {
  name: "LinkList",
  props: ["data", "options", "totalRowCount"],
  watch: {
    "data.row.state": {
      handler: function (newVal, oldval) {
        if (newVal != oldval){
          this.createDocumentURL()
        } this.disableLink();
      },
      deep: true,
    },
  },
  data() {
    return {
      columnName: null,
      row: null,
      value: "",
      is_disable: false,
      documentLink :""
    };
  },
  computed: {
    cid() {
      let columnName = _.get(this.data,"column.property")
      return `idp-row-${columnName}_${this.data.$index}`;
    },
  },
  methods: {
    /**
     * Purpose: Creating href URL separatly as opening anchor tag will render entire vue app, 
     * It requires when user wants open the document in new tab 
     */
    createDocumentURL(){
      const row = this.data.row
      let filter = getQueryFilter();
      let query = {
        view: row.type || "document",
        document_index: parseInt(this.data.$index), // added for navigating to next/prev document
        total_row_count:this.totalRowCount, // to get the total record count for pagination
        id: "" + row._id,
        filter: JSON.stringify(filter || {}),     
      };
     
      if (query.view == "package" && row.parent_document_id) {
        query.id = row.parent_document_id;
        query.defaultId = row._id;
      }
      
      // Display parent document incase of excel child 
      if(row.file_type == Constants.DOCEX.DOCUMENT_FILETYPES.EXCEL && row.is_excel_child){
        query.id = row.parent_document_id; 
      }
      //Adding formId in query params to display the formViewer
      if(row.file_type == Constants.DOCEX.DOCUMENT_FILETYPES.FORM) {
        query.formId = row.form_id
      }
      let urlParams = Object.keys(query)
        .map(function (k) {
          return encodeURIComponent(k) + "=" + encodeURIComponent(query[k]);
        })
        .join("&");
      
        this.documentLink = this.createDocumentLink(row.file_type, urlParams)
    },
    /**
     * Creates a document link based on the given fileType and parameters. It returns the default document view if the fileType is not found in the fileTypeLinkMap.
     *
     * @param {string} fileType - The type of the document file (e.g., "excel" or "form").
     * @urlParams {string} urlParams - The parameters to be included in the link (e.g., query parameters).
     * @returns {string} - The generated document link based on the fileType and parameters.
    */
    createDocumentLink(fileType, urlParams) {
      // Mapping of fileType to corresponding document links
      const fileTypeLinkMap = {
        [Constants.DOCEX.DOCUMENT_FILETYPES.EXCEL]: `/idp/excel-view?${urlParams}`,
        [Constants.DOCEX.DOCUMENT_FILETYPES.FORM]: `/idp/form-view?${urlParams}`,
        // Add more mappings for other file types if needed
      };

      // Get the document link based on the fileType from the fileTypeLinkMap
      const docLink = fileTypeLinkMap[fileType];

      // If a specific link is found for the fileType, return it
      if (docLink) {
        return docLink;
      }

      // If no specific link is found, return the default viewer link with the parameters
      const defaultViewerLink = `/idp/document-view?${urlParams}`;
      return defaultViewerLink;
    },

    /**
     * Purpose: Push prepared link into vue router. This will use same vue app 
     * 
     */
    handleClick(event) {
        this.$router.push(this.documentLink);
    },
    disableLink() {
      let result = false;
      if(this.data.row.state == Constants.DOCEX.STATE_PUBLISHED.PUBLISH_IN_PROGRESS && this.data.row.file_type == Constants.DOCEX.DOCUMENT_FILETYPES.EXCEL){
        this.is_disable = false
        return
      }

      // In case of failed excel document disable file link, we are keeping file link enabled for other file types.
      if (this.data.row.state == Constants.DOCEX.STATE_PUBLISHED.FAILED && this.data.row.file_type == Constants.DOCEX.DOCUMENT_FILETYPES.EXCEL) {
        this.is_disable = true;
        return;
      }
      
      for (const key of this.options.disableCheckKey) {
        result = this.options.disableValues[key] && this.options.disableValues[key].includes(this.data.row[key]);
        if (result) {
          break;
        }
      }
      this.is_disable = result;
    },
  },

  beforeMount() {
    this.columnName = _.get(this.data,"column.property")
    this.row = this.data && this.data["row"];
    this.value = this.row[this.columnName];
    this.disableLink();
    this.createDocumentURL()
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.anchor-disabled {
  pointer-events: none;
  opacity: 0.6;
}
</style>
