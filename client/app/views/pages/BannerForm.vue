<template>
	<el-main>
		<div class="kp-back-to-parent">
			<el-button
				class="kp-btn-back"
				icon="el-icon-back"
				v-on:click="displayList"
			></el-button>
			<h1 class="kp-page-title">{{ pageTitle }}</h1>
		</div>
		<el-breadcrumb separator="/">
			<el-breadcrumb-item :to="{ path: '/banner-list' }"
				>Banners</el-breadcrumb-item
			>
			<el-breadcrumb-item>{{ pageTitle }}</el-breadcrumb-item>
		</el-breadcrumb>

		<!-- Form Page -->

		<div class="kp-form-area">
			<div class="kp-form-panel">
				<el-row>
					<el-col>
						<el-form
							:label-position="labelPosition"
							label-width="100px"
							:model="banner"
							:rules="validationRules"
							ref="ruleForm"
						>
                         <ConfirmModel ref="model"></ConfirmModel>
							<el-row :gutter="72">
								<el-col :span="8">
									<div class="kp-form-input-1 kp-form-field">
										<el-form-item
											prop="customer_id"
											label="Customer"
											class="kp-form-field-label"
										>
											<el-select
												placeholder="Please select customer"
												v-model="banner.customer_id"
												clearable
											>
												<el-option
													v-for="customer in customers"
													:value="customer._id"
													:key="customer._id"
													:label="
														customer.customer_name
													"
												></el-option>
											</el-select>
										</el-form-item>
									</div>

									<div class="kp-form-input-1 kp-form-field">
										<el-form-item
											label="Start time"
											prop="start_time"
											class="kp-form-field-label"
										>
											<calender
												:value="banner.start_time"
												v-model="banner.start_time"
												type="datetime"
												placeholder="Select date and time"
											></calender>
										</el-form-item>
									</div>
								</el-col>
								<el-col :span="8">
									<div class="kp-form-input-1 kp-form-field">
										<el-form-item
											label="Message"
											prop="message"
											class="kp-form-field-label"
										>
											<el-input
												v-model="banner.message"
												placeholder=""
											></el-input>
										</el-form-item>
									</div>

									<div class="kp-form-input-1 kp-form-field">
										<el-form-item
											label="End time"
											prop="end_time"
											class="kp-form-field-label"
										>
											<calender
												:value="banner.end_time"
												v-model="banner.end_time"
												type="datetime"
												placeholder="Select date and time"
											></calender>
										</el-form-item>
									</div>
								</el-col>
							</el-row>
						</el-form>
					</el-col>
				</el-row>
			</div>
			<el-button
				v-on:click.once="save"
				:key="buttonKey"
				class="kp-btn-form-primary"
				type="primary"
				>Save</el-button
			>
			<el-button v-on:click="displayList" class="kp-btn-form-outline"
				>Cancel</el-button
			>
			<div v-if="!isFormValid" class="kp-form-error">
				* Please check field with errors
			</div>
		</div>
	</el-main>
</template>

<script>
import _ from "lodash";
import Json from "@/util/Json";
import ConfirmModel from "@/components/ConfirmModel";
import Codemirror from "@/components/Codemirror";
import CommonService from "@/services/CommonService";
import constants from "@/resources/Constants";
import CustomerService from "@/services/CustomerService";
import Calender from "@/components/Calender";
const inputDateFormat = "YYYY-mm-dd THH:MM:ssZ";
import moment from "moment";

export default {
  name: "BannerFrom",
  components: {
    Calender,
    ConfirmModel
  },
  data() {
    return {
      labelPosition: "top",
      isFormValid: true,
      cacheDataModal: {
        cachedForm: {},
        isFormEdited: false,
        isEditForm: false,
        isNewForm: false
      },
      requiredParam: {},
      pageTitle: "New banner",
      banner: { end_time: "", start_time: "" },
      customers: [],
      buttonKey: 1,
      endpoint: constants.BANNER_ENDPOINT,
      validationRules: this.setValidationRules(),
      schema: [
        {
          fieldType: "el-date-picker",
          name: "end_time",
          type: "date",
          placeholder: "Enter Date",
          format: "yyyy/MM/dd"
        },
        {
          fieldType: "el-date-picker",
          name: "start_time",
          type: "date",
          placeholder: "Enter Date",
          format: "yyyy/MM/dd"
        }
      ]
    };
  },
  watch: {
    banner: {
      handler(newVal, oldVal) {
        if (this.cacheDataModal.isNewForm || this.cacheDataModal.isEditForm) {
          this.cacheDataModal.isFormEdited =
            JSON.stringify(this.cacheDataModal.cachedForm) !=
            JSON.stringify(this.banner);
        }
      },
      deep: true
    }
  },
  methods: {
    async init() {
      const bannerId = this.getBannerIdFromUrl();
      if (bannerId) {
        let banner = await CommonService.fetchById(
          this.endpoint,
          bannerId
        ).catch(error => {
          this.notifyError("Error while fetching banner data");
        });

        this.banner.ends_time = {
          end_time: moment(banner.end_time, "yyyy/MM/DD").format("yyyy/MM/DD")
        };

        this.banner.ends_time = {
          start_time: moment(banner.end_time, "yyyy/MM/DD").format("yyyy/MM/DD")
        };
        this.banner =
          (banner && _.defaultsDeep(banner, this.banner)) || this.banner;
        this.cacheDataModal.isEditForm = true;
        this.cacheDataModal.isFormEdited = false;
        this.cacheDataModal.cachedForm = { ...this.banner };
        this.pageTitle = "Edit banner";
      } else {
        this.cacheDataModal.isNewForm = true;
        this.cacheDataModal.isFormEdited = false;
        this.cacheDataModal.cachedForm = { ...this.banner };
      }
    },
    getBannerIdFromUrl() {
      return this.$route.query.id || "";
    },

    async save() {
      this.cacheDataModal.isFormEdited = false;
      let isValid = await this.$refs.ruleForm.validate().catch(error => {});
      this.isFormValid = isValid;
      let banner =
        isValid &&
        (await CommonService.save(this.endpoint, this.banner).catch(error => {
          this.isFormValid = false;
          this.notifyError("Error while saving banner data!!");
        }));
      if (banner) {
        this.banner._id = banner._id; // add service id after first request to existing service object to avoid duplicate service entries
        this.notifySuccess("Banner saved successfully!!");
        this.displayList();
      }
      this.buttonKey++;
    },

    async fetchCustomers() {
      this.customers = await CustomerService.find().catch(error => {
        this.notifyError("Error while fetching customer");
      });
    },

    displayList() {
      this.$router.push({
        path: "/banner-list"
      });
    },
    setValidationRules() {
      return {
        message: [
          {
            required: true,
            message: "Please input message",
            trigger: "change"
          }
        ],
        end_time: [
          {
            required: false,
            message: "Please input end_time",
            trigger: "change"
          }
        ],
        start_time: [
          {
            required: false,
            message: "Please input start_time",
            trigger: "change"
          }
        ],
        customer_id: [
          {
            required: true,
            message: "Please input customer_id",
            trigger: "change"
          }
        ]
      };
    }
  },

  beforeMount() {
    let user = this.$store.getters.user;
    if (user.roles.includes("admin")) {
      this.showList = true;
    }
    this.init();
    this.fetchCustomers();
    window.addEventListener("beforeunload", event => {
      if (!this.cacheDataModal.isFormEdited) return;
      event.preventDefault();
      event.returnValue = "";
    });
  },
  beforeRouteLeave: function(to, from, next) {
    if (this.cacheDataModal.isFormEdited) {
      //    return window.confirm('Do you really want to leave? you have unsaved changes!')
      return this.$refs.model.open(next);
    } else {
      return next();
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/scss/_variables";

// form dattime form input
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
}
.el-collapse {
  border: 0;
}
.kp-form-field {
  .kp-form-field {
    margin-bottom: 0;
  }
}
// form dattime form input end
</style>
