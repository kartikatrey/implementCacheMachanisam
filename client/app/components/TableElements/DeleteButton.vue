<template>
<span>
    <el-dropdown-item :disabled="disableButton" :cid="'table-action-dropdown-delete-' + propData.index" v-if="type=='dropdown'" :command="deleteRecord">
        <span class="mdi mdi-delete action-btn dropdown-btn"></span>Delete
    </el-dropdown-item>
    <el-button :disabled="disableButton" :cid="'table-action-delete-' + propData.index" class="delete-btn" v-else v-on:click="deleteRecord">
        <span class="mdi mdi-delete action-btn"></span>
    </el-button>
</span>
</template>

<script>
import TableAPIService from "@/services/TableAPIService";
import AjaxService from "@/services/AjaxService";
import {
    _
} from "vue-underscore";
import EventBus from "@/EventBus";

let tableApiService = new TableAPIService();
export default {
    name: "DeleteButton",
    props: ["propData", "type","parameters"],
    data() {
        return {};
    },
    computed: {
        disableButton(){
            if(this.propData.column.deleteOptions.disableFunction){
                return !this[this.propData.column.deleteOptions.disableFunction]();
            }
            return false;
        }
    },
    methods: {
        deleteRecord() {
            let record = this.propData.row;
            let column = this.propData.column;
            let confirmText = `Are you sure you want to delete?`;
            column.deleteOptions && column.deleteOptions.comment && (confirmText = column.deleteOptions.comment);
            if (!record._id) {
                EventBus.$emit("deleteRow", this.propData.index);
                this.notifySuccess();
                return;
            }
            this.$confirm(confirmText, "Confirmation", {
                    confirmButtonText: "Confirm",
                    cancelButtonText: "Cancel",
                    type: "warning"
                })
                .then(() => {
                    if (
                        !_.has(column.deleteOptions, "endpoint") ||
                        !_.has(column.deleteOptions, "field")
                    ) {
                        this.$notify.error({
                            title: "Error",
                            message: "Table header configuration missing!"
                        });
                        return;
                    }
                    let endpoint = column.deleteOptions.endpoint;

                    let deleteObject = {};
                    deleteObject[column.deleteOptions.field] = false;

                    if (column.deleteOptions.extraFields) {
                        _.each(column.deleteOptions.extraFields, field => {
                            deleteObject[field] = record[field]
                        });
                    }

                    tableApiService.findByIdAndUpdate(
                        endpoint,
                        record._id,
                        deleteObject,
                        (error, response) => {
                            if (error) {
                                return this.$notify.error({
                                    title: "Error",
                                    message: "Error while deleting record!"
                                });
                            }
                            if (response.data._id === record._id) {
                                this.notifySuccess();
                                //When there are two data tables on the same page, 
                                //emit a 'refreshTable' event with the 'refreshEventName' parameter to trigger the specific data table to refresh.
                                if (_.isEmpty(this.parameters)) {
                                    return;
                                }
                                if (this.parameters.refreshEventName) {
                                    EventBus.$emit("refreshTable__" + this.parameters.refreshEventName);
                                    return;
                                }
                                EventBus.$emit("refreshTable");
                                EventBus.$emit("tableRecordDeleted", record);
                            }
                        }
                    );
                })
                .catch(error => {});
        },

        notifySuccess() {
            this.$notify({
                title: "Success",
                message: "Record deleted successfully!",
                type: "success"
            });
        }
    }
};
</script>

<style lang="scss">
.qna-delete {
    padding-top: 26px !important;
}

.button-style {
    font-size: 26px !important;
    padding: 0 !important;
}

.edit-delete-button-container {
    .el-button {
        padding: 5px;
        border: 0;
    }
}

.delete-btn{
    background: transparent;
    border:None;
}


</style>
    