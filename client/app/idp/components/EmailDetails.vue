<template>
  <div  v-loading="showLoader" class="email-details-container">
    <!-- subject division -->
    <div class="email-subject">
      <div class="subject-icon">
        <i class="mdi mdi-email-outline"></i>
      </div>
      <div class="subject-details">
        <div class="email-id">{{form.subject}}</div>
        <div class="email-date">{{form.date | formatDate}}</div>
      </div>
    </div>
    <!-- to msg  -->
    <div class="email-from">
      <avatar key="key" :showStatus="true" :showClose="false" v-bind="prepareAvatarObject()"></avatar>
      <div class="avtar-details">
        <span class="email-user-name"> {{form.from_user}}</span>
      </div>
    </div>
    <div class="email-container">
      <div class="wrap">
        <div class="label">TO</div>
        <div class="email-name"><div class='status-circle' ></div>{{form.to}}</div>
      </div>
    </div>
    <div class="email-container"  v-if="form.cc">
      <div class="wrap">
        <div class="label">CC</div>
        <div class="email-name"><div class='status-circle' ></div>{{form.cc}}</div>
      </div>
    </div>
      <div class="attached-file-list" style="">
        <el-tag 
            style="margin-right: 5px;margin-top: 5px;"
            size="small" 
            v-for="(file,i) in attachments" :key="i"
            :type="i">
            <a @click.prevent="downloadAttachment(file)"><i class="mdi mdi-download"></i> {{file.file_name}}</a>
        </el-tag>
      </div>     
    <div v-if="form.body" class="email-body" type="text" v-dompurify-html="form.body"> </div>
    <div v-if="!form.body" class="email-body" type="text" v-dompurify-html="bodyContent"> </div>
  </div>
</template>

<script>
import DocumentService from "@/idp/services/DocumentService";
import Avatar from "@/idp/components/chat/components/Avatar.vue";
import VueAvatar from "vue-avatar";
import VueDOMPurifyHTML from 'vue-dompurify-html'
import moment from "moment-timezone"
export default {
  name: "EmailDetails",
  components: {
    Avatar,
    VueAvatar,
    VueDOMPurifyHTML
  },
  props: ["messageId","docIds","parentDocId"],
  filters:{
    formatDate(value){
        if (!value) return '';
        return moment(value).format('DD MMM YYYY | LT')
    }
  },
  data() {
    return {
      emailResponse:{},
      showLoader:true,
      attachments:[],
      bodyContent : "The content of the email is deleted once the document is published.",
      form: {
        to: "",
        from: "",
        cc: "",
        subject: "",
        body: "",
      },
    };
  },
  computed: {},
  watch: {
    messageId: {
      handler: async function (newVal, oldval) {
        if (_.isEmpty(newVal) ) {
          return;
        }
        await this.showEmailData();
      },
      deep: true,
      immediate: true,
    },
   
  },
  methods: {
    async showEmailData() {   
      if(!this.messageId){
        this.notifyError("Error while processing");
        this.showLoader = false;
        return;
      }
      this.showLoader = true; 
      // independent API call parallelly 

      // We're passing document ids array from emailDetailsPopup
      // if that is present then assign it else normal flow will execute
      let docIds = Array.isArray(this.docIds) ? this.docIds : [this.docIds];
      
      this.parentDocId && docIds.push(this.parentDocId)
      const [emailResponse, emailAttachmentResponse] = await Promise.all([
        DocumentService.getEmailInfo({_id:this.messageId},null,['email_info']),
        DocumentService.getEmailAttachments({"email_id":this.messageId,"doc_ids":docIds})
      ])
      this.attachments = emailAttachmentResponse.data.status ? emailAttachmentResponse.data.attachments : []
      this.emailResponse = _.get(emailResponse, 'email_info', {})
      this.showLoader = false;
      this.form = {
        body : this.emailResponse.body,
        to : this.emailResponse.to,
        from_name : this.emailResponse.from_name,
        from_email : this.emailResponse.from_email,
        from_user : this.emailResponse.from_name, 
        from_emil : this.emailResponse.from_email,
        cc : this.emailResponse.cc,
        date : this.emailResponse.sent_date,
        subject : this.emailResponse.subject,
      };
    },
    async downloadAttachment(file){
      try {
          const params = {
            file_name: file.original_file_name,
            storage_folder_path: file.storage_folder_path
          };
          await DocumentService.downloadDocument(params);
        } catch (e) {
          console.log(e);
          this.notifyError("Something went wrong while downloading attachment.");
        }
    },
    prepareAvatarObject() {
      return {
          userId : this.form.from_name,
          username :  this.form.from_name.toString(),
          userEmail :  this.form.from_email.toString(),
          src : this.form.avatar,
          size : 30,
          status : {}
      };
    },
  },
};
</script>
<style lang="scss">
@import "../_idpVariables";
@import "../_idpGlobal";

.email-details-container {
   overflow: auto;
    height: 100%;
    margin-left: 2rem;
    margin-top: 1.5rem;

    .email-container {
         padding-left: 6.7rem;
      font-size: var(--font-base);
      margin-top: 1rem;
      margin-top: 0.5rem;
        .wrap {
          display: flex;
            .label {
              padding-right: .6rem;
              font-size: var(--font-sm-5);
              font-weight: 500;
              color: var(--dark-02);
            }
            .email-name {
              font-weight: 400;
                padding-left: 1rem;
              position: relative;
                    .status-circle {
                        width: 10px;
                        height: 10px;
                        border-radius: 50%;
                        border: 1px solid white;
                        background-color: var(--yellow-05);
                        top: 4px;
                        left: 0px;
                        position: absolute;
                    }
            }
            
        }
    }

    .email-subject {
       
        font-weight: 500;
        display: flex;
        .mdi {
          display: inline-block;
             margin-right: 0.5rem;
          font-size: 1.7rem;
          vertical-align: middle;
          color: var(--brand-04);
           margin-top: -3px;
          position: relative;
        }
        .email-id {
           font-size: var(--font-lg);
            color: var(--brand-04);
        }
        .email-date{
          font-size: var(--font-sm-5); 
          color: var(--dark-04);
          font-weight: 400;
        }
    }
    .avatar-wrapper {
      margin-right: .7rem;
    }
    .icon-container {
          transform: scale(1.3);
    position: relative;
    }
    .email-from{
       align-items: center;
    // margin-left: 24px;
    margin-top: 2rem;
    display: flex;
    padding-left: 30px;
      .avtar-details {
         font-size: var(--font-base);
         margin-left: 0.5rem;
          .email-user-name {
                font-size: var(--font-sm-5);
                color: var(--dark-03);
                font-weight: 500;
          }
          .user-email {
             color: var(--dark-02);
             font-size: var(--font-md);
             font-weight: 500;
             display: block;
          }
      }
    }
    .email-to{
      font-size: 12px;
    margin: 0px;
    padding-left: 89px;
      
    }
   
    .email-body{
      overflow: scroll;
     font-size: var(--font-base);
        margin-top: 2rem;
    background: rgb(255, 255, 255);
    padding: 22px;
    margin-right: 1rem;
    }
}
</style>