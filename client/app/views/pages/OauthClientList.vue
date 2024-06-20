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
    name: "OauthClientList",
    components: {
        DataTable
    },
    data() {
        return {
            activeOauthCount: 0,
            endpoint: constants.OAUTH_CLIENT_ENDPOINT,
            tableParams: {
                apiName: `/portal/api/table/oauth_client`,
                queryParam: {
                     active: true
                },
                tableName: "oauth_client",
                enableExport:true,
                isRestify: true,
                limit: 10,
                addButtonConfig:{path:"/oauth-client-form",name:'Add oauth'},
            },
            pageTitle:"Authoization client"
        };
    },
    methods: {},
    beforeMount() {}
};
</script>

<style lang="scss">
@import "../../assets/scss/_variables";

</style>
