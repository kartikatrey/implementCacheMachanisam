<template>
<main>
	<el-dialog
        custom-class="select-list-modal"
		:visible.sync="visible"
		width="70%"
		:destroy-on-close="true"
		:close-on-click-modal="true"
		:before-close="handleDocumentSelectModalClose"
        :show-close="true"
	>
		<div class="document-select-list">
			<header>
            <h3>{{options.title}} <span>{{options.subTitle}}</span></h3> 
				<GlobalSearch v-bind:searchText.sync="searchText" />
                <i size="medium" class="mdi mdi-close" @click="closeList"></i>
			</header>
			<div class="datatable">
				<IdpDataTable
					:tableProps="tableProps"
					@handleRowSelect="handleRowSelect"
				></IdpDataTable>
				<footer class="modal-footer">
					<el-button
						id="add-document"
						:disabled="!selectedDocument"
						size="small"
						type="primary"
						@click="addDocument"
						>+ {{options.submitButtonText}}</el-button
					>
				</footer>
			</div>
            <div class="alternate-option">
                <slot :openSelectList="openSelectList"></slot>
            </div>
			
		</div>
	</el-dialog>
   </main> 
</template>

<script>
import IdpDataTable from "../table/IdpDataTable";
import Constants from "@/resources/Constants";
import EventBus from "@/EventBus";
import GlobalSearch from "./GlobalSearch";
import _ from "lodash";
import DocumentService from "@/idp/services/DocumentService";

export default {
	name: "DocumentSelectList",
	props:{
        'displayListView':{},
        "extraQueryParam":{},
        "buttonOptions":{}
    },
	watch: {
		searchText: {
			handler: function(newVal, oldVal) {
				this.initColumnFilters(newVal);
			},
			deep: true
		}
	},
	data() {
		return {
            options : {
               title:'Select document',
               subTitle:"Select and add document from existing list.", 
               submitButtonText:"Select document",
               ...this.buttonOptions
            },
            visible:true,
			searchText: "",
			showDatatable: true,
			tableProps: {
				tableConfigLoaded: true, // this flag is added to load datatable once all tableprps are loaded.
				multiSelect: false,
				readParamsFromUrl: false,
				enableDateRangeFilter: false,
				enableCustomerFilter: false,
				minHeight: 400,
                paginationSizes:[5, 15, 25, 50],
				tableName: "de_document",
				tableIdentifier: "idp_insurance_list",
				sortColumn: "-created_at",
				defaultPageSize: 10,
				query: {
					...this.extraQueryParam,
                    ...{active: true}
				},
				columns: [
					{
						header_component: null,
						cell_component: "RadioButton",
						name: "Radio",
						sortable: false,
						width: "40",
                        fixed: "left"
					},
					{
						header_component: null,
						cell_component: "Dot",
						name: "Link dot",
						sortable: false,
						width: "15",
						options: {
							groupParentKey: "is_multi_documents_present",
							groupChildKey: "parent_document_id",
							errorPointCheck: [
								{
									key: "has_errors",
									value: true,
									class: "error-dot"
								},
								{
									key: "fraud_detected",
									value: true,
									class: "fraud-dot"
								}
							]
						}
					},
					{
						name: "file_name",
						label: "Document name",
						header_component: null,
						sortable: true,
						width: "160",
						showTooltipWhenOverflow: true,
						filterOptions: {
							enable: true,
							filterType: "input"
						},
						options: {
							eventName: "IDP_OPEN_DOCUMENT",
							disableCheckKey: [
								"state",
								"is_data_deleted",
								"is_multi_documents_present"
							],
							disableValues: {
								state: [
									"In progress",
									"Requested",
									"Publish in progress",
									"Publish started"
								],
								is_data_deleted: [true],
								is_multi_documents_present: [true]
							}
						}
					},
					{
						name: "document_subtype",
						label: "Document type",
						header_component: null,
						filterOptions: {
							enable: true,
							filterType: "input"
						},
						options: {
							mapping: Constants.DOCEX.INSURANCE_SUBTYPE_MAPPING
						},
						cell_component: "LabelMap",
						sortable: true,
						width: "130",
						showTooltipWhenOverflow: true
					},
					{
						name: "created_at",
						label: "Upload date",
						header_component: null,
						cell_component: "Date",
						sortable: true,
						width: "140",
						showTooltipWhenOverflow: true
					},
					{
						name: "created_by",
						label: "Uploaded by",
						header_component: null,
						filterOptions: {
							enable: true,
							filterType: "input"
						},
						cell_component: null,
						sortable: true,
						width: "130",
						showTooltipWhenOverflow: true
					},			
					{
						name: "updated_at",
						label: "Updated date",
						header_component: null,
						cell_component: "Date",
						sortable: true,
						width: "140",
						showTooltipWhenOverflow: true
					},
					{
						name: "updated_by",
						label: "Updated by",
						header_component: null,
						cell_component: null,
						sortable: true,
						width: "130",
						showTooltipWhenOverflow: true,
						filterOptions: {
							enable: true,
							filterType: "input"
						}
					},
					{
						name: "state",
						fixed: "right",
						label: "Status",
						header_component: null,
						filterOptions: {
							enable: true,
							filterType: "input"
						},
						cell_component: "Status",
						sortable: true,
						showTooltipWhenOverflow: true,
						options: {
							retryEvent: "IDP_RETRY",
							detailsEvent: "IDP_DETAILS",
							disableCheckKey: ["is_data_deleted"],
							disableValues: { is_data_deleted: [true] }
						}
					}
				]
			},
			selectedDocument: null
		};
	},
	components: {
		IdpDataTable,
		GlobalSearch
	},
	methods: {
		initColumnFilters(searchText) {
			const columnFilter = DocumentService.getTableColumnFilters({
				searchText,
				columns: this.tableProps.columns
			});
			this.tableProps.query = {
				...(this.tableProps.query || {}),
				...columnFilter
			};
		},

		handleRowSelect(data) {
			this.selectedDocument = data;
		},

		addDocument() {
			// this.$setLoader({
			//     target: "#add-document"
			// });
			this.$emit("addDocument", this.selectedDocument);
		},

		closeList() {
			this.$emit("update:displayListView", false);
            this.$emit("closeDialog", false);
		},

		handleDocumentSelectModalClose() {
			this.$emit("handleDocumentSelectModalClose");
		},

		openSelectList() {
			this.$emit("openUploadDialog");
		}
	},
	created() {},
	mounted() {}
};
</script>

<style lang="scss">
@import "../_idpVariables";
@import "../_idpGlobal";

.select-list-modal{
    padding: 0rem !important;
    // height: 80%;
    overflow-y: auto;
	margin-top: 4vh !important;
	padding-bottom: 2rem;
    &::-webkit-scrollbar {
        width: 3px;
    }
    &::-webkit-scrollbar-track {
        background: transparent;
    }
    &::-webkit-scrollbar-thumb {
        background: #8e9091;
    }
		.el-table--enable-row-transition .el-table__body td:first-child .cell {
			margin-left: 0.2rem;
				display: block;
	}

   .document-select-list {
     .multi-doc-line {
		right: 5px !important;
	}

    .mdi-close{
         border: 0px;
         margin-left: 1rem;
         padding: 0px;
         cursor: pointer;
    }

	header {
		display: flex;
		justify-content: flex-end;
		padding: 1rem 2rem;
		h3 {
			margin: 0 auto 0 0;
			font-size: var(--font-pagetile);
			color: var(--dark-01);
			font-weight: normal;

			span {
				color: var(--dark-05);
				display: inline-block;
				margin-left: 1rem;
				font-size: 1.15rem;
    			font-weight: 300;
			}
		}
		.global-search {
			.el-input--mini .el-input__inner {
				height: 24px;
				line-height: 24px;
			}
		}
	}

    .datatable{
        padding:1.5rem 2rem 1rem 2rem;
        background: var(--dark-07);
		position: relative;
        .el-table {
              border-radius: 1rem;
              th{
                  background-color: white;
                  border-bottom: 0px;  
               }              
        }

	.el-table__body tr.current-row > td {
        &:first-child {
           border-left : 3px solid var(--brand-06);
        }
        background-color: var(--brand-08);
    }

    }

    .alternate-option{
        padding: 1rem;
    }
    .dialog-footer{
        text-align: right;
        padding-top: 10px;
    }


	.el-table tr {
		background-color: #ffffff !important;
	}
	footer {
		justify-content: end;
		padding: 0;
		position: absolute;
		right: 2.5rem;
		bottom: .8rem;
		display: inline-block;
		border: 0;
	}
}

.search-icon {
	position: absolute;
	z-index: 1;
	color: #a0aec0;
	left: 6px;
	top: 1px;
	bottom: 17px;
	font-size: 18px;
}

}

</style>
