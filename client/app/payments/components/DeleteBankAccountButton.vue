<template>
    <span>
        <el-dropdown-item :cid="'table-action-dropdown-delete-' + propData.index" v-if="type=='dropdown'" :command="deleteRecord">
            <span class="mdi mdi-delete action-btn dropdown-btn"></span>Delete
        </el-dropdown-item>
        <el-button :cid="'table-action-delete-' + propData.index" class="delete-btn" v-else v-on:click="deleteRecord">
            <span class="mdi mdi-delete action-btn"></span>
        </el-button>
    </span>
</template>

<script>
import _ from "lodash";
import EventBus from "@/EventBus";
import PaymentService from "@/payments/services/PaymentSevice.js";
import Constants from "@/resources/Constants"


export default {
    name: "DeleteBankAccountButton",
    props: ["propData","type","parameters"],
    data() {
        return {
            paymentUserType: ''
        };
    },
    computed: {},
    methods: {
        async deleteRecord() {
            const record = this.propData.row;
            const confirmText = `Are you sure you want to delete?`;
            let response;
            let vendorSiteId = "";
            let vendorId = "";
            try{            
                let isConfirm = await this.notifyConfirm(confirmText, "Confirm", "warning")
                if(!isConfirm) return;
                if (this.paymentUserType == Constants.PAYMENTS_CONFIG.USER_TYPES.VENDOR) {
                    vendorSiteId = this.$store.getters['vendorStore/getVendorSiteId'];
                    vendorId = this.$store.getters['vendorStore/getVendorId'];
                }
                const deleteBankAccPayload = {
                    "vendor_site_id": vendorSiteId,
                    "vendor_id": vendorId,
                    "id": record.id
                }
                response = await PaymentService.call({ action: "deleteBankAccount", data: deleteBankAccPayload });
                this.notifySuccess("Record deleted successfully!");
                EventBus.$emit("refreshBankAccountTable");                            
            } catch (error) {
                let errMsg = _.get(error, 'response.data.error.message');
                errMsg && this.notifyError(_.get(error, 'response.data.error.message'));
            }
        }
    },
    beforeMount() {
        this.paymentUserType = this.$store.getters['paymentStore/getPaymentUserType'];
    }
};
</script>

<style lang="scss">
</style>
