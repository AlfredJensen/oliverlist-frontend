<script>
import { Line, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  extends: Line,
  mixins: [reactiveProp],
  props: {
    /*
    chartdata: {
      type: Object,
      default: null
    },*/
    options: {
      type: Object,
      default: null,
      scales: {
            xAxes: [{
               type: 'time',
                distribution: 'series'
            }]
      }
    }
  },
  mounted () {
    this.renderChart(this.chartData, this.options)
  }
}
</script>