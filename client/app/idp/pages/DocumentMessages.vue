<template>
<div class="document-message-section" v-bind:class="[isMessageVisible ? 'list-overflow' : '',isPublishError?'document-message-section-publish-error':'']">
    <!-- Toggle button for messages -->
    <el-button type="text" icon="mdi mdi-chevron-down" class="toggle-action-button" v-if="!isMessageVisible" @click="showMessages">
    </el-button>
    <el-button icon="mdi mdi-chevron-up" type="text" class="toggle-action-button" v-if="isMessageVisible" @click="hideMessages">
    </el-button>

    <!-- Document message container -->
    <div v-if="showDocumentMessagesFlag" class="document-message-container">
        <!-- <div v-bind:class="[isPublishError?'validation-error-for-publish-message':'validation-error']"> -->
        <!-- Validation count -->
        <!-- <span v-if="displayValidationMsg" class="mdi mdi-alert-circle-outline error-info-icon"></span
        >{{ displayValidationMsg }} -->
        <!-- </div> -->
        <!-- Rejection Error -->
        <!--  -->
        <div v-if="isDocumentRejected" class="rejection-note-container">
            <span class="mdi mdi-alert-circle-outline warning-info icon"></span>
            <span class="title"> Rejection note : </span>
            <span class="info">{{rejection_note.substring(0, 40) + ".."}}</span>
        </div>

        <!-- Document error -->
        <div v-for="item in documentMessages" v-bind:key="item.message" class="validation-error document-error-container" v-html="item.message"></div>
    </div>
</div>
</template>

<script>
import _ from "lodash";
import Constants from "@/resources/Constants";
import { mapState } from "vuex";
import MessageService from "../services/MessageService"

export default {
    name: "DocumentMessages",
    data() {
        return {
            isMessageVisible: false
        };
    },
    watch:{ 
    
    },
    created: function () {},
    components: {},
    computed: {
         ...mapState("documentViewStore",{
            showDocumentMessagesFlag : state => [...state.showDocumentMessagesFlag],
        }),
        isDocumentRejected() {
           return this.$store.getters["documentViewStore/isDocumentRejected"];
        },
        isPublishError(){
            return this.$store.getters["documentViewStore/isPublishError"];
        },
        rejectionNote(){
            return this.$store.getters["documentViewStore/rejectionNote"];
        },
        documentMessages() {
            function getRowInfo(error) {
                const index = error.row + 1;
                return " : Row(" + index + ")"
            }

            let displayDocumentErrorList = [];
            const documentId = this.$store.getters["documentViewStore/documentId"];
            const allErrorMessage = this.$store.getters["documentViewStore/allErrorMessages"];
            let docMessages = allErrorMessage[documentId]//this.$store.getters["documentViewStore/allErrorMessages"];
            let messages = _.cloneDeep(docMessages);
            if(allErrorMessage["PackageLevelMessage"].length){
                let packageMesage = _.cloneDeep(allErrorMessage["PackageLevelMessage"])
                messages.unshift(...packageMesage)
            }
            let stage = this.$store.getters["documentViewStore/stage"];
            if (_.includes(
                    [Constants.DOCEX.STAGE.FRAUD_FLAGGED, Constants.DOCEX.STAGE.FRAUD_CONFIRMED],
                    stage
                )) {
                messages = _.filter(messages, (msg) => {
                    return (msg["message_type"]).toLowerCase() == "fraud"
                });
            } else {
                messages = _.filter(messages, (msg) => {
                    return (msg["message_type"]).toLowerCase() !== "fraud"
                })
            }
            
            for(let messageObj of messages){
                messageObj.field_type == 'LINE' && (messageObj.message += getRowInfo(messageObj))
                let messageType = _.get(messageObj, 'message_type', '').toLowerCase();
                let messageContent = messageObj.message;
                messageObj.message = MessageService.getMessageBasedOnType(messageType, messageContent);
                displayDocumentErrorList.push(messageObj);
            }

            let publishFailedReason =  this.$store.getters["documentViewStore/publishFailedReason"];

            if (!_.isEmpty(publishFailedReason)) {
                displayDocumentErrorList.push({
                    'message': '<span class="publish-fail-message-icon mdi mdi-alert-circle-outline error-info-icon"></span><div class="publish-fail-message">' + publishFailedReason + '</div>'
                })
            }

            //Getting Move to inbox reason and adding it to the error messages to display
            let moveToInboxReason =  this.$store.getters["documentViewStore/moveToInboxReason"];

            if (!_.isEmpty(moveToInboxReason)) {
                displayDocumentErrorList.push({
                    'message': '<span class="mdi mdi-information-outline"></span>' +
                    '<p class="document-warning-message">' + moveToInboxReason + '</p>'
                })
            }
            return displayDocumentErrorList;
        },

      
  messageData() {
    const { isDocumentRejected, documentMessages } = this
    return {
      isDocumentRejected,
      documentMessages
    }
  }


    },
    props: [],
    methods: {
        hideMessages() {
            this.isMessageVisible = false;
             this.$store.commit("documentViewStore/toggleMessageSection",false);
        },
        showMessages() {
            this.isMessageVisible = true;
            this.$store.commit("documentViewStore/toggleMessageSection",true);
        },
    },
    mounted() {},
};
</script>

<style lang="scss">
@import "../_idpVariables";
@import "../_idpGlobal";

.document-message-section {
    background: #fff2f2;
    height: 100%;
    position: relative;
    overflow: auto;

    .document-message-header-container {
        height: 2rem;
    }

    .document-message-title {
        padding: 0.2rem 0 0 0.5rem;
    }

    .el-button--text:focus,
    .el-button--text:hover {
        color: black !important;
    }

    .toggle-action-button {
        position: sticky;
        top: 0px;
        float: right;
        color: #606266;
        padding-top: 0rem;
        padding-bottom: 0px;
        font-size: 1.9rem;

    }

    .document-message-container {
        // padding: 0rem 0.3rem 0.3rem 0.3rem;
        // max-height: 125px;
        // height: 100%;

        .rejection-note-container {
            padding: 0 0 0 0;
            color: #cc2e2e;
            font-size: 13px;

            .icon {
                color: var(--yellow-04) !important;
                padding: 3px 0px 3px 5px;
                font-size: var(--font-base);
                font-weight: bold;
            }

            .info {
                color: var(--yellow-04) !important
            }

            .title {
                color: var(--yellow-04);
                font-size: var(--font-base);
                font-weight: bold;
            }
        }

        .validation-error {
            padding: 0 0 0 0;
            color: #cc2e2e;
            font-size: 13px;

            span {
                border-radius: 100px;
                padding: 2px 3px 5px 5px;
                font-size: var(--font-base);
                font-weight: bold;
                vertical-align: middle;
            }

            .publish-fail-message-icon {
                color: var(--yellow-02);
                margin-right: 5px;
            }

            .publish-fail-message {
                color: var(--yellow-02);
                display: contents;
            }
        }

        .validation-error-for-publish-message {
            padding: 0 0 0 0;
            color: var(--dark-02);
            font-size: 13px;

            span {
                border-radius: 100px;
                padding: 2px 3px 5px 5px;
                font-size: var(--font-base);
                font-weight: bold;
                vertical-align: middle;
            }

            .publish-fail-message-icon {
                color: var(--yellow-02);
                margin-right: 5px;
            }

            .publish-fail-message {
                color: var(--yellow-02);
                display: contents;
            }
        }

        ul {
            margin: auto;
            margin-left: 0.4rem;
        }

        .document-warning-message {
            display: contents;
            color: var(--yellow-04);
        }
          .document-success-message {
            display: contents;
            color: var(--green-04);
        }
        .success-icon{
             color: var(--green-04);
        }
    }

    .document-message-container-scroll::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px var(--dark-06);
        background-color: var(--white);
    }

    .document-message-container-scroll::-webkit-scrollbar {
        width: 6px;
        background-color: var(--white);
    }

    .document-message-container-scroll::-webkit-scrollbar-thumb {
        background-color: var(--dark-05);
    }
}

.document-message-section-publish-error {
    background: var(--yellow-08);
}

.list-overflow {
    // overflow: auto;
}

.list-overflow::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px var(--dark-06);
    background-color: var(--white);
}

.list-overflow::-webkit-scrollbar {
    width: 6px;
    background-color: var(--white);
}

.list-overflow::-webkit-scrollbar-thumb {
    background-color: var(--dark-05);
}
</style>
