<template>
  <div class="container-fluid">
    <div class="card p-2 mb-2">
      <div class="card p-2 mb-2">
        <div class="d-flex justify-content-between align-items-center">
          <h4 class="text-center m-0">History ReGrinding</h4>
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
        <div v-if="showRegrindingChart" class="card mb-2">
          <RegrindingChart
            v-if="chartRegList.length > 0"
            :chartData="chartRegList"
            :selectedPeriod="selectedPeriod"
          />
          <div v-else class="text-center">
            <h3>Belum Ada Input Regrinding</h3>
          </div>
        </div>

        <div v-if="showChart" id="chart">
          <div
            v-for="(chartData, index) in chartDataList"
            :key="index"
            class="mb-4"
            ref="chartCard"
          >
            <div class="card">
              <div class="card-body">
                <h5>{{ chartData.measuring_portion }}</h5>
                <apexchart
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
              <th>Regrinding Date</th>
              <th>PIC</th>
              <th>Std Counter</th>
              <th>Actual Counter</th>
              <th>Problem</th>
              <th>Data Quality</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="Histories in GET_HISTORIES_TOOL"
              :key="Histories.tool_history_id"
            >
              <td>{{ Histories.no }}</td>
              <td>{{ Histories.tool_no }}</td>
              <td>{{ Histories.tool_qr }}</td>
              <td>{{ Histories.date_check }}</td>
              <td>{{ Histories.pic_check }}</td>
              <td>{{ Histories.std_counter }}</td>
              <td>{{ Histories.act_counter }}</td>
              <td>{{ Histories.system_problem }}</td>
              <td>
                <button
                  class="btn btn-primary"
                  @click="showGrafikMeasurement(Histories.tool_no)"
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
import {
  ACTION_GET_GRAPH_REGRINDING,
  ACTION_GET_HISTORIES_TOOL,
  ACTION_GRAFIK_MEASUREMENTS,
  GET_HISTORIES_TOOL,
  GET_MEASUREMENT_GRAPH,
  GET_REGRINDING_GRAPH,
} from '@/store/TMS/HistoryTool.module'
import { GET_META } from '@/store/TMS/META.module'
import VueApexCharts from 'vue3-apexcharts'
import { mapGetters } from 'vuex'
import RegrindingChart from '@/components/TMS/Graphs/Regrinding.vue'

export default {
  name: 'HistoryRegrinding',
  components: {
    apexchart: VueApexCharts,
    PaginationMaster,
    RegrindingChart,
  },
  data() {
    return {
      showRegrindingChart: true,
      selectedPeriod: 'day',
      meta: {
        totalData: 0,
        currentPage: 1,
        itemsPerPage: 10,
        totalPages: 1,
      },
      showChart: false,
      chartDataList: [],
      chartRegList: [],
    }
  },
  computed: {
    ...mapGetters([
      GET_META,
      GET_HISTORIES_TOOL,
      GET_MEASUREMENT_GRAPH,
      GET_REGRINDING_GRAPH,
    ]),
  },
  watch: {
    GET_META: function () {
      this.meta = this.GET_META
    },
    'meta.itemsPerPage': function () {
      this.$store.dispatch(ACTION_GET_HISTORIES_TOOL, { meta: this.meta })
    },
  },
  mounted() {
    this.$store.dispatch(ACTION_GET_HISTORIES_TOOL, { meta: this.meta })
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
        .dispatch(ACTION_GET_HISTORIES_TOOL, { meta: this.meta })
        .then(() => {
          this.chartDataList = []
        })
    },
    handleClickOutside(event) {
      const chartCards = this.$refs.chartCard || []
      const swalContainer = document.querySelector('.swal2-container') // Selektor untuk container SweetAlert

      const clickedInsideChart = chartCards.some((card) =>
        card.contains(event.target),
      )
      const clickedInsideSwal =
        swalContainer && swalContainer.contains(event.target)

      if (!clickedInsideChart && !clickedInsideSwal) {
        this.showChart = false
        this.showRegrindingChart = true
      }
    },
    async showGrafikMeasurement(tool_no) {
      try {
        // Dispatch action dan terima status serta data
        const response = await this.$store.dispatch(
          ACTION_GRAFIK_MEASUREMENTS,
          tool_no,
        )

        if (response.status === 200 && response.data) {
          const measurementData = response.data
          if (measurementData && Object.keys(measurementData).length > 0) {
            this.prepareChartData(measurementData)
            this.showChart = true
            this.showRegrindingChart = false
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
        const values = data[measuringPortion].values.map((value) =>
          parseFloat(value),
        )
        const upperLimit = parseFloat(data[measuringPortion].upper_limit)
        const lowerLimit = parseFloat(data[measuringPortion].lower_limit)

        const series = [
          {
            name: measuringPortion,
            data: values,
          },
        ]

        const categories = values.map((_, index) => `REG ${index + 1}`)

        // Menghitung nilai minimum dan maksimum untuk menambahkan buffer
        const minValue = Math.min(...values, lowerLimit)
        const maxValue = Math.max(...values, upperLimit)
        const buffer = (maxValue - minValue) * 0.1 // 10% buffer

        const chartOptions = {
          chart: {
            id: `chart-${measuringPortion}`,
          },
          xaxis: {
            categories,
          },
          yaxis: {
            min: minValue - buffer,
            max: maxValue + buffer,
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
    },
    async handlePeriodChange() {
      try {
        const period = this.selectedPeriod
        const response = await this.$store.dispatch(
          ACTION_GET_GRAPH_REGRINDING,
          period,
        )

        if (response.status === 200 && response.data) {
          this.prepareRegrindingChartData(response.data)
        } else {
          this.chartRegList = []
        }
      } catch (error) {
        console.error('Failed to load data:', error)
        this.chartRegList = []
      }
    },

    prepareRegrindingChartData(data) {
      if (this.selectedPeriod === 'day') {
        const hourRanges = [
          '07:30-09:30/21:00-22:00',
          '09:40-11:45/22:10-24:00',
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
            aggregatedData['07:30-09:30/21:00-22:00']++
          } else if (
            (hour >= 9 && hour < 11) ||
            (hour === 11 && minute <= 45) ||
            (hour >= 22 && hour < 24)
          ) {
            aggregatedData['09:40-11:45/22:10-24:00']++
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

        this.chartRegList = Object.keys(aggregatedData).map((hourRange) => ({
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

        this.chartRegList = Object.keys(aggregatedData).map((date) => ({
          label: date,
          value: aggregatedData[date],
        }))
      }
      this.chartOptions = {
        chart: {
          id: 'regrinding-chart',
        },
        xaxis: {
          categories: this.chartRegList.map((item) => item.label),
        },
        yaxis: {
          title: {
            text: 'Jumlah Regrinding',
          },
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
      }

      console.log('Prepared chart data:', this.chartRegList)
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
</style>
