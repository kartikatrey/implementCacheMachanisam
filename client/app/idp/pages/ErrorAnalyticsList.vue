<template>
<main class="kp-main kp-without-navbar error-analytics-wrapper">
    <idp-list-header :title="title" :tableProps="tableProps" :filter="filter"></idp-list-header>
    <div class="page-body">
        <IdpDataTable title="" :tableProps="tableProps"></IdpDataTable>
    </div>
</main>
</template>

<script>
import EventBus from "@/EventBus";
import IdpDataTable from "../table/IdpDataTable";
import IdpListHeader from "./idpListHeader.vue";
import DocumentService from "@/idp/services/DocumentService";
const getTableColumnFilters = function (payload) {
    let conditions = [];
    // Escape the all prenthesis
    payload.searchText = payload.searchText.replace(new RegExp('\\(', 'g'), '\\(');
    payload.searchText = payload.searchText.replace(new RegExp('\\)', 'g'), '\\)');

    let columns = payload.columns;
    for (let i = 0; i < columns.length; i++) {
        if (_.get(columns[i], "filterOptions.enable") == true) {
            let condition = {};
            let col_val = "(" + payload.searchText + ")";
            condition[columns[i].name] = {
                $regex: col_val,
                $options: "i",
            };
            conditions.push(condition);
        }
    }
    return {
        $or: conditions
    };
}

export default {
    name: "ErrorAnalytics",
    components: {
        IdpDataTable,
        IdpListHeader
    },
    data() {
        return {
            count: 0,
            title:'Error Analytics',
            tableProps: {
                expandColumns:[],
                expandTableParams:{},
                tableConfigLoaded: false,
                lookups: [],
                multiSelect: false,
                showTabs: false,
                paginationSizes:[5, 15, 25,50],
                minHeight: 600,
                tableName: "de_analytics",
                tableIdentifier: "error_analytics",
                sortColumn: "-created_at",
                apiName: `/portal/api/table/de_analytics`,
                query: {
                    active: true
                },
                columns: [{
                        name: "file_name",
                        label: "Document name",
                        header_component: null,
                        sortable: true,
                        width: "300",
                        showTooltipWhenOverflow: true,
                        filterOptions: {
                            enable: true
                        }
                    },
                    {
                        name: "vendor_name",
                        label: "Vendor name",
                        header_component: null,
                        cell_component: null,
                        filterOptions: {
                            enable: true
                        },
                        sortable: true,
                        width: "250",
                        showTooltipWhenOverflow: true,
                    },
                    {
                        name: "code",
                        label: "Error code",
                        header_component: null,
                        cell_component: null,
                        sortable: true,
                        width: "200",
                        filterOptions: {
                            enable: true
                        },
                        showTooltipWhenOverflow: true,
                    },
                    {
                        name: "field_name",
                        label: "Field name",
                        header_component: null,
                        cell_component: null,
                        sortable: true,
                        filterOptions: {
                            enable: true
                        },
                        width: "150",
                        showTooltipWhenOverflow: true,
                    },
                    {
                        name: "field_type",
                        label: "Field type",
                        header_component: null,
                        cell_component: null,
                        filterOptions: {
                            enable: true
                        },
                        sortable: true,
                        width: "130",
                        showTooltipWhenOverflow: true,
                    },
                    {
                        name: "type",
                        label: "Error type",
                        header_component: null,
                        cell_component: null,
                        filterOptions: {
                            enable: true
                        },
                        sortable: true,
                        width: "150",
                        showTooltipWhenOverflow: true,
                    },
                        {
                        name: "document_type",
                        label: "Document type",
                        header_component: null,
                        cell_component: null,
                        sortable: true,
                        filterOptions: {
                            enable: true
                        },
                        width: "150",
                        showTooltipWhenOverflow: true,
                    },
                        {
                        name: "original_value",
                        label: "Original Value",
                        header_component: null,
                        cell_component: null,
                        sortable: true,
                        filterOptions: {
                            enable: true
                        },
                        width: "150",
                        showTooltipWhenOverflow: true,
                    },
                        {
                        name: "modified_value",
                        label: "Modified Value",
                        header_component: null,
                        cell_component: null,
                        sortable: true,
                        filterOptions: {
                            enable: true
                        },
                        width: "150",
                        showTooltipWhenOverflow: true,
                    },
                    {
                        name: "created_at",
                        label: "Created date",
                        header_component: null,
                        cell_component: "Date",
                        sortable: true,
                        width: "200",
                        showTooltipWhenOverflow: true,
                    }
                ]
            },
        };
    },
    methods: {
        initColumnFilters(searchText) {
            const columnFilter = getTableColumnFilters({
                searchText,
                columns: this.tableProps.columns
            });
            this.tableProps.query = {
                ...columnFilter,
                ...(this.tableProps.query || {}),
            }

        },
        findFilter() {
            try {
                this.filter = JSON.parse(
                    (this.$route && this.$route.query && this.$route.query.filter) || "{}"
                );
                this.tableProps.query = {
                    ...(this.tableProps.query || {}),
                    ...(this.filter.dateFilter || {})
                };
            } catch (err) {
                this.filter = {};
            }
            return this.filter;
        },
    },

    async beforeMount() {
        this.$store.commit("setDisplayIdpTree",false);
        this.$store.commit("setDisplayIdpNavbar",false);
        this.findFilter();
        this.tableProps.bulkActions = ["export", "refresh"];


        if(this.filter.analytics_type == 'FRAUD' ){
            this.title = 'Fraud analytics';
        }

        this.filter.field_name && (this.tableProps.query.field_name = this.filter.field_name)
        this.filter.error_type && (this.tableProps.query.error_type = this.filter.error_type)
        this.filter.code && (this.tableProps.query.code = this.filter.code)
        this.filter.vendor_name && (this.tableProps.query.vendor_name = this.filter.vendor_name)
        this.filter.type && (this.tableProps.query.type = this.filter.type)
        this.filter.analytics_type && (this.tableProps.query.analytics_type = this.filter.analytics_type)

        const sortColumn = _.get(this.filter[this.tableProps.tableIdentifier],'sortColumn');
        if(sortColumn) this.tableProps.sortColumn = sortColumn;

        let searchText = this.filter.searchText && ("" + this.filter.searchText).trim();
        if (searchText) this.initColumnFilters(searchText);
        this.tableProps.tableConfigLoaded = true;
    }
};
</script>

<style lang="scss">
.error-analytics-wrapper {
    .search {
        margin-right: 0px !important
    }
}
</style>
