<template>
  <div class="table-toolbar spreadsheet-toolbar page-header">
      <span class="page-title">{{parameters.title}}</span>
      <div class="train-actions">
        <span>
          <el-button
            v-if="isSaveActionAllowed"
            data-v-step="1"
            class="btn-add ml-0"
            type="primary"
            cid="table-header-add"
            v-on:click="addColumn"
            size="small"
            >Add column</el-button
          >
          <el-button
            v-if="isSaveActionAllowed"
            class="ml-0 pl-10 pr-10"
            type="primary"
            cid="table-header-save"
            v-on:click="upsertData"
            size="medium"
            >Save</el-button
          >
           <el-button
            style="cursor: pointer"
            :disabled="!parameters.sampleFileData"
            class="ml-0 pl-10 pr-10"
            type="primary"
            cid="table-header-save"
            size="medium"
            ><json-csv name="template.csv" :data="parameters.sampleFileData">Download template</json-csv></el-button
          >
        </span>
      </div>
      <div class="search">
        <span class="mdi mdi-magnify search-icon"></span>
        <el-input
          clearable
          cid="table-global-search"
          class="kp-toolbar-input"
          placeholder="Search..."
          v-model="searchText"
        ></el-input>
      </div>
      <el-dropdown @command="handleCommand">
      <el-button cid="idp-doc-list-actions" class="el-dropdown-link vertical-icon idp-dropdown" size="mini"
        ><i class="el-icon-more"> </i
      ></el-button>
      <el-dropdown-menu
        cid="idp-doc-list-action-dropdown"
        class="actions-list lookup-action-wrapper-drowdown"
        slot="dropdown"
      >
        <el-dropdown-item v-if="isDeleteAllAllowed" cid="idp-doc-list-actions-refresh" command="DELETE_ALL"><span class="mdi mdi-delete"></span>Delete all</el-dropdown-item>
        <el-dropdown-item v-if="isSaveActionAllowed" cid="idp-doc-list-actions-delete"  command="BULK_UPLOAD"><span class="mdi mdi-upload"></span>Upload</el-dropdown-item>
        <el-dropdown-item cid="idp-doc-list-actions-download"  command="BULK_DOWNLOAD"><span class="mdi mdi-download"></span>Download</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    </div>
</template>

<script>
import EventBus from "@/EventBus";
import jsonCsv from 'vue-json-csv'
import formMixin from "@/mixins/formMixin.js";

export default {
  name: "Toolbar",
  mixins: [formMixin],
  watch: {
    searchText: {
            handler: function (newVal, oldval) {;
                    this.$emit('search', newVal);
            },
            immediate: true,
            deep: true
        }
  },

  props: [
    "parameters",
    "isDeleteAllAllowed"
  ],
  components: {
    jsonCsv
  },
  data() {
    return {
     searchText:"" ,
     isSaveActionAllowed : true,
     isDeleteActionAllowed: true
    };
  },
  methods: {
      upsertData(){
        this.$emit('upsert');
      },
      addColumn(){
        EventBus.$emit('ADD_COLUMN');
      },
      handleCommand(command) {
        EventBus.$emit(command);
      },
  },

  async beforeMount() {
    this.isSaveActionAllowed = await this.isSaveActionPermitted('lookup');
  }

};
</script>

<style lang="scss">
@import "../../idp/_idpVariables";
.lookup-action-wrapper-drowdown {
  margin: 0;
}
.spreadsheet-toolbar {
  margin-top: 3rem;
      .page-title {
          margin-left: 0;
          margin-right: auto;
          font-style: normal;
          font-weight: 600 !important;
          font-size: 1.286rem !important;
          line-height: 27px;
          color: rgba(74, 84, 104, .92) !important;
          margin: 0;
      }
      .train-actions {
        margin-right: 1rem;
      }
      .el-dropdown {
          display: inline-block;
          position: relative;
          color: #606266;
          font-size: 14px;
               button.idp-dropdown {
                  background-color: var(--dark-07);
                  line-height: 0;
                  padding: 8px 6px;
                  margin-top: -2px;
                }
      }

}

</style>
