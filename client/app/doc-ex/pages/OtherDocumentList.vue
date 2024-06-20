<template>
<el-main>
    <h1 class="kp-page-title">{{pageTitle}}</h1>
    <div class="table-wrap">
        <DataTable :parameters="requiredParams"></DataTable>
    </div>
    <el-dialog width="38%" class="confirmation-box" title="Confirmation" :before-close="handleCloseDialog" :visible.sync="showModal">
        <el-form :model="form" :rules="rules" ref="form" label-width="178px" class="demo-form">
            <el-form-item label="Document type" prop="document_type">
                <el-select class="config-value" v-model="form.document_type" placeholder="Select document type">
                    <el-option v-for="(item, index) in document_type_list" v-bind:value="item.value" :key="item.value" :label="item.label"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-button v-loading="loading" type="primary" @click="submitForm('form')">Confirm</el-button>
                <el-button @click="handleCloseDialog">Close</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</el-main>
</template>

<script>
import DataTable from "../../components/DataTable.vue";
import AjaxService from "@public/services/AjaxService";
import EventBus from "@/EventBus";
import Constants from "@/resources/Constants";
import DocumentService from "@/doc-ex/services/DocumentService";

export default {
    name: "OtherDocumentList",
    components: {
        DataTable
    },
    data() {
        return {
            requiredParams: {
                apiName: "/portal/api/table/de_document", //add your API url here
                queryParam: {
                    active: true,
                    document_type:  { '$in': Constants.DOCEX.OTHER_DOC_TYPES }
                },
                showPaginationOptions: true, // to show/hide pagination option
                tableName: "other_documents", // it is use to get headers of table from tableHeaderConfig.js
                isRestify: true,
                limit: 10, // to limit the number of records to be fetched,
                actionItems: [{
                        icon: "el-icon-refresh",
                        name: "Move",
                        event_name: "move_document"
                    }

                ]

            },
            document_type_list: Constants.DOCEX.DOCUMENT_TYPE_LIST,

            pageTitle: 'Other documents',
            form: {
                document_type: ""
            },
            showModal: false,
            rules: {
                document_type: [{
                    required: true,
                    message: 'Please select document type',
                    trigger: 'change'
                }]
            },
            document:{},
            loading:false
        };
    },
    methods: {
        async openDocument(document) {
            console.log("openDocumentInTab")
            let urls = await DocumentService.getFileUrl({
                    id: document._id,
                    file_for_preview:true
                })
            window.open(urls[0]);

        },
        handleCloseDialog() {
            this.showModal = false
        },
       async  submitForm(formName) {
           this.loading= true
            this.$refs[formName].validate(async (valid) => {
                if (!valid)
                    return
                let params = {
                    storage_folder_path: this.document.storage_folder_path,
                    uploaded_file_path : this.document.uploaded_file_path,
                    document_id: this.document._id,
                    document_type: this.form.document_type,
                    file_name: this.document.original_file_name,
                    input_channel_id : this.document.input_channel_id

                };
                try{
                let response = await DocumentService.move(params)
                 EventBus.$emit('refreshTable');

                }
                catch(error){
                     this.loading= false
                     return this.notifyError("Something went wrong.")
                }
                let response = await DocumentService.move(params).catch(error=>{
                  
                })
                this.loading= false

                this.showModal = false
                this.form.document_type =""
                return

            });
        },
        async moveDocument(document) {
            this.showModal = true
            this.document =document.row

            // refresh table 
            // this.notifySuccess();  

        }

    },
    beforeMount() {
        EventBus.$on("openDocumentInTab", (document) => {
            this.openDocument(document)
        });
        EventBus.$on("move_document", (document) => {
            this.moveDocument(document)
        });

    },
    beforeDestroy() {
        EventBus.$off(["openDocumentInTab", "move_document"]);

    }
};
</script>
