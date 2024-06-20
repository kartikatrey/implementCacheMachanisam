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
    
    name: "idpNerList",
    components: {
        DataTable,
    },
    data() {
    return {
            tableParams: {
            apiName: `/portal/api/table/trn_ner_data`,
            // queryParam: {
            //     active: true
            // },
            tableName: "trn_ner_data",
            initialSort: "-created_on",
            pageTitle: "NER list",
            isRegxSearch:true,
            enableExport: false,
            isRestify: true,
            limit: 10,
            addButtonConfig: true,
            addButtonConfig: {  
              path: "/idp/ner-form",
              name: "Add NER",
            },
        }
    };  
},
 beforeMount() {
    this.$store.commit("setDisplayIdpTree",false);
    this.$store.commit("setDisplayIdpNavbar",true);
  },
}
</script>