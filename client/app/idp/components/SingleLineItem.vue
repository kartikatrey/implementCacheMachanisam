<template>
    <div class="line-item-table">
        <div class="import-export-link-grp">
            <a :class="{ 'disabled-link': !isDisableLink || hasButtonPermission('Delete all')}" @click.prevent="deleteAllLineItems({ row_count: lineItemTableParams.rows.length })">Delete all</a>
            <span></span>
            <a :class="{ 'disabled-link': !isDisableLink || hasButtonPermission('Add row') }" @click.prevent="addRowInLineItem">Add row</a>
            <span></span>
            <a :class="{ 'disabled-link': !isDisableLink || hasButtonPermission('Export') }" @click.prevent="exportLineItem">Export</a>
            <span></span>
            <a :class="{ 'disabled-link': !isDisableLink || hasButtonPermission('Import') }" @click.prevent="importLineItem">Import</a>
        </div>
        <IdpLineTable 
            :class="['line-table', lineItemTableParams.tableName]" 
            :parameters="lineItemTableParams"
            :isDocumentReadOnly="docData.isDocumentReadOnly"
            :documentType="docData.documentType"
            @delete-idp-row="deleteRow"
            @clone-idp-row="cloneRow"
            @add-idp-row-above="addRowAbove"
            @add-idp-row-below="addRowBelow"
            :key="singleDataTableState"
            ref="singleDataTable"
        ></IdpLineTable>
    </div>
</template>

<script>
import IdpLineTable from "@/components/IdpLineTable.vue";
import DocumentService from "@/idp/services/DocumentService";
import _ from "lodash";
import EventBus from "@/EventBus";

export default {
    name: "SingleLineItem",
    components: { IdpLineTable },
    props: [
        "docData", 
        "lineItemTableParams"
    ],
    data() {
        return {
            lodash: _ ,
            singleDataTableState : 0
        }
    },

    computed: {
        isDisableLink() {
            if (this.lineItemTableParams.rows.length > 0 || this.lineItemTableParams.columns.length > 1) {
                return this.$store.getters["actionButtonStore/isSaveActionEnabled"]
            }
            return false;
        },
    },
    beforeMount(){
        console.log("SingleLineItem:: Before Mount");
    },
    updated(){
        console.log("SingleLineItem:: Updated");
    },
    methods: {
        async importLineItem() {
            this.$emit("handleImportLineItems");
        },
        async exportLineItem() {
            if (!this.lineItemTableParams.rows.length) {
                this.notifyError(`No data found for line table. Please add data to export the CSV file.`);
                return;
            }
            this.$emit("handleExportLineItems");
        },
        refreshDataTable(){
            this.$refs.singleDataTable.refreshTable();
        },
        addRowAbove(tableData) {
            const index = tableData.row.id;
            const payload = { index : index };
            this.$store.commit("documentViewStore/addRow", payload);
            this.$emit("setFieldConfigsForRows");
            this.$nextTick(()=>{
                /**
                 * Purpose: Refresh bounding boxes in the canvas.
                 * When operations are performed on line items, refreshing is required for highlighting.
                 * field_config.name are used to highlight line items, so changing a field's name requires updating the bounds.
                 */
                if(tableData && tableData.formattedRow){
                    const pageNumber = DocumentService.getPageNumberFromRow(tableData.formattedRow);
                    this.$emit("reloadBoundingBox", pageNumber);
                }
                this.$store.commit("documentViewStore/moveErrorMessages", payload);
            })
        },

        addRowBelow(tableData) {
            let index = tableData.row.id;
            index++;
            const payload = { index : index };
            this.$store.commit("documentViewStore/addRow", payload);
            this.$emit("setFieldConfigsForRows");
            this.$nextTick(()=>{
                /**
                 * Purpose: Refresh bounding boxes in the canvas.
                 * When operations are performed on line items, refreshing is required for highlighting.
                 * field_config.name are used to highlight line items, so changing a field's name requires updating the bounds.
                 */
                 if(tableData && tableData.formattedRow){
                    const pageNumber = DocumentService.getPageNumberFromRow(tableData.formattedRow);
                    this.$emit("reloadBoundingBox", pageNumber);
                }
                this.$store.commit("documentViewStore/moveErrorMessages", payload);
            })
        },

        cloneRow(tableData) {
            const index = tableData.row.id;
            const payload = { index };    
            this.$store.commit("documentViewStore/rowClone", payload);
            this.$emit("setFieldConfigsForRows");
            this.$nextTick(()=>{
                /**
                 * Purpose: Refresh bounding boxes in the canvas.
                 * When operations are performed on line items, refreshing is required for highlighting.
                 * field_config.name are used to highlight line items, so changing a field's name requires updating the bounds.
                 */
                 if(tableData && tableData.formattedRow){
                    const pageNumber = DocumentService.getPageNumberFromRow(tableData.formattedRow);
                    this.$emit("reloadBoundingBox", pageNumber);
                }
                this.$store.commit("documentViewStore/moveErrorMessages", payload);
            })
        },

        deleteRow(tableData) {
            const index = tableData.row.id;
            const payload = { index : index };
            this.$store.commit("documentViewStore/deleteLineItemRow", payload);
            this.$emit("setFieldConfigsForRows");
            this.$nextTick(()=>{
                /**
                 * Purpose: Refresh bounding boxes in the canvas.
                 * When operations are performed on line items, refreshing is required for highlighting.
                 * field_config.name are used to highlight line items, so changing a field's name requires updating the bounds.
                */
                if(tableData && tableData.formattedRow){
                    const pageNumber = DocumentService.getPageNumberFromRow(tableData.formattedRow);
                    this.$emit("reloadBoundingBox", pageNumber);
                }
                this.$store.commit("documentViewStore/deleteErrorMessage", payload);
            })
        },
        // Function is calling dataTable addRowInLineItem function using refs and update prediction in the store
        addRowInLineItem(tableData){
            const index = 0;
            const data = { row : { id : index } }
            const payload = { index : index };

            /*
                We're adding one empty array "[]", when "delete all" is clicked OR any table rows length is zero
                and when user clicks on "add row" then we're using that empty array in "mapFieldValue" to add all selected columns in that row
                and again we're refreshing tableParams that passed to each table
            */
            if(this.lineItemTableParams.rows.length === 0){
                this.$store.commit("documentViewStore/addRow", { index : 0 });
                this.$nextTick( () => {
                    EventBus.$emit("addRowInEmptyTable");
                    this.singleDataTableState += 1;
                })
                return;
            }

            this.$refs.singleDataTable.addRowInLineItem(data);
            this.$store.commit("documentViewStore/addRow", { index: index });
            this.$emit("setFieldConfigsForRows");
            this.$nextTick(()=>{
                /**
                 * Purpose: Refresh bounding boxes in the canvas.
                 * When operations are performed on line items, refreshing is required for highlighting.
                 * field_config.name are used to highlight line items, so changing a field's name requires updating the bounds.
                 */
                if(this.lineItemTableParams && this.lineItemTableParams.rows.length){
                    const pageNumber = DocumentService.getPageNumberFromRow(this.lineItemTableParams.rows[0]);
                    this.$emit("reloadBoundingBox", pageNumber);
                }
                this.$store.commit("documentViewStore/moveErrorMessages", payload);
            })
        },
        // Function is calling DataTable deleteAllRows function using refs and update prediction in the store
        async deleteAllLineItems(tableData) {
            const rowCount = this.$refs.singleDataTable._props.parameters.rows.length;
            if(!rowCount){
                return ;
            }

            let deleteConfirm = await this.$confirm(`Are you sure you want to delete all ${rowCount} line items?`, "Confirmation", {
                confirmButtonText: "Delete",
                cancelButtonText: "Cancel",
                type: "warning"
            }).catch(e => {
                console.error(e)
            });

            if (!deleteConfirm) { return; }

            // We passed table params using cloneDeep so we need to make empty that rows also
            this.$refs.singleDataTable.deleteAllRows();

            // Update prediction in the store
            this.$store.commit("documentViewStore/deleteAllLineItems", tableData);

            this.$nextTick(() => {
                this.$store.commit("documentViewStore/deleteAllErrorMessages", rowCount);
            })
        }
    }
}
</script>