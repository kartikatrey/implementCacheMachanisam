<template>
  <section v-if="showList" class="page-body">
      <h3 class="page-title">
        {{title}}
      </h3>
      <div class="grid-content bg-purple">
        <div data-v-step="2" class="table-wrap">
          <data-table :parameters="tableParams" :key="refreshTable" ref="datatable"></data-table>
        </div>
      </div>
    </section>
</template>

<script>

import DataTable from "@/components/DataTable.vue";

export default {
  name: "VersionRelatedList",
  props: [
    "id",
    "title",
    "type",
    "collectionName"
  ],
  watch: {},
  data() {
    return {
      showList:false,
      refreshTable: 1,
      queryParams: {
        record_id: this.$route.query.id || this.id,
        active: true
      }
    };

  },

  computed: {
    tableParams() {
      return {
        apiName: `/portal/api/table/version`,
        aggregation: true,
        tableName: "version",
        tableHeaderConfigParams: {
        },
        isRestify: true,
        queryParam: {
          record_id: this.$route.query.id || this.id,
          active: true
        },
        isRegxSearch:true,
        limit: 10,
        hideAddButton: true,
        initialSort : "-created_at"
      };
    },
  },
  methods: {

  },

  components: {
    DataTable
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  beforeMount() {
    if(this.$route.query.id || this.id){
      this.showList = true
    }
   },
};
</script>

<style lang="scss">
@import "../_idpVariables";
@import "../_idpGlobal";

.block-container {
  clear: both;
  display: flex;
  padding: var(--space-sm) var(--space-base);
  .block-50:first-child {
    padding-right: var(--space-base);
  }
  .block-50 {
    width: 50%;
    // padding:0 var(--space-sm);
  }
  .block-100 {
    width: 100%;
  }
  .el-card.card-focus {
    background-color: rgba(90, 103, 216, 1) !important;
    .el-checkbox-group{
       background-color: var(--white) !important;
    }
    .message {
      color: var(--white);
      .percentage.high {
        color: var(--green-07);
      }
      .percentage.medium {
        color: var(--yellow-07);
      }
      .percentage.low {
        color: var(--red-07);
      }
    }
    .error-msg,
    .icon-error {
      color: var(--red-07);
    }
    .icon-check {
      color: var(--green-07) !important;
    }
    .icon-details {
      color: var(--brand-09) !important;
    }

    .el-input__inner {
      background: var(--white) !important;
    }
  }
  .el-card {
    padding: var(--space-sm);
    box-sizing: border-box;
    position: relative;
    width: 100%;
    box-shadow: 0 2px 2px 0 var(--dark-06);
    border-radius: var(--radius-base);
    border: none;
    .message {
      .percentage.high {
        color: var(--green-03);
      }
      .percentage.medium {
        color: var(--yellow-03);
      }
      .percentage.low {
        color: var(--red-03);
      }
    }
    .el-card__header {
      border-bottom: none;
      padding: 0 0 var(--space-sm) 0;
      box-sizing: border-box;
      font-size: calc(var(--font-sm) + 0.07rem);
      color: var(--dark-01);
      white-space: nowrap;
      .message{
        clear: both;
        display: inline-block;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 86%;
        overflow: hidden;
    }
    }
    .el-card__body {
      padding: 0;
    }
    .el-input {
      width: 100%;
    }
  }
} // block container

.icon-error {
  color: var(--red-05);
  position: absolute;
  right: 10px;
  font-size: var(--font-lg);
  top: 0;
}
.icon-warning {
  color: var(--yellow-05);
  position: absolute;
  right: 10px;
  font-size: var(--font-lg);
}
.icon-check {
  color: var(--green-05);
  position: absolute;
  right: 10px;
  font-size: var(--font-lg);
  top: 2px;
}
.icon-details {
   color: var(--dark-04);
  position: absolute;
  right: 29px;
  font-size: var(--font-lg);
  top: 2px;
}
.error-msg {
  font-size: var(--font-xs);
  color: var(--red-05);
}
.warning-msg {
  font-size: var(--font-xs);
  color: var(--yellow-05);
}
</style>
