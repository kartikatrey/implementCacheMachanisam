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
    name: "KttTemplateList",
    components: {
        DataTable
    },
    data() {
        return {
            activeTemplateCount: 0,
            endpoint:constants.KTT_TEMPLATE_ENDPOINT,
            tableParams: {
                apiName: `/portal/api/table/ktt_template`,
                queryParam: {
                    active: true
                },
                tableName: "ktt_template",
                enableExport:true,
                isRestify: true,
                limit: 10,
                  addButtonConfig:{path:"/ktt-template-form",name:'Add template'},
            },
             pageTitle:"Template"
        };
    },
    methods: {
        fetchActiveCount() {
            CommonService.fetchActiveCount(this.endpoint)
                .then(activeTemplateCount => {
                    this.activeTemplateCount = activeTemplateCount;
                })
                .catch(error => {
                    this.notifyError("Error while fetching active template count!!");
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
