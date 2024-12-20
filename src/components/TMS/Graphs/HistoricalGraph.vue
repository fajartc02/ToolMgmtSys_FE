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
          enabled: true,
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
        // console.log('series', this.series)

        // Ambil nilai standard dari series Standard
        const standardData = this.series[1]?.data || [] // Mengambil data Standard, jika ada
        const standardValue = standardData.length > 0 ? standardData[0] : null // Ambil nilai pertama dari Standard

        this.chartOptions = {
          chart: {
            height: 350,
            type: 'line',
            zoom: {
              enabled: false,
            },
          },
          dataLabels: {
            enabled: true,
            formatter: function (val, opts) {
              // Hanya tampilkan data label untuk seri "Actual"
              return opts.seriesIndex === 0 ? val : undefined // Ganti 0 dengan indeks seri Actual
            },
          },
          stroke: {
            width: 5,
            curve: 'straight',
            dashArray: [0, 8],
          },
          title: {
            text: 'Tool Counter Status',
            align: 'left',
          },
          grid: {
            row: {
              colors: ['#f3f3f3', 'transparent'], // Warna latar belakang baris
              opacity: 0.5,
            },
          },
          xaxis: {
            categories: this.GET_GRAPH.categories,
            axisBorder: {
              show: true, // Menampilkan garis sumbu X
              color: '#000', // Warna hitam untuk sumbu X
            },
            axisTicks: {
              show: true, // Menampilkan ticks di sumbu X
              color: '#000', // Warna hitam untuk ticks
            },
          },
          yaxis: {
            axisBorder: {
              show: true, // Menampilkan garis sumbu Y
              color: '#000', // Warna hitam untuk sumbu Y
            },
            axisTicks: {
              show: true, // Menampilkan ticks di sumbu Y
              color: '#000', // Warna hitam untuk ticks
            },
          },
          annotations:
            standardValue !== null
              ? {
                  yaxis: [
                    {
                      y: standardValue, // Menggunakan nilai Standard untuk anotasi

                      label: {
                        borderColor: '#FEB019',
                        style: {
                          color: '#fff',
                          background: '#FEB019',
                        },
                        text: `Standard: ${standardValue}`, // Teks anotasi
                      },
                    },
                  ],
                }
              : {}, // Jika tidak ada nilai Standard, tidak tampilkan anotasi
        }
      }
    },
    // GET_GRAPH: function () {
    //   if (this.GET_GRAPH) {
    //     this.series = this.GET_GRAPH.data

    //     // Ambil nilai minimum dan maksimum dari data "Actual" (seri pertama)
    //     const actualData = this.series[0]?.data || [] // Seri data Actual
    //     const minValue = Math.min(...actualData) // Nilai minimum dari data
    //     const maxValue = Math.max(...actualData) // Nilai maksimum dari data

    //     // Tentukan nilai minimum dan maksimum sumbu Y sebagai kelipatan 100
    //     const yMin = Math.floor(minValue / 100) * 100 // Pembulatan ke bawah ke kelipatan 100
    //     const yMax = Math.ceil(maxValue / 100) * 100 // Pembulatan ke atas ke kelipatan 100

    //     // Ambil nilai standard dari series Standard
    //     const standardData = this.series[1]?.data || []
    //     const standardValue = standardData.length > 0 ? standardData[0] : null

    //     this.chartOptions = {
    //       chart: {
    //         height: 350,
    //         type: 'line',
    //         zoom: {
    //           enabled: false,
    //         },
    //       },
    //       dataLabels: {
    //         enabled: true,
    //         formatter: function (val, opts) {
    //           return opts.seriesIndex === 0 ? val : undefined // Hanya untuk seri "Actual"
    //         },
    //       },
    //       stroke: {
    //         width: 2,
    //         curve: 'straight',
    //         dashArray: [0, 8],
    //       },
    //       title: {
    //         text: 'Tool Counter Status',
    //         align: 'left',
    //       },
    //       grid: {
    //         row: {
    //           colors: ['transparent', 'transparent'], // Tetap menggunakan transparan
    //           opacity: 0.5,
    //         },
    //       },
    //       xaxis: {
    //         categories: this.GET_GRAPH.categories,
    //         axisBorder: {
    //           show: true,
    //           color: '#000',
    //         },
    //         axisTicks: {
    //           show: true,
    //           color: '#000',
    //         },
    //       },
    //       yaxis: {
    //         min: yMin, // Nilai minimum dinamis
    //         max: yMax, // Nilai maksimum dinamis
    //         tickAmount: (yMax - yMin) / 100, // Jumlah ticks (1 tick per kelipatan 100)
    //         axisBorder: {
    //           show: true,
    //           color: '#000',
    //         },
    //         axisTicks: {
    //           show: true,
    //           color: '#000',
    //         },
    //         labels: {
    //           formatter: function (value) {
    //             return value // Tetap tampilkan nilai asli
    //           },
    //         },
    //       },
    //       annotations:
    //         standardValue !== null
    //           ? {
    //               yaxis: [
    //                 {
    //                   y: standardValue,
    //                   label: {
    //                     borderColor: '#FEB019',
    //                     style: {
    //                       color: '#fff',
    //                       background: '#FEB019',
    //                     },
    //                     text: `Standard: ${standardValue}`,
    //                   },
    //                 },
    //               ],
    //             }
    //           : {},
    //     }
    //   }
    // },
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
