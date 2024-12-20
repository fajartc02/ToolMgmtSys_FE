<template>
  <div class="container-fluid">
    <div class="card p-2 mb-2">
      <div class="card p-2 mb-2">
        <div class="d-flex justify-content-between align-items-center">
          <h4 class="text-center m-0">History Setting</h4>
          <select
            v-model="selectedPeriod"
            class="form-select select-sm"
            @change="handlePeriodChange"
          >
            <option value="" disabled selected>Pilih Periode</option>
            <option value="day">Day</option>
            <option value="month">Month</option>
          </select>
        </div>
      </div>
    </div>
    <div class="card mt-2">
      <div class="card-body">
        <div v-if="showSettingChart" class="card mb-2">
          <SettingChart
            v-if="chartSetList.length > 0"
            :chartData="chartSetList"
            :selectedPeriod="selectedPeriod"
          />
          <div v-else class="text-center">
            <h3>Belum Ada Input Setting</h3>
          </div>
        </div>
        <div v-if="showChart" id="chart">
          <div
            v-for="(chartData, index) in chartDataList"
            :key="index"
            class="mb-4"
            ref="chartCardset"
          >
            <div class="card">
              <div class="card-body">
                <h5>{{ chartData.measuring_portion }}</h5>
                <div v-if="chartData.measuring_portion === 'Internal Coolant'">
                  <p>
                    Status: <strong>{{ chartData.status }}</strong>
                  </p>
                  <ul>
                    <li
                      v-for="(setting, idx) in chartData.categories"
                      :key="idx"
                    >
                      Setting {{ idx + 1 }}: {{ setting }}
                    </li>
                  </ul>
                </div>
                <apexchart
                  v-if="chartData.measuring_portion !== 'Internal Coolant'"
                  type="line"
                  height="350"
                  :options="chartData.chartOptions"
                  :series="chartData.series"
                ></apexchart>
              </div>
            </div>
          </div>
        </div>

        <table
          class="table table-bordered table-striped"
          style="text-align: center"
        >
          <thead>
            <tr>
              <th>No</th>
              <th>Tool ID</th>
              <th>QR Tag</th>
              <th>Setting Date</th>
              <th>PIC</th>
              <th>Data Quality</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="Histories in GET_SETTING_HISTORY"
              :key="Histories.tool_history_id"
            >
              <td>{{ Histories.no }}</td>
              <td>{{ Histories.tool_no }}</td>
              <td>{{ Histories.tool_qr }}</td>
              <td>{{ Histories.date_check }}</td>
              <td>{{ Histories.pic_check }}</td>
              <td>
                <button
                  class="btn btn-primary"
                  @click="grafikSetting(Histories.tool_no)"
                >
                  <i class="fas fa-eye"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="card-footer">
        <div class="d-flex justify-content-between">
          <div>
            <label class="m-0">Show</label>
            <select class="form-select" v-model="meta.itemsPerPage">
              <option
                v-for="itemsPerPage in [10, 25, 50, 100]"
                :key="itemsPerPage"
                :value="itemsPerPage"
              >
                {{ itemsPerPage }}
              </option>
            </select>
          </div>
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
</template>

<script>
import PaginationMaster from '@/components/TMS/Pagination/PaginationMaster.vue'

import { GET_META } from '@/store/TMS/META.module'
import VueApexCharts from 'vue3-apexcharts'
import { mapGetters } from 'vuex'
import SettingChart from '@/components/TMS/Graphs/SettingGraph.vue'
import {
  ACTION_GET_GRAPH_SETTING,
  ACTION_GET_MEASURING_SETTING,
  ACTION_GET_SETTING_HISTORY,
  GET_SETTING_HISTORY,
  GET_SETTING_MEASURE_HISTORY,
} from '@/store/TMS/SettingHistory.module'
import { GET_REGRINDING_GRAPH } from '@/store/TMS/HistoryTool.module'

export default {
  name: 'HistorySetting',
  components: {
    apexchart: VueApexCharts,
    PaginationMaster,
    SettingChart,
  },
  data() {
    return {
      showSettingChart: true,
      selectedPeriod: 'day',
      meta: {
        totalData: 0,
        currentPage: 1,
        itemsPerPage: 10,
        totalPages: 1,
      },
      showChart: false,
      chartDataList: [],
      chartSetList: [],
    }
  },
  computed: {
    ...mapGetters([
      GET_META,
      GET_SETTING_HISTORY,
      GET_SETTING_MEASURE_HISTORY,
      GET_REGRINDING_GRAPH,
    ]),
  },
  watch: {
    GET_META: function () {
      this.meta = this.GET_META
    },
    'meta.itemsPerPage': function () {
      this.$store.dispatch(ACTION_GET_SETTING_HISTORY, { meta: this.meta })
    },
  },
  mounted() {
    this.$store.dispatch(ACTION_GET_SETTING_HISTORY, { meta: this.meta })
    this.handlePeriodChange()
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleClickOutside)
  },
  methods: {
    handlePageChange(page) {
      this.meta.currentPage = page
      this.$store
        .dispatch(ACTION_GET_SETTING_HISTORY, { meta: this.meta })
        .then(() => {
          this.chartDataList = []
        })
    },
    handleClickOutside(event) {
      const chartCards = this.$refs.chartCardset || []
      const swalContainer = document.querySelector('.swal2-container') // Selektor untuk container SweetAlert

      const clickedInsideChart = chartCards.some((card) =>
        card.contains(event.target),
      )
      const clickedInsideSwal =
        swalContainer && swalContainer.contains(event.target)

      if (!clickedInsideChart && !clickedInsideSwal) {
        this.showChart = false
        this.showSettingChart = true
      }
    },
    async grafikSetting(tool_no) {
      try {
        // Dispatch action dan terima status serta data
        const response = await this.$store.dispatch(
          ACTION_GET_MEASURING_SETTING,
          tool_no,
        )
        console.log(response)

        if (response.status === 200 && response.data) {
          const measurementData = response.data
          if (measurementData && Object.keys(measurementData).length > 0) {
            this.prepareChartData(measurementData)
            this.showChart = true
            this.showSettingChart = false
            this.$swal(
              'Success',
              'Data has been loaded successfully',
              'success',
            )
          } else {
            this.chartDataList = []
            this.showChart = false
            this.$swal('Error', 'No data found', 'error')
          }
        } else if (response.status === 404) {
          this.chartDataList = []
          this.showChart = false
          this.$swal('Error', 'No data found', 'error')
        } else {
          this.chartDataList = []
          this.showChart = false
          this.$swal('Error', 'Failed to load data', 'error')
        }
      } catch (error) {
        this.showChart = false
        this.chartDataList = []
        this.$swal('Error', 'Failed to load data', 'error')
      }
    },

    prepareChartData(data) {
      this.chartDataList = Object.keys(data).map((measuringPortion) => {
        const values = data[measuringPortion].values || []
        const upperLimit =
          data[measuringPortion].upper_limit !== null
            ? parseFloat(data[measuringPortion].upper_limit)
            : null
        const lowerLimit =
          data[measuringPortion].lower_limit !== null
            ? parseFloat(data[measuringPortion].lower_limit)
            : null

        let categories = []
        let series = []

        if (measuringPortion === 'Internal Coolant') {
          // Untuk "Internal Coolant", gunakan status OK/NG
          const statuses = values.map((value) => value.value) // Ambil status OK/NG
          categories = values.map((value) => value.date) // Gunakan date sebagai sumbu X
          const numericData = statuses.map((status) =>
            status === 'OK' ? 1 : 0,
          )

          series = [
            {
              name: measuringPortion,
              data: numericData,
            },
          ]

          return {
            measuring_portion: measuringPortion,
            chartOptions: {
              chart: {
                id: `chart-${measuringPortion}`,
              },
              xaxis: {
                categories, // Gunakan date sebagai kategori
              },
              yaxis: {
                min: 0,
                max: 1, // Karena hanya 0 (NG) atau 1 (OK)
              },
            },
            series,
            status: statuses.includes('NG') ? 'NG' : 'OK', // Tentukan status keseluruhan
          }
        } else {
          // Untuk jenis pengukuran lain
          const numericValues = values.map((value) => parseFloat(value.value))
          categories = values.map((value) => value.date) // Gunakan date sebagai kategori

          series = [
            {
              name: measuringPortion,
              data: numericValues,
            },
          ]

          const minValue = Math.min(
            ...numericValues.filter((value) => !isNaN(value)),
            lowerLimit || 0,
          )
          const maxValue = Math.max(
            ...numericValues.filter((value) => !isNaN(value)),
            upperLimit || 0,
          )
          const buffer = (maxValue - minValue) * 0.1 // Buffer 10%

          const chartOptions = {
            chart: {
              id: `chart-${measuringPortion}`,
            },
            xaxis: {
              categories, // Gunakan date sebagai kategori
            },
            dataLabels: {
              enabled: true,
            },
            grid: {
              xaxis: {
                lines: {
                  show: true, // Menampilkan garis pada sumbu x
                },
              },
              yaxis: {
                lines: {
                  show: true, // Menampilkan garis pada sumbu y
                },
              },
            },
            yaxis: {
              min: minValue - buffer,
              max: maxValue + buffer,
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
        }
      })

      console.log('chartDataList', this.chartDataList)
    },
    async handlePeriodChange() {
      try {
        const period = this.selectedPeriod
        const response = await this.$store.dispatch(
          ACTION_GET_GRAPH_SETTING,
          period,
        )

        if (response.status === 200 && response.data) {
          this.prepareSettingChartData(response.data)
        } else {
          this.chartRegList = []
        }
      } catch (error) {
        console.error('Failed to load data:', error)
        this.chartRegList = []
      }
    },

    prepareSettingChartData(data) {
      if (this.selectedPeriod === 'day') {
        const hourRanges = [
          '7:30-9:30/21:00-22:00',
          '9:40-11:45/22:10-24:00',
          '12:30-14:00/00:30-02:30',
          '14:10-16:00/02:40-05:45',
        ]

        const aggregatedData = hourRanges.reduce((acc, range) => {
          acc[range] = 0
          return acc
        }, {})

        data.forEach((item) => {
          const createdDate = new Date(item.created_dt)
          const hour = createdDate.getHours()
          const minute = createdDate.getMinutes()

          if (
            (hour >= 7 && hour < 9) ||
            (hour === 9 && minute <= 30) ||
            (hour >= 21 && hour < 22)
          ) {
            aggregatedData['7:30-9:30/21:00-22:00']++
          } else if (
            (hour >= 9 && hour < 11) ||
            (hour === 11 && minute <= 45) ||
            (hour >= 22 && hour < 24)
          ) {
            aggregatedData['9:40-11:45/22:10-24:00']++
          } else if (
            (hour >= 12 && hour < 14) ||
            (hour === 14 && minute <= 0) ||
            (hour >= 0 && hour < 2) ||
            (hour === 2 && minute <= 30)
          ) {
            aggregatedData['12:30-14:00/00:30-02:30']++
          } else if (
            (hour >= 14 && hour < 16) ||
            (hour === 16 && minute <= 0) ||
            (hour >= 2 && hour < 5) ||
            (hour === 5 && minute <= 45)
          ) {
            aggregatedData['14:10-16:00/02:40-05:45']++
          }
        })

        this.chartSetList = Object.keys(aggregatedData).map((hourRange) => ({
          label: hourRange,
          value: aggregatedData[hourRange],
        }))
      } else if (this.selectedPeriod === 'month') {
        const aggregatedData = {}
        const now = new Date()
        const year = now.getFullYear()
        const month = now.getMonth()

        // Menentukan jumlah hari dalam bulan ini
        const lastDay = new Date(year, month + 1, 0).getDate()

        // Menginisialisasi data untuk setiap hari dalam bulan ini
        for (let day = 1; day <= lastDay; day++) {
          const dateLabel = `${day}`
          aggregatedData[dateLabel] = 0
        }

        data.forEach((item) => {
          const date = new Date(item.created_dt)
          if (date.getMonth() === month && date.getFullYear() === year) {
            const dayOfMonth = date.getDate()
            const dateLabel = `${dayOfMonth}`
            aggregatedData[dateLabel]++
          }
        })

        this.chartSetList = Object.keys(aggregatedData).map((date) => ({
          label: date,
          value: aggregatedData[date],
        }))
      }

      // console.log('Prepared chart data:', this.chartSetList)
    },
  },
}
</script>
<style scoped>
.select-sm {
  width: auto;
  min-width: 100px; /* Atur sesuai kebutuhan */
  margin-left: auto; /* Dorong elemen ke kanan */
}
.table-bordered th,
.table-bordered td {
  border: 1px solid #000 !important;
}
.table-bordered th {
  background-color: rgb(198, 240, 240);
  height: 50px;
}
</style>
