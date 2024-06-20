<template>
        <div v-if="documentId">
            <data-table  :class="[this.className?'line-table':'other-table']"  :parameters="approvalTabTableParams"  ref="approvalTabTable"></data-table>
        </div>
</template>

<script>
import _ from "lodash";
import DataTable from "@/components/DataTable.vue";

export default {
    name: 'ApprovalList',
    components: {
        DataTable
    },
    props: {
     documentId:null,
     className:{
        default:null
     }
    },
    watch: {
        documentId: {
            handler: function (newVal, oldVal) {
                if(!newVal) return
                this.approvalTabTableParams.apiName = '/portal/api/de-approval-history?document_id='+newVal
            },
        }
    },
    data() {
        return {
            approvalTabTableParams: {
                apiName: '/portal/api/de-approval-history?document_id='+this.documentId,
                showPaginationOptions: false,
                tableName: "approvalTab",
                isRestify: false,
                customfilter:false,
                limit: 5,
                tableMode: "static",
                showSortOptions: false,
                refreshButton: true,
                fixedHeader: false,
                globalSearch:false,
                enableGroupFilter:false
            },
        };
    },
    methods:{
        refreshApprovalList(){
            this.$refs.approvalTabTable.refreshTable();
        }
    }
};
</script>
<style lang="scss">
.line-table {
    .vgt-wrap__footer {
        position: unset;
    }
}
</style>