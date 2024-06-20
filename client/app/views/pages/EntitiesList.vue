<template>
<el-main>
    <h1 class="kp-page-title">{{pageTitle}}</h1>
    <div class="table-wrap">
        <DataTable :parameters="requiredParams"></DataTable>
    </div>
</el-main>
</template>

<script>
import DataTable from "../../components/DataTable.vue";
import AjaxService from "@public/services/AjaxService";

export default {
    name: "EntitiesList",
    components: {
        DataTable
    },
    data() {
        return {
            requiredParams: {
                apiName: "/portal/api/table/entity", //add your API url here
                queryParam: {
                    active: true
                },
                showPaginationOptions: true, // to show/hide pagination option
                tableName: "entity", // it is use to get headers of table from tableHeaderConfig.js
                enableExport: true,
                isRestify: true,
                limit: 10, // to limit the number of records to be fetched
                addButtonConfig: {
                    path: "/entities-form",
                    name: 'Add entity'
                },

            },
            pageTitle: 'Entities'
        };
    },
    methods: {}
};
</script>
