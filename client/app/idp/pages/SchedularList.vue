<template>
 <el-main class="kp-main">
    <section class="page-body">
      <div class="table-wrap">
            <DataTable :parameters="tableParams" :columnTemplate="schedularStatusColumnTemplate"></DataTable>
        </div>
    </section>
</el-main>
</template>

<script>
import DataTable from "@/components/DataTable.vue";
import { getStatusBadge } from "@/util/CommonUtil";
export default {
    name: "SchedularList",
    components: {
        DataTable
    },
    data() {
        return {
            tableParams: {
                apiName: `/portal/api/schedular`,
                initialSort: "-updated_at",
                tableName: "schedular",
                pageTitle: "Schedular",
                isRegxSearch:true,
                isRestify: false,
                limit: 10,
                addButtonConfig: true,
                addButtonConfig:{path:"/idp/schedular-form",name:'Add Scheduler'},
            },       
            pageTitle:"Scheduler"
        };
    },
    methods: {
        schedularStatusColumnTemplate(props) {
            return getStatusBadge(props);
        }
    },
    beforeMount() {
        this.$store.commit("setDisplayIdpTree",false);
        this.$store.commit("setDisplayIdpNavbar",true);
       
    }
};
</script>

<style lang="scss">
@import "../../assets/scss/_variables";

</style>
