<template>
  <div>
    <apexchart
      v-if="chartData.length"
      type="line"
      height="350"
      :options="chartOptions"
      :series="chartSeries"
    ></apexchart>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import moment from 'moment'

export default defineComponent({
  name: 'RegrindingChart',
  components: {
    apexchart: VueApexCharts,
  },
  props: {
    chartData: {
      type: Array,
      required: true,
    },
    selectedPeriod: {
      type: String,
      default: 'day',
    },
  },

  setup(props) {
    const getTitle = () => {
      if (props.selectedPeriod === 'day') {
        return `${moment().format('dddd, D MMMM YYYY')}` // Format hari ini
      } else if (props.selectedPeriod === 'month') {
        return `${moment().format('MMMM YYYY')}` // Format bulan ini
      }
    }

    const chartOptions = computed(() => ({
      chart: {
        id: 'regrinding-chart',
        type: 'line',
        height: 350,
        zoom: {
          enabled: false,
        },
      },
      title: {
        text: getTitle(),
        align: 'center',
        style: {
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#333',
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (val) => val,
        style: {
          fontSize: '12px',
          colors: ['#333'],
        },
        offsetY: -10,
      },
      stroke: {
        curve: 'smooth',
        width: 2,
      },
      xaxis: {
        categories: props.chartData.map((data) => data.label),
        labels: {
          style: {
            colors: '#333',
            fontSize: '12px',
          },
        },
      },
      yaxis: {
        title: {
          text: 'Total Regrindings',
          style: {
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#333',
          },
        },
        labels: {
          style: {
            colors: '#333',
            fontSize: '12px',
          },
        },
      },
      grid: {
        borderColor: '#ddd',
        strokeDashArray: 4,
      },
      tooltip: {
        theme: 'dark',
      },
    }))

    const chartSeries = computed(() => [
      {
        name: 'Regrinding Count',
        data: props.chartData.map((data) => data.value),
      },
    ])

    return {
      chartOptions,
      chartSeries,
    }
  },
})
</script>
