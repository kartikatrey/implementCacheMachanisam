<template>
<div id="spreadsheet-wrapper" class="spread-sheet-wrap">
    <toolbar @search="handleSearch" @upsert="upsert" :parameters="parameters" :isDeleteAllAllowed="isDeleteAllAllowed"></toolbar>
    <div v-if="showSpreadsheet && (parameters.columns &&parameters.columns.length > 0)" id="sheet" ref="spreadsheet"></div>
    <p v-if="parameters.columns &&parameters.columns.length == 0">No column has been added yet.</p>
    <link rel="stylesheet" href="https://jsuites.net/v4/jsuites.css" type="text/css" />
    <link rel="stylesheet" href="https://bossanova.uk/jspreadsheet/v4/jexcel.css" type="text/css" />
    <!-- <link rel="stylesheet" href="https://bossanova.uk/jspreadsheet/v4/jexcel.datatables.css" type="text/css" /> -->
    <div class="idp-table-footer-container">
        <el-row>
            <el-col :span="2.6" class="per-page-title">
                <span>Rows per page:</span>
            </el-col>
            <el-col :span="1" class="per-page-count">
                <el-select v-model="pageSize" class="page-count-dropdown-container" placeholder="Select" @change="handlePageSizeChange">
                    <el-option v-for="pageSize in paginationSizes" :key="pageSize" :label="pageSize" :value="pageSize">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="16" class="idp-table-pagination">
                <el-pagination layout="prev, pager, next"  :page-size="pageSize" :current-page="selectedPage" @current-change="handlePageChange" :total="totalRecords" />
            </el-col>
        </el-row>
    </div>

</div>
</template>


<script src="https://bossanova.uk/jspreadsheet/v4/jexcel.js"></script>
<script src="https://jsuites.net/v4/jsuites.js"></script>

<style lang="scss">
// @import "_idpGlobal";
@import "../idp/_idpVariables";

.jexcel  {
  width: 100% !important;
}
.spread-sheet-wrap {
    position:relative;
      .spread-sheetheader {
        position:absolute;
        top:4.2rem;
        z-index:999
      }
}
.jexcel_container {
    overflow: auto;
    width: 100%;
    position: relative;
        .jexcel_filter {
            position: absolute;
            right: 0;
            top: 0;
        }
        .jexcel_content {
              overflow: auto;
              width: 100%;
              // background: rgba(237, 242, 247, 1);
                  background: rgb(247, 250, 252);
        }

}
.idp-table-footer-container {
        background: var(--dark-07);
        border-bottom-left-radius: var(--radius-lg);
        border-bottom-right-radius: var(--radius-lg);

        .el-input__inner {
            width: 100px
        }

        .el-input__suffix {
            padding-left: 5px;
        }

        .per-page-title {
            margin-top: var(--space-sm);
            margin-right: var(--space-xs);

            span {
                padding-left: 1.5rem;
                color: #718096;
                font-size: var(--font-sm);
            }
        }

        .per-page-count {
            .el-input {
                line-height: 2.5rem;
                color: #718096;
            }

            input {
                background: inherit;
                border: 0px;
                padding-left: 0px;
                font-size: var(--font-sm);
            }

            .el-input__suffix {
                left: 0.5rem;
                line-height: 1rem;
                font-weight: bold;
                color: #718096;
            }

            span {
                i {
                    font-weight: bold;
                    color: #718096;
                }
            }
        }

        .idp-table-pagination {
            text-align: center;

            .el-pagination {
                button {
                    background: inherit;
                }

                ul {
                    li {
                        background: inherit;
                        color: #718096;
                    }

                    .active {
                        color: #1dc0fc !important;
                    }
                }
            }
        }
    }
</style>

<script>

import jspreadsheet from "jspreadsheet-ce";
import TableAPIService from "../services/TableAPIService";
import EventBus from "@/EventBus";
import LookupService from "@/idp/services/LookupService";
import DocumentService from "@/idp/services/DocumentService";
import _ from "lodash";
import $ from 'jquery';
import Constants from "@/resources/Constants";
import Toolbar from "@/components/TableElements/Toolbar.vue";
import moment from "moment";
let spreadsheet;
export default {
    name: "SpreadSheet",
    props: ["parameters", "isDeleteAllAllowed"],
    components: {
        Toolbar
    },
    watch : {
        "parameters.columns" : {
            handler: async function (newVal, old) {
                if(!newVal){
                    return;
                }

                this.spreadsheet = null;
                this.showSpreadsheet = false
                this.$nextTick(()=> {
                    this.showSpreadsheet = true
                })
                this.columns = newVal;
                await this.getCount()
                await this.init()
                if(!old || ((old && old.length) == newVal.length))return;

                _.each(this.spreadsheet.options.data , (val, index)=> {
                     let rowsModifiedList = _.cloneDeep(this.rowModifiedList)
                    rowsModifiedList.add(index)
                    this.rowModifiedList = rowsModifiedList
                 })
            },
            deep: true,
            immediate:true
        }
    },
    data() {
        return {
            columnNamesMap: {},
            currentSortOrder:null,
            currentSortColumnIndex:null,
            selectedPage:1,
            pageSize:15,
            paginationSizes:[5, 15, 25,50],
            totalRecords:0,
            showSpreadsheet: true,
            searchText:'',
            busEvents: [],
            columns: this.parameters.columns,
            rows: this.parameters.rows || [],
            tableAPI: new TableAPIService(),
            currentPage: 1,
            skip: 0,
            limit: 15,
            sortField:this.parameters.sortField || "_id",
            select: this.parameters.select || [],
            filters: this.parameters.filters || true,
            tableOverflow: this.parameters.tableOverflow || true,
            defaultColWidth: this.parameters.defaultColWidth || 50,
            search: this.parameters.search || true,
            lazyLoading: this.parameters.lazyLoading || false,
            includeHeadersOnDownload:true,
            loadingSpin: this.parameters.loadingSpin || true,
            query: this.parameters.query,
            rowModifiedList: new Set(),
            colModifiedList: new Set(),
            spreadSheetInstance: {}
        };
    },
    async beforeMount() {
       // Created a map to associate column indexes with their corresponding column names to use whenever sorting data
        this.columnNamesMap = this.columns.reduce((map, column, index) => {
                map[index] = column.name;
                return map;
        }, {});
        window.addEventListener("beforeunload", this.preventNav);
        this.$once("hook:beforeDestroy", () => {
            window.removeEventListener("beforeunload", this.preventNav);
        });
    },
    methods: {
        preventNav(event) {
            let idList = Array.from(this.rowModifiedList)
            if (_.isEmpty(idList)) return;
                event.preventDefault();
                event.returnValue = "";
        },

        async handleSearch(searchText) {
            let columnFilter = {}
            if (searchText) {
                this.selectedPage = 1;
                columnFilter = this.initColumnFilters(searchText);
                 this.query = {
                              ...(this.query || {}),
                              ...columnFilter,
                            };
            }
            else{
                delete this.query["$or"];
            }
            //store here this.query in vue store to use in lookupconfig to download data based on
            this.$store.commit('setSpreadsheetQuery', this.query);
            await this.applyFilter();
            // spreadsheet && spreadsheet.search(searchText)
        },
        async handlePageSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.selectedPage = 1;
            await this.applyFilter();
        },
        async handlePageChange(pageNumber) {
            this.selectedPage = pageNumber
            // Determine the selected sorting order and map it to the corresponding column name
            let sortColumnName = this.columnNamesMap[this.currentSortColumnIndex];
            sortColumnName = sortColumnName ? (this.currentSortOrder === 1 ? sortColumnName : '-' + sortColumnName) : '';
            // Update the sorted column name in the store
            this.$store.commit('setSortColumnForLookup', sortColumnName);
            await this.applyFilter();
        },
        async applyFilter(){
            this.limit = this.pageSize
            this.skip =  ( this.selectedPage - 1) * this.pageSize
            await this.getCount();
            this.getRecordsUsingRestify((rows) => {
                this.spreadsheet.setData(rows);
            });
        },
        bulkUpload() {
            this.$emit('bulkUpload')
        },
        insertColumn(columnIndex) {
            columnIndex = Number(columnIndex)
            this.$emit('insertColumn', columnIndex)
        },

        editColumn(columnIndex) {
            columnIndex = Number(columnIndex)
            this.$emit('editColumn', columnIndex)
        },

        deleteColumn(instance, cell, x, y, value) {
             this.$confirm(`Are you sure you want to delete selected column(s).`, 'Confirm', {
                    confirmButtonText: 'Confirm',
                    cancelButtonText: 'Cancel'
              })
              .then(async () => {
                    const columnIndexes = _.map([...Array(x)].map((_, idx) => cell + idx))
                    EventBus.$emit('DELETE_SPREADSHEET_COLUMNS', columnIndexes)
                })
              .catch(action => {
               })


        },

        beforeDeleteColumn(instance, cell, x, y, value){
               this.deleteColumn(instance, cell, x, y, value)
               return false
        },

        afterInsertRow(instance, rowNum, x, y, isRowAddedBefore){
                this.spreadSheetInstance = instance.jspreadsheet;
                let rowsModifiedList = _.cloneDeep(this.rowModifiedList)
                let rowIndexAdded = isRowAddedBefore ? Number(rowNum) : Number(rowNum)+1
                rowsModifiedList.add(rowIndexAdded)
                this.rowModifiedList = rowsModifiedList
        },

        init() {
            this.$setLoader({
                target: "#spreadsheet-wrapper"
            });
            let self = this;
            this.getTableHeaders();
            this.addSelectColumns();
            return new Promise((resolve)=>{
            this.getRecordsUsingRestify((rows) => {
                    rows = _.isEmpty(rows) ?  [[]] :rows;
                    let options = {
                        columns: this.columns,
                        data: rows,
                        filters: this.filters,
                        tableOverflow: this.tableOverflow,
                        defaultColWidth: this.defaultColWidth,
                        search: false,
                        onbeforedeleterow: this.beforeDeleteRow,
                        onchange: this.afterColumnValueChanged,
                        onbeforedeletecolumn: this.beforeDeleteColumn,
                        onchangeheader: this.handleHeaderChange,
                        updateTable:function(instance, cell, col, row, val, label, cellName) {

                        if (this.columns[col].type == 'date') {
                            cell.innerText = val ? moment(val).format(Constants.DOCEX.DISPLAY_DATE_FORMAT) : '';
                        }
                        },
                        contextMenu: function (obj, x, y, e) {
                            var items = [];
                            if (y == null) {
                                // insert column
                                if (obj.options.allowInsertColumn == true) {
                                    items.push({
                                        title: "Insert new column",
                                        onclick: function () {
                                            self.insertColumn(x)
                                        }
                                    });
                                }
                                // Rename column
                                if (obj.options.allowRenameColumn == true) {
                                    items.push({
                                        title: "Edit column",
                                        onclick: function () {
                                            self.editColumn(x)
                                        }
                                    });
                                }
                                // delete column
                                if (obj.options.allowDeleteColumn == true) {
                                    items.push({
                                        title:obj.options.text.deleteSelectedColumns,
                                        onclick:function() {
                                            obj.deleteColumn(obj.getSelectedColumns().length ? undefined : parseInt(x));
                                        }
                                    });
                                }

                                // Sorting
                                if (obj.options.columnSorting == true) {
                                    // Line
                                    items.push({
                                        type: 'line'
                                    });

                                    items.push({
                                        title: obj.options.text.orderAscending,
                                        onclick: function () {
                                            obj.orderBy(x, 0);
                                            self.currentSortColumnIndex = x; // Store the clicked column's index
                                            self.currentSortOrder = 1; // Ascending
                                            const sortColumnName = self.columnNamesMap[x];
                                            // Update the selected sorted column name in the store
                                            self.$store.commit('setSortColumnForLookup', sortColumnName);
                                        }
                                    });
                                    items.push({
                                        title: obj.options.text.orderDescending,
                                        onclick: function () {
                                            obj.orderBy(x, 1);
                                            self.currentSortColumnIndex = x; // Store the clicked column's index
                                            self.currentSortOrder = -1; // Descending
                                            let sortColumnName = self.columnNamesMap[x];
                                            sortColumnName = '-'+sortColumnName // Adding minus sign to indicate descending order for server-side sorting
                                            // Update the selected sorted column name in the store
                                            self.$store.commit('setSortColumnForLookup', sortColumnName);
                                        }
                                    });
                                }
                            } else {
                                // Insert new row
                                if (obj.options.allowInsertRow == true) {
                                    items.push({
                                        title: obj.options.text.insertANewRowAfter,
                                        onclick: function () {
                                            obj.insertRow(1, parseInt(y));
                                        }
                                    });
                                }
                                // delete row
                                if (obj.options.allowDeleteRow == true) {
                                    items.push({
                                        title: obj.options.text.deleteSelectedRows,
                                        onclick: function () {
                                            obj.deleteRow(obj.getSelectedRows().length ? undefined : parseInt(y));
                                        }
                                    });
                                }

                            }
                            // Line
                            items.push({
                                type: 'line'
                            });
                            // Save
                            if (obj.options.allowExport) {
                                items.push({
                                    title: obj.options.text.saveAs,
                                    shortcut: 'Ctrl + S',
                                    onclick: function () {
                                        obj.download();
                                    }
                                });
                            }
                            return items;
                        },
                        oninsertrow:this.afterInsertRow
                    };
                    spreadsheet = jspreadsheet(document.getElementById("sheet"), options);
                    Object.assign(this, {
                        spreadsheet
                    });
                    this.$resetLoader();
                    resolve()
                });
            })

        },

        deleteRows(instance, cell, x, y, value) {
                this.$confirm(`Are you sure you want to delete all rows.`, 'Confirm', {
                    confirmButtonText: 'Confirm',
                    cancelButtonText: 'Cancel'
                })
                .then(async () => {
                    const idsToDelete = _.map([...Array(x)].map((_, idx) => cell + idx), (cellIndex) => {
                    let data = instance.jspreadsheet.getJsonRow(cellIndex)
                        return data._id
                    })
                    EventBus.$emit('DELETE_SPREADSHEET_ROWS', idsToDelete)
                })
                .catch(action => {
                })
        },

        afterColumnValueChanged(instance, cell, x, y, value) {
            this.spreadSheetInstance = instance.jspreadsheet;
            let rowsModifiedList = _.cloneDeep(this.rowModifiedList)
            rowsModifiedList.add(Number(y))
            this.rowModifiedList = rowsModifiedList
        },

        beforeDeleteRow(instance, cell, x, y, value) {
            this.deleteRows(instance, cell, x, y, value)
            return false;
        },

        async getRecordsUsingRestify(callback) {
            // this.tableAPI.addQuery(this.query);
            this.tableAPI.addLimit(this.limit);
            this.tableAPI.addSkip(this.skip);
            this.tableAPI.setQuery(this.query);
            const sortColumnName = this.$store.getters.getSortColumnName
            this.tableAPI.addSortCondition(sortColumnName || this.sortField);
            this.parameters.aggregation ? this.tableAPI.addAggregation(this.parameters.aggregation) : "";
            this.parameters.select ? this.tableAPI.addSelectColumns(this.parameters.select) : "";
            let self = this;
            this.tableAPI.find(this.parameters.apiName, (error, response) => {
                if (response) {
                    self.rows = response;
                    callback(response);
                    return;
                }
            });
        },
        async getCount() {
            let lookupCount = await LookupService.getLookUpData(JSON.stringify(this.query))
            this.totalRecords = lookupCount || 0;
        },
        initColumnFilters(searchText) {
            const columnFilter = DocumentService.getTableColumnFilters({
                searchText,columns:this.columns
            });
            return columnFilter
        },
        getTableHeaders() {
            let columns = []
            _.each(this.columns, (item, index) => {
                let dataType = Constants.DOCEX.SPREADSHEET_DATATYPE_MAPPING[item.datatype] || item.datatype;
                columns.push({
                    name: item.name,
                    title: item.label,
                    type: dataType,
                     filterOptions: {
                        enable: true,
                    },
                });
            });
            columns =   !_.isEmpty(columns) ? columns.concat(Constants.DOCEX.SPREADSHEET_WHO_COLUMNS) : columns
            this.columns = columns
            this.columns.push({
                name: "_id",
                title: "Id",
                type: "hidden"
            })
        },

        addSelectColumns() {
            if (this.parameters.select >= 1) {
                return;
            }
            _.each(this.columns, (item, index) => {
                this.parameters.select.push(item.name);
            });
        },

        async upsert() {
            let idList = Array.from(this.rowModifiedList);
            if(_.isEmpty(idList)){
                this.$notify({
                    title: 'Warning',
                    message: 'No data has been modified.',
                    type: 'warning'
               });
               return;
            }
            let self = this
            let rowData = _.map(idList, (item, index) => {
                return self.spreadsheet.getJsonRow(item)
            })
            EventBus.$emit('UPSERT_DATA', rowData)
            this.rowModifiedList = new Set()
        },

        handleHeaderChange() {
            alert('hey')
        }
    }

};
</script>

<style lang="scss">
#spreadsheet-wrapper{
.el-loading-spinner {
    margin-top: 95px !important;
}
}
</style>


