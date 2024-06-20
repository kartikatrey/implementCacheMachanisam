<template>
<div class="page-dashboard">
    <el-row class="system-count-container" :gutter="20">
        <el-col :md="({span:8})" :xl="({span:6})">
            <el-row :gutter="10">
                <el-col :span="getUserCountSpan">
                    <user-count :isAdmin="isAdmin"></user-count>
                </el-col>
                <el-col :span="getSystemCountSpan">
                    <system-count :isAdmin="isAdmin" :count="masterSystemCount"></system-count>
                </el-col>
            </el-row>
            <el-row :gutter="10">
               <StatementsByCustomer></StatementsByCustomer>
            </el-row>
        </el-col>
        <el-col :md="({span:16})" :xl="({span:18})">
            <active-user-chart :isAdmin="isAdmin"></active-user-chart>
        </el-col>
    </el-row>

    <el-row :gutter="20">
        <count-tiles-module :isAdmin="isAdmin"> </count-tiles-module>
    </el-row>
    <el-row :gutter="20">
        <el-col :span="12">
            <div class="grid-content bg-purple top-right-graph">
                <div class="dashboard-section-label">Tickets created</div>
                <el-tabs type="border-card">
                    <el-tab-pane>
                        <span slot="label">Day</span>
                        <line-chart v-bind:params="ticketCountChartParams.data.day" :label="ticketCountChartParams.label" class="stackedBarChart"></line-chart>
                    </el-tab-pane>
                    <el-tab-pane>
                        <span slot="label">Week</span>
                        <line-chart v-bind:params="ticketCountChartParams.data.week" :label="ticketCountChartParams.label" class="stackedBarChart"></line-chart>
                    </el-tab-pane>
                    <el-tab-pane>
                        <span slot="label">Month</span>
                        <line-chart v-bind:params="ticketCountChartParams.data.month" :label="ticketCountChartParams.label" class="stackedBarChart"></line-chart>
                    </el-tab-pane>
                    <el-tab-pane>
                        <span slot="label">Year</span>
                        <line-chart v-bind:params="ticketCountChartParams.data.year" :label="ticketCountChartParams.label" class="stackedBarChart"></line-chart>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </el-col>
        <el-col :span="12">
            <div class="grid-content bg-purple top-right-graph">
                <div class="dashboard-section-label">Issue resolved by KB</div>
                <el-tabs type="border-card">
                    <el-tab-pane>
                        <span slot="label">Day</span>
                        <line-chart :params="knowledgeBaseChartParams.data.day" :label="knowledgeBaseChartParams.label" class="stackedBarChart"></line-chart>
                    </el-tab-pane>
                    <el-tab-pane>
                        <span slot="label">Week</span>
                        <line-chart :params="knowledgeBaseChartParams.data.week" :label="knowledgeBaseChartParams.label" class="stackedBarChart"></line-chart>
                    </el-tab-pane>
                    <el-tab-pane>
                        <span slot="label">Month</span>
                        <line-chart :params="knowledgeBaseChartParams.data.month" :label="knowledgeBaseChartParams.label" class="stackedBarChart"></line-chart>
                    </el-tab-pane>
                    <el-tab-pane>
                        <span slot="label">Year</span>
                        <line-chart :params="knowledgeBaseChartParams.data.year" :label="knowledgeBaseChartParams.label" class="stackedBarChart"></line-chart>
                    </el-tab-pane>
                </el-tabs>
            </div>

        </el-col>
    </el-row>
    <el-row :gutter="20">
        <el-col :span="24">
            <div class="grid-content bg-purple command-system-container">
                <div class="dashboard-section-label">Transactions by Model Type</div>
                <bar-chart :params="transactionByModelTypeChartParams" class="barChart"></bar-chart>
            </div>
        </el-col>

    </el-row>
    <div v-if="!isAdmin">
        <el-row :gutter="20">
            <el-col :span="12">
                <div class="grid-content bg-purple command-system-container">
                    <div class="dashboard-section-label">Commands by System</div>
                    <bar-chart :params="commandChartParams" class="barChart"></bar-chart>
                </div>
            </el-col>

            <el-col :span="12">
                <div class="grid-content bg-purple commands-nalysis-container">
                    <div class="dashboard-section-label">Commands Analysis</div>
                    <stacked-bar-chart class="stackedBarChart"></stacked-bar-chart>
                </div>
            </el-col>
        </el-row>

        <el-row :gutter="20">
            <el-col :span="8">
                <div class="grid-content bg-purple commands-container">
                    <div class="dashboard-section-label">Commands</div>
                    <doughnut-chart class="doughnutChart"></doughnut-chart>
                </div>
            </el-col>
            <el-col :span="16">
                <div class="topUsers-container">
                    <div class="grid-content bg-purple">
                        <div class="dashboard-section-label">Recent Registrations</div>
                        <DataTable :parameters="registrationParam"></DataTable>
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="12">
                <div class="grid-content bg-purple command-system-container transaction-chart">
                    <div class="dashboard-section-label">API Transactions by Models</div>
                    <bar-chart :params="modelChartParams" class="barChart"></bar-chart>
                </div>
            </el-col>

            <el-col :span="12">
                <transaction-chart></transaction-chart>
            </el-col>
        </el-row>
    </div>

</div>
</template>

<script>
import DataTable from "../../components/DataTable.vue";
import SystemCount from "../../components/Dashboard/SystemCount.vue";
import BarChart from "../../components/Dashboard/BarChart.vue";
import DoughnutChart from "../../components/Dashboard/DoughnutChart.vue";
import StatementsByCustomer from "../../components/Dashboard/StatementsByCustomer.vue";
import UserCount from "../../components/Dashboard/UserCount.vue";
import StackedBarChart from "../../components/Dashboard/StackedBarChart.vue";
import LineChart from "../../components/Dashboard/LineChart.vue";
import CountTilesModule from "../../components/Dashboard/CountTilesModule.vue";
import AjaxService from "../../services/AjaxService";
import activeUserChart from "../../components/Dashboard/ActiveUserChart.vue";
import transactionChart from "../../components/Dashboard/TransactionsByTimeChart.vue";
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import _ from 'lodash'

export default {
    name: "Dashboard",
    data() {
        return {
            usersChartParams: { 'endpoint': '/portal/api/active-users', 'label': 'Active Users' },
            transactionsChartParams: { 'endpoint': '/portal/api/transactions-time', 'label': 'API Transactions' },
            modelChartParams: { 'endpoint': '/portal/api/transactions-model', 'label': 'API Transactions' },
            commandChartParams: { 'endpoint': '/portal/api/statements-system', 'label': 'Commands' },
            ticketCountChartParams: { 'data': '', 'label': 'Tickets Created' },
            knowledgeBaseChartParams: { 'data': '', 'label': 'Issue resolved by Knowledge Base' },
            transactionByModelTypeChartParams: '',
            app1: 0,
            registrationParam: {
                apiName: "/portal/api/recent-registration",
                showPaginationOptions: false,
                showSelectOptions: false,
                showSortOptions: false,
                showHeader: false,
                tableName: "DashboardRegisterDevice",
                isRestify: false
            },
            tabPosition: "top",
            customerCount: "",
            masterSystemCount: "",
            trainingCount: "",
            transactionCount: "",
            isAdmin: true,
            countBlockSpan: 6
        };
    },
    computed: {

        getUserCountSpan() {
            let span = this.isAdmin ? 12 : 15
            return span
        },

        getSystemCountSpan() {
            let span = this.isAdmin ? 12 : 9
            return span
        }

    },
    components: {
        SystemCount,
        BarChart,
        StatementsByCustomer,
        UserCount,
        DoughnutChart,
        DataTable,
        StackedBarChart,
        CountTilesModule,
        activeUserChart,
        transactionChart,
        LineChart,
        VuePerfectScrollbar
    },
    methods: {
        getGraphData() {
            AjaxService.getJson("/portal/api/graph-data", null, (error, res) => {
                if (res) {
                    this.ticketCountChartParams = Object.assign(this.ticketCountChartParams, { 'data': res.data.ticketCreationData });
                    this.knowledgeBaseChartParams = Object.assign(this.knowledgeBaseChartParams, { 'data': res.data.kbResolvedIssuesData });
                    this.transactionByModelTypeChartParams = Object.assign({}, { 'data': res.data.transactionsByModelType, 'label': 'Transactions' });

                } else {
                    console.log("error occured");
                }
            });
        }

    },
    beforeMount() {
        let user = this.$store.getters.user;
        this.isAdmin = user.roles.includes("admin") ? true : false
        this.getGraphData()
    }
};
</script>

<style lang="scss">
.DA{
    margin-bottom: 12px;
}

.system-count-container{
    margin-bottom:2px !important;
    .el-row{
        margin-bottom:12px !important;
    }
    
}
.center-align{
    text-align:center;
}
.flex > .box.grow {
    width: 100% !important;
}
.page-dashboard {
    overflow-y: auto !important;
}

.transaction-chart {
    height: 375px;
}

.barChart canvas {
    width: 100% !important;
    height: 300px !important;
    position: relative;
}

.stackedBarChart {
    height: 300px;
}

.stackedBarChart canvas {
    width: 100% !important;
    height: 300px !important;
    position: relative;
}

.doughnutChart canvas {
    width: 100% !important;
    position: relative;
    height: 278px !important;
}

.commands-nalysis-container {
    .stackedBarChart canvas {
        width: 100% !important;
        height: 315px !important;
        position: relative;
        // margin-left: -27px !important;
    }
}

.radio-switcher {
    display: inline-block;
    float: right;
    margin-right: 16px;

    .el-radio-button__inner {
        padding: 6px;
        font-size: 12px;
    }
}

.page-dashboard {

    .chart-container,
    .registrations-container,
    .topUsers-container {
        .page-vue-good-table {
            box-shadow: none !important;
        }

        .vue-good-table-box {
            padding: 16px;
        }

        // th {
        //   color: #56a6f1 !important;
        // }
    }

    .el-row {
        margin-bottom: 20px;

        &:last-child {
            margin-bottom: 0;
        }
    }

    .el-col {
        border-radius: 4px;
    }

    .bg-purple-dark {
        background: #99a9bf;
    }

    .bg-purple {
        background: #ffffff;
    }

    .bg-oranges {
        background: #56f19a;
        color: #ffffff;
    }

    .bg-oranges-2 {
        background: #a1dd70;
        color: #ffffff;
    }

    .bg-oranges-3 {
        background: #97cf6a;
        color: #ffffff;
    }

    .bg-purple-light {
        background: #e5e9f2;
    }

    .grid-content {
        border-radius: 5px;
        min-height: 327px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
        position: relative;
    }

    .registered-container {
        min-height: 135px !important;

        .users-count {
            margin-top: -12px;
        }
    }

    .row-bg {
        padding: 10px 0;
        background-color: #f9fafc;
    }

    .grid-content-sub {
        border-radius: 5px;
        min-height: 36px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
    }

    .systems-container {
        height: 135px !important;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
    }

    .top-left-values {
        // height: 97px;
    }

    .top-left-values-big {
        height: 190px;
    }

    .dashboard-section-label {
        font-weight: 700;
        padding-left: 16px;
        padding-top: 8px;
    }

    .counter {
        font-size: 31px;
        font-weight: bold;
        padding-left: 16px;
        margin-top: 10px;
    }

    .vb-content {
        padding: 0 20px;
        box-sizing: border-box !important;
        margin-top: -5px;
        margin-left: -20px;
        margin-right: -20px;
        height: calc(100% + 15px) !important;
        width: calc(100% + 40px) !important;
    }

    canvas {
        // position: relative;
    }

    .top-right-graph {
        position: relative;
    }

    //Active users style
    .command-system-container {
        overflow: hidden;

        .stackedBarChart {
            margin-top: -16px;
        }
    }

    .el-tabs--border-card {
        border: 0;
        box-shadow: none;
        overflow: hidden;

        .el-tabs__header {
            position: absolute;
            right: 16px;
            top: 10px;
            background-color: #fff;
            border-bottom: 0;

            .el-tabs__nav {
                overflow: hidden;
            }

            .el-tabs__nav {
                border: 0.5px solid rgba(112, 112, 112, 0.5);
                border-radius: 3px;
            }

            .el-tabs__item {
                pointer-events: auto;
                height: 25px;
                line-height: 25px;
                padding: 0 12px;
                font-size: 12px;
                border-left: 0;
                border-right: 0;
            }

            .is-active {
                background-color: rgba(0, 93, 166, 1) !important;
                color: #fff !important;
                border-left: 0;
                border-right: 0;
            }
        }
    }

    // endActive users style

    .commands-container {
        canvas#doughnut-chart {
            height: 278px !important;
        }
    }

}

@media (max-width: 768px) {
    .page-dashboard {
        .vb-content {
            padding: 0 5px !important;
            margin: -5px;
            width: calc(100% + 10px) !important;
        }
    }
}
</style>
