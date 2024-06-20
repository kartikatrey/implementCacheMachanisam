<template>
  <div class="action-buttons" >
  <!-- section Properies buttons -->
  <template v-if="source=='Properties'" >
   <span  v-for="button in propertiesActionButtons" :key="button.name"> <el-button
      :id="button.name"
      size="small"
      cid="save-draft"
      type="primary"
      v-if="button.type!='dropdown'"
      v-on:click="handleAction([button])"
      :key="button._id"
      >{{ button.label }}</el-button
    ></span>
    <el-dropdown
      size="small"
      split-button
      type="primary"
      v-for="button in propertiesDropdownButtons"
      :key="button._id"
      @command="handleAction">
        {{button.label}}
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="item in button.options" :key="item.key" :command=[button,item.value] >{{item.key}}</el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown>
  </template>

    <!-- section Package bar buttons -->
    <template v-if="source=='PackageBar'">
    <span v-for="button in packageBarActionButtons" :key="button.name"><el-button
     id="action-btn"
      size="small"
      cid="save-draft"
      type="primary"
      v-if="button.type!='dropdown'"
      v-on:click="handleAction([button])"
      :key="button._id"
      >{{ button.label }}
      </el-button
    ></span>
    <span>
    <el-dropdown
      size="small"
      split-button
      type="primary"
      v-for="button in pkgDropdownButtons"
      :key="button._id"
      @command="handleAction">
        {{button.label}}
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="item in button.options" :key="item.key" :command=[button,item.value] >{{item.key}}</el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown>
  </span>
    </template>
   


  </div>
</template>

<script>
import ActionButtonConfig from "@/idp/services/ActionButtonConfig";
import _ from "lodash";
import Constants from "@/resources/Constants";
import { mapState } from "vuex";
import { getQueryFilter } from "@/util/CommonUtil";

export default {
  name: "ActionButtons",
  props: [ "isDocumentReadOnly","source"],
  watch: {},
  data() {
    return {
      clickActionMapping : {
        [Constants.PLATFORM_ACTION_BUTTON.SAVE]: this.saveDraft,
        [Constants.PLATFORM_ACTION_BUTTON.CONFIRM]: this.confirm,
        [Constants.PLATFORM_ACTION_BUTTON.PUBLISH]: this.publish,
        [Constants.PLATFORM_ACTION_BUTTON.REJECT_DOCUMENT]: this.reject,
        [Constants.PLATFORM_ACTION_BUTTON.APPROVE]: this.approveWaitingDocument,
        [Constants.PLATFORM_ACTION_BUTTON.REJECT]: this.rejectWaitingDocument,
        [Constants.PLATFORM_ACTION_BUTTON.FRAUD_CONFIRMED]: this.handleFraud,
        [Constants.PLATFORM_ACTION_BUTTON.FRAUD_REJECTED]: this.rejectFraud,
        [Constants.PLATFORM_ACTION_BUTTON.DUPLICATE]: this.duplicateDocument,
        [Constants.PLATFORM_ACTION_BUTTON.MOVE_TO_INBOX]: this.moveToInbox,
        [Constants.PLATFORM_ACTION_BUTTON.SEND_FOR_APPROVAL]: this.sendForApproval,
        [Constants.PLATFORM_ACTION_BUTTON.DELETE]: this.deleteDocument,
        [Constants.PLATFORM_ACTION_BUTTON.RESTORE]: this.restoreDocument,
        [Constants.DOCEX.TRIGGER_ACTION.COLLABORATION_SUBMIT]: this.collaborationSubmit,
        [Constants.PLATFORM_ACTION_BUTTON.MARK_AS_REVIEWED]: this.markDocumentAsReviewed,
      },
      disableActionMapping : {
        [Constants.PLATFORM_ACTION_BUTTON.SAVE]: this.isDocumentReadOnly || false,
        [Constants.PLATFORM_ACTION_BUTTON.CONFIRM]: this.isDocumentReadOnly || false,
        [Constants.PLATFORM_ACTION_BUTTON.DUPLICATE]: this.isDocumentReadOnly || false,
        [Constants.PLATFORM_ACTION_BUTTON.FRAUD_CONFIRMED]:
          this.documentData && this.documentData.stage != Constants.DOCEX.STAGE.FRAUD_FLAGGED,
        [Constants.PLATFORM_ACTION_BUTTON.FRAUD_REJECTED]:
          this.documentData && this.documentData.stage != Constants.DOCEX.STAGE.FRAUD_FLAGGED,
      }
          };
  },
  computed: {
     ...mapState("documentViewStore",{
            documentData : state => state.documentData,
     }),
      ...mapState("actionButtonStore",{
           propertiesActionButtons : state => state.propertiesActionButtons,
           packageBarActionButtons : state => state.packageBarActionButtons,
        }),
        pkgDropdownButtons(){
          return this.packageBarActionButtons.filter(btn => btn.type === 'dropdown')
        },
        propertiesDropdownButtons(){
          return this.propertiesActionButtons.filter(btn => btn.type === 'dropdown')
        }

  },
  methods: {
    handleAction([button, actionVal]){
      console.log("action button clicked !!!!!!!!!!!!!")
      if(button.is_platform){
        this.handlePlatformAction(button.name)
        return;
      }
      this.handleUserAction(button,actionVal)
      
    },
    async handleUserAction(button,actionVal) {
      this.$setLoader({
          spinner: "el-icon-loading"
      });

      const actionPayload = {
        button_id: button._id,
        document_id: _.get(this.documentData,'parent_document_id') || this.documentData._id

      };

      if(_.get(button,'type')=="dropdown"){
        const dropdownAction = button.dropdown_action
        const payload = {[dropdownAction]:actionVal}
        actionPayload["payload"] = payload
        actionPayload["document_id"] = _.get(this.documentData,'parent_document_id')
      }
      // check should_redirect enabled in de_field config for dynamic button
      if(button.should_redirect){
        //navigate to list page
        this.navigate()
      }
      // call dynamic action asynchronously, so even after redirect to list 
      //  page it will wait for response 
      ActionButtonConfig.callActionHandler(actionPayload).then((actionResponse) => {
        if(!_.get(actionResponse.data,"status") || !_.get(actionResponse.data.data.workflowData,"status",true)){
          this.$notify({
            title: "Error",
            type: "error",
            dangerouslyUseHTMLString: true,
            message: actionResponse.data.data.workflowData.msg || "Something went wrong",
            duration: 0,
          })
        }
        else{
          this.$notify({
            title: "Success",
            type: "success",
            dangerouslyUseHTMLString: true,
            message: actionResponse.data.data.workflowData.msg || "Success",
            duration: 0,
          })
        }
      }).catch((error) => {
          console.log(error);
          this.notifyError(
              `Something went wrong`
          );
      }).finally(()=>{
        this.$resetLoader();
      });
      
    },
    handlePlatformAction(name) {
      this.clickActionMapping[name]();
    },
    isDisable(name) {
      this.disableActionMapping[name];
    },
    markDocumentAsReviewed(){
      this.$emit("markAsReviewed");
    },
    saveDraft() {
      this.$emit("save", { action: Constants.DOCEX.TRIGGER_ACTION.DRAFT });
    },
    confirm() {
      this.$emit("confirm", {
        stage: Constants.DOCEX.STAGE.CONFIRMED,
        action: Constants.DOCEX.TRIGGER_ACTION.CONFIRM,
      });
    },
    publish() {
      this.$emit("publish");
    },
    collaborationSubmit() {
      this.$emit("submit", { action: Constants.DOCEX.TRIGGER_ACTION.COLLABORATION_SUBMIT });
    },
    reject() {
      this.$emit("reject");
    },
    sendForApproval(){
      this.$emit("callApprovalWorkflow");
    },
    handleFraud() {
      this.$emit("handleFraud", "confirm");
    },
    rejectFraud() {
      this.$emit("handleFraud", "reject");
    },
    duplicateDocument() {
      this.$emit("duplicateDocument");
    },
    deleteDocument(){
      this.$emit("deleteDocument");
    },
    restoreDocument(){
        this.$emit("restore")
    },
    moveToInbox() {
      this.$emit("moveToInbox", {
        stage: Constants.DOCEX.STAGE.UPLOADED,
        action: Constants.DOCEX.TRIGGER_ACTION.MOVE_TO_RECIEVED,
      });
    },
    approveWaitingDocument() {
      this.$emit("approveRejectWaitingDocument", {stage:"Approved", action:"approve"});
    },
    rejectWaitingDocument() {
      this.$emit("approveRejectWaitingDocument", {stage:"Rejected", action:"reject"});
    },

    executeClientScript(script) {
      const response = UIEventScriptService.runClientScript(script);
    },
    navigate() {
      const documentType = this.documentData.document_type
      const filter = getQueryFilter();
      const path = this.getPath(documentType) || `/idp/document/${documentType}`;
      this.$router.push({
          path,
          query: {
              filter: JSON.stringify(filter || {})
          }
      });
    },
    // route map for static list pages
		getPath(documentType) {
        const docTypeListPageRouteMap = {
            "insurance": "/idp/insurance-document-list"
        }
        return docTypeListPageRouteMap[documentType];
    },
  },

};
</script>

<style lang="scss">
.action-buttons {
  display: inline;
  margin: 10px;
  button {
    height: 2rem;
  }
}
</style>
