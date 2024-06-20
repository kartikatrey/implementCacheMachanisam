<template>
  <section v-if="showList" class="page-body">
      <div class="grid-content bg-purple">
        <div data-v-step="2" class="table-wrap">
          <data-table :parameters="tableParams" ref="datatable"></data-table>
        </div>
      </div>
    </section>
</template>

<script>

import DataTable from "@/components/DataTable.vue";
import constants from "@/resources/Constants";

export default {
  name: "Test History List",
  props: [
    "id"
  ],
  data() {
    return {
      showList:false
    };
    
  },
  
  computed: {
    tableParams() {
      return {
        apiName: constants.TEST_HISTORY_ENDPOINT,
        aggregation: true,
        tableName: "test_history",
        // pageTitle: "Run History",
        tableHeaderConfigParams: {
        },
        isRestify: true,
        queryParam: {
          reference_id: this.$route.query.id || this.id,
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
</style>
