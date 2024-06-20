<template>
    <span>
      <el-dropdown-item :disabled="disableButton" v-if="type === 'dropdown'" :command="releaseMicroDeposits">
        <span class="action-btn dropdown-btn" :class="[icon, { green: propData.row.status === verifiedStatus }]"></span>
        <span :class="{ green: propData.row.status === verifiedStatus }" :cid="'table-action-edit-' + propData.index" >{{ label }}</span>
      </el-dropdown-item>
      <el-button
        v-else
        :disabled="disableButton"
        v-on:click="releaseMicroDeposits"
      >
        <span class="action-btn" :class="[icon, { green: verifiedStatus }]"></span>
        <span :class="{ green: propData.row.status === verifiedStatus}">{{ label }}</span>
      </el-button>
    </span>
  </template>


    <script>
    import PaymentService from "@/payments/services/PaymentSevice.js";
    import Constants from "../../resources/Constants"


    export default {
        name: "VerifyPaymentButton",
        props: ["propData", "type"],
        vendorId: '',
        vendorSiteId:'',
        paymentUserType: '',
        data() {
            return {
                label: "Verify",
                icon: "mdi mdi-bank-check",
                verifiedStatus : Constants.PAYMENTS_CONFIG.BANK_ACCOUNT_STATUS.VERIFIED
            };
        },
        computed: {
            disableButton() {
                if (this.propData.column.verifyOptions.disableFunction) {
                    return !this[this.propData.column.verifyOptions.disableFunction]();
                }
                return this.propData.row.status === Constants.PAYMENTS_CONFIG.BANK_ACCOUNT_STATUS.VERIFIED;
            },
        },
        methods: {
            releaseMicroDeposits() {
                let record = this.propData.row;
                let column = this.propData.column;
                if(record.status !== Constants.PAYMENTS_CONFIG.BANK_ACCOUNT_STATUS.VERIFIED){
                    PaymentService.call({ action: "releaseMicrodeposits", data: {account:record.id, vendor_id: this.vendorId, vendor_site_id: this.vendorSiteId} })
                }
                //added this check for paymentIntegration
                if(record.id){
                    record._id = record.id
                }
                this.$router.push(column.verifyOptions.routerPath);
                this.$store.commit("paymentStore/setBankAccountRow",this.propData.row)
            }
        },

        beforeMount() {
          this.paymentUserType = this.$store.getters['paymentStore/getPaymentUserType'];
          if(this.paymentUserType == Constants.PAYMENTS_CONFIG.USER_TYPES.VENDOR){
            this.vendorId = this.$store.getters['vendorStore/getVendorId'];
            this.vendorSiteId = this.$store.getters['vendorStore/getVendorSiteId'];
          }
            if (this.propData.row.status === Constants.PAYMENTS_CONFIG.BANK_ACCOUNT_STATUS.VERIFIED) {
                this.label = "Verified";
                this.icon = "mdi mdi-bank-check";
            } else {
                this.label = this.propData.column.verifyOptions.label || this.label;
                this.icon = this.propData.column.verifyOptions.icon || this.icon;
            }
        },

    };
    </script>

<style lang="scss">
.button-style {
  font-size: 26px !important;
  padding: 0 !important;
}

.edit-delete-button-container {
  .el-button {
    padding: 12px;
    border: 0;
    .action-btn {
      &.green {
        color: green;
      }
    }
    span {
      &.green {
        color: green;
      }
    }
  }
}
</style>
