<script>
import { Doughnut } from "vue-chartjs";
import AjaxService from "../../services/AjaxService";
export default {
  name: "DoughnutChart",
  data() {
    return {
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false
        }
      },
      datacollection: {
        datasets: [
          {
            label: "Statements",
            backgroundColor: ["#529EE5", "#56F19A"],
            data: []
          }
        ],
        labels: ["Success", "Failed"]
      }
    };
  },
  extends: Doughnut,
  methods: {
    chartData() {
      let self = this;
      AjaxService.getJson("/portal/api/statement-status", {}, (error, res) => {
        if (res) {
          let responseData=res.data && res.data.response
          self.datacollection.datasets[0].data.push(responseData["success"]);
          self.datacollection.datasets[0].data.push(responseData["failed"]);
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


