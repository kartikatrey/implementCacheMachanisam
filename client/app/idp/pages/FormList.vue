<!-- created list view for Form Builder -->
<template>
    <el-main class="kp-main form-list">
        <section class="page-body">
            <div class="table-wrap form-list-data-table">
                <DataTable :parameters="tableParams"></DataTable>
            </div>
        </section>
    </el-main>
</template>
  
<script>
import DataTable from "@/components/DataTable.vue";
export default {
    name: "FormList",
    components: {
        DataTable,
    },
    data() {
        return {
            // parameters for datatable of de_form
            tableParams: {
                apiName: `/portal/api/table/de_form`,
                tableName: "formList",
                pageTitle: "Form List",
                enableExport: false,
                isRestify: true,
                initialSort : "-updated_at",
                customfilter:false,
                isRegxSearch:true,
                addButtonConfig: true,
                limit:10,
                showPaginationOptions: true,
                addButtonConfig: {
                    path: "/idp/form-builder",
                    name: "Create Form",
                },
            },
        };
    },
    beforeMount() {
        this.$store.commit("setDisplayIdpTree",false);
        this.$store.commit("setDisplayIdpNavbar",true);
    },
};
</script>

  