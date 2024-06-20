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
        <el-button class="btn-attach" plain size="mini" cid="idp-add-comment-attachtment" @click="showUploadModal"  :disabled="isReviewerOnly">
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
import DocumentService from "@/idp/services/DocumentService";
import CustomerConfig from "@/idp/services/DeCustomerConfig";
import moment from 'moment'
import Upload from "@/idp/components/IdpUpload";
import EventBus from "@/EventBus";
import Constants from "@/resources/Constants";
import { mapState } from "vuex";

export default {
    name: "CommentAttachment",
    props: ["isDocumentReadOnly","docType"],
    watch: {
    // We modified the watcher property from documentData._id to documentId because, in the case of Excel, 
    // we store child IDs in documentData. Consequently, we need to retrieve attachments based on the parent document ID.
    "documentId": {
      handler: function (newVal, oldval) {
        console.log("watch:CommentAttachment:documentId",newVal,oldval)
        if(!newVal || newVal == oldval)return
        this.getAllAttachments()
      },
      immediate: true,
      deep: true,
    },
    'counts':{
       handler: function (newVal, oldval) {
        console.log("watch:CommentAttachment:counts",newVal,oldval)
        if(!newVal || newVal == oldval)return
        this.$store.commit("documentViewStore/totalCommentCount",(this.counts.commentCount || 0)+(this.counts.attachtmentCount || 0));
        // this.$emit('update:totalCommentCount', (this.counts.commentCount || 0)+(this.counts.attachtmentCount || 0))
      } 
    }
    },
    data() {
        return {
            comment:'',
            handler:'attachment',
            showModal: false,
            attachments:[],
            counts:{commentCount:0,attachtmentCount:0},
            isReviewerOnly:false,
            customerConfiguration:[]
        };
    },
    filters:{
        formateDate(value){
            if (!value) return ''
            value = moment(value, 'HH:mm');
            return  value.format('HH:mm, DD MMM YY')
        }
    },
    computed:{
        ...mapState("documentViewStore",{
            documentData: state =>state.documentData,
            documentId: state =>state.documentId,
            // customerConfiguration: state =>state.customerConfiguration,
            totalCommentCount: state => state.totalCommentCount
        }),
    
    
    
      uploadParams(){
          return {      
                    service_name: "documentAttachmentService",
                    document_id: this.documentData._id || this.documentId,
                    document_type: this.docType || this.documentData.document_type,
                    directory_path: Constants.DOCEX.ATTACHMENT_PATH,
                    is_manual_upload : true // to identify file is uploaded manually from UI
            }
    }
    },
    methods: {
               
       async getAllAttachments(){
        try{
            const parentDocId = _.get(this.documentData, "parent_document_id");
            const params = {
                'document_id':this.documentId,
                ...(parentDocId && { parent_document_id: parentDocId }),
                'reject_attachment':false,
                'active':true};
            this.attachments = await DocumentService.getDocumentAttachments(params);
            this.counts.attachtmentCount = (this.attachments || []).length;
            this.$store.commit("documentViewStore/totalCommentCount",(this.counts.commentCount || 0)+(this.counts.attachtmentCount || 0));
         }catch (e) {
          console.log(e);
          this.notifyError("Something went wrong while getting attachment list.");
        }
    },
    showUploadModal() {
      this.showModal = true;
      this.$forceUpdate()
    },
    closeDialog() {
      this.showModal = false;
      this.$refs.upload.$refs.upload.fileList = [];
      this.$refs.upload.$refs.upload.outputData = [];
      this.getAllAttachments()
    },
    async removeAttachment(file){
        try{
            let params = {'storage_file_name':file.storage_file_name,'storage_path':file.storage_path,
            customer_storage:file.customer_storage
            
            }

        
            let response = await DocumentService.removeDocumentAttachments(file._id,params)
            if (response) this.getAllAttachments()
        } catch (e) {
          console.log(e);
          this.notifyError("Something went wrong while removing attachment.");

        }
    },
    async downloadAttachment(file){
        let params = {file_name: file.storage_file_name,document_type: file.document_type,storage_folder_path: file.storage_path};
        try {
          await DocumentService.downloadDocument(params);
        } catch (e) {
          console.log(e);
          this.notifyError("Something went wrong while downloading attachment.");
        }
    },
    async handleAttachmentUpload(){
        let uploaded_attachment_length = this.$refs.upload && this.$refs.upload.fileList.length
        let configured_doc_count = this.customerConfiguration.max_number_of_attachments_per_doc
        let current_document_attachment_count = this.attachments && this.attachments.length
        if ((uploaded_attachment_length + current_document_attachment_count)  > (configured_doc_count)) {
            this.notifyError( `Maximum ${configured_doc_count} attachments are allowed per document`)
            return
        }
        this.$refs.upload.$refs.upload.active =true

    },
    async setConfiguration(){
        const docTypesConfig = await CustomerConfig.getCustConfigByDocType(this.document_type);
        if(docTypesConfig['document_type'] == this.document_type){
            this.customerConfiguration= this.document_type
            return;
        }
        this.customerConfiguration= this.$store.getters["documentViewStore/customerConfiguration"]; 
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
    beforeMount(){
        this.registerEvents();        
        //if login user role is reviewer only, then they should not not able to upload document
        let user = this.$store.getters.user; 
        this.isReviewerOnly= _.get(user,"is_reviewer_only")
        this.setConfiguration()
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
