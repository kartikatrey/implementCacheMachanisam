<template>
  <div class="avg-time-chart-container dashboard-cards">
     <el-row type="flex" class="graph-toolbar-container">
        <el-col :span="20" class="title-container">
          <div class="header">Process Metrics</div>
        </el-col>
      </el-row>

    <div class="process-metrics-graph" >
      <el-row class="first-row">
        <el-col :span="11" class="processing-time">
          <span class="title">Avg. processing time</span>
          <h1 class="content average-processing-value">
            {{ avgProcessingTime.value }}

            <span class="footer">{{ avgProcessingTime.format }}</span>
          </h1>
          
        </el-col>
        <el-col :span="2"></el-col>
        <el-col :span="11" class="waiting-inbox">
          <span class="title">Avg. waiting time in inbox</span>
          <h1 class="content">
            {{ avgInboxTime.value }}

            <span class="footer">{{ avgInboxTime.format }}</span>
          </h1>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="11" class="waiting-review">
          <span class="title">Avg. waiting time for review</span>
          <h1 class="content">
            {{ avgReviewTime.value }}

            <span class="footer">{{ avgReviewTime.format }} </span>
          </h1>
        </el-col>
        <el-col :span="2"></el-col>

        <el-col :span="11" class="waiting-publish">
          <span class="title">Avg. waiting time for publish</span>
          <h1 class="content">
            {{ avgPublishTime.value }}

            <span class="footer">{{ avgPublishTime.format }}</span>
          </h1>
        </el-col>
      </el-row>
    </div>

  </div>
</template>

<script>
// import EventBus from "@/EventBus";
import IdpChartService from "@/services/IdpChartService";

export default {
  name: "AverageTimeChart",
  data() {
    return {
      avgProcessingTime: {value:"00:00",format:"Hours"},
      avgInboxTime: {value:"00:00",format:"Hours"},
      avgPublishTime: {value:"00:00",format:"Hours"},
      avgReviewTime: {value:"00:00",format:"Hours"}
    };
  },
  props: ["span","defaultQuery"],
  computed: {},
  methods: {
    convertSecondsInDaysHrsFormat(timeInseconds) {

        let avgTime = {value: '00:00',format:"Hours"} ;

        function isNumber(n) {
          return !isNaN(parseFloat(n)) && isFinite(n);
        }

        if(!isNumber(timeInseconds)) return avgTime;

        timeInseconds = Number(timeInseconds)
        timeInseconds = timeInseconds *1000; // convert to milliseconds
        let seconds = (timeInseconds/1000);
        let minutes = parseInt(seconds/60, 10);
        seconds = seconds%60;
        let hours = parseInt(minutes/60, 10);
        minutes = minutes%60;

        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        
        avgTime.value = hours + ':' + minutes;
        return avgTime
    },
    async init(){
      try{
        let chartResult = await IdpChartService.getChartData({
            chart_name: "AverageTimeChart",
            query: this.defaultQuery || {}
        });
         this.avgProcessingTime = this.convertSecondsInDaysHrsFormat(
          chartResult.average_processing_time
        );
        this.avgInboxTime = this.convertSecondsInDaysHrsFormat(
          chartResult.inbox_time
        );
        this.avgPublishTime = this.convertSecondsInDaysHrsFormat(
          chartResult.publish_time
        );
        this.avgReviewTime = this.convertSecondsInDaysHrsFormat(
          chartResult.review_time
        );
      }catch(exception){
        console.log(exception)
      }
      finally{
        this.$store.commit('dashboardStore/setdashboardComponentStatus','AverageTimeChart');
      }
    }
  },
  components: {},
  created() {},
  mounted() {},
  beforeDestroy() {},
  beforeMount() {
   this.init();
  },
};
</script>

<style lang="scss">
@import "../../_idpGlobal";

.avg-time-chart-container {
  text-align: left;

  .process-metrics-graph {
      padding: var(--space-xl) 0 0  var(--space-xl);
      // transform: scale(1.07);
  }
  .first-row {
    margin-bottom: 3rem;
    margin-top: 2rem;

  }


  .header {
    font-size:14px;
    text-align: left;
    font-weight: 400;
    text-align: center;
  }

  span.title {
    font-weight: 400;
    font-size: var(--font-sm);
    color: var(--dark-04);
    text-transform:capitalize;
  }

  h1.content {
    margin: 0px;
    font-weight: 700;
    font-size:4rem;
    color: #2f855a;
    line-height: 3.9rem;
    width: auto;
    span.footer {
      font-weight: 400;
      font-size: var(--font-base);
      line-height: 19.6px;
      text-align: initial;
      width: auto;
    }
  }

  span.footer {
    font-weight: 400;
    font-size: var(--font-base);
    line-height: 19.6px;
    color: #2f855a;
  }

  div.waiting-review {
    h1 {
      color: #c53030;

      span.footer {
        font-weight: 400;
        font-size: var(--font-base);
        line-height: 19.6px;
        color: #c53030;
      }
    }
  }
}
</style>
