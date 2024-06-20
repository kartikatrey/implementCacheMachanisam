<template>
  <section class="add-records-container accordian-container">
    <div>
      <div class="panel" v-loading="loading">
        <div class="panel-body">
          <section class="page-body add-record-table">
            <div>
              <div data-v-step="2" class="table-wrap">
                <span class="page-title">{{pageTitle}}</span>
                <data-table
                  :parameters="tableParams"
                  ref="addRecordsTable"
                  :columnTemplate="columnTemplate"
                  @selectionChanged="handleSelectionChanged"
                  :key="tableKey"
                  :pre-selected-rows="permissionRecord.record_ids"
                ></data-table>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import DataTable from "@/components/DataTable.vue";
import _ from "lodash";
import { Loading } from "element-ui";
import { getStatusBadge } from "@/util/CommonUtil";
import EventBus from "@/EventBus";

export default {
  name: "AddRecords",
  data() {
    return {
      searchText: "",
      loading: false,
      pageTitle:"Resource menu records",   
      brForm: {},
      tableKey: 0,
      tableParams: {
        apiName: "",
        queryParam: {},
        showSelectOptions: true,
        tableName: "",
        initialSort: "-updated_at",
        enableExport: false,
        isRegxSearch: true,
        isRestify: true,
        limit: 10,
        shouldActionWrapperEnable : false
      }
    };
  },
  components: { DataTable, Loading },
  props: [ "permissionRecord" ],
  watch: {
  'permissionRecord.resource_name': {
      handler(newResourceName) {
        this.tableParams.apiName = `/portal/api/table/${newResourceName}`;
        this.tableParams.tableName = newResourceName;
        this.tableKey += 1;
      },
      immediate: true
    }
  },
  methods: {
    columnTemplate(props) {
      return getStatusBadge(props);
    },
    handleSelectionChanged(selectedRows){
      let menuRecordIds = _.map(selectedRows, rec => rec._id);
      EventBus.$emit("add-record-ids", menuRecordIds);
    },
  },
};
</script>



<style lang="scss">
@import "../_idpVariables";
@import "../_idpGlobal";

.add-records-container{
  .page-title{
    top: 2rem;
    position: relative;
  }

  .panel-body{
    border-top: 0.125rem solid rgb(102, 126, 234);
    padding-top: 1rem !important;

    .table-toolbar{
      .export-btn{
        margin-left: 0;
      }
    }
  }
}
</style>