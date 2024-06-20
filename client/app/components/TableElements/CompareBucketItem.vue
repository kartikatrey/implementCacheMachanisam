<template>
  <div>
    <el-dropdown-item
      :cid="'table-action-script-dialog-' + propData.index"
      v-if="type == 'dropdown'"
      :command="compareRecord"
    >
      <span :class="icon"></span>Compare
    </el-dropdown-item>
    <div v-if="loader">
      <el-dialog
        width="1100px"
        v-if="displayDialog"
        :close-on-click-modal="false"
        :show-close="false"
        :destroy-on-close="true"
        class="folder-modal-container"
        title="Script details"
        :visible.sync="dialogVisible"
        :append-to-body="true"
        center
      >
        <div>
          <!-- <h3 class="title">{{ pageTitle }} :</h3> -->
          <div style="display: flex">
            <h4 class="existing-script">Existing Script :</h4>
            <h4 class="new-script">New Script :</h4>
          </div>
          <codemirror :merge="true" :options="cmOption" />
          <!-- Footer -->
          <footer>
            <div class="cancelButton">
              <el-button
                v-on:click="cancel"
                class="btn btn-sm btn-default"
                cid="add-business-rule-form-close"
              >
                Close
              </el-button>
            </div>
          </footer>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
//dedent is an ES6 string tag that strips indentation from multi-line strings.
import dedent from "dedent";
import { codemirror } from "vue-codemirror";
import "codemirror/mode/css/css.js";
import "codemirror/addon/merge/merge.css";
import "codemirror/addon/merge/merge.js";
import DiffMatchPatch from "diff-match-patch";
window.diff_match_patch = DiffMatchPatch;
window.DIFF_DELETE = -1;
window.DIFF_INSERT = 1;
window.DIFF_EQUAL = 0;
import VersionService from "@/idp/services/VersionService";
import CollectionService from "@/idp/services/CollectionService";
import Constants from "@/resources/Constants";

export default {
  name: "CompareBucketItem",
  props: ["propData", "type"],
  components: {
    codemirror,
  },

  data() {
    return {
      icon: "mdi mdi-compare action-btn dropdown-btn compare-btn",
      loader: false,
      pageTitle: "Script",
      dialogVisible: true,
      displayDialog: false,
      oldCollectionData: "",
      versionRecord: "",
      cmOption: {
        value: "",
        origLeft: null,
        orig: "",
        // connect: "align",
        styleActiveLine: false,
        showCursorWhenSelecting: true,
        mode: "text/javascript",
        // line: true,
        lineNumbers: true,
        theme: this.$store.getters.selectedTheme === Constants.DOCEX.THEMES.DARK ? 'monokai' : 'default',
        collapseIdentical: false,
        highlightDifferences: true,
        autofocus: true,
        disabled: true,
      },
    };
  },
  methods: {
    async compareRecord() {
      this.$setLoader({
        target: "#mdi-compare",
        spinner: "el-icon-loading",
      });
      const _id = this.propData.column.scriptOptions._id;
      this.displayDialog = true;
      let record = this.propData.row;
      let collection_name = this.propData.row.collection_name;

      let oldId = record["record_id"];
      let oldCollectionData = await CollectionService.fetchByTableNameAndId(
        collection_name,
        oldId
      );
      oldCollectionData = this.formatCode(oldCollectionData);
      this.oldCollectionData = dedent(`${JSON.stringify(oldCollectionData, null, 2)}`);
      this.cmOption.value = this.oldCollectionData;
      this.recordId = record[_id];
      let newCollectionData = await VersionService.fetchById(this.recordId);
      newCollectionData = this.formatCode(JSON.parse(newCollectionData.record));
      this.versionRecord = dedent(`${JSON.stringify(newCollectionData, null, 2)}`);
      this.cmOption.orig = this.versionRecord;
      if (this.versionRecord && this.oldCollectionData) {
        this.$resetLoader();
        this.loader = true;
        return;
      }
    },
    cancel() {
      this.displayDialog = false;
      this.loader = false;
    },
    formatCode(collectionData) {
      try {
        let value = "";
        for (let key in collectionData) {
          value = collectionData[key];
          if (value != null && typeof value === "string" && value.includes("\t")) {
            value = value.replaceAll("\t", "  ");
            value = value.replaceAll('"', "'");
            collectionData[key] = value;
          }
        }
        return collectionData;
      } catch(error){
        this.notifyError("Error while formatting code!!");
        console.error(error)
      }
    },
  },
};
</script>
<style lang="scss">
h3.title {
  margin-left: 15px;
}
.compare-code-container {
  .compare-code-wrap > div {
    margin: 10px;
  }
}
.compare-code-container .CodeMirror {
  width: 500px;
}
.cancelButton {
  margin-left: 1020px;
  margin-top: 5px;
}
.existing-script {
  flex-grow: 1;
  padding-bottom: 0;
  margin-bottom: 0;
}
.new-script {
  flex-grow: 1;
  padding-left: 3.5rem;
  padding-bottom: 0;
  margin-bottom: 0;
}
</style>
