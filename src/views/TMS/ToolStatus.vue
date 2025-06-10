<template>
  <div class="container-fluid">
    <div class="card">
      <div class="d-flex justify-content-center align-items-center">
        <div class="input-group">
          <span class="input-group-text">Scan QR</span>
          <input
            id="qr-input"
            type="text"
            class="form-control"
            placeholder="Scan your tools"
            v-model="search.tool_qr"
          />
        </div>
      </div>
    </div>
    <CardToolStatus v-if="search.tool_qr != ''" :is_footer="false" />

    <!-- Kondisi untuk tool_qr selain A0167 dan A0256 -->
    <div
      v-if="
        search.tool_qr !== 'A0167' &&
        search.tool_qr !== 'A0256' &&
        search.tool_qr != ''
      "
      class="row"
    >
      <!-- Jika chartDataList ada isinya -->
      <template v-if="chartDataList.length > 0 && search.tool_qr.length >= 5">
        <div class="col mt-1">
          <div
            v-for="(chartData, index) in chartDataList"
            :key="index"
            class="mb-1"
            ref="chartCard"
          >
            <div class="card">
              <div class="card-body">
                <h5>{{ chartData.measuring_portion }}</h5>
                <apexchart
                  type="line"
                  height="300"
                  :options="chartData.chartOptions"
                  :series="chartData.series"
                ></apexchart>
              </div>
            </div>
          </div>
        </div>
        <div class="col">
          <div class="card mt-1">
            <HistoricalGraphVue
              :tool_qr="search.tool_qr"
              :system_activity="'USED'"
            />
          </div>
        </div>
      </template>

      <!-- Jika chartDataList kosong -->
      <template v-else>
        <div class="col-12">
          <div class="card mt-3 text-center">
            <div class="card-body">
              <h1 class="text-muted">Data belum Tersedia</h1>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Kondisi khusus hanya untuk A0167 atau A0256 -->
    <div
      v-if="search.tool_qr === 'A0167' || search.tool_qr === 'A0256'"
      class="col-12"
    >
      <div class="card mt-1">
        <HistoricalGraph167 v-if="search.tool_qr === 'A0167'" />
        <HistoricalGraphVue2 v-else-if="search.tool_qr === 'A0256'" />
      </div>
    </div>

    <div
      v-if="search.tool_qr != ''"
      class="d-flex justify-content-center align-items-start mt-2"
    >
      <div class="card" style="width: 100%">
        <div class="card-header">
          <h6 class="text-center m-0">Tools Historical</h6>
        </div>
        <div class="card-body p-0">
          <table
            style="text-align: center"
            class="table table-bordered table-striped"
          >
            <thead>
              <tr>
                <th>Activity</th>
                <th>Detail Activity</th>
                <th>Date</th>
                <th>Tool Name</th>
                <th>Position</th>
                <th>Regrinding</th>
                <th>Std Counter</th>
                <th>Actual Counter</th>
                <th>Problem</th>
                <th>PIC</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="GET_TOOL_HISTORIES.length > 0">
                <tr
                  v-for="toolHistory in GET_TOOL_HISTORIES"
                  :key="toolHistory.id"
                >
                  <td>{{ toolHistory.system_activity }}</td>
                  <td>{{ toolHistory.distribution_nm }}</td>
                  <td>{{ toolHistory.date_check }}</td>
                  <td>{{ toolHistory.tool_no }}</td>
                  <td>{{ toolHistory.machine_nm }}</td>
                  <td>{{ toolHistory.reg_cnt }}</td>
                  <td>{{ toolHistory.std_counter }}</td>
                  <td>{{ toolHistory.act_counter }}</td>
                  <td>{{ toolHistory.system_problem }}</td>
                  <td>{{ toolHistory.pic_check }}</td>
                </tr>
              </template>
              <template v-else>
                <tr>
                  <th colspan="10">
                    <h3 class="text-center text-muted bg-transparent">
                      No data found
                    </h3>
                  </th>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
        <div class="card-footer">
          <div class="d-flex justify-content-between">
            <!-- Show per page selector -->
            <div>
              <label class="m-0">Show</label>
              <select class="form-select" v-model="meta.itemsPerPage">
                <option
                  v-for="itemsPerPage in [25, 50, 100]"
                  :key="itemsPerPage"
                  :value="itemsPerPage"
                >
                  {{ itemsPerPage }}
                </option>
              </select>
            </div>
            <!-- Pagination component -->
            <div>
              <label class="m-0">Page</label>
              <PaginationMaster
                :currentPage="meta.currentPage"
                :totalData="meta.totalData"
                :itemsPerPage="meta.itemsPerPage"
                @page-changed="handlePageChange"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <PleaseScanQRTools v-if="search.tool_qr == ''" />
  </div>
</template>
<script>
import CardToolStatus from '@/components/TMS/Cards/CardToolStatus.vue'
import PleaseScanQRTools from '@/components/TMS/PleaseScanQRTools.vue'

import {
  ACTION_GET_GRAFIK_QUALITY,
  ACTION_GET_TOOL_HISTORY,
  ACTION_TOOL_DETAILS,
  GET_HISTORY_QUALITY,
  GET_TOOL_DETAILS,
  GET_TOOL_HISTORIES,
} from '@/store/TMS/TOOLS.module'

import HistoricalGraph167 from '@/components/TMS/Graphs/HistoricalGraph167.vue'
import HistoricalGraphVue from '@/components/TMS/Graphs/HistoricalGraph.vue'
import HistoricalGraphVue2 from '@/components/TMS/Graphs/HistoricalGraph2.vue'
import { mapGetters } from 'vuex'
import { GET_META } from '@/store/TMS/META.module'
import VueApexCharts from 'vue3-apexcharts'
import moment from 'moment-timezone'
import PaginationMaster from '@/components/TMS/Pagination/PaginationMaster.vue'

export default {
  name: 'ToolStatus',

  data() {
    return {
      meta: {
        totalData: 0,
        currentPage: 1,
        itemsPerPage: 25,
        totalPages: 1,
      },
      search: {
        tool_qr: '',
      },
      toolHistories: [
        // IN USED,SETTING,REGRINDING,SCRAB,NEW,USED
        // {
        //   id: 1,
        //   activity: "IN USED",
        //   date: "2024-06-05 09:00",
        //   toolName: "Drill DSDW-0001-1",
        //   location: "Tool Regrinding",
        //   actualCounter: "201",
        //   stdCounter: "200",
        //   pic: "Bambang",
        //   notes: "",
        // },
        // {
        //   id: 2,
        //   activity: "SETTING",
        //   date: "2024-06-03 09:00",
        //   toolName: "Drill DSDW-0001-1",
        //   location: "Clean Room",
        //   actualCounter: "201",
        //   stdCounter: "200",
        //   pic: "Bambang",
        //   notes: "",
        // },
        // {
        //   id: 3,
        //   activity: "IN USED",
        //   date: "2024-07-01 09:00",
        //   toolName: "Drill DSDW-0001-1",
        //   location: "Cylinder Head | IMSP-0001",
        //   actualCounter: "",
        //   stdCounter: "200",
        //   pic: "Dedi M.",
        //   notes: "",
        // },
        // {
        //   id: 4,
        //   activity: "SETTING",
        //   date: "2024-06-29 09:00",
        //   toolName: "Drill DSDW-0001-1",
        //   location: "Clean Room",
        //   actualCounter: "201",
        //   stdCounter: "200",
        //   pic: "Bambang",
        //   notes: "",
        // },
        // {
        //   id: 5,
        //   activity: "REGRINDING",
        //   date: "2024-06-29 08:00",
        //   toolName: "Drill DSDW-0001-1",
        //   location: "Tool Regrinding",
        //   actualCounter: "201",
        //   stdCounter: "200",
        //   pic: "Bambang",
        //   notes: "",
        // },
        // {
        //   id: 6,
        //   activity: "NEW",
        //   date: "2024-06-29 08:00",
        //   toolName: "Drill DSDW-0001-1",
        //   location: "Tool Regrinding",
        //   actualCounter: "201",
        //   stdCounter: "200",
        //   pic: "Bambang",
        //   notes: "",
        // },
      ],
      chartDataList: [],
    }
  },
  computed: {
    ...mapGetters([
      GET_TOOL_DETAILS,
      GET_META,
      GET_TOOL_HISTORIES,
      GET_HISTORY_QUALITY,
    ]),
  },
  watch: {
    GET_META: function () {
      this.meta = this.GET_META
    },
    'meta.itemsPerPage': function () {
      this.$store.dispatch(ACTION_GET_TOOL_HISTORY, {
        meta: this.meta,
        tool_qr: this.search.tool_qr,
      })
    },
    search: {
      async handler() {
        if (this.search.tool_qr.length === 5) {
          await this.$store.dispatch(ACTION_TOOL_DETAILS, this.search)
          await this.getToolsHistory()
          await this.getGrafikQuality()
        }
        if (this.search.tool_qr.length >= 10) {
          this.search.tool_qr = this.search.tool_qr.slice(5, 11)
        }
      },
      deep: true,
    },
    'search.tool_qr'(newVal) {
      if (!newVal) {
        this.chartDataList = []
      }
    },
  },
  methods: {
    handlePageChange(page) {
      this.meta.currentPage = page
      this.$store.dispatch(ACTION_GET_TOOL_HISTORY, {
        meta: this.meta,
        tool_qr: this.search.tool_qr,
      })
    },
    async getToolsHistory() {
      try {
        await this.$store.dispatch(ACTION_GET_TOOL_HISTORY, {
          meta: this.meta,
          tool_qr: this.search.tool_qr,
        })
      } catch (error) {
        alert(error)
      }
    },
    async getGrafikQuality() {
      try {
        let response = await this.$store.dispatch(ACTION_GET_GRAFIK_QUALITY, {
          tool_qr: this.search.tool_qr,
        })
        if (response.status === 200) {
          const measurementData = response.data.data
          console.log('measurementData', measurementData)

          if (measurementData && Object.keys(measurementData).length > 0) {
            this.prepareChartData(measurementData)
          }
        }
      } catch (error) {
        alert(error)
      }
    },
    // prepareChartData(data) {
    //   // console.log('prepareChartData', data)

    //   this.chartDataList = Object.keys(data).map((measuringPortion) => {
    //     // Mendapatkan dan membalikkan urutan values
    //     const values = data[measuringPortion].values
    //       .map((value) => parseFloat(value))
    //       .reverse() // Membalik urutan values dari yang terakhir ke yang pertama

    //     const upperLimit = parseFloat(data[measuringPortion].upper_limit)
    //     const lowerLimit = parseFloat(data[measuringPortion].lower_limit)

    //     const series = [
    //       {
    //         name: measuringPortion,
    //         data: values,
    //       },
    //     ]

    //     // Mendapatkan dan membalikkan urutan dates
    //     const dates = data[measuringPortion].dates.reverse() // Membalik urutan dates untuk mengikuti urutan values

    //     // Menggunakan dates sebagai categories di xaxis
    //     const categories = dates.map((date) => date) // Menggunakan dates sebagai kategori

    //     // Menghitung nilai minimum dan maksimum untuk menambahkan buffer
    //     const minValue = Math.min(...values, lowerLimit)
    //     const maxValue = Math.max(...values, upperLimit)
    //     const buffer = (maxValue - minValue) * 0.1 // 10% buffer

    //     const chartOptions = {
    //       chart: {
    //         id: `chart-${measuringPortion}`,
    //       },
    //       xaxis: {
    //         categories,
    //         axisBorder: {
    //           show: true, // Menampilkan garis sumbu X
    //           color: '#000', // Warna hitam untuk sumbu X
    //         },
    //         axisTicks: {
    //           show: true, // Menampilkan ticks di sumbu X
    //           color: '#000', // Warna hitam untuk ticks
    //         },
    //       },
    //       yaxis: {
    //         min: minValue - buffer,
    //         max: maxValue + buffer,
    //         axisBorder: {
    //           show: true, // Menampilkan garis sumbu Y
    //           color: '#000', // Warna hitam untuk sumbu Y
    //         },
    //         axisTicks: {
    //           show: true, // Menampilkan ticks di sumbu Y
    //           color: '#000', // Warna hitam untuk ticks
    //         },
    //       },
    //       dataLabels: {
    //         enabled: true,
    //       },
    //       grid: {
    //         xaxis: {
    //           lines: {
    //             show: false, // Menampilkan garis pada sumbu x
    //           },
    //         },
    //         yaxis: {
    //           lines: {
    //             show: false, // Menampilkan garis pada sumbu y
    //           },
    //         },
    //       },
    //       annotations: {
    //         yaxis: [
    //           {
    //             y: upperLimit,
    //             borderColor: '#00E396',
    //             label: {
    //               borderColor: '#00E396',
    //               style: {
    //                 color: '#fff',
    //                 background: '#00E396',
    //               },
    //               text: `Upper Limit: ${upperLimit}`,
    //             },
    //           },
    //           {
    //             y: lowerLimit,
    //             borderColor: '#FEB019',
    //             label: {
    //               borderColor: '#FEB019',
    //               style: {
    //                 color: '#fff',
    //                 background: '#FEB019',
    //               },
    //               text: `Lower Limit: ${lowerLimit}`,
    //             },
    //           },
    //         ],
    //       },
    //     }

    //     return {
    //       measuring_portion: measuringPortion,
    //       chartOptions,
    //       series,
    //     }
    //   })
    //   // console.log('chartDataList', this.chartDataList)
    // },
    prepareChartData(data) {
      this.chartDataList = Object.keys(data).map((measuringPortion) => {
        const measuringData = data[measuringPortion]

        // Gabungkan dates dan values untuk disortir
        const combinedData = measuringData.dates.map((date, index) => ({
          date,
          value: parseFloat(measuringData.values[index]),
        }))

        // Urutkan berdasarkan dates secara ascending
        combinedData.sort((a, b) => {
          const dateA = moment(a.date, 'DD-MM-YYYY')
          const dateB = moment(b.date, 'DD-MM-YYYY')
          return dateA - dateB // Urutkan berdasarkan tanggal
        })

        // Pisahkan kembali ke dalam arrays dates dan values
        const sortedDates = combinedData.map((item) => item.date)
        const sortedValues = combinedData.map((item) => item.value)

        const upperLimit = parseFloat(measuringData.upper_limit)
        const lowerLimit = parseFloat(measuringData.lower_limit)

        const series = [
          {
            name: measuringPortion,
            data: sortedValues,
          },
        ]

        const categories = sortedDates

        const minValue = Math.min(...sortedValues, lowerLimit)
        const maxValue = Math.max(...sortedValues, upperLimit)
        const buffer = (maxValue - minValue) * 0.1

        const chartOptions = {
          chart: {
            id: `chart-${measuringPortion}`,
          },
          xaxis: {
            categories,
            axisBorder: {
              show: true,
              color: '#000',
            },
            axisTicks: {
              show: true,
              color: '#000',
            },
          },
          yaxis: {
            min: minValue - buffer,
            max: maxValue + buffer,
            axisBorder: {
              show: true,
              color: '#000',
            },
            axisTicks: {
              show: true,
              color: '#000',
            },
          },
          dataLabels: {
            enabled: true,
          },
          grid: {
            xaxis: {
              lines: {
                show: false,
              },
            },
            yaxis: {
              lines: {
                show: false,
              },
            },
          },
          annotations: {
            yaxis: [
              {
                y: upperLimit,
                borderColor: '#00E396',
                label: {
                  borderColor: '#00E396',
                  style: {
                    color: '#fff',
                    background: '#00E396',
                  },
                  text: `Upper Limit: ${upperLimit}`,
                },
              },
              {
                y: lowerLimit,
                borderColor: '#FEB019',
                label: {
                  borderColor: '#FEB019',
                  style: {
                    color: '#fff',
                    background: '#FEB019',
                  },
                  text: `Lower Limit: ${lowerLimit}`,
                },
              },
            ],
          },
        }

        return {
          measuring_portion: measuringPortion,
          chartOptions,
          series,
        }
      })

      console.log('chartDataList', this.chartDataList)
    },
  },
  components: {
    CardToolStatus,
    PleaseScanQRTools,
    HistoricalGraphVue,
    HistoricalGraphVue2,
    HistoricalGraph167,
    apexchart: VueApexCharts,
    PaginationMaster,
  },
  mounted() {
    document.getElementById('qr-input').onblur = function () {
      this.focus()
    }
    document.getElementById('qr-input').focus()
  },
}
</script>
