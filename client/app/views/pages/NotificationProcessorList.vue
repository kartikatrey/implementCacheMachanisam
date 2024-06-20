<template>
<el-main>
    <h1 class="kp-page-title">{{pageTitle}}</h1>
    <div class="table-wrap">
        <data-table :parameters="tableParams" ref="datatable"></data-table>
    </div>
</el-main>
</template>

<script>
import DataTable from "../../components/DataTable.vue";
import CommonService from "@/services/CommonService";
import constants from "@/resources/Constants";

export default {
    name: "NotificationProcessorList",
    components: {
        DataTable
    },
    data() {
        return {
            tableParams: {
                apiName: `/portal/api/table/notification_processor`,
                queryParam: {
                    "active": true
                },
                tableName: "notification_processor",
                enableExport: true,
                isRestify: true,
                limit: 10,
                addButtonConfig: {
                    path: "/notification-processor-form",
                    name: 'Notification Processor'
                },
            },
            pageTitle: "Notification processor",
            activeNotificationCount: 0,
            endpoint: constants.NOTIFICATION_PROCESSOR_ENDPOINT
        };
    },
    methods: {
        fetchActiveCount() {
            CommonService.fetchActiveCount(this.endpoint)
                .then(activeNotificationCount => {
                    this.activeNotificationCount = activeNotificationCount;
                })
                .catch(error => {
                    this.notifyError("Error while fetching active notification count!!");
                });
        },

        onTableUpdate() {
            this.fetchActiveCount();
        }
    },
    beforeMount() {
        this.fetchActiveCount();
    }
}
</script>

<style lang="scss">
@import "../../assets/scss/_variables";

.modal-dropdown {
    margin-bottom: 34px;

    .sub-heading {
        font-weight: 700;
        text-transform: uppercase;
        font-size: 0.875rem;
        display: block;
        margin-bottom: 7px;
    }
}
</style>
