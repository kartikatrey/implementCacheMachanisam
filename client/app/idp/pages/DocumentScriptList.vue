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
  name: "DocumentScriptList",
  components: {
    DataTable,
  },
  data() {
    return {
      count: 0,
      tableParams: {
        apiName: `/portal/api/table/de_document_script`,
        queryParam: {
          active:true
        },
        tableName: "de_document_script",
        pageTitle: "All UI Scripts",
        initialSort: "-created_at",
        enableExport: true,
        isRestify: true,
        isRegxSearch:true,
        limit: 10,
        addButtonConfig: true,
        addButtonConfig: {
          path: "/idp/document-script-form",
          name: "Add Script",
        },
      }
    };
  },
  methods: {},
  created(){
    // We display all type of scripts in UI scripts menu
    // To display Autocomplete and PO Mapper scripts we have created different menus with parameter type in URL
    // Here we filter scripts by the parameter 'type'(AUTO_COMPLETE/REFERENCE) from the URL of the menu.
    const type = !_.isEmpty(this.$route.query) && this.$route.query.type;
    if(type){
        this.tableParams.queryParam.type = type;
        this.tableParams.addButtonConfig.path = `/idp/document-script-form?type=${type}`
        // Give page title according to the type received from url
        const typePageTitleMap = {
            "AUTO_COMPLETE": "All Autocomplete Scripts",
            "REFERENCE": "All PO Mapper Scripts"
        };
        // Give page title if type found in typePageTitleMap, otherwise give default paga title as 'All Scripts'
        this.tableParams.pageTitle = typePageTitleMap[type] || 'All Scripts'  
      }
  },
  beforeMount() {
    this.$store.commit("setDisplayIdpTree",false);
    this.$store.commit("setDisplayIdpNavbar",true);
  },
};
</script>
