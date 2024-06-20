<script>
import { Line } from "vue-chartjs";
import AjaxService from "../../services/AjaxService";
import { _ } from "vue-underscore";
import lodash from "lodash"

export default {
  name: "LineChart",
  props: ["params","label"],
  data() {
    return {
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        scales: {
          yAxes: [{
         type: "linear",
         display: true,
         position: "left",
         id: "y-axis-1",
         labels: {
           show: true,

         },
         ticks: {
           beginAtZero: true,
           userCallback: function(label, index, labels) {
             if (Math.floor(label) === label) {
               return label;
             }

           },
         }

       }]
        }
      },
      datacollection: {
        datasets: [
          {
            label: "",
            backgroundColor: "#6DB7FC",
            data: []
          }
        ],
        labels: []
      }
    };
  },
  extends: Line,
  watch: {
    'params': {
      handler: function (newVal, oldval) {
       
       if(newVal){
      this.renderChartData(newVal)
      return;
    }         
      },
      immediate: true,
      deep: true

    }
  },
  methods: {
  
    renderChartData(data)
    {
          let weekData = data;
          this.datacollection.labels = _.pluck(weekData, "time");
          this.datacollection.datasets[0].data = _.pluck(weekData, "count");
          this.datacollection.datasets[0].label = this.label;
          this.renderChart(this.datacollection, this.options);
    }


  }
};
</script>
<style>
canvas#doughnut-chart {
  left: 0;
  /* position: absolute; */
  top: 0;
}
</style>


