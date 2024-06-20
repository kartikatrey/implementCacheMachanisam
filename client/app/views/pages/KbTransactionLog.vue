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
    name: "KbTransactionLog",
    components: {
        DataTable
    },
    data() {
        return {
            activeMenuCount: 0,
            //endpoint: constants.MENU_ENDPOINT,
            tableParams: {
                apiName: `/portal/api/table/kb_transaction_log`,
                queryParam: {},
                tableName: "kb_transaction_log",
                enableExport:true,
                isRestify: true,
                limit: 10,
            },
            pageTitle:"Kb transaction log"
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
