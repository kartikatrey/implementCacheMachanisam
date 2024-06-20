<template>
   <el-main class="kp-main">
    <section class="page-body">
      <div class="table-wrap">
        <DataTable :ref="BusinessRuleLibrary" :parameters="tableParams"></DataTable>
      </div>
    </section>
  </el-main>
</template>

<script>
import DataTable from "@/components/DataTable.vue";
import EventBus from "@/EventBus";

export default {
  name: "BusinessRuleLibraryList",
  components: {
    DataTable,
  },
  data() {
    return {
      count: 0,
      tableParams: {
        apiName: `/portal/api/business-rule-library`,
        queryParam: { 
          active: true
        },
        tableName: "business_rules_library",
        pageTitle: "Business Rule Library",
        initialSort: "-updated_at",
        enableExport: false,
        enableAiSearch: true,
        aiSearchParam:{
          searchText:"",
          searchColumn:'description',
          showToggle: true,
          toggleSearchColumn: 'script',
          collectionType: 'business_rule'
        },
        isRegxSearch:false,
        customfilter: false,
        isRestify: false,
        limit: 10,
        addButtonConfig: false,
        globalSearch:false
       
      }
    };
  },
  methods: {
    updateRowsData(searchText,data){
      this.$store.commit("businessRuleStore/setAiSearchText",searchText);
      this.$store.commit("businessRuleStore/setBusinessRuleSearchData",data);
      this.tableParams.rows = data
      EventBus.$emit('refreshTable');
    },
  },

  beforeMount() {
    const showSearchResult = this.$route.query.search;
    if(showSearchResult){
      this.tableParams.aiSearchParam.searchText = this.$store.getters["businessRuleStore/AiSearchText"]
      this.tableParams.rows = this.$store.getters["businessRuleStore/BusinessRuleSearchData"]
    }
    this.$store.commit("setDisplayIdpTree",false);
    this.$store.commit("setDisplayIdpNavbar",true);
    EventBus.$on("dataChanged", (searchText,data) => {
        this.updateRowsData(searchText,data);
      });
  },
  beforeDestroy() {
    EventBus.$off('dataChanged');
  },
};
</script>
