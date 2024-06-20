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
  name: "DomainVendorMapList",
  components: {
    DataTable,
  },
  data() {
    return {
      count: 0,
      tableParams: {
        allowInline: true,
        apiName: `/portal/api/table/de_vendor_info_map`,
        queryParam: { 
          active: true
        },
        tableName: "de_vendor_info_map",
        pageTitle: "Vendor Domain Map",
        initialSort: "-created_at",
        isRegxSearch:true,
        enableExport: false,
        isRestify: true,
        limit: 10,
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
