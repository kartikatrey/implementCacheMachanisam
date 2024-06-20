<template>
<main class="kp-main">
    <idp-list-header title="Script logs" :tableProps="tableProps" :filter="filter"></idp-list-header>
    <div class="page-body">
      <IdpDataTable title="" :tableProps="tableProps"></IdpDataTable>
    </div>
  </main>
   <!-- <el-main class="kp-main">
    <section class="page-body">
      <div class="table-wrap">
        <DataTable :parameters="tableParams"></DataTable>
      </div>
    </section>
  </el-main> -->
</template>

<script>

import IdpDataTable from "../../idp/table/IdpDataTable";
import IdpListHeader from "../../idp/pages/idpListHeader.vue";
import DocumentService from "@/idp/services/DocumentService";
import EventBus from "@/EventBus";

export default {
	name: 'ScriptLogList',
	components:{IdpDataTable, IdpListHeader},
	data() {
        return {
			    totalCount:0,
			    filter: {},
	        tableProps: {
          tableConfigLoaded : true,
          enableDateRangeFilter: true,
          paginationSizes:[15, 30, 50, 100],
          apiName: `/portal/api/table/script_log`,
          query: {
            active: true
          },
          bulkActions:['refresh', 'export'],
          tableIdentifier: "script_log",
          sortColumn: "-created_at",
          tableName: "script_log",
          pageTitle: "Script Logs",
          initialSort: "-created_at",
          showTabs:false,
          enableCustomerFilter:false,
          enableExport: true,
          isRestify: true,
          limit: 10,
          addButtonConfig: true,
          isRegxSearch:true,
columns: [
	{
		label: "Level",
    name: "level",
    field: "level",
    header_component: null,
    cell_component: null,
     globalSearchOptions: {
                enable: true,
                filterType:"input"
            },
    sortable: true,
    width: '100',
    showTooltipWhenOverflow: true
	},
	{
		label: "User name",
    name: "user_name",
     field: "user_name",
    header_component: null,
    cell_component: null,
     globalSearchOptions: {
                enable: true,
                filterType:"input"
            },
    sortable: true,
    // width: '160',
    showTooltipWhenOverflow: true
	},
	{
		label: "Document name",
    name: "document_name",
    field: "document_name",
		header_component: null,
    cell_component: null,
    globalSearchOptions: {
                enable: true,
                filterType:"input"
            },
    sortable: true,
    // width: '160',
    showTooltipWhenOverflow: true
	},

	{
		label: "Source",
    name: "source",
    field: "source",
	 header_component: null,
    cell_component: null,
     globalSearchOptions: {
                enable: true,
                filterType:"input"
            },
    sortable: true,
    // width: '160',
    showTooltipWhenOverflow: true
	},
	{
		label: "Script name",
    name: "script_name",
    field: "script_name",
		 header_component: null,
    cell_component: null,
     globalSearchOptions: {
                enable: true,
                filterType:"input"
            },
    sortable: true,
    // width: '160',
    showTooltipWhenOverflow: true
	},
	{
		label: "Message",
		name: "message",
	 header_component: null,
    cell_component: null,
     globalSearchOptions: {
                enable: true,
                filterType:"input"
            },
    sortable: true,
    // width: '160',
    showTooltipWhenOverflow: true
	},
	{
		label: "Tag",
    name: "tag",
     field: "tag",
	 header_component: null,
    cell_component: null,
     globalSearchOptions: {
                enable: true,
                filterType:"input"
            },
    sortable: true,
    // width: '100',
    showTooltipWhenOverflow: true
	},
	{
		label: "DateTime",
		name: "created_at",
    header_component: null,
    cell_component: "Date",
    sortable: true,
    // width: '160',
    showTooltipWhenOverflow: true,
	}
],

expandColumns: [
		{
		  name: "document_name",
		  label: "Document name",
		  header_component: null,
      cell_component: null,
      width: "500",
      custom_class:true,
		},
		{
		  name: "message",
		  label: "Message",
		  header_component: null,
      cell_component: null,
      width: "500",
      custom_class:true,
		}
]
     },

        }
    },

	methods: {
  findFilter() {
      try {
        this.filter = JSON.parse(
          (this.$route && this.$route.query && this.$route.query.filter) || "{}"
        );
      } catch (err) {
        this.filter = {};
      }
      return this.filter;
    },
      initColumnFilters(searchText) {
      const columnFilter = DocumentService.getTableColumnFilters({
        searchText,columns:this.tableProps.columns
      });
      this.tableProps.query = {
        ...columnFilter,
        ...(this.tableProps.query || {}),
      };
    }
	},


	beforeMount(){
	  this.$store.commit("setDisplayIdpTree",false);
    this.$store.commit("setDisplayIdpNavbar",true);

    this.findFilter();

    this.tableProps.lookups = this.filter.lookups || [];
    this.tableProps.query = {
      ...(this.tableProps.query || {}),
      ...(this.filter.secondary || {}),
    };
let searchText =
      this.filter.searchText && ("" + this.filter.searchText).trim();
    if (searchText) this.initColumnFilters(searchText);


 },
}
</script>

<style lang="scss">
@import '../../assets/scss/_variables';

.page-info-container {
	border-radius: 5px;
    -webkit-box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
	max-width: 1000px;
    width: 100%;
	padding: 16px;
	background:$color-white;
		.el-col {
			border-right: .5px solid #bbbbbb;
			border-radius:0;
				&:last-child {
					border-right:0;
				}
		}
}

</style>

