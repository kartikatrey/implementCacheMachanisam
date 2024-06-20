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
    name: "UserPreferenceList",
    components: {
        DataTable
    },
    data() {
        return {
            activePreferenceCount: 0,
            endpoint: constants.USER_PREFERENCE_ENDPOINT,
            tableParams: {
                apiName: `/portal/api/table/user_preference`,
                queryParam: {
                    active: true
                },
                tableName: "user_preference",
                enableExport:true,
                isRestify: true,
                limit: 10
            },
            pageTitle:"User preferences"
        };
    },
    methods: {
        fetchActiveCount() {
            CommonService.fetchActiveCount(this.endpoint)
                .then(activePreferenceCount => {
                    this.activePreferenceCount = activePreferenceCount;
                })
                .catch(error => {
                    this.notifyError("Error while fetching active preference count!!");
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
