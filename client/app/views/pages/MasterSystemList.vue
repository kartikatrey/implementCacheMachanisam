<template>
<el-main>
    <h1 class="kp-page-title">{{pageTitle}}</h1>
    <div class="table-wrap">
        <data-table :parameters="tableParams"></data-table>
    </div>
    <!-- </div> -->
</el-main>
</template>

<script>
import DataTable from "../../components/DataTable.vue";
import SystemService from '../../services/SystemService'

export default {
    name: "MasterSystemList",
    components: {
        DataTable
    },
    data() {
        return {
            count: 0,
            tableParams: {
                apiName: `/portal/api/table/master_system`,
                queryParam: {
                    active: true
                },
                tableName: "master_system",
                initialSort: "system_name",
                enableExport: true,
                isRestify: true,
                limit: 10,
                addButtonConfig: true,
                addButtonConfig: {
                    path: "/master-system-form",
                    name: 'Add master system'
                },
            },
            searchValue: '',
            pageTitle: "Master system"
        };
    },
    methods: {

    },
    beforeMount() {}
}
</script>

<style lang="scss">

</style>
