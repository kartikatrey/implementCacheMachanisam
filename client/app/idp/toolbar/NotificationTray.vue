<template>
<div class="notification-tray">
    <!-- <span class="heading">Notifications</span> -->
    <div v-for="(notification, index) in notifications">
        <ChatNotification v-on:onMessageClick="onMessageClick" :notification="notification"></ChatNotification>
    </div>
</div>
</template>

<script>
// import MenuService from "@/services/MenuService";
// import DashboardDrillDownService from "../services/DashboardDrillDownService";
// import EventBus from "@/EventBus";
// import IdpUpload from "@/idp/components/IdpUpload";
// import Constants from "@/resources/Constants";
// import ReportIssueService from "@/services/ReportIssueService";
// import { VueEditor } from "vue2-editor";
// import { Loading } from "element-ui";
// import "quill/dist/quill.core.css";
// import "quill/dist/quill.snow.css";
// import "quill/dist/quill.bubble.css";
// import _ from "lodash";
// import UserService from "@/idp/services/UserService";
// import HealthMonitorService from "@/services/HealthMonitorService";
// import MessagingService from "@/idp/services/MessagingService";

import moment from "moment";
import ChatNotification from "@/idp/components/chat/components/ChatNotification.vue";

export default {
    name: "NotificationTray",
    components: {
        ChatNotification
    },
    props: ["notifications"],
    data() {
        return {};
    },
    computed: {},
    filters: {
        getTimeDifference: function (date) {
        return moment(date).fromNow();
    }
    },
    watch: {
        messages: {
            handler: function (newVal, oldval) {
                if (!newVal || newVal == oldval) {
                    return;
                }
            },
            immediate: true,
            deep: true,
        },
    },
    methods: {
         onMessageClick() {
            this.$event.emit("onMessageClick");
         },
        prepareAvatarObject(user) {
            return {
                "username": user.full_name || user.username,
                "src": user.avatar,
                "size": 30
            }
        },
      
        showFormattedDate(value) {
            try {
                let now = moment();
                let dateValue = moment(value);
                return dateValue.format("DD MMM YYYY") != now.format("DD MMM YYYY") ?
                    dateValue.format("ddd,DD MMM YYYY hh:mm A") :
                    `Today ${dateValue.format("hh:mm A")}`;
            } catch (err) {
                return "" + value;
            }
        },
    },
    created() {},
    beforeDestroy() {},
    beforeMount() {},
    mounted() {},
};
</script>

<style lang="scss">
@import "../_idpGlobal.scss";

</style>
