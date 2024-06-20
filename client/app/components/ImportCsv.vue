<template>
<el-dialog v-if="dialogShow" :before-close="closeDialog" class="import-file-container" title="Import file" @close="closeDialog" :visible.sync="dialogShow">
    <div class="inner">
        <el-row :span="16">
            <input ref="csv" type="file" @change.prevent="validFileMimeType" class="inputClass" name="csv">
        </el-row>
        <!-- <el-row :span="16">
      <el-button @click="exportTemplate">Download Sample File</el-button>
      </el-row> -->

    </div>
    <div class="modal-bottom-btns">
        <el-button v-if="isValidFileMimeType" id="importData" :class="buttonClass" @click.prevent="parseCsv" size="medium" type="primary">
            Upload
        </el-button>
        <el-button @click="closeDialog" size="medium">Cancel</el-button>
    </div>

</el-dialog>
</template>

<script>
import _ from "lodash";
import Papa from 'papaparse';
import Constants from "@/resources/Constants";

import mimeTypes from "mime-types";
import EventBus from "@/EventBus";

export default {
    name: "ImportCsv",
    props: ["dialogShow", "modelType"],
    components: {},

    data() {
        return {
            csv: null,
            sample: null,
            isValidFileMimeType: false,
            fileMimeTypes: ["text/csv", "text/x-csv", "application/vnd.ms-excel", "text/plain"],

            validation: true,

        };
    },

    watch: {
        dialogShow: {
            handler: function (val) {
                if (val == false) {
                    this.csv = null;
                    this.isValidFileMimeType = false
                }
            },
            immediate: true,
            deep: true
        }

    },
    methods: {
        closeDialog() {
             this.$emit("closeDialog");
             this.csv = null;
             this.isValidFileMimeType = false
        },

        validFileMimeType() {
            let file = this.$refs.csv.files[0];
            const mimeType = file.type === "" ? mimeTypes.lookup(file.name) : file.type;
            if (file) {
                this.fileSelected = true;
                this.isValidFileMimeType = this.validation ? this.validateMimeType(mimeType) : true;
            } else {
                this.isValidFileMimeType = !this.validation;
                this.fileSelected = false;
            }
            if (!this.isValidFileMimeType) {
                this.notifyError("File type not supported, Please select .csv file");
            }
        },
        validateMimeType(type) {
            return this.fileMimeTypes.indexOf(type) > -1;
        },
        parseCsv() {
            let rowData = []
            const _this = this;
            this.readFile((output) => {
                Papa.parse(output, {
                    header: true,
                    skipEmptyLines: true,
                    step: function (results, parser) {
                        console.log("Row data:", results.data);
                        console.log("parser $$$$$:", parser)
                        let isValid = _this.validate(results.data[0], _this.modelType);
                         if (!isValid) {
                            _this.notifyError("Invalid header row");
                            parser.abort()
                            return;
                        }
                        rowData.push(results.data[0])
                    },

                    complete: function (results) {
                        console.log("inside complete!!!!!!!!!!!!!!", rowData)
                        _this.csv = rowData
                        _this.insertData(_this.csv)
                    }
                });

            });

        },
        validate(row, model_type) {
            let columnsMapping = Constants.EXPORT_COLUMNS[model_type];
            let columns = _.sortBy(_.map(columnsMapping, "label")); // pluck by label ex. [domain,statement] and sort by ascending order
            let keys = _.sortBy(_.keys(row)); // sort keys by ascending order 
            if (!_.isEqual(keys, columns)) { // check whether keys and columns are same (_.isEqual() also check order)
                return false
            }
            return true
        },
        readFile(callback) {
            let file = this.$refs.csv.files[0];
            if (file) {
                let reader = new FileReader();
                reader.readAsText(file, "UTF-8");
                reader.onload = function (evt) {
                    callback(evt.target.result);
                };
                reader.onerror = function () {};
            }
        },
        insertData(data) {
            console.log("inside insertdata!!!!!!!!!!!!!!", data)
            EventBus.$emit('insertData', data);
            // if (this.csv) {
            //     //this.closeDialog()
            // }
        },
        exportTemplate() {
            let fileName = this.modelType + ".csv"
            window.open(`${window.location.origin}/portal/api/process-file?fileName=${fileName}&alloweDelete=${false}`, "_self");

        },

    }
};
</script>

<style lang="scss">
input[type=file] {
    border: 1px dashed;
    padding: 20px;
    border-radius: 5px;
    margin-bottom: 20px;
    overflow: hidden;
    position: relative;
    text-align: center;
    display: inline-block;
}

.modal-bottom-btns {
    text-align: right;
}

.import-file-container {
    text-align: center;

    .el-dialog {
        width: 500px;
        border-radius: 5px;
        top: 100px;
    }

}
</style>
