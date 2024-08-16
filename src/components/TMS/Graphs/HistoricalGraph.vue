<template>
  <div v-if="GET_GRAPH.categories.length > 0" id="chart">
    <apexchart
      type="line"
      height="350"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </div>
  <div class="p-2" v-else>
    <h2 class="text-muted text-center">Tidak Ada Grafik</h2>
  </div>
</template>
<script>
import { ACTION_GRAPH, GET_GRAPH } from '@/store/TMS/GRAPH.module'
import VueApexCharts from 'vue3-apexcharts'
import { mapGetters } from 'vuex'
export default {
  name: 'HistoricalGraph',
  data() {
    return {
      series: [],
      chartOptions: {
        chart: {
          height: 350,
          type: 'line',
          zoom: {
            enabled: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          width: 2,
          curve: 'straight',
          dashArray: [0, 8],
        },
        title: {
          text: 'Tool Counter Status',
          align: 'left',
        },
        grid: {
          row: {
            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5,
          },
        },
        xaxis: {
          categories: [
            'REGR#1',
            'REGR#2',
            'REGR#3',
            'REGR#4',
            'REGR#5',
            'REGR#6',
            'REGR#7',
            'REGR#8',
          ],
        },
        annotations: {
          points: [],
        },
      },
    }
  },
  components: {
    apexchart: VueApexCharts,
  },
  computed: {
    ...mapGetters([GET_GRAPH]),
  },
  watch: {
    tool_qr: function () {
      console.log(this.tool_qr)
      if (this.tool_qr)
        this.$store.dispatch(ACTION_GRAPH, {
          tool_qr: this.tool_qr,
          system_activity: this.system_activity,
        })
    },
    GET_GRAPH: function () {
      if (this.GET_GRAPH) {
        this.series = this.GET_GRAPH.data
        this.chartOptions = {
          chart: {
            height: 350,
            type: 'line',
            zoom: {
              enabled: false,
            },
          },
          dataLabels: {
            enabled: false,
          },
          stroke: {
            width: 2,
            curve: 'straight',
            dashArray: [0, 8],
          },
          title: {
            text: 'Tool Counter Status',
            align: 'left',
          },
          grid: {
            row: {
              colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
              opacity: 0.5,
            },
          },
          xaxis: {
            categories: this.GET_GRAPH.categories,
          },
          annotations: this.GET_GRAPH.annotations,
        }
      }
    },
  },
  props: {
    tool_qr: String,
    system_activity: String,
  },
  async mounted() {
    await this.$store.dispatch(ACTION_GRAPH, {
      tool_qr: this.tool_qr,
      system_activity: this.system_activity,
    })
  },
}
</script>
<style></style>
