<template>
  <el-main class="kp-main">
    <section class="page-body">
      <div class="page-title">
        <el-button cid="subscription-form-header-back" icon="mdi mdi-arrow-left-circle-outline" v-on:click="onBack"></el-button>
        <span class="page-title-text" v-if="form._id">Edit {{ pageTitle }}
        </span>
        <span class="page-title-text" v-else>Add {{ pageTitle }}</span>
      </div>
      <section class="form-page-container">
        <div class="panel">
          <div class="panel-body">
            <el-form label-position="left" :model="form" ref="form" label-width="120px" :rules="formRules">
              <el-row :gutter="40">
                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item class="control-label col-sm-2" prop="customer_name" label="Customer Name">
                      <el-select @change="onCustomerChange" v-model="form.customer_name" class="select-box"
                        cid="subscription-form-customer-select" collapse-tags placeholder="Select customer">
                        <el-option v-for="(item, index) in customerList" :cid="'subscription-form-customer-name' + index"
                          :key="item._id" :label="item.customer_name" :value="item" label-width="170px"></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="40">
                <el-col :span="12">
                  <div class="kp-form-group subscription-date-icons">
                    <el-form-item class="control-label col-sm-2" prop="start_date" label="Start Date">
                      <el-date-picker type="date" placeholder="Pick a start date"
                        v-model="form.start_date"></el-date-picker>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="kp-form-group subscription-date-icons">
                    <el-form-item class="control-label col-sm-2" prop="end_date" label="End Date">
                      <el-date-picker type="date" placeholder="Pick a end date" v-model="form.end_date"
                        :picker-options="pickerOptions"></el-date-picker>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="40">
                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item class="control-label col-sm-2" prop="tier" label="Tier">
                      <el-select @change="onTierChange" v-model="form.tier" class="select-box" collapse-tags
                        cid="subscription-form-tier-select" placeholder="Select tier">
                        <el-option v-for="(item, index) in tierList" :cid="'subscription-form-tier-select' + index"
                          :key="item" :label="item" :value="item" label-width="170px"></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item class="control-label col-sm-2" prop="contract_page_count" label="Contract Page Count">
                      <el-input name="contract_page_count" cid="subscription-contract-page-count"
                        v-model="form.contract_page_count" placeholder="Enter contract page count" disabled></el-input>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="40">
                <el-col :span="12">
                  <div class="kp-form-group">
                    <el-form-item class="control-label col-sm-2" prop="billing_cycle" label="Billing Cycle">
                      <el-select v-model="form.billing_cycle" class="select-box" collapse-tags
                        cid="subscription-form-billing-cycle-select" placeholder="Select billing cycle">
                        <el-option v-for="(item, index) in billingCycleList"
                          :cid="'subscription-form-billing-cycle-select' + index" :key="item" :label="item" :value="item"
                          label-width="170px"></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <footer>
            <div></div>
            <div>
              <el-button size="small" v-on:click="onBack">Cancel</el-button>
            </div>
            <div>
              <el-button size="small" id="save-subscrption-btn" v-on:click="onSave" :disabled="disableSaveSubsciption"
                type="primary">Save</el-button>
            </div>
          </footer>
        </div>
      </section>
    </section>
  </el-main>
</template>
  
<script>
import Constants from "@/resources/Constants";
import DataTable from "@/components/DataTable.vue";
import CustomerService from "@/idp/services/CustomerService";
import SubscriptionService from "@/idp/services/SubscriptionService";

export default {
  name: "VendorUserForm",
  components: {
    DataTable
  },
  data() {
    const validateEndDate = (rule, value, callback) => {
      const startTimestamp = new Date(this.form.start_date).getTime();
      const endTimestamp = new Date(value).getTime();
      if (startTimestamp && endTimestamp && endTimestamp <= startTimestamp) {
        callback(new Error('End date should be after start date'));
      } else {
        callback();
      }
    };
    return {
      pageTitle: "Subscription",
      customerList: [],
      form: {},
      tierList: Constants.DOCEX.SUBSCRIPTION.TIER_LIST,
      billingCycleList: Constants.DOCEX.SUBSCRIPTION.BILLING_CYCLE,
      disableSaveSubsciption: false,
      formRules: {
        customer_name: [
          {
            required: true,
            message: "Please select customer",
            trigger: "change"
          }
        ],
        tier: [
          {
            required: true,
            message: "Please select a tier",
            trigger: "change"
          }
        ],
        contract_page_count: [
          {
            required: true,
            message: "Please select contract page count",
            trigger: "change"
          }
        ],
        billing_cycle: [
          {
            required: true,
            message: "Please select a billing cycle",
            trigger: "change"
          }
        ],
        start_date: [
          {
            required: true,
            message: "Please pick a start date",
            trigger: "change"
          }
        ],
        end_date: [
          {
            required: true,
            message: "Please pick a end date",
            trigger: "change"
          },
          { validator: validateEndDate }
        ]
      },
      pickerOptions: {
        disabledDate: (time) => {
          // Disable dates that are earlier than the start_date
          return time.getTime() < new Date(this.form.start_date).getTime();
        },
      },
    };
  },
  methods: {
    async init(subscriptionRecordId) {
      try {
        const subscriptionProjection = [
          'customer_id',
          'customer_code',
          'customer_name',
          'start_date',
          'end_date',
          'tier',
          'contract_page_count',
          'billing_cycle'
        ]
        const subscriptionData = await SubscriptionService.fetchById(subscriptionRecordId, subscriptionProjection);
        this.form = Object.assign({}, this.form, subscriptionData);
      } catch (error) {
        this.notifyError("Error while getting subscription record");
      }
    },
    async getCustomerData() {
      try {
        const customerParams = {
          select: [
            "customer_code",
            "customer_name"
          ]
        }
        this.customerList = await CustomerService.find({ type: "IDP", active: true }, customerParams);
      } catch (e) {
        this.notifyError("Error while fetching customer data")
      }
    },
    onCustomerChange(customer) {
      this.form.customer_id = customer._id;
      this.form.customer_name = customer.customer_name;
      this.form.customer_code = customer.customer_code;
    },
    onTierChange(tier) {
      const tierRecord = Constants.DOCEX.SUBSCRIPTION.CONTRACT_PAGE_COUNT.find((item) => {
        return item.tier == tier;
      })
      this.form.contract_page_count = tierRecord && tierRecord.contract_page_count;
    },
    async onSave() {
      this.disableSaveSubsciption = true;
      this.$setLoader({
        target: "#save-subscrption-btn",
        spinner: "el-icon-loading",
      });
      const isFormValid = await this.$refs.form.validate().catch((error) => {
      });

      if (!isFormValid) {
        this.$resetLoader();
        this.disableSaveSubsciption = false;
        return;
      }
      return this.saveSubscriptionRecord();
    },
    async saveSubscriptionRecord() {
      try {
        const subscriptionResponse = await SubscriptionService.saveSubscriptionDetails(this.form);
        if (subscriptionResponse) {
          this.form = subscriptionResponse.data;
          this.notifySuccess("Subscription data saved successfully");
          this.$router.push({ path: "/idp/subscription-list" });
        }
      } catch (error) {
        this.notifyError(error);
      } finally {
        this.$resetLoader();
        this.disableSaveSubsciption = false;
      };
    },
    onBack() {
      this.$router.push("/idp/subscription-list");
    }
  },

  async beforeMount() {
    this.getCustomerData();
    this.$store.commit("setDisplayIdpTree", false);
    this.$store.commit("setDisplayIdpNavbar", true);
    const subscriptionRecordId = this.$route.query.id;
    if (subscriptionRecordId) {
      this.init(subscriptionRecordId);
    }
  },
};
</script>

<style lang="scss">
@import "../_idpGlobal";

.kp-form-group {
  .el-input.is-disabled .el-input__inner {
    background-color: var(--dark-10) !important;
    color: var(--dark-04) !important;
  }
}

.subscription-date-icons {
  .el-input__icon {
    line-height: inherit !important;
    padding-top: 2.5px;
  }
}
</style>
