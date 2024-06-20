<template>
<el-popover v-model="visible" popper-class="message-indicator" width="400" v-if="shouldShowMsgIndicator" placement="right" trigger="click">
    <message v-if="visible" :id="'messages-window-'+data.row._id" :isTabActive="visible" :org="data.row && data.row.org" :documentId="data.row && data.row._id"></message>
    <span slot="reference" class="message-indicator-icon mdi mdi-forum"> </span>
</el-popover>
</template>

<script>
import ChatNotification from "@/idp/components/chat/components/ChatNotification.vue";
import MessagingService from "@/idp/services/MessagingService";
import EventBus from "@/EventBus";
import _ from "lodash";
import Constants from "@/resources/Constants";
import Message from "../../components/Message.vue";

export default {
    name: "MessageIndicator",
    components: {
        ChatNotification,
        Message
    },
    props: ["data"],
    computed: {
        shouldShowMsgIndicator() {
            return this.data.row && this.data.row.has_collab_messages && !_.includes([Constants.DOCEX.STAGE.DELETED, Constants.DOCEX.STAGE.PUBLISHED], this.data.row.stage);
        }
    },

    data() {
        return {
            notification: {},
            visible: false,
            loading: false
        };
    },
    methods: {

    }
};
</script>

<style lang="scss">
@import "../../_idpVariables";

.message-indicator {
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    height: 400px;
    padding: 0px;
    border: 0;
    border-radius: .6rem;
    // overflow: hidden;

    .comment-container {
        background: white
    }

    .vac-message-card .triangle-left {
        position: absolute !important; 
        left: 7px !important;
        top: 2px !important;
        width: 0 !important;
        height: 0 !important;
        border-top: 0px solid transparent !important;
        border-right: 15px solid #F5F8FA !important;
        border-bottom: 22px solid transparent !important;
        margin-left: -2px !important;
    }

    .vac-message-card:not(.vac-message-current) {
        background: #F5F8FA;
    }

    .vac-textarea {
        background: var(--dark-08) !important;
    }
}

.message-indicator-icon {
    color: var(--brand-06);
    font-size: 12px;
    cursor:pointer;
}
</style>
