<template>
    <el-main class="kp-main">
      <section class="page-body">
        <div class="table-wrap">
          <DataTable v-show="isPaymentEnabled" :parameters="tableParams" :columnTemplate="bankStatusColumnTemplate"></DataTable>
        </div>
      </section>
      <div class="payment-enable-box-container">
        <el-card v-if="!isLoading && !isPaymentEnabled && showEnablePaymentsSection" class="payment-enable-box">
          <div class="payment-enable-box-body">
            <div class="payment-enable-box-header">
              <el-divider>
                Enable Payments
              </el-divider>
              <div class="payment-alert-icon">
                <i class="mdi mdi-alert"></i>
              </div>
              <div class="payment-enable-box-message">
                It appears that payments are currently disabled for your account. Would you like to enable the payments
                feature?
              </div>
            </div>
            <div class="payment-enable-box-footer">
              <div class="payment-enable-box-button">
                <el-button type="primary" @click="enablePayment">Enable</el-button>
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </el-main>
  </template>
  <script>
  
  import CustomerService from "@/idp/services/CustomerService";
  import PaymentService from "../services/PaymentSevice";
  import DataTable from "@/components/DataTable.vue";
  import _ from 'lodash';
  import EventBus from "@/EventBus";
  
  export default {
    name: "CustomerBankAccounts",
    components: {
          DataTable
      },
    data() {
      return {
          count: 0,
          tableParams: {
              apiName: "/portal/api/payments?action=getBankAccounts",
              pageTitle: "Bank Accounts",
              showPaginationOptions: true,
              tableName: "bank_account_details",
              isRestify: false,
              customfilter: false,
              limit: 15,
              tableMode: "static",
              initialSort: "-date",
              showSortOptions: false,
              refreshButton: true,
              fixedHeader: false,
              isRegxSearch:false,
              globalSearch: false,
              enableGroupFilter: false,
              addButtonConfig: true,
              addButtonConfig: {
                  path: "/payments/add-bank-account",
                  name: "Add Account"
              }
          },
        showEnablePaymentsSection: true,
        isPaymentEnabled: false,
        isLoading: true
      };
    },
    methods: {
      bankStatusColumnTemplate(props) {
      return PaymentService.getBankStatusBadge(props);
      },
      async enablePayment() {
        try{
          this.isLoading = true;
          const response = await PaymentService.call({"action": "createSenderUser", "data":{}});
          this.notifySuccess(_.get(response,"", "Your payment service enabled successfully, you can set up bank accounts now"))
          this.isPaymentEnabled = true;
          this.showEnablePaymentsSection = false;
          this.isLoading = false;
        }catch(error){
          this.notifyError(_.get(error, 'response.data.error.message', 'Error while completing the request.'));
        }
      },
      registerEvents() {
        EventBus.$on("refreshBankAccountTable", () => {
          EventBus.$emit("refreshTable")
        });
      },
      destroyBusEvents(){
        const busEvents = [
            "refreshBankAccountTable"
          ];
        EventBus.$off(busEvents);
      },
      async checkPaymentEnabledStatus() {
        //check if payment is enabled or not in 'customer_configuration' table
        try {
          this.isPaymentEnabled = await CustomerService.isCustomerPaymentEnabled();
          this.showEnablePaymentsSection = !this.isPaymentEnabled;
        }catch(error) {
          console.error('Failed to get customer configuration:', error);
          this.isPaymentEnabled = false;
          this.showEnablePaymentsSection = true;
        }
      }
    },
    async beforeMount() {
      this.$store.commit("setDisplayIdpTree", "false");
      this.$store.commit("setDisplayIdpTree", false);
      this.$store.commit('paymentStore/setPaymentUserType', "customer");
      this.destroyBusEvents();
      this.registerEvents();
      await this.checkPaymentEnabledStatus();
      this.isLoading = false;
    }
  };
  </script>
  
  <style lang="scss">
   @import '../../../app/idp/idpGlobal';
   @import '../../idp/idpVariables';
   @import '../../idp/idpGlobal';
  
    .el-card__body {
      padding: 0;
    }
  
    .payment-enable-box-container {
      display: flex;
      justify-content: center;
    }
  
    .payment-enable-box {
      margin-top: 30px;
      box-shadow: none !important;
      border: 0.125rem solid rgb(102, 126, 234);
      border-radius: 0.25rem;
      width: 65%;
    }
  
    .payment-enable-box-body {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .payment-enable-box-header {
        margin: 1rem 3rem;
        .payment-alert-icon {
          display: flex;
          justify-content: center;
          .mdi-alert {
            font-size: 6.25rem;
            color: #A0AEC0;
          }
        }
      }
      .payment-enable-box-footer {
        border-top: 1px solid #DCDFE6;
        width: 100%;
        display: flex;
        justify-content: center;
        padding: 1.5rem 0;
        .payment-enable-box-button {
          .el-button {
            padding-left: 3rem;
            padding-right: 3rem;
          }
        }
      }
    }
  
    .payment-enable-box-message {
      margin-bottom: 10px;
    }
  
    </style>
  
  
  
  