<template>
    <div class="comment-container">
        <div class="attached-file">
            <div class="attached-file-list" style="">    
                <el-tag size="small" 
                    v-for="(file,i) in attachments" :key="i"
                    :closable = "true"
                    :type="i"
                    @close="removeAttachment(file)">
                    <a @click.prevent="downloadAttachment(file)"><i class="mdi mdi-download"></i> {{file.file_name}}</a>
                </el-tag>
            </div>
            <div>
                <el-button class="btn-attach" plain size="mini" cid="idp-add-comment-attachtment" @click="showDialog" :disabled="disabled">
                <i class="mdi mdi-cloud-upload"></i> Add Attachment</el-button> 
            </div>
        </div>    
        <upload
            v-if="showModal"
            ref="upload"
            :handler = "handler"
            @closeDialog="closeDialog"
            :data="uploadParams"
            :multiple="true"
          ></upload>        
    </div>
</template>

<script>
import _ from "lodash";
import CustomerConfig from "@/idp/services/DeCustomerConfig";
import AttachmentService from "@/idp/services/AttachmentService";
import Upload from "@/idp/components/IdpUpload";
import EventBus from "@/EventBus";
import Constants from "@/resources/Constants";

export default {
    name: "FormAttachments",
    props:{
        documentId : String,
        documentType: String,
        disabled: Boolean,
        viewType:String
    },
    data() {
    return {
        comment:'',
        handler:'attachment',
        showModal: false,
        attachments:[],
        uploadParams: {},
        customerConfiguration:[]
    };
    },
    methods: {
        showDialog() {
            this.showModal = true;
            this.$forceUpdate()
        },
        async closeDialog() {
            this.showModal = false;
            this.$refs.upload.$refs.upload.fileList = [];
            this.$refs.upload.$refs.upload.outputData = [];
            this.attachments = await this.getAllAttachments()
        },
        async getAllAttachments(){
            try{
                const attachments = await AttachmentService.getAllAttachments(this.documentId)
                if(this.attachments.length!=attachments.length){
                    this.$emit("updateAttachmentCount",attachments.length);
                }
                return attachments;
            }catch (e) {
                this.notifyError(`Something went wrong while getting attachment list: ${e.toString()}`);
            }
        },
        async removeAttachment(file){
            try{
                if(this.disabled) {
                    this.notifyError(`Form is read-only. Attachment cannot be deleted.`);
                    return;
                }
                await AttachmentService.removeAttachment(file, this.viewType)
                /**
                 * When a form contains multiple attachments and one of these attachments is being removed,
                 * it's important to display the remaining attachments on the form. 
                 * Therefore, after an attachment is removed, we retrieve and display all the remaining attachments.
                 * */
                this.attachments = await this.getAllAttachments()
            } catch (e) {
                this.notifyError(`Something went wrong while removing attachment: ${e.toString()}`);
            }
        },
        async downloadAttachment(file){
            try {
                await AttachmentService.downloadAttachment(file);
            } catch (e) {
                this.notifyError(`Something went wrong while downloading attachment: ${e.toString()}`);
            }
        },
        async handleAttachmentUpload(){
            let uploaded_attachment_length = this.$refs.upload && this.$refs.upload.fileList.length
            let configured_doc_count = _.get(this.customerConfiguration, "max_number_of_attachments_per_doc", 5) 
            let current_document_attachment_count = this.attachments && this.attachments.length
            if ((uploaded_attachment_length + current_document_attachment_count)  > (configured_doc_count)) {
                this.notifyError( `Maximum ${configured_doc_count} attachments are allowed per document`)
                return;
            }
            this.$refs.upload.$refs.upload.active = true;
        },
        async initializeAttachments(){
            //Fetch all existing attachments
            this.attachments = await this.getAllAttachments();
            //Initialize upload parameters
            this.uploadParams = {      
                service_name: "documentAttachmentService",
                document_id: this.documentId,
                document_type: this.documentType,
                directory_path: Constants.DOCEX.ATTACHMENT_PATH,
                is_manual_upload : true
            }
        },
        async setConfigurationByDocType(){
            const docTypesConfig = await CustomerConfig.getCustConfigByDocType(this.documentType);
            this.customerConfiguration = docTypesConfig;
        },
        registerEvents(){
            EventBus.$on("upload_clicked_attachment", () => {
                this.handleAttachmentUpload()
            });  
        }
    },
    beforeDestroy() {
        const busEvents= ["upload_clicked_attachment"]
        EventBus.$off(busEvents)
    },
    beforeMount() {
        this.registerEvents();
        this.setConfigurationByDocType();
        /*
        * Fetches all existing attachments
        * Initializes upload parameters
        */
        this.initializeAttachments()
    },
    components: {Upload}
}
</script>

<style lang="scss">
@import "../_idpVariables";
@import "../_idpGlobal"; 
.comment-container {
    // padding: 0 var(--space-lg);
    height: 100%;
    display: flex;
    flex-direction: column;
    .attached-file {
        display: block;
        margin: 1rem 0 var(--space-md) 0;
        // margin-top: 2rem;
        padding: var(--space-base) 2rem;
        height: 100%;
        .btn-attach {
            padding: var(--space-md);
            width: 100%;
            border: 1px dashed var(--brand-04);
            padding: 1rem;
            font-size: var(--font-md);
            margin-top: var(--space-base);
            height: 100%;
                i {
                    display: block;
                    font-size: 2.4rem;
                    color: var(--brand-04);
                    margin-bottom:var(--space-xs);
                }
                span{
                    display: block;
                }
        }

        .attached-file-list{
                margin-right: 5px;
                max-height: calc(100% - 85px);
                overflow: auto;
        }

        .el-tag {
            background: var(--white);
            font-size: var(--font-base);
            border: 0;
            margin:0 0 .3rem 0;
            border-radius: var(--radius-base);
            width: 100%;
            overflow: hidden;
            position: relative;
            padding: .5rem 3rem .5rem 1rem;
            box-shadow: 0 0px 10px 1px rgba(50, 50, 50, 0.05);
            height: auto;            
                a {
                    color: var(--dark-03);
                    text-decoration: none;
                    font-size: var(--font-base);
                    display: block;
                    width: 100%;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                        i {
                            color: var(--dark-04);
                            font-size: 1.5rem;
                            margin-right: var(--space-sm);
                            vertical-align: bottom;
                        }
                }
                .el-icon-close {
                    color: var(--dark-03);
                    background: transparent;
                    position: absolute;
                    top: .7rem;
                    right: 1rem;
                    font-size: 1.5rem;
                    transition: all ease-in-out .05s;
                        &:hover {
                            color: var(--dark-01);
                            transform: scale(1.1);
                        }
                }
            }
        }  // attached file end
}// comment container
</style>
  