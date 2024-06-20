<template>
  <el-main>
    <h3 class="purchases">Purchases</h3>
    <div class="grid-content">
      <el-collapse v-if="toggle" v-model="activeName">
        <el-collapse-item
          v-for="(item, key,index) in subscriptions"
          :key="key"
          :name="index + 1"
          :title="key"
        >
          <div
            class="table-wrap"
            v-if="item"
          >
            <data-table
              :data="item"
              :parameters="tableParams"
              :ref="key"
            ></data-table>
            <el-button
              type="primary"
              class="add-da-button"
              v-on:click="addAssistanceDialogShow=true"
            >Add digital assistant</el-button>
          </div>
          <div class="add-digital-assistance-dialog-container">
            <el-dialog
              v-if="addAssistanceDialogShow"
              class="product-container"
              title="Add digital assistant"
              :visible.sync="addAssistanceDialogShow"
              :close-on-click-modal="false"
              @close="closeDialog"
            >
              <el-row class="product-catalogue-row">
                <div>
                  <product-catalogue
                    :showDefault="false"
                    :data="productCatalogueParams"
                  ></product-catalogue>
                </div>
              </el-row>
              <el-row class="digital-assistant-row">
                <div class>
                  <digital-assistant></digital-assistant>
                </div>
              </el-row>
              <div class="modal-bottom-btns">
                <el-button
                  @click="closeDialog"
                >Cancel</el-button>
                <el-button
                  id="create-button"
                  type="primary"
                  @click="save"
                >Create</el-button>
              </div>
            </el-dialog>
          </div>
          <div class="product-catalogue-dialog-container">
            <el-dialog
              v-if="dialogShow"
              class="product-container"
              title="Product Catalogue"
              :visible.sync="dialogShow"
              @close="closeDialog"
              :close-on-click-modal="false"
            >
              <div class>
                <product-catalogue
                  :showDefault="true"
                  :data="productCatalogueParams"
                ></product-catalogue>
              </div>
              <div class="modal-bottom-btns">
                <el-button
                  @click="closeDialog"
                >Cancel</el-button>
                <el-button
                  id="create-button"
                  type="primary"
                  :disabled="!enableUpdate"
                  @click="updateSubscription"
                >Update</el-button>
              </div>
            </el-dialog>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </el-main>
</template>

<script>
import DataTable from "../../components/DataTable.vue";
import PaymentService from "../../services/PaymentService.js";
import ProductCatalogue from "../../components/ProductCatalogue.vue";
import DigitalAssistant from "../../components/DigitalAssistant.vue";
import DAService from "@/services/DAService";
import { Loading } from "element-ui";
import moment from "moment";
import EventBus from "@/EventBus";

export default {
  name: "SubscriptionList",
  components: { DataTable, ProductCatalogue, DigitalAssistant },

  data() {
    return {
      activeName: 1,
      tableParams: {
        apiName: "/portal/api/subscriptions",
        showPaginationOptions: false,
        tableName: "subscriptions",
        isRestify: false,
        limit: 5,
        tableMode: "static",
        showSortOptions: false,
        actionItems: [
          {
            icon: "el-icon-close",
            name: "Cancel Subscription",
            event_name: "cancelSubscription",
            hideCondition: propData => (propData.row.cancel_at || propData.row.status=="Canceled" ? true : false)
          },
          {
            icon: "el-icon-edit",
            name: "Edit",
            event_name: "editDialog"
          }
        ]
      },
      subscriptions: {},
      dialogShow: false,
      addAssistanceDialogShow: false,
      productCatalogueParams: {},
      priceId: "",
      customer_name: "",
      defaultNerDomains: [],
      enableUpdate: true,
      subscription_id: "",
      subscription_item_id: "",
      selectedTableKey: "",
      toggle:true
    };
  },
  methods: {
    handleCancelSubscription(propData) {
      const record = propData.row;
      const payload = {
        subscription_id: record.id,
        is_cancel: true
      };

      this.$confirm(
        `Your services will remain active till  ` +
          moment
            .unix(record.current_period_end)
            .utc()
            .format("Do MMM YYYY"),
        "Cancel Subscription",
        {
          confirmButtonText: "Confirm",
          cancelButtonText: "Cancel",
          type: "warning"
        }
      )
        .then(async () => {
          const response = await PaymentService.cancelSubscription(payload);
          response
            ? (this.notifySuccess("Subsription is cancelled successfully!"),this.fetchSubscriptions())
            : this.notifyError("Error while cancel subscription!");
        })
        .catch(error => {
          console.log(error);
        });
    },
    updateSubscription() {
      this.showLoader({
        target: "#create-button",
        spinner: "el-icon-loading"
      });
      const subscriptionData = {};
      subscriptionData.subscription_id = this.subscription_id;
      subscriptionData.subscription_item_id = this.subscription_item_id;
      subscriptionData.subscription_price_id = this.price_id;

      PaymentService.updateSubscription(JSON.stringify(subscriptionData))
        .then(response => {
          if (response.statusText.toLowerCase() == "ok") {
            this.dialogShow = false;
            this.fetchSubscriptions();
            this.notifySuccess(
              "Your subscription has been updated successfully"
            );
          }
        })
        .catch(error => {
          let errorMessage = error;
          if (error)
            return this.notifyError("Error while updating subscription");
        })
        .finally(() => {
          this.dialogShow = false;
          this.hideLoader();
          // this.$refs[this.selectedTableKey][0].refreshTable();
        });
    },
    closeDialog() {
      this.dialogShow = false;
      this.addAssistanceDialogShow = false;
      this.hideLoader();
    },

    hideLoader() {
      // Loading should be closed asynchronously
      if (this.loadingInstance) {
        this.loadingInstance.close();
      }
      this.loadingInstance = null;
    },

    showLoader(params) {
      this.loadingInstance = Loading.service({
        ...params
      });
    },
    save() {
      if (!this.price_id) {
        this.notifyError("Please select a plan first");
        return;
      }
      if (!this.customer_name) {
        this.notifyError("Please provide assistant name");
        return;
      }
      let isQnaChild = localStorage.getItem("qnaChild");
      if (isQnaChild) {
        this.notifyError("Please exit from setup");
        return;
      }

      this.showLoader({
        target: "#create-button",
        spinner: "el-icon-loading"
      });
      let form = {
        formData: {
          is_new_digital_assistant: true,
          customer_name: this.customer_name,
          default_domains: this.defaultNerDomains
        },
        price_id: this.price_id
      };
      DAService.createDA(form)
        .then(response => {
          if(!response.status){
              response.message && this.notifyError(response.message)
              return;
           }
          this.notifySuccess(response.message);
          // this.addAssistanceDialogShow = false;
          this.closeDialog();
          this.fetchSubscriptions();
        })
        .catch(error => {
          this.notifyError("There is an error while creating assistant");
        })
        .finally(() => {
         
          this.hideLoader();

          //     this.customer_name - "";
        });
    },
   async fetchSubscriptions(){
      try {
          const response = await PaymentService.fetchSubscriptions();
          if (response.status) {
            this.subscriptions = response.data;
            this.toggle = false;
            setTimeout(()=>{
              this.toggle =true;
            },1);
            
            return;
          }
          this.notifyError(response.message);
        }
        catch (error) {
          this.notifyError("Error while fetching subscriptions");
      }
   }
  },
  beforeMount() {
      EventBus.$on("cancelSubscription", rowData => {
        this.handleCancelSubscription(rowData);
      });
      EventBus.$on("editDialog", propData => {
        const data = propData.row;
        this.productCatalogueParams.product_code = data.product_code;
        this.selectedTableKey = data.product_code;
        this.productCatalogueParams.current_plan_id = data.plan.id;
        this.subscription_id = data.id;
        this.subscription_item_id = data.items.data[0].id;
        this.dialogShow = true;
      });

      EventBus.$on("planId", priceId => {
        this.enableUpdate =
          priceId == this.productCatalogueParams.current_plan_id ? false : true;
        this.price_id = priceId;
      });

      EventBus.$on("DADetails", data => {
        this.customer_name = data.customer_name.trim();
        // this.defaultNerDomains = data.defaultNerDomains;
      });

      this.fetchSubscriptions();
  }
}
</script>
<style lang="scss">
@import "../../assets/scss/_variables";

.add-digital-assistance-dialog-container {
  .el-dialog {
    width: 70%;
    margin-top: 30px !important;
  }
  .el-dialog__body {
    padding: 18px 34px;
  }
}
.purchases {
  font-size: 22px;
  color: #005da6;
  margin: 0;
  display: inline-block;
  margin-bottom: 10px;
  margin-left: 6px;
}
.el-collapse-item__header {
  padding: 4px;
  font-size: 14px;
  font-weight: bold;
}
.add-da-button {
  margin-top: 15px;
}

.el-collapse-item:first-child {
  padding-bottom: 17px;
}

.el-collapse-item__arrow {
  font-weight: bolder;
  font-size: 20px;
}
.el-collapse-item__header {
  border-radius: 7px;
  padding-left: 26px;
}
.el-loading-spinner {
  margin-top: -7px !important;
}
.da-container {
  .el-dialog {
    border-radius: 8px;
  }

  .el-dialog__body {
    text-align: center;
    padding: 20px;
    .file-name-container {
      border: 1px dashed;
      padding: 20px;
      border-radius: 5px;
      margin-bottom: 20px;
    }

    .inner {
      width: 70%;
      margin: 0 auto;
      margin-bottom: 30px;

      .el-button {
        width: 100%;
      }
    }

    .modal-bottom-btns {
      text-align: right;
    }
  }
}
.checkbox_block {
  margin-top: 15px;
  .checkbox_div {
    padding-left: 100px;
  }
}
.da-container .el-dialog__body {
  text-align: left !important;
  .CodeMirror-lint-marker-error {
    display: none !important;
  }
  .product-container {
    // width: 77%;
  }
  .el-input {
    padding-top: 10px;
  }
}

// Dialog Css
.product-catalogue-dialog-container {
  .el-dialog {
    width: 70%;
    margin-top: 30px !important;
  }
  .el-dialog__body {
    padding: 18px 34px;
  }
}
</style>
