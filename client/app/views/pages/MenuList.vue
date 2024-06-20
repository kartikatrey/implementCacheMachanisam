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
    name: "MenuList",
    components: {
        DataTable
    },
    data() {
        return {
            endpoint: constants.MENU_ENDPOINT,
            tableParams: {
                apiName: `/portal/api/table/cp_menu`,
                queryParam: {
                    active: true
                },
                tableName: "cp_menu",
                enableExport: true,
                isRestify: true,
                limit: 10,
                addButtonConfig: {
                    path: "/menu-form",
                    name: 'Add menu'
                },
            },
            pageTitle: "Menu"
        };
    },
    methods: {},
    beforeMount() {}
};
</script>

<style lang="scss">
@import "../../assets/scss/_variables";
</style>
