<template>
    <el-main>
    
        <h1 class="kp-page-title">{{pageTitle}}</h1>
    
        <div class="kp-container">
    
            <div class="left-block">
    
                <div class="folder-wrap" v-bar="{ useScrollbarPseudo: true }">
    
                    <div class="top-section">
    
                        <el-tooltip class="item" effect="dark" content="Add root folder" placement="top">
    
                            <el-button @click="openFolderDialogBox($event, 'root')" class="kp-btn-toolbar">
    
                                <span class="mdi mdi-folder-plus"></span>
    
                            </el-button>
    
                        </el-tooltip>
    
                        <el-tooltip class="item" effect="dark" content="Add folder" placement="top">
    
                            <el-button @click="openFolderDialogBox" class="kp-btn-toolbar kp-btn-addfolder">
    
                                <span class="mdi mdi-folder-outline"></span>
    
                            </el-button>
    
                        </el-tooltip>
    
                        <el-tooltip class="item" effect="dark" content="Delete folder" placement="top">
    
                            <el-button class="kp-btn-toolbar right-btn" @click="deleteEmptyFolder" style="float:right;">
    
                                <span class="mdi mdi-delete"></span>
    
                            </el-button>
    
                        </el-tooltip>
    
                    </div>
    
                    <div class="folder-search-container sdfsdf">
    
                        <el-input placeholder="Search folder..." v-model="folderSearch"></el-input>
    
                    </div>
    
    
    
                    <el-tree :props="props" :data="directoryData" default-expand-all highlight-current :filter-node-method="filterNode" current-node-key @node-click="handleNodeClick" @current-change="onCurrentNodeChange" node-key="id" ref="tree"></el-tree>
    
    
    
                    <el-dialog width="40%" :show-close="false" class="folder-modal-container" before-close="closeDialog" title="Create New Folder" :visible.sync="displayFolderDialog" center>
    
                        <el-row :gutter="10">
    
                            <el-col style="height:1px" :span="5"></el-col>
    
                            <el-col :span="12">
    
                                <el-input v-model="folderName" placeholder="Folder name"></el-input>
    
                                <span v-if="invalidFolderName" class="folder-name-validation">*Please enter valid folder name</span>
    
                            </el-col>
    
                            <el-col class="folder-name-save" :span="6">
    
                                <el-button type="primary" :disabled="!(folderName.trim())" size="small" @click="createFolder">Confirm</el-button>
    
                            </el-col>
    
                        </el-row>
    
                    </el-dialog>
    
                </div>
    
            </div>
    
            <!-- left block -->
    
            <!-- right block -->
    
            <div class="right-block">
    
                <div>
    
                    <upload v-if="displayUploadDialog" @closeDialog="closeUploadDialog" :data="uploadParams" :accept="getValidDocType" :multiple="allowMultipleUpload"></upload>
    
                </div>
    
                <div>
    
                    <el-menu class="kp-table-toolbar mb-20">
    
                        <el-row>
    
                            <el-col :span="15">
    
                                <div class="left-block">
    
                                    <el-button icon="el-icon-plus" class="upload-document btn-train kp-btn-primary" type="primary" @click="uploadDocument">Upload Document</el-button>
    
                                </div>
    
                                <span class="space-toolbar">&nbsp;</span>
    
                            </el-col>
    
                            <el-col :span="9">
    
                                <el-row class="right-block" :gutter="20" type="flex" justify="end">
    
                                    <el-col :span="18" class="no-p">
    
                                        <el-input clearable @input.native="onSearch(searchText)" @clear="onSearch(searchText)" class="kp-toolbar-input" placeholder="Search" v-model="searchText"></el-input>
    
                                    </el-col>
    
                                    <el-col :span="6" class="no-p">
    
                                        <el-tooltip class="item" effect="dark" content="Filter" placement="top-start">
    
                                            <el-button @click="applyFilter" class="kp-btn-toolbar" style="display: inline-block;">
    
                                                <span class="mdi mdi-filter"></span>
    
                                            </el-button>
    
                                        </el-tooltip>
    
                                    </el-col>
    
                                </el-row>
    
                            </el-col>
    
                        </el-row>
    
                    </el-menu>
    
                    <div>
    
                        <filter-form v-if="isFilter" @setFilterData="setFilterData" :columns="filterColumns"></filter-form>
    
                    </div>
    
                    <div class="kp-form-area kp-tabs" v-loading="!isTableParamReady">
    
                        <el-tabs v-if="isTableParamReady" class="kp-form-tabs-panel tab-container" v-model="activeTabName" type="card">
    
                            <el-tab-pane class="kp-tabs-body" v-for="tab in tableTabs" v-bind:key="tab.id" :name="tab.tab_name">
    
                                <span slot="label">
    
                    {{tab.tab_label}}
    
                    <el-badge :value="tab.tabCount" color="success" type="success"></el-badge>
    
                  </span>
    
                                <data-table :parameters="tab" :ref="tab.tab_name"></data-table>
    
                            </el-tab-pane>
    
                        </el-tabs>
    
                    </div>
    
                </div>
    
            </div>
    
            <!-- right block -->
    
        </div>
    
        <div v-if="showDocumentView">
    
            <!-- <document-view v-bind:showDocumentView.sync="showDocumentView" :propData="documentViewParams" > </document-view> -->
    
        </div>
    
    </el-main>
</template>

<script>
import DataTable from "../../components/DataTable.vue";
// import DocumentView from "./DocumentView.vue";
import Upload from "../../components/Upload";
import TableAPIService from "../../services/TableAPIService";
import AjaxService from "../../services/AjaxService";
import { Loading } from "element-ui";
import DocumentService from "@/doc-ex/services/DocumentService";
import _ from "lodash";
import EventBus from "@/EventBus";
import Constants from "@/resources/Constants";
import FilterForm from "@/components/Filter.vue";
import { debounce } from "debounce";

let tblData = {};

export default {
    name: "DocumentList",
    components: {
        DataTable,
        // DocumentView,
        Loading,
        FilterForm,
        Upload

    },
    watch: {
        folderSearch(val) {
            this.$refs.tree.filter(val.toLowerCase().trim());

        },
        showDocumentView(val) {
            if (!val) this.refreshTables()
        }
    },
    computed: {
        getValidDocType() {
            return Constants.DOCEX.VALID_FILE_TYPES.join(",")
        }
    },
    data() {
        return {

            documentViewParams: {},
            showDocumentView: false,
            storageFilter: '',
            folderSearch: '',
            extraction_timeout_object: '',
            activeTabName: 'uploaded',
            isFilter: false,
            pageTitle: "Document Extraction",
            searchText: "",
            filterColumns: [],
            loadingInstance: null,
            outerVisible: false,
            displayFolderDialog: false,
            folderName: "My_documents",
            isRootFolder: false,
            isTableParamReady: false,
            invalidFolderName: false,
            directoryData: [],
            fileData: [],
            allowMultipleUpload: true,
            clickedNode: {},
            props: {
                label: "name",
                children: "children",
                isLeaf: "leaf",
            },
            document_type: this.document_type,
            displayUploadDialog: false,
            uploadParams: {},
            publishDialogVisible: false,
            retryPublishData: {},
            tableTabs: [{
                    id: 1,
                    index: 0,
                    tabCount: 0,
                    event_name: 'docex_uploaded',
                    showTableToolbar: false,
                    isRegxSearch: true,
                    count_event: 'uploadedCount',
                    apiName: `/portal/api/table/de_document`,
                    tableName: "de_document",
                    initialSort: "-created_at",
                    isRestify: true,
                    queryParam: {
                        status: Constants.DOCEX.STATUS.UPLOADED,
                        active: true,
                        document_type: this.$route.meta.document_type,
                        storage_folder_path: { "$regex": ".*/My_documents$" }
                    },
                    limit: 10,
                    allowInline: false,
                    tab_label: "Received",
                    tab_name: "uploaded",
                    addButtonConfig: false,
                    actionItems: [{
                            icon: "el-icon-refresh",
                            name: "Retry",
                            event_name: "retry_document",
                            inline: true
                        },
                        {
                            icon: "mdi mdi-arrow-down-thin-circle-outline",
                            name: "Download",
                            event_name: "download_document",
                            hideCondition: (propData) =>
                                propData.row.extraction_status != Constants.DOCEX.EXTRACTION_STATUS.IN_PROGRESS ?
                                false :
                                true,
                        }
                    ]
                },
                {
                    id: 2,
                    index: 1,
                    tabCount: 0,
                    event_name: 'docex_invalid',
                    showTableToolbar: false,
                    isRegxSearch: true,
                    count_event: 'invalidCount',
                    apiName: `/portal/api/table/de_document`,
                    tableName: "invalid_documents",
                    initialSort: "-created_at",
                    isRestify: true,
                    queryParam: {
                        status: { '$in': Constants.DOCEX.STATUS.INVALID },
                        active: true,
                        document_type: this.$route.meta.document_type,
                        storage_folder_path: { "$regex": ".*/My_documents$" }
                    },
                    limit: 10,
                    allowInline: false,
                    tab_label: "Invalid",
                    tab_name: "invalid",
                    addButtonConfig: false,
                    actionItems: [{
                        icon: "mdi mdi-arrow-down-thin-circle-outline",
                        name: "Download",
                        event_name: "download_document",
                        hideCondition: (propData) =>
                            propData.row.extraction_status != Constants.DOCEX.EXTRACTION_STATUS.IN_PROGRESS ?
                            false :
                            true,
                    }]
                },
                {
                    id: 3,
                    index: 2,
                    tabCount: 0,
                    event_name: 'docex_confirmed',
                    showTableToolbar: false,
                    isRegxSearch: true,
                    count_event: 'confirmCount',
                    apiName: `/portal/api/table/de_document`,
                    tableName: "de_document_confirm",
                    initialSort: "-updated_at",
                    isRestify: true,
                    queryParam: {
                        status: Constants.DOCEX.STATUS.CONFIRMED,
                        active: true,
                        document_type: this.$route.meta.document_type,
                        storage_folder_path: { "$regex": ".*/My_documents$" }
                    },
                    limit: 10,
                    allowInline: false,
                    tab_label: "Reviewed",
                    tab_name: "confirmed",
                    addButtonConfig: false,
                    actionItems: [
                        // {
                        //   icon: "el-icon-refresh-right",
                        //   name: "Retry",
                        //   event_name: "retry_document",
                        //   hideCondition: (propData) =>
                        //     propData.row.extraction_status == Constants.DOCEX.EXTRACTION_STATUS.FAILED
                        //       ? false
                        //       : true,
                        // },
                        {
                            icon: "mdi mdi-arrow-down-thin-circle-outline",
                            name: "Download",
                            event_name: "download_document",
                            hideCondition: (propData) =>
                                propData.row.extraction_status != Constants.DOCEX.EXTRACTION_STATUS.IN_PROGRESS ?
                                false :
                                true,
                        }
                    ]
                },
                {
                    id: 4,
                    index: 3,
                    tabCount: 0,
                    event_name: 'docex_published',
                    isRegxSearch: true,
                    showTableToolbar: false,
                    count_event: 'publishCount',
                    apiName: `/portal/api/table/de_document`,
                    tableName: "de_document_publish",
                    initialSort: "-created_at",
                    isRestify: true,
                    queryParam: {
                        status: Constants.DOCEX.STATUS.PUBLISHED,
                        active: true,
                        document_type: this.$route.meta.document_type,
                        storage_folder_path: { "$regex": ".*/My_documents/Invoices_Set_1$" }
                    },
                    limit: 10,
                    allowInline: false,
                    tab_label: "Published",
                    tab_name: "success",
                    addButtonConfig: false,
                    actionItems: [{
                            icon: "mdi mdi-arrow-down-thin-circle-outline",
                            name: "Download",
                            event_name: "download_document",
                            hideCondition: (propData) =>
                                propData.row.extraction_status != Constants.DOCEX.EXTRACTION_STATUS.IN_PROGRESS ?
                                false :
                                true,
                        },
                        {
                            icon: "el-icon-refresh",
                            name: "Retry",
                            event_name: "retry_publish",
                            hideCondition: (propData) => {
                                let isPublisher = false;
                                let isAdmin = false;
                                let user = this.$store.getters.user;
                                if (user.roles.includes(Constants.DOCEX.ROLES_MAP.IDP_PUBLISHER) || user.roles.includes(Constants.DOCEX.ROLES_MAP.IDP_PUBLISHER_ONLY)) isPublisher = true
                                if (user.roles.includes(Constants.DOCEX.ROLES_MAP.IDP_CUSTOMER_ADMIN)) isAdmin = true
                                return ((isPublisher || isAdmin) && (propData.row.publish_status === Constants.DOCEX.PUBLISH_STATUS.FAILED)) ?
                                    false :
                                    true
                            }
                        },
                        {
                            icon: "mdi mdi-export",
                            name: "Export",
                            event_name: "export_data",
                            hideCondition: (propData) =>
                                propData.row.publish_status == Constants.DOCEX.PUBLISH_STATUS.SUCCESS ?
                                false :
                                true,
                        }
                    ]
                },
            ],
            allBusEvents: []
        };
    },
    methods: {
        filterNode(value, data) {
            if (!value) return true;
            return data.name.toLowerCase().indexOf(value) !== -1;
        },
        handlePublishDialogClose() {
            this.publishDialogVisible = false;
        },
        setFilterData(data) {
            for (let key in this.tableTabs) {
                this.$refs[this.tableTabs[key].tab_name][0].setFilterData(data);
            }
        },
        onSearch: debounce(function(searchText) {
            for (let key in this.tableTabs) {
                this.$refs[this.tableTabs[key].tab_name][0].globalSearch(this.searchText);
            }
        }, 1000),
        closeDialog() {
            this.$emit('closeDialog');
        },
        openFolderDialogBox(event, isRoot) {
            this.isRootFolder = isRoot ? true : false;
            this.folderName = "";
            this.displayFolderDialog = true;
        },
        applyFilter() {
            this.filterColumns = this.$refs[this.activeTabName][0].getFilterColumns();
            this.isFilter = !this.isFilter;
        },
        async createFolder() {
            this.displayFolderDialog = false;
            let createdNode = {};
            let directoryPath = this.clickedNode ? this.getDirectoryPath(this.$refs.tree.getNode(this.clickedNode)) : null;
            directoryPath = (!this.isRootFolder && directoryPath) ? `${directoryPath}/${this.folderName}/` : `/${this.folderName}/`
            let currentNodeId = this.isRootFolder ? null : (this.clickedNode && this.clickedNode.id)
            let response = await DocumentService.createFolder({ directory: directoryPath, document_type: this.document_type, current_node_id: currentNodeId });
            this.isRootFolder = false;
            if (response.data.statusCode !== 200 || (response.data.data && !response.data.data.status)) {
                this.notifyError(`Error while creating folder '${this.folderName}'`);
                return;
            }
            if (!response.data.data.result) {
                this.notifyError(`'${this.folderName}' already exists. Duplicate folder cannot be created.`);
                return;
            }
            if (response.data.data.current_node_id) {
                createdNode = { "name": this.folderName, id: response.data.data.id }
                this.$refs.tree.append(createdNode, this.$refs.tree.getNode(response.data.data.current_node_id));
                this.$refs.tree.setCurrentKey(response.data.data.id)
                this.clickedNode = createdNode;
                this.updateTable(this.getDirectoryPath(this.$refs.tree.getNode(this.clickedNode)));
                return;
            }
            createdNode = { "name": this.folderName, "id": response.data.data.id }
            this.directoryData.push(createdNode)
            this.$nextTick(() => {
                this.$refs.tree.setCurrentKey(response.data.data.id)
                this.clickedNode = createdNode;
            })
            this.updateTable('/' + this.folderName);
            return createdNode.id;
        },
        async deleteEmptyFolder() {
            if (!this.clickedNode.id) {
                this.notifyError("Please select a folder to delete.");
                return;
            }
            let directoryPath = this.getDirectoryPath(this.$refs.tree.getNode(this.clickedNode));
            let response = await DocumentService.deleteEmptyFolder({ directory: directoryPath, document_type: this.document_type, current_node_id: this.clickedNode.id });
            if (response.data.statusCode !== 200 || (response.data.data && !response.data.data.status)) {
                this.notifyError(`Error occurred while deleting folder '${this.folderName}'`);
                return;
            } else if (response.data.data.result) {
                this.$refs.tree.remove(this.$refs.tree.getNode(response.data.data.current_node_id));
                this.notifySuccess(`Selected folder deleted successfully.`);
                return;
            }
            this.notifyError("The folder you are trying to delete is not empty.");
        },
        async handleNodeClick(data) {
            this.clickedNode = data
            let directoryPath = this.getDirectoryPath(this.$refs.tree.getNode(data));
            this.updateTable(directoryPath);
            let response = await DocumentService.getDirectories({ directory: directoryPath, document_type: this.document_type, current_node_id: this.clickedNode.id });
            this.appendChildDirectories(response)

            clearTimeout(this.extraction_timeout_object);
            this.checkExtractionStatus();
        },
        onCurrentNodeChange(currentNode, nodeProperty) {
            console.log("=======================onCurrentNodeChange====================")
        },
        refreshTables() {
            for (let key in this.tableTabs) {
                this.$refs[this.tableTabs[key].tab_name][0].refreshTable();
            }
        },
        updateTable(storage_folder_path) {
            this.storageFilter = { storage_folder_path: { '$regex': '.*' + storage_folder_path + '$' } }
            for (let key in this.tableTabs) {
                this.$refs[this.tableTabs[key].tab_name][0].updateTableFiler(this.storageFilter)
                this.$refs[this.tableTabs[key].tab_name][0].setQueryParam(this.storageFilter);
            }
        },
        appendChildDirectories(directoryResponse) {
            if (directoryResponse.data.result && (directoryResponse.data.result).length) {
                if (!this.clickedNode.children)
                    this.clickedNode.children = [];
                this.$refs.tree.updateKeyChildren(directoryResponse.data.current_node_id, directoryResponse.data.result);
            }
        },
        getDirectoryPath(node) {
            if (!node) return;
            let directoryPath = '';
            var key = "parent";
            while (_.get(node, key).parent) {
                directoryPath = "/" + _.get(node, key).data.name + directoryPath;
                key += ".parent";
            }
            directoryPath = directoryPath + "/" + node.data.name
            return directoryPath;
        },
        async downloadFile(record) {
            let params = {
                file_name: record.row.original_file_name,
                document_type: this.document_type,
                storage_folder_path: record.row.storage_folder_path,
                original_file_name:_.get(record.row,"file_name"), //Added for downloading html file
                file_type:_.get(record.row,"file_type")////Added for downloading html file
            }
            try {
                let directoryResponse = await DocumentService.downloadDocument(params);

            } catch (e) {
                this.notifyError("Something went wrong.");
            }
            // let endPoint = `${window.location.origin}/portal/api/storage-files?file_name=${record.row.original_file_name}&document_type=${this.document_type}&storage_folder_path=${record.row.storage_folder_path}`
            // window.open(endPoint, '_self')
        },
        uploadDocument() {
            if (!this.clickedNode.id) {
                this.notifyError("Please select a folder to upload a file.");
                return;
            }
            this.uploadParams = {
                service_name: "docExService",
                document_type: this.document_type,
                directory_path: this.getDirectoryPath(this.$refs.tree.getNode(this.clickedNode))
            }
            this.displayUploadDialog = true;
        },
        async retryExtraction(data) {
            try {
                let params = {
                    storage_folder_path: data.row.storage_folder_path,
                    original_file_name: data.row.original_file_name,
                    id: data.row._id,
                    document_type: data.row.document_type
                };

                // Show table Loader
                ///this.$refs[this.activeTabName][0].isDataLoading = true;
                this.$setLoader({
                    target: `tbody tr:nth-child(${data.index + 1})  .status`,
                    spinner: "el-icon-loading"
                })
                let retryResponse = await DocumentService.retry(params);
                !_.get(retryResponse, 'data.data.status') ? this.notifyError("Something went wrong.") : null;
                // refresh table
                _.get(retryResponse, 'data.data.data') ? this.$refs[this.activeTabName][0].refreshRow(_.get(retryResponse, 'data.data.data'), data.index) : null;
                // this.notifySuccess();
            } catch (e) {
                console.log(e)
                this.notifyError("Something went wrong.");
            } finally {
                this.$resetLoader()
            }
        },
        async retryPublish(data) {
            this.retryPublishData.document_id = data.row._id
            this.retryPublishData.document_type = data.row.document_type
            this.publishDialogVisible = true
        },

        exportData(data) {
            DocumentService.exportData('json', data.row._id)
        },
        registerEvents() {
            this.allBusEvents = ["openDocument", "retry_document", "download_document", "retry_publish", "export_data"]
            EventBus.$on("openDocument", (data) => {
                this.renderDocexCanvas(data)
            });
            EventBus.$on("retry_document", (data) => {
                this.retryExtraction(data);
            });
            EventBus.$on("retry_publish", (data) => {
                this.retryPublish(data);
            });
            EventBus.$on("download_document", (data) => {
                this.downloadFile(data);
            });
            EventBus.$on("export_data", (data) => {
                this.exportData(data);
            });

            for (var tab in this.tableTabs) {
                let event = this.tableTabs[tab].count_event
                this.allBusEvents.push(event);
                EventBus.$on(event, (data) => {
                    this.tableTabs[data.index].tabCount = data.count;
                });
            }

        },
        deRegisterEvents() {
            EventBus.$off(this.allBusEvents);
        },
        closeUploadDialog() {
            this.displayUploadDialog = false;
            this.refreshTables();
        },
        processTableParams(folder_name) {
            for (let i = 0; i < this.tableTabs.length; i++) {
                this.tableTabs[i].queryParam.storage_folder_path = { "$regex": `.*/${folder_name}$` }
            }
            this.isTableParamReady = true;
        },
        async init() {
            let nodeId = null;
            let directoryResponse = await DocumentService.getDirectories({ directory: "", document_type: this.document_type });
            let directoryResponseData = directoryResponse.data.status && directoryResponse.data.result;
            if (directoryResponseData && directoryResponseData.length) this.directoryData = directoryResponseData
            else nodeId = await this.createFolder();
            const initialNodeName = this.$route.meta.parentFolderName || (this.directoryData[0].name);
            if (initialNodeName) this.processTableParams(initialNodeName);
            //Finding the node with name as initialNodeName in the current tree data
            const initialNode = _.find(this.directoryData, { 'name': initialNodeName })
            //nodeId: for which node to append the directory data to
            nodeId = initialNode && initialNode.id || nodeId;
            if (nodeId) {
                let response = await DocumentService.getDirectories({ directory: `/${initialNodeName}/`, document_type: this.document_type, current_node_id: nodeId });
                this.appendChildDirectories(response)
            }
            this.$refs.tree.setCurrentKey(nodeId)
            this.clickedNode = initialNode;
            this.checkExtractionStatus();
        },
        renderDocexCanvas(data) {
            this.documentViewParams = { id: data._id, documentType: data.document_type, storagePath: data.storage_folder_path, status: data.status, rejection_note: data.rejection_note, approval_status: data.approval_status };
            this.showDocumentView = true;
            // this.$router.push({ path: "/invoice-document-view",query: { id: data._id, documentType:data.document_type, storagePath: data.storage_folder_path, status: data.status}});
        },
        async checkExtractionStatus() {
            let uploaded_tab = this.tableTabs[0];
            // Check if Any progress extraction
            let inProgressExtraction = _.filter(this.$refs[uploaded_tab.tab_name][0].rows, (item) => {
                if (item.extraction_status == Constants.DOCEX.EXTRACTION_STATUS.IN_PROGRESS || item.extraction_status == Constants.DOCEX.EXTRACTION_STATUS.REQUESTED || item.extraction_status == Constants.DOCEX.EXTRACTION_STATUS.EXTRACTED) return item
            });

            if (inProgressExtraction.length) {
                // Get all Updated Records
                let response = await DocumentService.getExtractedDocument({ 'document_id': { "$in": _.map(inProgressExtraction, '_id') } });

                // Get all Extraction completed records
                let extractedDocument = _.filter(response, item => {
                    if (item.extraction_status != Constants.DOCEX.EXTRACTION_STATUS.EXTRACTED && item.extraction_status != Constants.DOCEX.EXTRACTION_STATUS.IN_PROGRESS && item.extraction_status != Constants.DOCEX.EXTRACTION_STATUS.REQUESTED) return item;
                });

                // Update in Datatable of extracted records
                for (var key in extractedDocument) {
                    EventBus.$emit("updateTable" + uploaded_tab.event_name, {
                        updateProperty: ['status', 'extraction_status'],
                        response: extractedDocument[key],
                        _id: extractedDocument[key]._id
                    });
                }

            }
            this.extraction_timeout_object = setTimeout(_ => {
                this.checkExtractionStatus();
            }, Constants.DOCEX.EXTRACTION_REFRESH_TIME || 5000);

        },
        async getDocumentById(documentId) {
            try {
                const document = await DocumentService.fetchById(documentId);
                return document;
            } catch (error) {
                console.error(error);
            }
        }
    },

    async beforeMount() {
        this.document_type = this.$route.params.documentType;
        const urlParams = new URLSearchParams(window.location.search);
        const documentId = urlParams.get("id");
        if (documentId) {
            const document = await this.getDocumentById(documentId);
            this.renderDocexCanvas(document)
        }
        this.init();
        this.registerEvents();
    },
    // mounted(){
    //   window.addEventListener("resize", _=>{
    //     document.getElementsByClassName('el-tree')[0].style.height =  (0.53 *document.getElementsByTagName('body')[0].scrollWidth) + 'px'
    //   });
    // },
    beforeDestroy() {
        this.deRegisterEvents();
        // window.removeEventListener("resize");
        clearTimeout(this.extraction_timeout_object)
    },
};
</script>


<style lang="scss">
@import "../../assets/scss/_variables";
.kp-container {
    height: 100%;
}

.el-dialog {
    width: 58%;
}

// folder style
.container {
    height: 100%;
    clear: both;
}

.kp-container {
    .left-block {
        width: 20%;
        display: inline-block;
        height: 100%; // border: 1px solid red;
        //     overflow-y: scroll;
    }
}

.right-block {
    width: 77%;
    display: inline-block;
    float: right;
}

.folder-wrap {
    background: #ffffff;
    -webkit-box-shadow: 0 0px 11px rgba(0, 0, 0, 0.1);
    box-shadow: 0 0px 11px rgba(0, 0, 0, 0.1);
    border-radius: 7px;
    overflow: auto;
    margin-top: 16px; // height: 100%;
    // min-height: 40%;
    // max-height: 90%;
    .el-tree {
        // height: unset;
        height: unset;
        max-height: 65vh;
        min-height: 20vh;
    }
    .top-section {
        border-bottom: 1px solid #e7e7e7; // padding: 16px;
        clear: both;
        .kp-btn-addfolder {
            padding-left: 5px !important;
        }
        .el-button {
            padding: 18px 12px;
            font-size: 22px;
            border: 0;
            color: #005DA6;
            margin: 0;
            display: inline-block;
        }
        .right-btn {
            float: left;
        }
    }
    .el-tree-node {
        /* white-space: nowrap; */
        outline: none;
        border-bottom: 0px solid #e7e7e7;
        .el-tree-node__content {
            padding: 7px 0;
            border-bottom: 1px solid #efebeb;
            border-radius: 4px;
            .el-tree-node__label {
                color: #939aa7;
            }
            .el-tree-node__expand-icon.is-leaf {
                color: #939aa7;
            }
        }
    }
    .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
        font-weight: bold;
        background-color: white;
        .el-tree-node__label {
            color: #00A7E0 !important;
        }
    }
    .el-tree-node__label {
        font-size: 14px;
        font-style: italic;
    }
    .el-tree-node__children {
        .el-tree-node {
            border-bottom: 0 !important;
        }
    }
    .el-tree-node>.el-tree-node__children {
        background: #f7f7f7;
    }
}

// folder style
.folder-modal-container {
    text-align: center;
    .folder-name-save {
        text-align: left;
    }
    .folder-name-validation {
        color: red;
        font-size: 12px;
    }
    .space-toolbar {
        font-size: 0.1px;
        display: inline-block;
    }
}

.tab-container {
    .el-badge__content {
        width: 25px;
    }
}

.kp-form-tabs-panel {
    margin-top: -9px !important;
}

.el-tree {
    height: 400px;
    overflow-y: auto !important;
}

.el-tree::-webkit-scrollbar {
    width: 5px;
    height: 5px;
    border-radius: 100px;
    position: relative;
}

.el-tree::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px #d0d0d0;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 100px;
}

/* Track */

.el-tree::-webkit-scrollbar-track {
    //   background: #ffffff;
    border-radius: 100px;
}

/* Handle on hover */

.el-tree::-webkit-scrollbar-thumb:hover {
    background-color: rgba(0, 0, 0, 0.5);
}

.folder-search-container {
    margin-left: 5%;
    margin-right: 3%;
    margin-top: 4%;
}
</style>
