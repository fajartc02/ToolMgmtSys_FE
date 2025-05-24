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
          data: [10000, 10000, 9985, 9853, 9400, 9300, 9210, 9000],
        },
        {
          name: 'Standard',
          data: [10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000],
          dataLabels: {
            enabled: false,
          },
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
            ' 03-08-2024',
            ' 15-10-2024',
            ' 05-12-2024',
            ' 03-01-2025',
            ' 01-02-2025',
            ' 20-03-2025',
            ' 07-04-2025',
            ' 15-05-2025',
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
