<template>
    <el-dialog width="60%" class="subscription-history-list-modal" :visible.sync="showSubscriptionHistory" :close-on-click-modal="false">
        <p class="subscription-history-list-title">
            <el-button round text class="subscription-history-list-close-btn" size="small" @click="closeSubscriptionDialog">
                <i class="mdi mdi-close"></i>
            </el-button>
            Page Process History
        </p>
        <DataTable :parameters="tableParams"></DataTable>
    </el-dialog>
</template>

<script>
import DataTable from "@/components/DataTable.vue";

const tableColumns = [
    {
        field: "year",
        label: "Year",
        filterOptions: {
            enable: true,
            filterType: "input",
        },
        globalSearchOptions: {
            enable: true,
            filterType: "input",
        },
    },
    {
        field: "page_count",
        label: "Page Count",
        filterOptions: {
            enable: true,
            filterType: "input",
        },
        globalSearchOptions: {
            enable: true,
            filterType: "input",
        },
    }
];
export default {
    name: "SubscriptionHistoryDialog",
    props: ["showSubscriptionHistory", "subscriptionData"],
    components: {
        DataTable
    },
    computed: {
        tableParams() {
            return {
                pageTitle: "",
                initialSort: "year",
                isStaticTable: true,
                showPaginationOptions: false,
                showSortOptions: false,
                fixedHeader: false,
                globalSearch: false,
                enableGroupFilter: false,
                fixedHeader: false,
                isRestify: false,
                customfilter: false,
                rows: this.subscriptionData || [],
                columns: tableColumns
            }
        }
    },
    data() {},
    methods: {
        closeSubscriptionDialog() {
            this.$emit('close-subscription-dialog');
        }
    }
}
</script>

<style lang="scss">
@import "../../idp/_idpVariables";
@import "../../idp/_idpGlobal";

.subscription-history-list-modal {
    .el-dialog {
        padding: 1.7rem;
        .vue-good-table-box {
            height: 360px;
            overflow: auto;
        }
        .vue-good-table-box .vgt-table tbody tr td {
            text-align: left;
        }
    }
}

.subscription-history-list-title {
    margin: 0 0 -2rem 0;
    font-style: normal;
    font-weight: 600;
    font-size: 1.286rem;
    line-height: 27px;
    letter-spacing: 0.01em;
    color: var(--dark-02);
    position: relative;
}

.subscription-history-list-close-btn {
    position: absolute;
    border: 0;
    color: var(--dark-03);
    font-size: 1.2rem;
    vertical-align: text-top;
    padding: 0 !important;
    right: -10px;
    top: -10px;
    z-index: 9999;
    transition: .15s all ease-in-out;
    transform-origin: center center;
    background: var(--dark-08);
    width: 25px;
    height: 25px;
    &:hover {
        background: transparent !important;
        transform: scale(1.2);
    }
}
</style>