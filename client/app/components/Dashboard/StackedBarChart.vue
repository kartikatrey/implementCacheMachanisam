<script>
import { Bar, mixins } from "vue-chartjs";
import AjaxService from "../../services/AjaxService";
import ColorHash from "color-hash";
import { _ } from "vue-underscore";

export default {
  name: "StackedBarChart",
  extends: Bar,
  data() {
    return {
      chartData: {
        labels: [],
        datasets: []
      },
      options: {
        legend:{
          display:false
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              stacked: true,
              ticks: {
                    fontSize: 10,
                    autoSkip: false,
                    maxRotation: 90,
                    minRotation: 90
                }
            }
          ],
          yAxes: [
            {
              stacked: true,
              ticks: {
                    fontSize: 10
                }
            }
          ]
        }
      }
    };
  },
  methods: {
    getChartData() {
      let self = this;
      AjaxService.getJson("/portal/api/object-statement", null, (error, res) => {
        if (res) {
          let statements = res.data.response.statements;
          let systems = res.data.response.systems;
          self.chartData.labels = systems;
          var colorHash = new ColorHash();
          statements.forEach(object => {
            let sysIndex = _.indexOf(systems, object.system_name);
            let datasetObject = {
              label: object.object_name,
              data: [],
              backgroundColor: colorHash.hex(object.object_name)
            };
            datasetObject.data[sysIndex] = object.count;
            self.chartData.datasets.push(datasetObject);
            datasetObject = {};
          });
        }
        self.$data._chart.update();
      });
    }
  },
  beforeMount() {
    this.getChartData();
  },
  mounted() {
    this.renderChart(this.chartData, this.options);
  }
};
</script>
