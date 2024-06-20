<template>
<el-main>
		<h1 class="kp-page-title">{{pageTitle}}</h1>
        

        <div class="table-wrap">
            <data-table :parameters="tableParams" @refreshCount="onTableUpdate" ref="datatable"></data-table>
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
            activeMenuCount: 0,
            endpoint: constants.SERVICE_LOG,
            tableParams: {
                apiName: `/portal/api/table/ks_model_version`,
                queryParam: {},
                tableName: "ks_model_version",
                enableExport:true,
                isRestify: true,
                limit: 10
            },
            pageTitle:"Ks model version"
        };
    },
    methods: {
        fetchActiveCount() {
            CommonService.fetchActiveCount(this.endpoint)
                .then(activeMenuCount => {
                    this.activeMenuCount = activeMenuCount;
                })
                .catch(error => {
                    this.notifyError("Error while fetching active menu count!!");
                });
        },
        onTableUpdate() {
            this.fetchActiveCount();
        }
    },
    beforeMount() {
        this.fetchActiveCount();
    }
};
</script>

<style lang="scss">
@import "../../assets/scss/_variables";

</style>
