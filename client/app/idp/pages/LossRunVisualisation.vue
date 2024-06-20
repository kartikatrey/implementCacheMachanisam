<template>

    <div v-if="showVisualisationPage" class="document-viewer-container">
   
    <el-row v-if="headerFields.length" :gutter="12" class="document-viewer-graph-fields">
        <el-col v-bind:key= field.name v-for="field in headerFields" :span="3" class="card-col header-fields">
            <el-card shadow="always">
                 <div><b>{{field && field.field_config && field.field_config.label}}</b></div>
        <div>{{field && field.value}}</div>
            </el-card>
        </el-col>
       
    </el-row>
    <el-row :gutter="12">
        <el-col v-bind:key= chart.key v-for="chart in lossRunChartsDataRow1" :span="8" class="card-col">
            <el-card  shadow="always" class="box-card idp-card-container idp-total-count">
                <div class="header">{{ chart.key }}</div>
                 <doughnut-chart
                    v-if="chart.type == 'pie'"
                    class="donught-chart-visualisation"
                    :options="chart.options"
                    :name="'one'"
                ></doughnut-chart>
                <stack-bar-chart
                    class="processing-time-wrapper"
                    v-if="chart.type == 'bar'"
                    :options="chart.options"
                    :name="'stacked-bar-processing-time'"
                ></stack-bar-chart>

            </el-card>
        </el-col>
    </el-row>
       <el-row :gutter="12">
        <el-col v-bind:key= chart.key v-for="chart in lossRunChartsDataRow2" :span="8" class="card-col">
            <el-card  shadow="always" class="box-card idp-card-container idp-total-count">
                <div class="header">{{ chart.key }}</div>
                 <doughnut-chart
                    v-if="chart.type == 'pie'"
                    class="donught-chart-visualisation"
                    :options="chart.options"
                    :name="'one'"
                ></doughnut-chart>
                <stack-bar-chart
                    class="processing-time-wrapper"
                    v-if="chart.type == 'bar'"
                    :options="chart.options"
                    :name="'stacked-bar-processing-time'"
                ></stack-bar-chart>

            </el-card>
        </el-col>
    </el-row>
    </div>
</template>

    
<script>
  
    // import PackageViewer from '../components/PackageViewer.vue'
    import StackBarChart from "../main/charts/StackBarChart.vue";
    import DoughnutChart from "../main/charts/DoughnutChart.vue";
    import Constants from "@/resources/Constants";
    import _ from "lodash";

    import { mapState } from "vuex";
   
    
    export default {
        name: "LossRunVisualisation",
        components: {
            DoughnutChart,
            StackBarChart
        },
        props: [],
        mixins: [],
        data() {
            return {
                showVisualisationPage:true,
                headerFields:[],
                lossRunChartsDataRow1:[],
                lossRunChartsDataRow2:[],
                pieChartOptions: {
                    label: {
                    position: "center",
                    },
                    title: {
                        text: "",
                        left: "center",
                        top: "center",
                        show: true,
                        textStyle: {
                            color: "#718096",
                            fontSize: 10,
                            fontWeight: 800
                        },
                    },
                    grid: {
                        left: '8%',
                        right: '8%',
                        bottom: '0%',
                        top: '12%',
                    },
                    tooltip: {
                        trigger: "item",
                        formatter: "{a} <br/>{b} : {c} ({d}%)",
                    },
                    series: [
                        {
                            selectedMode: "single",
                            name: "",
                            type: "pie",
                            radius: ["42%", "62%"],
                            center: ["50%", "50%"],
                            label: {
                            formatter: "{b|{b}}   {c|{c}}",
                            rich: {
                                a: {
                                color: "#999",
                                lineHeight: 22,
                                align: "center",
                                fontSize: 10,
                                },
                                b: {
                                fontSize: 10,
                                lineHeight: 33,
                                color: "#718096",
                                },
                                c: {
                                fontSize: 10,
                                lineHeight: 33,
                                fontWeight: 900,
                                color: "#4A5568",
                                },
                                pear: {
                                as: "{per|o} ",
                                fontWeight: 900,
                                fontSize: 10,
                                borderRadius: 1000,
                                },
                            },
                        },
                     
                     },
                    ],
                },
                barGraphOptions: {
                    title: {
                    text: "",
                    left: "center",
                    show: false,
                    textStyle: {
                        color: "#718096",
                        fontSize: 11,
                        fontWeight: 0,
                    },
                    },
                    grid: {
                    containLabel: true,
                        left: '8%',
                        right: '8%',
                        bottom: '10%',
                        top: '18%',
                    },
                    xAxis: {
                    type: "category",
                    data: [],
                    },
                    yAxis: {
                    type: "value",
                    data: [],
                    },
                    tooltip: {},
                    legend: {
                    top: 20,
                    data: [],
                    },
                    color: ["#4285F4", "#FB9902", "#EA4335", "#FBBC04"],
                },
            };
    },
    
        methods: {
           
            prepareHeaderData(){
                const customerConfiguration= this.$store.getters["documentViewStore/customerConfiguration"]; 
                // const documentType = this.$store.getters["documentViewStore/documentType"]
                const fieldPredictionData = this.$store.getters["documentViewStore/fieldPredictionData"];
                let visualisationFields = customerConfiguration.visualisation_fields || []
                if(_.isEmpty(visualisationFields)) return;
                this.headerFields = _.chain(fieldPredictionData.prediction)
                                    .filter(item => visualisationFields.includes(item.name))
                                    .uniqBy('name')
                                    .value();

            },
            prepareChartData(){
                
                const fieldPredictionData = this.$store.getters["documentViewStore/fieldPredictionData"];
                const tableData = _.find(fieldPredictionData.prediction, {name: "table"},null);
                if (!tableData) return;
                this.prepareClaimsByLobData(tableData)
                this.prepareClaimsIncurredByLobData(tableData)
                this.prepareLossRunStatusData(tableData)
                this.prepareClaimsByYearData(tableData)
                this.prepareClaimsIncurredByYearData(tableData)
                this.prepareClaimsIncurredByReasonData(tableData)
            },

            prepareClaimsByLobData(tableData){
                // Create an object to store the count of cause_loss_des by table_name
                const countCauseLossDesByTable = {};

                // Iterate through the input data
                tableData.data.forEach(item => {
                    const table_name = item.table_name;
                    const content = item.content;

                    // Initialize the count object for the table_name if it doesn't exist
                    if (!countCauseLossDesByTable[table_name]) {
                        countCauseLossDesByTable[table_name] = {};
                    }

                    // Iterate through the rows of the content
                    content.rows.forEach(row => {
                        // Initialize the count for the cause_loss_des if it doesn't exist
                        if (!countCauseLossDesByTable[table_name]) {
                            countCauseLossDesByTable[table_name] = 0;
                        }

                        // Increment the count for the specific cause_loss_des and table_name
                        countCauseLossDesByTable[table_name]++;
                    });
                });
                let series =[]
                for (let key in countCauseLossDesByTable) {
                        let seriesData = {
                            name: key,
                            type: "bar",
                            stack: "stack",
                            data: [],
                            label: {

                                show: true
                            },
                        }
                        seriesData.name=key
                        seriesData.data.push(countCauseLossDesByTable[key])
                        series.push(seriesData)
                }
                let claimsByLobData = _.cloneDeep(this.barGraphOptions)
                claimsByLobData.xAxis["data"] = Object.keys(countCauseLossDesByTable);
                claimsByLobData["series"] = series;
                this.lossRunChartsDataRow1.push({"type":"bar", "key":"Claims # by LOB", "options":claimsByLobData})
                
            },

            prepareClaimsByYearData(tableData){
                
               // Create an object to store the total number of claims per date_loss year per table_name
                const totalClaimsByYear = {};

                // Iterate through the input data
                tableData.data.forEach(item => {
                    const table_name = item.table_name;
                    const content = item.content;

                    // Initialize the total for the table_name if it doesn't exist
                    if (!totalClaimsByYear[table_name]) {
                        totalClaimsByYear[table_name] = {};
                    }

                    // Iterate through the rows of the content
                    content.rows.forEach(row => {
                        const dateLossValueCell = row.find(cell => cell.name === "date_loss")
                        if(!dateLossValueCell) return;
                        const dateLossValue = dateLossValueCell.value;
                        if(isNaN(new Date(dateLossValue))){
                            return;
                        }
                        const year = new Date(dateLossValue).getFullYear(); // Extract the year
                        if(!year) {
                            return;
                        }
                        // Initialize the count for the year if it doesn't exist
                        if (!totalClaimsByYear[table_name][year]) {
                            totalClaimsByYear[table_name][year] = 0;
                        }

                        // Increment the count for the specific year and table_name
                        totalClaimsByYear[table_name][year]++;
                    });
                });
                let series =[]
                for (let key in totalClaimsByYear) {
                        let seriesData = {
                            name: key,
                            type: "bar",
                            stack: "stack",
                            data: [],
                            label: {

                                show: true
                            },
                        }
                        for(let k in totalClaimsByYear[key]){
                            seriesData.data.push(totalClaimsByYear[key][k])
                        }
                        series.push(seriesData)
                }
                let claimsByyearData = _.cloneDeep(this.barGraphOptions)
                claimsByyearData.xAxis["data"] =  Object.keys(totalClaimsByYear[Object.keys(totalClaimsByYear)[0]]);
                claimsByyearData["series"] = series;
                this.lossRunChartsDataRow2.push({"type":"bar", "key":"Claims # by Year", "options":claimsByyearData})
                
            },
            prepareClaimsIncurredByReasonData(tableData){
               
                // Create an object to store the total amount per cause_loss_des
                const totalAmountByCauseLossDes = {};

                // Iterate through the input data
                tableData.data.forEach(item => {
                    const content = item.content;

                    // Iterate through the rows of the content
                    content.rows.forEach(row => {
                        const causeLossDesCell = row.find(cell => cell.name === "cause_loss_des");
                        const amountValueCell = row.find(cell => cell.name === "amount");
                        if (!causeLossDesCell || !amountValueCell) return;
                        const causeLossDes = causeLossDesCell.value;
                        const amountValue = amountValueCell.value;
                        if(!causeLossDes || !amountValue) return;
                        // Remove "$" and commas, then convert to a number
                        const amount = parseFloat(amountValue.replace(/[^0-9.-]+/g, ''));
                        if (isNaN(amount)) {
                            return;
                        }
                        // Initialize the total amount for the cause_loss_des if it doesn't exist
                        if (!totalAmountByCauseLossDes[causeLossDes]) {
                            totalAmountByCauseLossDes[causeLossDes] = 0;
                        }

                        // Add the amount to the total for the specific cause_loss_des
                        totalAmountByCauseLossDes[causeLossDes] += amount;
                    });
                });
                let data = []
                for (let key in totalAmountByCauseLossDes) {
                    data.push({
                                value: totalAmountByCauseLossDes[key],
                                name: key,
                            })
                    }
                let descOptions = _.cloneDeep(this.pieChartOptions);
                descOptions.title.text = "Incurred by Claims Reason"
                descOptions.series[0].data = data
                this.lossRunChartsDataRow2.push({"type":"pie", "key":"Incurred by Claims Reason", "options":descOptions})
                
            },
            prepareClaimsIncurredByLobData(tableData){
                // Create an object to store the total amount per cause_loss_des by table_name
                const totalAmountByCauseLossDes = {};

                // Iterate through the input data
                tableData.data.forEach(item => {
                    const table_name = item.table_name;
                    const content = item.content;
                    // Iterate through the rows of the content
                    content.rows.forEach(row => {
                        const amountValueCell = row.find(cell => cell.name === "amount");
                        if (!amountValueCell) return;
                        const amountValue = amountValueCell.value;
                        if(!amountValue) return;
                        // Remove "$" and commas, then convert to a number
                        const amount = parseFloat(amountValue.replace(/[^0-9.-]+/g, ''));
                        if (isNaN(amount)) {
                            return;
                        }
                        // Initialize the total amount for the lob if it doesn't exist
                        if (!totalAmountByCauseLossDes[table_name]) {
                            totalAmountByCauseLossDes[table_name] = 0;
                        }

                        // Add the amount to the total for the specific table_name
                       totalAmountByCauseLossDes[table_name] += amount;
                    });
                });
                let series =[]
                for (let key in totalAmountByCauseLossDes) {
                        let seriesData = {
                            name: key,
                            type: "bar",
                            stack: "stack",
                            data: [],
                            label: {

                                show: true
                            },
                        }
                        seriesData.name=key
                        seriesData.data.push(totalAmountByCauseLossDes[key])
                        series.push(seriesData)
                }
                let claimsIncurredByLobData = _.cloneDeep(this.barGraphOptions)
                claimsIncurredByLobData.yAxis['axisLabel'] = {formatter: '${value}'}
                claimsIncurredByLobData.xAxis["data"] = Object.keys(totalAmountByCauseLossDes);
                claimsIncurredByLobData["series"] = series;
                this.lossRunChartsDataRow1.push({"type":"bar", "key":"Claims Amount Incurred by LOB", "options":claimsIncurredByLobData})
            },
            
            prepareClaimsIncurredByYearData(tableData){
                const totalAmountsByYear = {};

                // Iterate through the data and calculate the total of amounts
                tableData.data.forEach(item => {
                    const table_name = item.table_name;
                    const content = item.content;

                    // Initialize the total for the table_name if it doesn't exist
                    if (!totalAmountsByYear[table_name]) {
                        totalAmountsByYear[table_name] = {};
                    }

                    content.rows.forEach(row => {
                        const dateLossValueCell = row.find(cell => cell.name === "date_loss")
                        if(!dateLossValueCell) return;
                        const dateLossValue = dateLossValueCell.value;
                        if(isNaN(new Date(dateLossValue))){
                            return;
                        }
                        const year = new Date(dateLossValue).getFullYear(); // Extract the year
                        if(!year) {
                            return;
                        }
                        const amountValueCell = row.find(cell => cell.name === "amount")
                        if(!amountValueCell) return;
                        const amountValue = amountValueCell.value;
                        if(!amountValue) return;

                        // Remove "$" and commas, then convert to a number
                        const amount = parseFloat(amountValue.replace(/[^0-9.-]+/g, ''));
                        if (isNaN(amount)) {
                            return;
                        }
                        // Initialize the total for the year if it doesn't exist
                        if (!totalAmountsByYear[table_name][year]) {
                            totalAmountsByYear[table_name][year] = 0;
                        }

                        // Add the amount to the total for the specific year and table_name
                        totalAmountsByYear[table_name][year] += amount;
                    });
                });

                   let series =[]
                   for (let key in totalAmountsByYear) {
                        let seriesData = {
                            name: key,
                            type: "bar",
                            stack: "stack",
                            data: [],
                            label: {

                                show: true
                            },
                        }
                        for(let k in totalAmountsByYear[key]){
                            seriesData.data.push(totalAmountsByYear[key][k])
                        }
                        series.push(seriesData)
                    }
                    let claimsIncurredByYearData = _.cloneDeep(this.barGraphOptions)
                    claimsIncurredByYearData.yAxis['axisLabel'] = {formatter: '${value}'}
                    claimsIncurredByYearData.xAxis["data"] = Object.keys(totalAmountsByYear[Object.keys(totalAmountsByYear)[0]]);
                    claimsIncurredByYearData["series"] = series;
                    this.lossRunChartsDataRow2.push({"type":"bar", "key":"Claims Amount Incurred by Year", "options":claimsIncurredByYearData})
            },
            prepareLossRunStatusData(tableData){
                // Create an object to store the claim status count
                const claimStatusCount = {};

                // Iterate through the input data
                tableData.data.forEach(item => {
                    const content = item.content;

                    // Iterate through the rows of the content
                    content.rows.forEach(row => {
                        const claimStatusCell = row.find(cell => cell.name === "status")
                        if(!claimStatusCell) return;
                        
                        const claimStatus = claimStatusCell.value;
                        if(!claimStatus) return;

                        // Initialize the count for the claim status if it doesn't exist
                        if (!claimStatusCount[claimStatus]) {
                            claimStatusCount[claimStatus] = 0;
                        }

                        // Increment the count for the specific claim status
                        claimStatusCount[claimStatus]++;
                    });
                });
                let data = []
                for (let key in claimStatusCount) {
                    data.push({
                                value: claimStatusCount[key],
                                name: key,
                            })
                    }
                let statusOptions = _.cloneDeep(this.pieChartOptions);
                statusOptions.title.text = "Claim Status"
                statusOptions.series[0].data = data
                this.lossRunChartsDataRow1.push({"type":"pie","key":"Claim Status","options":statusOptions})

            }
        },
    
        mounted(){
        },
        beforeMount(){
            this.prepareHeaderData();
            this.prepareChartData();
        }
    };
    </script>
    
    <style lang="scss">
    @import "../_idpVariables";
    @import "../_idpGlobal";
    .header-fields{
        width: fit-content;
    }
    .card-col{
    margin-bottom: 12px;
}

    .idp-card-container {
    box-shadow: none;
    border:1px solid var(--dark-08);
    padding:1.5rem 2rem 2rem 2rem;
    max-height: 375px;
    
    }
    .donught-chart-visualisation{
        .echarts {
                 width: auto;
                height: 27rem;
            }
    }
    
    .idp-card-container:hover  {
        box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    }

    .idp-total-count {
      .el-card__header {
          text-align: center;
      }
    }

      .document-viewer-container{
        margin-top: 70px;
        .back-button {
                    border-radius: var(--space-xs);
                    transform: rotate(35deg);
                    border: 0px solid  var(--dark-04);
                    width: 32x;
                    height: 32px;
                    border-radius: 100px;
                    z-index: 999;
                    margin-left: 1.4rem;
                    margin-top: 0;
                    top: 14px;
                    background: transparent;
                    font-size: 1.8rem;
                    display: block;
                    color: var(--dark-04);
                    padding: var(--space-xs);
    
                }
                .el-card__body{
                    min-height: 100px;

                    b{
                        font-size: 14px;
                    }
                }
    }

    .document-viewer-graph-header{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .document-viewer-graph-fields{
        display: flex;
        // justify-content: center;
        margin: 10px !important;
    }
    
    .toggle-switch-button{
        margin-right: 20px;
        margin-left: auto;
    }
    </style>