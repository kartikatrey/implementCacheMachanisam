<template>
<el-main >
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
    name: "PermissionList",
    components: {
        DataTable
    },
    data() {
        return {
            activePermissionCount: 0,
            endpoint: constants.PERMISSION_ENDPOINT,
            tableParams: {
                apiName: `/portal/api/table/cp_permission`,
                queryParam: {
                    active: true
                },
                tableName: "cp_permission",
                enableExport:true,
                isRestify: true,
                limit: 10,
                 addButtonConfig:true,
                addButtonConfig:{path:"/permission-form",name:'Add permission'}
            },
            pageTitle:"Permission"
        };
    },
    methods: {
        fetchActiveCount() {
            CommonService.fetchActiveCount(this.endpoint)
                .then(activePermissionCount => {
                    this.activePermissionCount = activePermissionCount;
                })
                .catch(error => {
                    this.notifyError("Error while fetching active permission count!!");
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
