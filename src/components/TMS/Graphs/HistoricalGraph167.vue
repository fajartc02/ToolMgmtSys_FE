<template>
  <div id="chart">
    <apexchart
      type="line"
      height="350"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </div>
</template>
<script>
import VueApexCharts from 'vue3-apexcharts'
export default {
  name: 'HistoricalGraph167',
  data() {
    return {
      series: [
        {
          name: 'Actual',
          data: [10000, 10000, 10000, 10000, 9100, 9100, 9100, 9100],
        },
        {
          name: 'Standard',
          data: [10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000],
        },
      ],
      chartOptions: {
        chart: {
          height: 350,
          type: 'line',
          zoom: {
            enabled: false,
          },
        },
        forecastDataPoints: {
          count: 4,
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: 'straight',
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
      },
    }
  },
  components: {
    apexchart: VueApexCharts,
  },
}
</script>
<style></style>
