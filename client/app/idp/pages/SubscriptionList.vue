<template>
    <el-main class="kp-main">
        <section class="page-body">
            <div class="table-wrap subscription-list-table">
                <DataTable :parameters="tableParams"></DataTable>
            </div>
            <SubscriptionHistoryDialog :showSubscriptionHistory="showSubscriptionHistory"
                :subscriptionData="subscriptionData" @close-subscription-dialog="handleSubscriptionDialogClose">
            </SubscriptionHistoryDialog>
        </section>
    </el-main>
</template>
   
<script>
import DataTable from "@/components/DataTable.vue";
import SubscriptionHistoryDialog from "@/components/TableElements/SubscriptionHistoryDialog.vue";
import EventBus from "@/EventBus";

export default {
    name: "SubscriptionList",
    components: {
        DataTable,
        SubscriptionHistoryDialog
    },
    data() {
        return {
            showSubscriptionHistory: false,
            subscriptionData: [],
            tableParams: {
                apiName: `/portal/api/table/subscriptions`,
                queryParam: {
                    active: true
                },
                initialSort: "-updated_at",
                tableName: "subscriptions",
                pageTitle: "Subscriptions",
                isRegxSearch: true,
                isRestify: true,
                limit: 10,
                addButtonConfig: true,
                addButtonConfig: { path: "/idp/subscription-form", name: 'Add Subscription' },
            }
        };
    },
    methods: {
        handleSubscriptionDialogClose() {
            this.showSubscriptionHistory = false;
        },
        registerEvents() {
            EventBus.$on("VIEW_SUBSCRIPTION_HISTORY", (subscriptionRowData) => {
                this.showSubscriptionHistory = true;
                this.subscriptionData = subscriptionRowData.page_count_history || [];
            });
        },
        destroyBusEvents() {
            const busEvents = [
                "VIEW_SUBSCRIPTION_HISTORY"
            ];
            EventBus.$off(busEvents);
        }
    },
    beforeMount() {
        this.registerEvents();
        this.$store.commit("setDisplayIdpTree", false);
        this.$store.commit("setDisplayIdpNavbar", true);
    },
    beforeDestory() {
        this.destroyBusEvents()
    }
};
</script>

<style lang="scss">
@import "../../assets/scss/_variables";
.subscription-list-table{
    .table-toolbar .export-btn{
      margin-left: 0rem;
    }
  }
</style>
