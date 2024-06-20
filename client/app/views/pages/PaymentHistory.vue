<template>
<el-main>
    <h1 class="kp-page-title">Billing</h1>
    <div class="main-container-balance">
        <el-row :gutter="20" class="balance-container">
            <el-col :span="12">
                <span class="balance-label">Balance</span>
                <span class="balance-amount">${{balance/100}}</span>
            </el-col>
            <el-col :span="12" class="doller-icon">
                <div class="doller">
                    $
                </div>
            </el-col>
        </el-row>
    </div>
    <div class="payment-cards-body">
        <div class="table-wrap">
            <data-table @openDialog="openDialog" :parameters="tableParamsCards" ref="datatable_billing"></data-table>
        </div>
        <!-- <el-button type="primary" class="btn add-card-button" v-on:click="openDialog">Add card</el-button> -->
        <el-dialog :show-close="false" width="31%" class="add-card-dialog" title="Edit card" :visible.sync="editCardShow" @close="closeDialog">
            <el-row>
                <el-col :span="10" class="expiry-month">
                    <span class="edit-dialog-label">Expiry month</span>
                    <el-select class="config-value" v-model="exp_month" placeholder="Select expiry month">
                        <el-option v-for="(item) in month_list" v-bind:value="item" :key="item" :label="item"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="10">
                    <span class="edit-dialog-label">Expiry year</span>
                    <el-select class="config-value" v-model="exp_year" placeholder="Select expiry month">
                        <el-option v-for="(item) in year_list" v-bind:value="item" :key="item" :label="item"></el-option>
                    </el-select>
                </el-col>
            </el-row>

            <div class="modal-bottom-btns">
                <el-button size="small" @click="closeDialog">Cancel</el-button>
                <el-button size="small" id="create-button" type="primary" @click="update">Update</el-button>
            </div>
        </el-dialog>
    </div>
    <el-dialog :close-on-click-modal="false" :show-close="false" width="31%" class="add-card-container" title="Add a card" :visible.sync="AddCardShow" @opened="init" @close="closeDialog">
        <!-- <el-form class="add-card-form" id="payment-form">
            <el-row>
                <label for="name">Name on Card</label>
                <el-input v-model="name_on_card" placeholder="Name on card"></el-input>
            </el-row> -->
        <el-form :model="cc_form" class="add-card-form" id="payment-form" :rules="cardFormRules" ref="cc_form">
            <el-row>
                <el-form-item prop="name_on_card">
                    <label for="name">Cardholder name *</label>
                    <br />
                    <el-input v-model="cc_form.name_on_card" placeholder="Name on card"></el-input>
                </el-form-item>
            </el-row>
            <el-row class="card-row">
                <label for="card-element">Credit card *</label>
                <div id="card-element" class="form-control">
                    <!-- A Stripe Element will be inserted here. -->
                </div>
            </el-row>
            <el-row>
                <div id="card-errors" role="alert"></div>
            </el-row>

            <div class="modal-bottom-btns">
                <el-button @click="closeDialog">Cancel</el-button>
                <el-button id="create-button" type="primary" @click="save" :disabled="disable_button">Add card</el-button>
            </div>
        </el-form>
    </el-dialog>
    <h3 class="payment-history-title"></h3>
    <div class="invoices">
        <h1 class="kp-page-title">Invoices</h1>
        <div class="table-wrap">
            <data-table :parameters="tableParams" ref="datatable"></data-table>
        </div>
    </div>
</el-main>
</template>

<script>
import PaymentService from "../../services/PaymentService";
import DataTable from "../../components/DataTable.vue";
import Constants from "@/resources/Constants";
import async from "async";
import AjaxService from "@/services/AjaxService";
import EventBus from "@/EventBus";
import {
    Loading
} from "element-ui";

const stripe = Stripe(Constants.PAYMENT_PUBLISHABLE_KEY);

export default {
    name: "PaymentHistory",
    components: {
        DataTable
    },
    data() {
        return {
            AddCardShow: false,
            editCardShow: false,
            card: "",
            cc_form: {
                name_on_card: ""
            },
            card_id: "",
            cardFormRules: {
                name_on_card: [{
                        required: true,
                        message: "Please enter name on card",
                        trigger: "blur"
                    },
                    //          {
                    //   pattern: /^[a-zA-Z_ ]*$/,
                    //   message: 'Name should contain alphabates only',
                    //   trigger: 'blur'
                    // }
                ],
            },
            balance: 0,
            exp_month: "",
            month_list: "",
            year_list: [],
            showAddCard: true,
            disable_button: false,
            exp_year: "",
            tableParams: {
                apiName: "/portal/api/payment-history",
                tableName: "payment_history",
                isRestify: false,
                limit: 5,
                tableMode: "static",
                actionItems: [{
                    icon: "mdi mdi-arrow-down-thin-circle-outline",
                    name: "Download",
                    event_name: "downloadInvoice"
                }]
            },
            tableParamsCards: {
                apiName: "/portal/api/payment-cards",
                tableName: "payment_cards",
                isRestify: false,
                limit: 5,
                tableMode: "static",
                 addButtonConfig:{
                    event:"openDialog",
                    name:"Add card"
                },
                showSortOptions: false,
                actionItems: [{
                        icon: "mdi mdi-credit-card-off",
                        name: "Delete",
                        event_name: "deleteCard"
                    },
                    {
                        icon: "el-icon-edit",
                        name: "Edit",
                        event_name: "editDialog"
                    },
                    {
                        icon: "mdi mdi-credit-card",
                        name: "Set Default",
                        event_name: "setDefaultCard",
                        hideCondition: propData => (propData.row.is_default ? true : false)
                    }
                ]
            }
        };
    },
    methods: {
        init() {
            let style = {
                base: {
                    '::placeholder': {
                        color: '#aab7c4'
                    }
                }
            }
            var elements = stripe.elements();
            this.card = elements.create("card", {
                hidePostalCode: true,
                style: style
            });
            this.card.mount("#card-element");
            this.card.addEventListener("change", function (event) {
                var displayError = document.getElementById("card-errors");
                displayError.textContent = event.error ? event.error.message : "";
            });
        },
        showLoader(params) {
            this.loadingInstance = Loading.service({
                ...params
            });
        },

        hideLoader() {
            // Loading should be closed asynchronously
            if (this.loadingInstance) {
                this.loadingInstance.close();
            }
            this.loadingInstance = null;
        },
        save() {
            this.$refs.cc_form.validate(valid => {
                if (!valid) {
                    return;
                }
                this.disable_button = true;

                stripe
                    .createToken(this.card, {
                        name: this.name_on_card
                    })
                    .then(result => {
                        if (result.token) {
                            this.showLoader({
                                target: "#create-button",
                                spinner: "el-icon-loading"
                            });
                            PaymentService.addCard(result.token)
                                .then(response => {
                                    if (!response.data.status) {
                                        this.notifyError(response.data.message);
                                        return
                                    }
                                    this.notifySuccess("Card added successfully");
                                })
                                .catch(error => {
                                    this.notifyError("Error occured while adding card");
                                })
                                .finally(() => {
                                    this.disable_button = false;
                                    this.$refs.datatable_billing.refreshTable();
                                    this.name_on_card = "";
                                    this.closeDialog();
                                });
                        }
                        var errorElement = document.getElementById("card-errors");
                        errorElement.textContent = result.error.message;
                        this.disable_button = false;
                    });
            })
        },
        update() {
            this.showLoader({
                target: "#create-button",
                spinner: "el-icon-loading"
            });
            const payload = {};
            payload.exp_month = this.exp_month;
            payload.exp_year = this.exp_year;
            payload.card_id = this.card_id;
            PaymentService.updateCardDetails(payload)
                .then(response => {
                    if (!response.data.status) {
                        this.notifyError(response.data.message);
                        return
                    }
                    this.notifySuccess("Card updated successfully");
                })
                .catch(error => {
                    this.notifyError("Error occured while updating card");
                })
                .finally(() => {
                    this.$refs.datatable_billing.refreshTable();
                    this.closeDialog();
                    // this.hideLoader();
                });
        },

        closeDialog() {
            this.AddCardShow = false;
            this.editCardShow = false;
            this.hideLoader();
            this.name_on_card = "";
            this.disable_button = false;
            this.$refs['cc_form'] && this.$refs['cc_form'].resetFields();
        },
        openDialog() {
            this.AddCardShow = true;
        },
        initCardDetails() {
            this.month_list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
            let now = new Date().getUTCFullYear();
            for (let index = 0; index < 20; index++) {
                this.year_list.push(now++);
            }
        },
        deleteCard(record) {
            const recordCount = this.$refs.datatable_billing.getRecordCount();
            const message = recordCount > 1 ?
                "Are you sure want to delete card?" :
                "You must have a single card registered to continue your subscription. Are you sure want to delete this card?";
            this.$confirm(message, "Delete Card", {
                confirmButtonText: "Confirm",
                cancelButtonText: "Cancel",
                type: "warning"
            }).then(async () => {
                PaymentService.deleteCard(record.id)
                    .then(response => {
                        if (!response.data.status) {
                            this.notifyError(response.data.message);
                            return
                        }
                        this.notifySuccess("Card deleted successfully!");
                        this.$refs.datatable_billing.refreshTable();
                    })
                    .catch(error => {
                        this.notifyError("Error while deleting card!");
                    });
            });
        },
        setDefaultCard(propData) {
            const payload = {
                card_id: propData.row.id
            };
            PaymentService.addDefaultCard(JSON.stringify(payload))
                .then(response => {
                    if (!response.data.data.status) {
                        this.notifyError(response.data.message);
                        return
                    }
                    this.notifySuccess("This card is set as Default successfully!");
                    this.$refs.datatable_billing.refreshTable();
                })
                .catch(error => {
                    this.notifyError("Error while setting card record!");
                });
        },
        editCard(data) {
            this.exp_month = data.exp_month;
            this.exp_year = data.exp_year;
            this.card_id = data.id;
            this.editCardShow = true;
        },
        downloadInvoice(record) {
            window.open(record.invoice_pdf, "_self");
        },
        registerEvents() {
            EventBus.$on("editDialog", propData => {
                const data = propData.row;
                this.editCard(data);
            });
            EventBus.$on("deleteCard", propData => {
                this.deleteCard(propData.row);
            });
            EventBus.$on("setDefaultCard", propData => {
                debugger;
                this.setDefaultCard(propData);
            });
            EventBus.$on("downloadInvoice", propData => {
                const data = propData.row;
                this.downloadInvoice(data);
            });
        },
            getBalance(){
             PaymentService.getCustomerBalance({})
                            .then(response => {
                               this.balance=response.data[0].ending_balance
                            })
                            .catch(error => {
                                console.log("Error occured while getting balance");
                            })
                           
        }
    },
    beforeMount() {
        this.registerEvents();
        this.getBalance();
        this.initCardDetails();
    },
    beforeDestroy() {
        EventBus.$off(["editDialog","deleteCard","setDefaultCard","downloadInvoice"]);
    }
};
</script>

<style lang="scss">
@import "../../assets/scss/_variables";

.main-container-balance {
    padding: 0 0 20px 10px;
    margin-top: 6px;
    margin-bottom: 14px;

    .balance-container {
        width: 200px;
        padding: 16px;
        -webkit-box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);

        .balance-label {
            font-size: 14px;
        }

        .balance-amount {
            font-size: 24px;
            font-weight: 600;
        }

        .doller-icon {
            line-height: 2.2;
            text-align: center;
            padding-left: 28px !important;

            .doller {
                color: green;
                font-weight: 600;
                font-size: 23px;
                width: 46px;
                background: #caeeca;
                border-radius: 74px;
                height: 49px;

            }
        }
    }
}

.drp_month {
    display: block;
}

.grid-content {
    border-radius: 7px;
}

.drp_year {
    display: block;
}

.service-config-container {
    .el-select {
        display: block;
    }

    .btn-save {
        text-transform: uppercase;
        font-weight: 700;
        display: block;
        margin-left: 0;
    }

    .el-input__suffix {
        top: 20px;
    }

    .el-form-item__label {
        font-weight: 700;
        text-transform: uppercase;
        font-size: $font-size-14;
    }

    .sub-head {
        font-weight: bold;
        text-transform: uppercase;
        font-size: $font-size-14;
    }

    .code-area-container {
        background: #e4e7ed;
        padding: 25px;
        min-height: 300px;
        margin-bottom: 20px;
    }

    .enter-code-indicator {
        font-weight: bold;
        text-transform: uppercase;
        font-size: $font-size-28;
        opacity: 0.5;
    }

    // Tag Filed mapping
    .el-tabs__content,
    .el-tabs__header {
        padding: 15px;
    }

    .object-container {
        background: $color-white;
        border-radius: 5px;
        margin-bottom: 10px;
        overflow: hidden;

        .btn-addtag {
            margin-bottom: 20px;
        }

        .obj-name {
            background: #e4e7ed;
            padding: 10px 16px;
            margin: 0;
            font-weight: bold;
            text-transform: uppercase;
            font-size: $font-size-14;
        }

        .el-button--text {
            font-weight: bold;
        }

        .object-body {
            padding: 16px;

            .tagname-container {
                border-bottom: 1px solid #dcdfe6;
                padding: 10px 0;
                margin-bottom: 10px;

                .el-input {
                    width: auto;
                    margin-right: 20px;
                }

                .tagname-code-area-container {
                    // background: #e4e7ed;
                    padding: 15px;
                    min-height: 100px;
                    vertical-align: top;
                    width: 55%;
                    display: inline-block;
                    margin-left: 20px;

                    .enter-code-indicator {
                        opacity: 0.5;
                    }
                }
            }
        }
    }

    .el-icon-arrow-down {
        font-size: 18px;
    }

    // Tag Filed mapping

    .webchat-chekbox {
        font-weight: 700;
        text-transform: uppercase;
        font-size: $font-size-14;
        margin-bottom: 25px;
        line-height: 18px;
    }
}

.add-card-form {
    #card-element {
        background: white;
        border: 1px solid #dcdfe6;
        padding: 11px 15px;
        border-radius: 4px;
        margin-top: 12px;
    }

    .el-input {
        margin-top: 13px;
    }

    .card-row {
        margin-top: 16px;
    }
}

.payment-cards-title {
    font-size: 22px;
    color: #005da6;
    margin: 0;
    display: inline-block;
    margin-bottom: 35px;
}

.payment-cards-body {
    .add-card-button {
        margin-bottom: 11px;
        margin-left: 30px;
    }

    .el-dialog__body {
        padding: 0px;
    }

    .el-row {
        margin-left: 0px;
        margin-right: 0px;
        // padding: 8%;
    }

    .edit-dialog-label {
        font-weight: bold;
    }

    .el-select {
        margin-top: 6px;
    }

    .expiry-month {
        margin-right: 15%;
    }

    .modal-bottom-btns {
        margin-right: 20px;
        padding-bottom: 5%;
    }
}

.payment-history-title {
    margin-top: 8px;
    font-size: 20px;
    color: #005da6;
    display: inline-block;
}

.invoices {
    .invoices-title {
        padding-left: 2%;
        font-size: 21px;
        padding-top: 2%;
        font-weight: 600;
    }
}
</style>
