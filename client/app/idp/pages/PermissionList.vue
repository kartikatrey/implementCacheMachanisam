<template>
    <el-main class="kp-main">
		<div class="table-wrap">
            <data-table :parameters="tableParams" ref="datatable"></data-table>
        </div>
    </el-main>
    </template>
    
    <script>
    import DataTable from "@/components/DataTable.vue";
    import constants from "@/resources/Constants";
    export default {
        name: "PermissionList",
        components: {
            DataTable
        },
        data() {
            return {
                activePermissionCount: 0,
                endpoint: constants.RESOURCE_PERMISSION_ENDPOINT,
                tableParams: {
                    apiName: `/portal/api/table/cp_permission`,
                    queryParam: {
                        active: true
                    },
                    tableName: "cp_permission",
                    enableExport:false,
                    isRestify: true,
                    limit: 10,
                     addButtonConfig:true,
                    addButtonConfig:{path:"/idp/permission-form",name:'Add permission'},
                    isRegxSearch:true,
				    initialSort: "-created_at",
                    pageTitle:"Permission"
                },
            };
        },
        methods: {},
        beforeMount() {}
    };
    </script>