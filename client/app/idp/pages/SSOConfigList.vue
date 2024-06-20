<template>
    <el-main class="kp-main">
     <section class="page-body">
       <div class="table-wrap">
         <DataTable :parameters="tableParams" :columnTemplate="maskCertificate"></DataTable>
       </div>
     </section>
   </el-main>
 </template>
 
 <script>
 import DataTable from "@/components/DataTable.vue";
 
 export default {
   name: "SSOConfigList",
   components: {
     DataTable,
   },
   data() {
    return {
      count: 0,
      tableParams: {
        apiName: `/portal/api/table/customer_sso_config`,
        queryParam: { active: true },
        tableName: "customer_sso_config",
        pageTitle: "SSO Configuration",
        initialSort: "-created_at",
        isRegxSearch:true,
        isRestify: true,
        limit: 10,
        addButtonConfig: true,
        addButtonConfig: {
          path: "/idp/sso-config-form",
          name: "Add SSO Configuration",
        },
      }
    };
  },
   methods: {
    maskCertificate(props){
      let certificate = props.formattedRow.cert;
      certificate = `${certificate.slice(1,4)}***${certificate.slice(-3)}`;
      return `<div>${certificate}</div>`;
    }
   },
 
   beforeMount() {
     this.$store.commit("setDisplayIdpTree",false);
     this.$store.commit("setDisplayIdpNavbar",true);
   },
 };
 </script>
 