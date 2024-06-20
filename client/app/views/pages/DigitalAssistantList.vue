<template>
<el-main>
    	<h1 class="kp-page-title">{{pageTitle}}</h1>
    <div id="assistant-button">
        <el-button type="primary" v-on:click="showDialog">Add digital assistant</el-button>
    </div>   
    <div class="table-wrap">
        <data-table :parameters="tableParams" ref="datatable"></data-table>
    </div>
    <!-- <div class="add-digital-assistance-dialog-container">
     <el-dialog :close-on-click-modal="false" v-if="dialogShow" class="product-container" title="Add digital assistant" :visible.sync="dialogShow" @close="closeDialog">
        <el-row class="product-catalogue-row">
        <div>  
            <product-catalogue :data="productCatalogueParams" :showDefault="false"></product-catalogue>
        </div>
    </div> -->
    <div class="add-digital-assistance-dialog-container">
        <el-dialog :close-on-click-modal="false" v-if="dialogShow" class="product-container" title="Add digital assistant" :visible.sync="dialogShow" @close="closeDialog">
            <el-row class="product-catalogue-row">
                <div>
                    <product-catalogue :data="productCatalogueParams" :showDefault="false"></product-catalogue>
                </div>
            </el-row>
            <el-row class="digital-assistant-row">
                <div class>
                    <digital-assistant></digital-assistant>
                </div>
            </el-row>
            <div class="modal-bottom-btns">
                <el-button @click="closeDialog">Cancel</el-button>
                <el-button id="create-button" type="primary" @click="save">Create</el-button>
            </div>

        </el-dialog>
    </div>
    <div class="add-digital-assistance-dialog-container">
        <el-dialog :close-on-click-modal="false" v-if="dialogShow" class="product-container" title="Add digital assistant" :visible.sync="dialogShow" @close="closeDialog">
            <el-row class="product-catalogue-row">
                <div>
                    <product-catalogue :data="productCatalogueParams" :showDefault="false"></product-catalogue>
                </div>
            </el-row>
            <el-row class="digital-assistant-row">
                <div class>
                    <digital-assistant></digital-assistant>
                </div>
            </el-row>
            <div class="modal-bottom-btns">
                <el-button @click="closeDialog">Cancel</el-button>
                <el-button id="create-button" type="primary" @click="save">Create</el-button>
            </div>

        </el-dialog>
    </div>
    <div>
        <el-dialog :close-on-click-modal="false" class="da-container" :show-close="false" v-if="embeddedCodeDialog" title="Embedded code" :visible.sync="embeddedCodeDialog" @close="closeDialog">
            <div>
                <codemirror class="mt-10" v-model="embeddedCode" :value=" embeddedCode"></codemirror>
            </div>
            <p v-if="codeCopied" style="text-align:center;color:green;">Code copied...</p>
            <div class="modal-bottom-btns">
                <el-button @click="closeDialog">Cancel</el-button>
                <el-button type="primary" @click="copyCodeToClipBoard">Copy</el-button>
            </div>
        </el-dialog>
    </div>
    <v-tour name="userGuide" :steps="steps" :options="options" :callbacks="callbacks"></v-tour>
</el-main>

<!-- New Structure -->
</template>

<script>
import DataTable from "../../components/DataTable.vue";
import ProductCatalogue from "../../components/ProductCatalogue.vue"
import Constants from "@/resources/Constants";
import DAService from "@/services/DAService";
import CustomerService from "@/services/CustomerService";
import PaymentService from "@/services/PaymentService";
import EventBus from "@/EventBus";
import AjaxService from "@/services/AjaxService";
import Codemirror from "@/components/Codemirror.vue";
import DigitalAssistant from "../../components/DigitalAssistant.vue"
import _ from "lodash";
import {
    Loading
} from "element-ui";
import userGuide from "@/mixins/userGuide.js";

export default {
    name: "DigitalAssistantList",
    components: {
        DataTable,
        Codemirror,
        Loading,
        ProductCatalogue,
        DigitalAssistant
    },
    mixins: [userGuide],
    data() {
        return {
            steps: Constants.USER_GUIDE_STEPS.DIGITAL_ASSISTANT,
            embeddedCode: `
      Loading...`,
            tableParams: {
                queryParam: {
                    active: true
                },
                apiName: `/portal/api/table/customer`,
                tableName: "digitalAssistant",
                initialSort: "-created_on",
                showPaginationOptions: true,
                limit: 5,
                isRestify: true
            },
            default_domains:{},
            dialogShow: false,
            AssistantDialogShow:false,
            embeddedCodeDialog: false,
            customer_name: "",
            codeCopied: false,
            isChecked:false,
            price_id:"",
            pageTitle:"Digital assistant",
            subscription_id:"",
            defaultNerDomains:[],
            productCatalogueParams:{"product_code":"QNA"}
        };
    },
    beforeMount() {
        EventBus.$on("test-bot", payload => {
            this.openTestBot(payload);
        });
        EventBus.$on("copy-code", payload => {
            this.openCodeDialog(payload);
        });
        EventBus.$on("open-setup", payload => {
            this.openBotSetup(payload);
        });
        EventBus.$on('planId', (priceId) => {
            this.price_id = priceId
        })
        EventBus.$on('DADetails', (data) => {
            this.customer_name = data.customer_name.trim()
        })
    },

    mounted(){
        this.setupGuide()
    },
    beforeDestroy() {
        EventBus.$off(["copy-code", "open-setup", "test-bot", "planId", "DADetails"]);
    },
    methods: {
        showDialog(){
            this.$stopTour()
            this.dialogShow = true;
        },
        openTestBot(payload) {
            this.$stopTour()
            console.log(payload);
            window.open("/assistance/test/" + payload._id);
        },
        openCodeDialog(payload) {
            this.$stopTour()
            this.codeCopied = false;
            this.embeddedCodeDialog = true;
            this.embeddedCode = "Loading ...";

            AjaxService.getJson(
                "/portal/api/digital-assistant-embaded-code", {
                    customer_id: payload._id
                },
                (error, res) => {
                    if (error) {
                        console.log(error);
                        this.notifyError(
                            "Something went wrong while fetching script please try after some time"
                        );
                        return;
                    }
                    this.embeddedCode = res.data;
                }
            );
        },

        copyCodeToClipBoard() {
            let textArea = document.createElement("textarea");
            textArea.textContent = this.embeddedCode;

            document.body.append(textArea);
            textArea.select();
            document.execCommand("copy");

            this.codeCopied = true;

            setTimeout(() => {
                this.codeCopied = false;
            }, 4000);
        },
        closeDialog() {
            this.dialogShow = false;
            this.embeddedCodeDialog = false;
            this.AssistantDialogShow = false;
            this.customer_name = "";
            this.defaultNerDomains = []
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
            let isQnaChild = localStorage.getItem('qnaChild');
            if (isQnaChild) {
                this.notifyError("Please exit from setup");
                return;
            }

            this.showLoader({
                target: '#create-button',
                spinner: 'el-icon-loading'
            })
            let form = {
                "formData": {
                    is_new_digital_assistant: true,
                    customer_name: this.customer_name,
                    default_domains: this.defaultNerDomains
                },
                "price_id": this.price_id,

            };
            DAService.createDA(form).then((response) => {
                    if (!response.status) {
                        response.message && this.notifyError(response.message)
                        return;
                    }
                    this.notifySuccess(response.message);
                    this.closeDialog();
                    this.$refs.datatable.refreshTable();
                    EventBus.$emit("updateChildCustomers");
                    this.dialogShow = false;
                })
                .catch((error) => {
                    this.notifyError("There is an error while creating assistant");
                })
                .finally(() => {
                    this.hideLoader()
                })

        },
        openBotSetup(payload) {
            this.$stopTour()
            let that = this;
            DAService.setup({
                    customer_id: payload._id
                }).then((response)=>{
                if(response.data && response.data.status){
                    EventBus.$emit("update-menu", {});
                    localStorage.setItem("qnaChild", payload.customer_name);
                    localStorage.setItem("qnaChildId", payload._id);
                    EventBus.$emit("update-toolbar", {
                        payload
                    });
                    that.$router.push({
                        path: "/da-configuration"
                    });
                }
            }).catch(()=>{
                this.notifyError("Error while opening setup");
            })
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
    }

};
</script>

<style lang="scss">
.add-digital-assistance-dialog-container {
    .el-dialog {
        width: 70%;
        margin-top: 30px !important;
    }

    .el-dialog__body {
        padding: 18px 34px;
    }
}

#assistant-button {
    margin-bottom: 40px;
    margin-top:10px;
}

.product-catalogue-row {
    // height: 500px;
}

.digital-assistant-row {
    margin-top: 15px;
    width: 430px;
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
        display: none !important
    }

    .product-container {
        width: 70%;
    }

    .el-input {
        padding-top: 10px;
    }
}
.el-input{
    padding-top: 10px;
}







</style>
