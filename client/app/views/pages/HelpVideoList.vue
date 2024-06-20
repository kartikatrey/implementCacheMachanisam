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
    name: "HelpVideoList",
    components: {
        DataTable
    },
    data() {
        return {
            activeVideoCount: 0,
            endpoint: constants.HELP_VIDEO_ENDPOINT,
            tableParams: {
                apiName: `/portal/api/table/help_video`,
                queryParam: {
                    active: true
                },
                tableName: "help_video",
                enableExport:true,
                isRestify: true,
                limit: 10,
                
                addButtonConfig:{path:"/help-video-form",name:'Add video'},
            },
            pageTitle:"Help video",
        };
    },
    methods: {
        // fetchActiveCount() {
        //     CommonService.fetchActiveCount(this.endpoint)
        //         .then(activeVideoCount => {
        //             this.activeVideoCount = activeVideoCount;

        //         })
        //         .catch(error => {
        //             this.notifyError("Error while fetching active videos count!!");
        //         });
        // },
        // onTableUpdate() {
        //     this.fetchActiveCount();
        // }
    },
    beforeMount() {
        // this.fetchActiveCount();
    }
};
</script>

<style lang="scss">

</style>
