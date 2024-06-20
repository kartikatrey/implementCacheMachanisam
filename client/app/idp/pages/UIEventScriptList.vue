<template>
   <el-main class="kp-main">
    <section class="page-body">
      <div class="table-wrap">
        <DataTable :parameters="tableParams"></DataTable>
      </div>
    </section>
  </el-main>
</template>

<script>
import DataTable from "@/components/DataTable.vue";
import EventBus from "@/EventBus";

export default {
  name: "UIEventScriptList",
  components: {
    DataTable,
  },
  data() {
    return {
      count: 0,
      tableParams: {
        apiName: `/portal/api/table/de_document_script`,
        queryParam: {
          active:true,
          type : "UI_EVENT_SCRIPT",
        },
        tableName: "de_document_script_ui_event",
        pageTitle: "All UI Event Scripts",
        initialSort: "-created_at",
        enableExport: true,
        isRestify: true,
        isRegxSearch:true,
        limit: 10,
        addButtonConfig: true,
        addButtonConfig: {
          path: "/idp/ui-event-script-form",
          name: "Add UI Event Script",
        },
        select:["name","system","created_by","created_at","updated_by","updated_at"]
      }
    };
  },
  methods: {},

  beforeMount() {
    this.$store.commit("setDisplayIdpTree",false);
    this.$store.commit("setDisplayIdpNavbar",true);
  },
};
</script>
