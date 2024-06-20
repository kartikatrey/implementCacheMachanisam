<template>
  <el-main class="kp-main">
    <section class="page-body">
      <div class="table-wrap">
        <DataTable :parameters="tableParams" :columnTemplate="columnTemplate"></DataTable>
      </div>
    </section>
  </el-main>
</template>

<script>
import DataTable from "@/components/DataTable.vue";
import constants from "@/resources/Constants";
import EventBus from "@/EventBus";

export default {
  name: "EmailTemplateList",
  components: {
    DataTable,
  },
  data() {
    return {
      endpoint: constants.EMAIL_TEMPLATE_ENDPOINT,
      tableParams: {
        apiName: `/portal/api/table/email_template`,
        tableName: "email_template",
        pageTitle: "Email Template",
        enableExport: true,
        refreshButton: true,
        refreshButton: {
          name: "Refresh",
        },
        initialSort:"-_id",
        isRestify: true,
        limit: 10,
        addButtonConfig: true,
        addButtonConfig: {
          path: "/idp/email-template-form",
          name: "Add Template",
        },
      },
    };
  },
  methods: {
    columnTemplate(props) {
      let htmlTemplate = "";
      if (props.row["active"]) {
        htmlTemplate = `<div data-v-c0ac797e="" cid="${"row-" + props.column.field + "-" + props.index
          }" class="el-badge mark"><sup class="badge-active">Active</sup></div>`;
      } else {
        htmlTemplate = `<div data-v-c0ac797e="" cid="${"row-" + props.column.field + "-" + props.index
          }" class="el-badge mark"><sup class="badge-pending">Inactive</sup></div>`;
      }
      return htmlTemplate;
    },
  },
  beforeMount() {
    this.$store.commit("setDisplayIdpTree",false);
    this.$store.commit("setDisplayIdpNavbar",true);
  },
};
</script>

<style lang="scss">
.badge-active {
  background-color: white;
  border-radius: 10px;
  color: rgba(66, 240, 153, 0.7);
  display: inline-block;
  font-size: 12px;
  height: 18px;
  line-height: 18px;
  padding: 0 6px;
  text-align: center;
  white-space: nowrap;
  border: 1px solid rgba(66, 240, 153, 0.7);
  width: 45px;
}

.badge-pending {
  background-color: white;
  border-radius: 10px;
  color: rgba(242, 205, 91, 1);
  display: inline-block;
  font-size: 12px;
  height: 18px;
  line-height: 18px;
  padding: 0 6px;
  text-align: center;
  white-space: nowrap;
  border: 1px solid rgba(242, 205, 91, 0.7);
  width: 45px;
}

.el-button--small {
    padding: 0px 15px !important;
}
</style>
