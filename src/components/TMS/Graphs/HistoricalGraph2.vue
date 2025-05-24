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
  name: 'HistoricalGraph',
  data() {
    return {
      series: [
        {
          name: 'Actual',
          data: [10000, 10010, 10015, 10025, 10100, 10100, 10100, 10100],
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
          enabled: true,
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
            '05-11-2024',
            '20-01-2025',
            '15-03-2025',
            '15-05-2025',
            'Challenge',
            'Challenge',
            'Challenge',
            'Challenge',
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
