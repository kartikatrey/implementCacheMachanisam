<template>
  <div >
      <el-dialog
        title="Warning"
        :visible.sync="rejectDialogVisible"
         @close = "closeRejectDialog()"
        :show-close="false"
        :close-on-click-modal="false"
        center
        element-loading-spinner="el-icon-loading"
        width="35%"
        custom-class="reject-invoive-container">
               <header>
                  <span> Send email/message </span>
                    <div class="actions">
                      <!-- <el-button type="text" round class="mdi mdi-minus" @click="minimise"></el-button> -->
                      <el-button cid="idp-reject-doc-dialog-close" type="text" round class="mdi mdi-close" @click="closeRejectDialog()"></el-button>
                    </div>
                </header>

                <div class="email-body">
                    <div class="email-details">
                        <el-form label-width="65px" @submit.prevent.native :model="form" :rules="formRules" ref="form">
                          <el-form-item label="To" prop="receiver" class="email-to inline-label-item">
                              <el-input  cid="idp-reject-doc-dialog-email-to" type="textarea" v-model="form.receiver" autocomplete="off"></el-input>
                              <!-- <el-button class="btn-acc" clear type="text">Cc</el-button> -->
                          </el-form-item>

                          <el-form-item label="Subject" class="item-subject"  prop="subject" >
                              <el-input  cid="idp-reject-doc-dialog-subject" type="text" v-model="form.subject" autocomplete="off">
                              </el-input>
                          </el-form-item>
                          <el-form-item
                                class=" item-subject reason-select-container"
                                prop="rejected_reason"
                                label="Rejected reason"
                                label-width="120px"
                              >
                                <el-select
                                  style="padding-left: 0px"
                                  class="select-box"
                                  size="small"
                                  v-model="form.rejected_reason"
                                  filterable
                                  reserve-keyword
                                  cid="reason-config-form-data-type-select"
                                  placeholder="Select reason"
                                >
                                  <el-option
                                    v-for="(reason, index) in rejectReasons"
                                    :cid="'reject-reason-form-rejected-reason_' + index"
                                    :key="reason.value"
                                    :label="reason.label"
                                    :value="reason.value"
                                     label-width="170px"
                                  ></el-option>
                                </el-select>
                              </el-form-item>
                        </el-form>
                    </div>
                    <div class="email-message">
                            <vue-editor id="message-editor" cid="idp-reject-doc-dialog-message" v-model="body" :editorToolbar="customToolbar"></vue-editor>
                    </div>

                           <div class="attached-wrap">
                                <el-tag size="small"
                                v-for="(file,i) in attachments" :key="i"
                                :closable = "!file.is_orignal_doc"
                                :type="i"
                                @close="removeAttachment(file)">
                                <a @click.prevent="downloadAttachment(file)">{{file.file_name}}</a>
                                </el-tag>
                            </div>

                </div>



              <div slot="footer" class="dialog-footer">
                <el-button class="reject-btn-send" size="medium" type="primary" cid="idp-reject-doc-dialog-send" :loading="loading" @click="send()">Send</el-button>
                <el-button class="mdi mdi-paperclip btn-attached" size="medium" cid="idp-reject-doc-dialog-attach-file" type="text" @click="showUploadModal()">Attach file</el-button>
              </div>
            </el-dialog>
            <!-- end reject invoice -->



<upload
        v-if="showModal"
        ref="upload"
        :handler = "handler"
        @closeDialog="closeUploadDialog"
        :data="uploadParams"
        :accept= "getValidDocType"
        :multiple="true"
></upload>
 </div>
</template>
<script>
import Constants from "@/resources/Constants";
import Upload from "@/idp/components/IdpUpload";
import { VueEditor } from "vue2-editor";
import EventBus from "@/EventBus";
import DocumentService from "@/idp/services/DocumentService";
import RejectReasonService from "@/idp/services/RejectReasonService";
import { mapState } from "vuex";
import _ from "lodash"

export default {
    name: "RejectDocDialog",
    components: {
        VueEditor,
        Upload
    },
    props: ["rejectDialogVisible", "isDocumentReadOnly"],
    data() {

      var EmptyValueValidator = (rule, value, callback) => {
      if (value && ("" + value).trim() === "") {
        callback(new Error("Please enter valid label name"));
      } else {
        callback();
      }}



    const emailValidator = (rule,value,callback) => {
      var emails = value;
      if(emails){
         emails = emails.split(",");
      }

      var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      for (var i = 0; i < emails.length; i++) {
          // Trim whitespaces from email address
          emails[i] = emails[i].trim();

          // Check email against our regex to determine if email is valid
          if( emails[i] == "" || ! regex.test(emails[i])){
            callback(new Error("Please enter valid email separated by ,"));
          }
      }
      callback()


    };
      return {
        attachments:[],
        rejectReasons : [],
        handler:'reject_attachment',
        showModal: false,
        body: "",
        loading:false,
        customerConfiguration:[],
        form: {
                receiver: "",
                subject:''
        },
        formRules: {
                receiver: [{
                    trigger: "change",
                    validator: emailValidator
                }, {
                          required: true,
                          message: "Please provide valid email",
                          trigger: "blur"
                        }],
                subject: [
                        {
                          validator: EmptyValueValidator,
                          trigger: "change",
                          message: "Please provide subject"
                        },
                        {
                          required: true,
                          message: "Please provide subject",
                          trigger: "change"
                        }
                      ],
                        rejected_reason:[
                        {
                          required: true,
                          message: "Please select reason",
                          trigger: "change"
                        }]
        },
        customToolbar: [
                        ['bold', 'italic', 'underline', 'strike'],
                        [{'align': ''}, {'align': 'center'}, {'align': 'right'}, {'align': 'justify'}],
                        ['blockquote', 'code-block'],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }]
                        ],

        loading: false
      };
    },
     computed :{
          ...mapState("documentViewStore",{
            documentData: state =>state.documentData,
            // customerConfiguration: state =>state.customerConfiguration,
        }),
     getValidDocType(){
       return Constants.DOCEX.VALID_FILE_TYPES.join(",")
     },
     uploadParams(){
          return {
                    service_name: "documentAttachmentService",document_id:this.documentData._id,
                    document_type: this.documentData.document_type,directory_path: Constants.DOCEX.ATTACHMENT_PATH,
                    reject_attachment : true
            }
    }
    },
    watch: {
        rejectDialogVisible: {
        handler: function (val, oldval) {
        if(val){
          this.attachments = [this.getOriginalDocument()]
          this.fetchDetails();
          }

    }
    },
    //  "documentData.document_type": {
    //         handler: function (newVal, oldval) {
    //             if(newVal || oldval){
    //                         this.fetchDetails();
    //             }
    //         },
    //         deep: true,
    //         immediate:true
    //     },
    },
    methods:{
        getOriginalDocument(){
          return {
                  'document_id':this.documentData._id,
                  'file_name':this.documentData.file_name,
                  'storage_file_name':this.documentData.original_file_name,
                  'storage_path':this.documentData.storage_folder_path,
                  'is_orignal_doc' : true
          }
    },
    closeRejectDialog(){
        this.showModal= false;
        this.$emit("hide", true);
        this.loading = false;
        this.$refs['form'].resetFields();
        this.clearDialogValues()
        _.each(this.attachments,(doc)=>{
          if(doc.reject_attachment){
            this.removeAttachment(doc)
          }
        })

    },
    showUploadModal() {
      this.showModal = true;
      this.$forceUpdate()
    },
    closeUploadDialog() {
      this.showModal = false;
      this.$refs.upload.$refs.upload.fileList = [];
      this.$refs.upload.$refs.upload.outputData = [];
      this.getRejectAttachments()
    },
    async send(){
        let isValid = await this.$refs.form.validate().catch((error) => {});
        if (!isValid) {
          this.loading = false;
          return;
        }
        this.loading = true;
        let payload = {
            'receiver':this.form.receiver,
            'subject' : this.form.subject,
            'body' : this.body,
            'document_id' : this.documentData._id,
            'rejected_reason':this.form.rejected_reason,
            'action': 'reject'
        }

			try{
				const docResponse = await DocumentService.processAction(payload)
       	if(docResponse.data.status){
					this.notifySuccess(docResponse.data.message);
          this.$emit("refreshPage");
				}else{
					this.notifyError(_.get(docResponse, "message", "Something went wrong!"))
				}
			}catch(e){
				console.log(e);
				this.notifyError("Something went wrong while rejecting document.");
			}
			finally{
				this.closeRejectDialog();
				this.clearDialogValues();

			}

    },
    clearDialogValues(){
      this.body = null
      this.form.subject = null
      this.form.receiver = null
    },
    async getRejectAttachments(){
        this.attachments = await DocumentService.getDocumentAttachments({'document_id':this.documentData._id,'reject_attachment':true,'active':true});
        this.attachments.unshift(this.getOriginalDocument())
    },
    async removeAttachment(file){
        try{
            let params = {'storage_file_name':file.storage_file_name,'storage_path':file.storage_path,
            customer_storage:file.customer_storage

            }
            let response = await DocumentService.removeDocumentAttachments(file._id,params)
            if (response) this.getRejectAttachments()
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
    },handleRejectUpload(){

        let uploaded_attachment_length = this.$refs.upload && this.$refs.upload.fileList.length
        let configured_doc_count = this.customerConfiguration && this.customerConfiguration.max_number_of_attachments_per_doc
        let current_document_attachment_count = this.attachments && this.attachments.length
        if ((current_document_attachment_count + uploaded_attachment_length)  > configured_doc_count) {
            this.notifyError( `Maximum ${configured_doc_count} attachments are allowed including original invoice`)
            return
        }
        this.$refs.upload.$refs.upload.active =true
    },
    async fetchDetails() {
      try {
        let response = await RejectReasonService.get({document_type:this.documentData["document_type"]});
        response = _.get(response, "data.data") || [];
        this.rejectReasons = _.filter(response, {document_type:this.documentData["document_type"]})
      } catch (exception) {
        console.log(exception);
      } finally {
      }
    },
 } ,
 beforeMount(){
        const documentType = _.get(this.documentData ,'document_type', '');
        this.customerConfiguration = documentType && window.kan_customer_configuration[documentType];

        EventBus.$on("upload_clicked_reject_attachment", () => {
            this.handleRejectUpload()
        });

    }
};
</script>
<style lang="scss">
@import "../_idpVariables";
@import "../_idpGlobal";

// reject invoice container start
div.el-dialog.reject-invoive-container {
  margin: 0;
  position: absolute;
  bottom: 0;
  right: 5rem;
  border-radius: .7rem .7rem 0 0;
  margin-top: 0;
  // padding: var(--space-lg);
      header {
        display: flex;
        justify-content: flex-end;
        background: 0;
        padding: 0;
          span {
            margin-left: 0;
            margin-right: auto;
            font-weight: 500;
            color: var(--dark-01);
            padding: 0;
            font-size: var(--font-lg);
          }
          .actions {
            .el-button {
              padding: 0;
              color: var(--dark-01);
              margin: 0 var(--space-sm);
              font-size: 1.4rem;
                &:Hover {
                  color: var(--brand-03);
                  font-weight: 500;
                }
            }
          }
      } // header
      .email-body {
        // padding: var(--space-lg) 0;
        white-space: normal;
          .email-details {
            .el-form-item.item-subject {
              margin-bottom: 0;
            }
              .el-form-item {
                border-bottom: 1px solid var(--dark-06);
                margin: 0;
                .el-form-item__error {
                      // margin-left: -60px;
                }
                .el-textarea {
                  .el-textarea__inner {
                        margin: 0;
                      border: 0;
                      line-height: 1.4;
                      padding: .3rem 4rem 0 0;
                      height: 32px;
                      resize: unset;
                  }
                }
                .el-form-item__label {
                  text-align: left;
                  color: var(--dark-04);
                  font-size: var(--font-base);
                  &:before {
                    display: none;
                  }
                }
                .btn-acc {
                  position: absolute;
                  right: 2rem;
                }
                  .el-form-item__content .el-input {
                    line-height: 2.6;
                        .el-input__inner {
                              padding: 1.2rem 0;
                              font-size: 1.2rem;
                            &::placeholder {
                              // color: var(--dark-01);
                              // font-size: var(--font-lg);
                            }
                        }
                        .el-input-group__prepend {
                          background: transparent;
                          border: 0;
                          padding: 0 .5rem 0 0;
                        }
                  }
                }
              // .reason-select-container {
              //         .el-form-item__content{
              //             .el-input__inner {
              //               font-size: var(--font-base) !important;
              //             &::placeholder {
              //               color: var(--dark-01);
              //               font-size: var(--font-base) !important;
              //             }
              //       }
              //   }
              // }
          } // emqail details


          .email-message {
            padding: 0;
            color: var(--dark-01);
            min-height: 200px;
            max-height: 300px;
            // overflow: auto;
              #message-editor {
                height: 160px;
                overflow: hidden;
              }
          }
          .attached-wrap {
            max-height: 100px;
            height: 73px;
            overflow: auto;
            margin-top: 1rem;
            // .attached-file {
            //   display: block;
            //   justify-content: flex-start;
            //  border-radius: unset;
            //   line-height: 3.2rem;
            //   width: 100%;
            //   overflow: hidden;
                span {
                  margin-left: 0;
                  margin-right: auto;
                  color: var(--brand-03);
                  margin-top: 0;
                  background: transparent;
                  border: 0;
                   border-bottom: 1px solid var(--dark-06);
                  font-size: var(--font-base);
                  border-radius: unset;
                  padding: .3rem 0;
                  box-sizing: content-box;
                  display: flex;
                  justify-content: flex-start;
                  font-size: var(--font-base);
                  align-items: center;
                    &:hover {
                      background: var(--dark-08);
                    }
                    a  {
                      text-decoration: none;
                      color: var(--brand-05);
                      margin-left: 0;
                      margin-right: auto;
                      white-space: nowrap;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      width: 90%;
                      padding-left: var(--space-base);
                    }
                    i {
                          margin-right: 1rem;
                              font-size: 1.35rem;
                    }
                }
                .el-button {
                  padding: 5px;
                  border: 0;
                  color: var(--brand-03);
                  font-size: 1.4rem;
                }
            // }
          }

          .reason-select-container{
            display: flex;
          }
      }
     .el-dialog__footer {
       padding: 0;
        .dialog-footer {
          text-align: left;
          padding-top: 1rem;
          display: flex;
          gap: 0.5rem;
          .reject-btn-send {
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 8rem;
          }

            .btn-attached {
              font-size: 1.3rem;
                span {
                    display: inline-block;
                    padding-left: .5rem;
                    font-size: 1.25rem;
                  }
            }
        }
     }
} // reject invoice container end

// .reject-invoive-container{
//   .reason-select-container{
//     input{
//       border-bottom: 0px;
//     }
//   }
// }

.reason-select-container {
  .el-form-item__content {
    margin-left: 0 !important;
      .el-input__inner {

            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            padding-right: 32px !important;


          font-size: var(--font-base) !important;
          background: var(--dark-08);
          border-radius: .3rem;
          color: var(--dark-03) !important;
          padding-left: var(--space-base) !important;

            &::placeholder {
              // font-size: var(--font-base) !important;
               color: var(--dark-03) !important;
            }
            .el-select__caret {
              color: var(--dark-01) !important;
            }
      }
  }
}



</style>