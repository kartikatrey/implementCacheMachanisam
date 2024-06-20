<template>
<el-main>
		<h1 class="kp-page-title">{{pageTitle}}</h1>        
        <div class="table-wrap">
            <data-table :parameters="tableParams" ref="datatable"></data-table>
        </div>
</el-main>
</template>

<script>
import DataTable from "@/components/DataTable.vue";
import CommonService from "@/services/CommonService";
import constants from "@/resources/Constants";
export default {
    name: "ServiceLog",
    components: {
        DataTable
    },
    data() {
        return {
            endpoint: constants.SERVICE_LOG,
            tableParams: {
                apiName: `/portal/api/table/service_log`,
                queryParam: {},
                tableName: "service_log",
                enableExport:true,
                isRestify: true,
                limit: 10
            },
            pageTitle:"Service log"
        };
    },
    methods: {
    },
    beforeMount() {
    }
};
</script>

<style lang="scss">
@import "../../assets/scss/_variables";

</style>
