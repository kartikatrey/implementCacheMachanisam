<template>
  <div class="verify-bank-account-container">
  <el-dialog :visible.sync="dialogVisible" :close-on-click-modal="false">
    <el-form ref="form" :model="form" :rules="rules">
            <el-divider>
              Please verify your account
            </el-divider>
      <el-row :gutter="40">
          <el-col :span="12">
            <div class="verify-bank-account-disclaimer">
               Please enter the two micro-deposit amounts made to your bank account.
            </div>
          </el-col>
      </el-row>

      <el-row :gutter="40">
        <el-col :span="12">
            <el-form-item  label="1st Credit Amount" prop="amount_1">
              <el-input v-model="form.amount_1"></el-input>
            </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="40">
        <el-col :span="12">
            <el-form-item label="2nd Credit Amount" prop="amount_2">
              <el-input v-model="form.amount_2"></el-input>
            </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="40">
        <el-col :span="12">
            <el-form-item label="Total Debit Amount">
             <el-input cid="verify-bank-account-total-debit-amount" :value="getTotalCreditAmount()" disabled></el-input>
            </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancelForm">Cancel</el-button>
      <el-button type="primary" @click="submitForm('form')">Submit</el-button>
    </div>
  </el-dialog>
  </div>
</template>


<script>
import PaymentService from "@/payments/services/PaymentSevice.js";
import Constants from "../../resources/Constants"
export default {
  name: "VerifyBankAccount",
  data() {
    return {
      dialogVisible: true,
      bankAccountId:'',
      vendorId: '',
      vendorSiteId:'',
      vendorSiteRecordId: '', //Object id of vendor site record
      paymentUserType:'',

      form: {
        amount_1: "",
        amount_2: ""
      },
      rules: {
        amount_1: [
          { required: true,
            message: 'Please enter 1st credit amount',
            trigger: 'blur' }
        ],
        amount_2: [
          { required: true,
            message: 'Please enter 2nd credit amount',
            trigger: 'blur' }
        ]
      },
    };
  },
  methods: {
    getTotalCreditAmount(){
      const totalAmount = parseFloat(this.form.amount_1) + parseFloat(this.form.amount_2);
      return totalAmount ? totalAmount : '0.0';
    },
    cancelForm() {
    this.dialogVisible = false;
    this.handleRouting();
  },
   submitForm(formName) {
    const formData = this.form
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogVisible = false;
          this.$emit('submit', this.form);
          PaymentService.call({action: "verifyMicrodeposits", data :{
            amount_1: this.form.amount_1,
            amount_2: this.form.amount_2,
            account : this.id,
            vendor_id: this.vendorId,
            vendor_site_id: this.vendorSiteId}
          });
          this.handleRouting();
        } else {
          return false;
        }
      });
    },
		handleRouting() {
			if(this.paymentUserType == Constants.PAYMENTS_CONFIG.USER_TYPES.VENDOR){
				this.vendorSiteRecordId = this.$store.getters['vendorStore/getVendorSiteRecordId'];
				this.$router.push(`/idp/vendor/vendor-site-detail?id=${this.vendorSiteRecordId}`);
			}
			else{
				this.$router.push({ path: "/payments/payment-mode" });
			}
		},
  },
  beforeMount() {
   this.id = this.$store.getters['paymentStore/getBankAccountId'];
   this.paymentUserType = this.$store.getters['paymentStore/getPaymentUserType'];
   if(this.paymentUserType == Constants.PAYMENTS_CONFIG.USER_TYPES.VENDOR){
      this.vendorId = this.$store.getters['vendorStore/getVendorId'];
      this.vendorSiteId = this.$store.getters['vendorStore/getVendorSiteId'];
   }
  },
};
</script>

<style lang="scss">
@import "../../idp/_idpGlobal.scss";
@import "../../idp/_idpVariables.scss";

.verify-bank-account-container {
    .el-form-item{
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .verify-bank-account-disclaimer {
      background-color: #E4EFFF;
      font-weight:600;
      border-radius: 3px;
      padding: 0 1.25rem;
      margin-bottom: 1rem;
    }

    .el-form-item::after , .el-form-item::before{
      content: none;
    }

  .input-box {
    width: 100%;
    margin-top: 10px;
    margin-left : 10px;
    padding: 10px;
    font-size: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .el-form-item__label {
    font-size: 12px;
    color: #606266;
  }

  .el-form{
    font-size: 12px;
    line-height:30px; 
  }

  .el-dialog {
    padding: 0;
    width: 42rem;
  }

  .el-dialog__body {
    padding: 1rem 3rem 0 !important;
  }

  .el-dialog__footer {
      padding: 1rem 3rem;
      text-align: center;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      border-top: 1px solid #DCDFE6;
      display: flex;
      justify-content: flex-end;
  }
  .el-col-12 {
      width: 100% !important;
  }
}
</style>
