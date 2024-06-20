<script>
import { Bar } from "vue-chartjs";
import AjaxService from "../../services/AjaxService";
import { _ } from "vue-underscore";

export default {
  name: "BarChartMonth",
  props: ["params"],
  data() {
    return {
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              ticks: {
                fontSize: 10,
                beginAtZero: true,
                   userCallback: function(label, index, labels) {
             if (Math.floor(label) === label) {
               return label;
             }

           },
              }
           
            }
          ],
          xAxes: [
            {
              ticks: {
                fontSize: 10,
                autoSkip: false,
                maxRotation: 90,
                minRotation: 90
              }
           
            }
          ]
        },
        legend: {
          display: false
        }
      },
      datacollection: {
        datasets: [
          {
            backgroundColor: "#6DB7FC",
            data: []
          }
        ],
        labels: []
      }
    };
  },
  extends: Bar,
  methods: {
    chartData() {
      let self = this;
   AjaxService.getJson(this.params.endpoint, {'usecase':this.params.usecase}, (error, res) => {
        if (res) {
          let monthData = res.data.response[0].month;
          this.datacollection.labels = _.pluck(monthData, "date");
          this.datacollection.datasets[0].data = _.pluck(monthData, "count");
          this.datacollection.datasets[0].label = this.params.label;
          this.renderChart(this.datacollection, this.options);
        }
      });
    }
  },
  beforeMount() {
    this.chartData();
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


