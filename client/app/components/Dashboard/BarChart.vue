<script>
import { Bar } from "vue-chartjs";
import AjaxService from "../../services/AjaxService";
import _ from'lodash'

export default {
  name: "BarChart",
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
                beginAtZero: true
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
    watch: {
    'params': {
      handler: function (newVal, oldval) {
       
       if(!newVal.endpoint && _.has(newVal, 'data') && _.has(newVal, 'label')){
         
      this.renderChartData(newVal)
      return;
    }         
      },
      immediate: true,
      deep: true

    }
  },
  methods: {
    chartData() {
      let self = this;
      AjaxService.getJson(this.params.endpoint, null, (error, res) => {
        if (res) {
          res.data.response.forEach(object => {
            self.datacollection.datasets[0].data.push(object.count);
            self.datacollection.labels.push(object.system);
            self.datacollection.datasets[0].label=this.params.label
          });
          this.renderChart(this.datacollection, this.options);
        }
      });
    },

    renderChartData(res){
          let self = this;
          res.data.forEach(object => {
            self.datacollection.datasets[0].data.push(object.count);
            self.datacollection.labels.push(object.system);
            self.datacollection.datasets[0].label=res.label
          });
          this.renderChart(this.datacollection, this.options);
      
    }
  },
  beforeMount() {
     if(this.params.endpoint){
           this.chartData();
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


