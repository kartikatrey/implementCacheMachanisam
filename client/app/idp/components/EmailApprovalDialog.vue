<template>
  <div class="add-approval-dialog-container">
    <el-dialog
      :append-to-body="true"
      title="Confirm"
      class="add-approval-dialog-container"
      :visible.sync="approvalDialogVisible"
      :close-on-click-modal="false"
      width="30%"
    >
      <h3 class="title">Do you want to send for Approval?</h3>
      <el-button
        cid="form-header-back"
        class="btn-close"
        icon="mdi mdi-close"
        @click="hideDialog"
      ></el-button>
      <div class="add-approval" v-loading="loadEmails">
        <el-form
          :model="form"
          @submit.prevent.native="addApproverEmail()"
          class="input-email-form"
          ref="form"
          :rules="formRules"
        >
          <el-form-item prop="emails" label>
            <el-input
              size="medium"
              cid="email-approval-dialog-emails"
              v-model="form.emails"
              placeholder="Enter approver emails"
            >
              <el-button slot="append" @click="addApproverEmail()" size="small"
                >Add</el-button
              >
            </el-input>
          </el-form-item>

          <el-form-item prop="select all" label class="email-approval-dialog-select-all">
            <el-checkbox v-model="selectAllEmails" @change="toggleSelectAll">Select all</el-checkbox>
          </el-form-item>

        </el-form>
        <el-checkbox-group
          v-model="selectedEmails"
          class="approver-list-box-container"
        >
          <el-checkbox
            v-for="(email, index) in emails"
            :cid="'email-approval-dialog-emails_' + index"
            v-bind:key="index"
            :label="email"
          ></el-checkbox>
        </el-checkbox-group>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button
          size="small"
          cid="email-approval-dialog-not-required"
          v-if="!isApprover"
          @click="clickOnNotRequired({})"
          >Not Required</el-button
        >
        <el-button
          size="small"
          cid="email-approval-dialog-send"
          :disabled="!selectedEmails.length"
          type="primary"
          @click="confirm()"
          >Send</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import lodash from "lodash";
import Validator from "@/services/Validator";

export default {
  name: "EmailApprovalDialog",
  props: [
    "isApprover",
    "approvalDialogVisible",
    "onConfirm",
    "emailList",
    "notRequiredAction",
  ],
  data() {
    return {
      form: {
        emails: "",
      },
      formRules: {
        emails: [
          {
            trigger: "change",
            validator: Validator.emailValidator,
            allowEmpty: true,
          },
        ],
      },
      loadEmails: true,
      selectedEmails: [],
      showNotRequiredBtn: false,
      emails: [],
      selectAllEmails : false
    };
  },
  watch: {
    emailList: {
      handler: function (newVal, oldval) {
        this.emails = lodash.clone(newVal);
      },
    },
  },
  methods: {
    confirm() {
      this.$emit("onConfirm", this.selectedEmails);
    },
    hideDialog() {
      this.$emit("hide");
    },

    async addApproverEmail() {
      if (!this.form.emails) return;
      let isValid = await this.$refs.form.validate().catch((error) => {});
      
      if (!isValid) return;
      
      let emailList = this.form.emails.split(",");

      emailList.forEach((email) => {
        this.selectedEmails.unshift(email);
      });
      let trimmedArr = this.selectedEmails.map((email) => email.trim());

      this.selectedEmails = this.emails = _.uniq(trimmedArr);

      this.form.emails = "";
    },
    clickOnNotRequired() {
      this.$emit("notRequiredAction", {});
    },

    toggleSelectAll() {
      if (this.selectAllEmails) {
        this.selectedEmails = [...this.emails];
      } else {
        this.selectedEmails = [];
      }
    },
  },
  beforeMount() {
    this.emails = this.emailList;
    if (this.notRequiredAction) {
      this.showNotRequiredBtn = true;
    }
  },
};
</script>

<style lang="scss">
.add-approval-dialog-container{
  .email-approval-dialog-select-all{
    margin-bottom : 0px;
    margin-left : 8px;
  }
}
</style>
