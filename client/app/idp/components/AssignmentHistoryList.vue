<template>
    <div v-if="documentId" class="assignment-history-wrapper">
        <DataTable
        :class="[this.className ? 'line-table' : 'other-table']"
        :parameters="assignmentTabTableParams"
        ref="assignmentTabTable"
        />
    </div>
</template>

<script>
import _ from "lodash";
import DataTable from "@/components/DataTable.vue";

export default {
    name: 'AssignmentList',
    components: {
        DataTable
    },
    props: {
        documentId: null,
        className: {
            default: null
        }
    },
    watch: {
        documentId: {
            handler: function (newVal, oldVal) {
                if (!newVal) return
                this.assignmentTabTableParams.queryParam = {
                    document_id: newVal
                }
            },
        }
    },
    data() {
        return {
            assignmentTabTableParams: {
                apiName: '/portal/api/table/de_assignment_history',
                showPaginationOptions: true,
                tableName: "de_assignment_history",
                isRestify: true,
                customfilter: false,
                limit: 5,
                tableMode: "static",
                showSortOptions: false,
                refreshButton: true,
                fixedHeader: false,
                globalSearch: false,
                enableGroupFilter: false,
                enableExport: true,
                queryParam: {
                    document_id: this.documentId
                }
            },
        };
    },
    methods: {
        refreshAssignmentList() {
            this.$refs.assignmentTabTable.refreshTable();
        }
    }
};
</script>
<style lang="scss">
.assignment-history-wrapper{
    .line-table {
        .vgt-wrap__footer {
            position: unset;
            bottom: 52px;
        }
        .text-center{
            text-align: center !important;
        }
    }
}
</style>