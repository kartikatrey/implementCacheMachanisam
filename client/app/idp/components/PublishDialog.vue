<template>
<div>
    <el-dialog custom-class="publish-dialog" :append-to-body="true" title="Publish Info" :visible.sync="publishDialogVisible" :close-on-click-modal="false" width="40%" :show-close="false" center element-loading-spinner="el-icon-loading">
        <header class="module-header">Do you want to publish now?</header>
        <span class="word-break-label">{{ loggedInMessage }}</span>
        <span slot="footer" class="dialog-footer">
            <el-button cid="idp-publish-dialog-close" :disabled="disableClose" size="small" @click="CancelPublish()">Close</el-button>
            <el-button cid="idp-publish-dialog-login" size="small" type="primary" v-if="showLogin" @click="openLoginUrl()">Login</el-button>
            <el-button cid="idp-publish-dialog-publish-now" size="small" type="primary" v-if="showPublish" :disabled="publishLoading" v-loading="publishLoading" element-loading-spinner="el-icon-loading" @click="publishToSystem()">Publish now</el-button>
        </span>
    </el-dialog>
</div>
</template>

<script>
import Constants from "@/resources/Constants";
import CustomerConfig from "@/idp/services/DeCustomerConfig";
import DocumentService from "@/idp/services/DocumentService";
import EventBus from "@/EventBus";
import _ from "lodash";
import {
    getQueryFilter
} from "@/util/CommonUtil";

export default {
    name: "PublishDialog",
    props: {
        publishDialogVisible: Boolean,
        documentVueStorePath: {
            type: String,
            default: null
        }
    },
    data() {
        return {
            systemConfig: {},
            loggedInMessage: "",
            loginUrl: "",
            showLogin: false,
            showPublish: false,
            publishLoading: false,
            publishDialogLoading: false,
            isRefreshNeeded: false,
            disableClose: false,
        };
    },
    watch: {
        publishDialogVisible: {
            handler: function (val, oldval) {
                if (!val) {
                    this.resetDialog();
                    return;
                }
                this.$nextTick(() => {
                    this.$setLoader({
                        target: ".publish-dialog > .el-dialog__body",
                        spinner: "el-icon-loading",
                    });
                });

                CustomerConfig.getSystemConfig({"documentType" : this.documentData.document_type})
                    .then((res) => {
                        this.systemConfig = res.data && res.data.config;
                        this.publish();
                    })
                    .catch((err) => {
                        console.log("Error while fetching customer configuration: ", err);
                    })
                    .finally(() => {
                        this.$resetLoader();
                    });
            },
            immediate: true,
            deep: true,
        },
    },
    /* Purpose: Retrieve a document from the vue store
       1) We receive a prop containing the vue store name to retrieve a document from vue store.
       2) If the prop is provided, fetch the document using the specified vue store.
       3) Otherwise, retrieve the document from the document vue store.
    */
    beforeMount(){
        if(this.documentVueStorePath){
            this.documentData = this.$store.getters[this.documentVueStorePath];
        } else{
            this.documentData = this.$store.getters["documentViewStore/documentData"];
        }
    },
    methods: {
        resetDialog() {
            this.systemConfig = {};
            this.loggedInMessage = "";
            this.loginUrl = "";
            this.showLogin = false;
            this.showPublish = false;
            this.publishLoading = false;
            this.publishDialogLoading = false;
            this.isRefreshNeeded = false;
        },
        CancelPublish() {
            this.isRefreshNeeded = false;
            this.handleDialogClose();
            this.showLogin = false;
            this.showPublish = false;
        },
        openLoginUrl() {
            // If the configured system has auth_type as basic/api_key/bearer_token then skipping the login process
            if (["BASIC","API_KEY", "BEARER_TOKEN"].includes(this.systemConfig.auth_type)) {
                //call rest api & return
                return;
            }
            window.open(this.loginUrl);
            this.loggedInMessage = `Please click on "Publish now" after the login process is completed.`;
            this.showLogin = false;
            this.showPublish = true;
        },

        async publish() {
            const publishTo = this.systemConfig["publish_to"];
            if(this.isEmailPublish()) { return; }
            if(this.isStoragePublish()) { return; }

            // If publish to is csv or json, export data in csv and json format.
            if (["csv","json","excel"].includes(publishTo)) {
                this.loggedInMessage = `Data is being exported as ${publishTo}.`;
                const payload = {
                    customer_id: this.documentData.customer_id,
                    document_ids: JSON.stringify([this.documentData._id]),
                    document_type: this.documentData.document_type,
                    export_type: publishTo,
                    file_name: this.documentData.file_name,
                    file_type : this.documentData.file_type,
                    document_subtype : this.documentData.document_subtype,
                    email_id : this.documentData.email && this.documentData.email.id
                }
                console.log("Upload param: ",payload)
                DocumentService.exportData(payload);
                this.isRefreshNeeded = true;
                return;
            }

            let system = this.systemConfig["system_name"];

            // If system requires basic authentication,authentication will be done in workkflow itself
            if (this.isLoginRequired(system)) return;

            // Prepare url if system requires OAUTH1/OAUTH2 authentication mechanism
            let response = await DocumentService.login({ system: system });
            if (response.data.statusCode !== 200 || (response.data.data && !response.data.data.status)) {
                this.notifyError(`Error while login into ${system} system`);
                return;
            }
            if (!(response.data.data && response.data.data.isLoogedIn)) {
                this.loggedInMessage = `You need to logged into ${system} system in order to publish. Do you want to login now?`;
                this.loginUrl = response.data.data.url;
                this.showLogin = true;
                return;
            }
            this.loggedInMessage = `You are logged into ${system} system. Do you want to publish now?`;
            this.showPublish = true;
        },

        async publishToSystem() {
            this.publishLoading = true;
            this.disableClose = true;
            const documentId = this.documentData._id;
            this.notifySuccess("Request to publish the document has been submitted successfully. ");
            this.publishLoading = false;
            this.disableClose = false;
            this.isRefreshNeeded = true;
            this.handleDialogClose();
            this.navigate();
            DocumentService.publish({
                    document_id: documentId
                })
                .then((res) => {
                    let data = res && res.data && res.data.data;
                    EventBus.$emit("REFRESH_TABLE");
                    if (!data.status) {
                        let errorMsg = data.message ? `${data.message}` : `Something went wrong while publishing the document.`;
                        this.$notify.error({
                            title: "Error",
                            dangerouslyUseHTMLString: true,
                            message: errorMsg
                        });
                        return;
                    }
                    this.$notify({
                        title: "Success",
                        type: "success",
                        dangerouslyUseHTMLString: true,
                        message: data.message || "Document published successfully."
                    });

                })
                .catch((error) => {
                    EventBus.$emit("REFRESH_TABLE");
                    this.notifyError(
                        `Something went wrong while publishing the document.`
                    );
                })
        },
        async handleDialogClose() {
            this.$emit("hide", this.isRefreshNeeded);
        },
        navigate() {
            const filter = getQueryFilter();
            // to nevigate after publish to the specified tab previously it is nevigating to inbox tab only.
            // filter["stage"] = Constants.DOCEX.STAGE.UPLOADED;
            this.$store.commit("setDisplayIdpTree",true);
            this.$router.push({
                path: `/idp/document/${this.documentData.document_type ? this.documentData.document_type : "invoice"}`,
                query: {
                    filter: JSON.stringify(filter || {}),
                },
            });
        },
        isLoginRequired(system) {
            let skipLoginPage = false;
            let oauth_version = this.systemConfig["oauth_version"];
            let auth_type = this.systemConfig["auth_type"];
            if (["BASIC", "API_KEY","OAUTH2", "BEARER_TOKEN", "BEARER_TOKEN_USERNAME_PASSWORD"].includes(auth_type) || oauth_version == "JWT") {
                this.loggedInMessage = `Record will be created in ${system} system using document extracted details. Do you want to publish now?`;
                this.showPublish = true;
                skipLoginPage = true;
            }
            return skipLoginPage;
        },
        isStoragePublish(){
            if (this.systemConfig["publish_to"] !== "system" && _.get(this.systemConfig, "storage_name", null)) {
                this.loggedInMessage = `Record will be created in ${this.systemConfig["storage_name"]} storage using document extracted details. Do you want to publish now?`;
                this.showPublish = true;
                return true;
            }
            return false;
        },
        isEmailPublish(){
            const publishTo = ("" + this.systemConfig["publish_to"]).toLocaleLowerCase();
            if (publishTo == 'email') {
                this.loggedInMessage = "The document will be sent to the email. Do you want to publish now?";
                this.showPublish = true;
                return true;
            }
            return false;
        }
    },
};
</script>

<style lang="scss">
@import "../_idpGlobal";

.publish-dialog {
    padding: var(--space-lg) !important;
}

.module-header {
    color: #000;
    font-size: var(--font-lg);
    border-bottom: 1px solid #e7e7e7;
    padding-bottom: var(--space-sm);
    margin-bottom: var(--space-lg);
    font-weight: 500;
}

.progress-container {
    margin-top: var(--space-xl);

    .pending-status {
        width: 13px;
        height: 13px;
        background: var(--white);
        border-radius: 100px;
        border: 1px solid #e2e2e2;
        display: inline-block;
        margin-right: var(--space-md);
    }

    .progress-stage {
        background: #f4f5f8;
        padding: var(--space-sm) var(--space-base);
        border-radius: var(--radius-base);
        margin-bottom: var(--space-md);
        display: flex;
        justify-content: flex-end;

        .title {
            color: var(--dark-04);
            margin-left: 0;
            margin-right: auto;

            .success-icon {
                color: var(--green-05);
                display: inline-block;
                margin-right: var(--space-md);
                font-size: var(--font-md);
            }
        }

        .title.completed {
            color: var(--green-05);
        }

        .el-loading-parent--relative {
            margin-right: 36px;
        }

        .status {
            color: var(--green-05);
        }
    }
}
</style>
