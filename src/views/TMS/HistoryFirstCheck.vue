<template>
  <div class="container-fluid">
    <div class="card p-2 mb-2">
      <div class="card p-2 mb-2">
        <div class="d-flex justify-content-between align-items-center">
          <h4 class="text-center m-0">History First Check</h4>
          <select class="form-control form-select select-sm" v-model="location">
            <option v-for="item in optsLocation" :key="item" :value="item">
              {{ item }}
            </option>
          </select>
        </div>
      </div>
    </div>
  </div>

  <div class="container-fluid" iv>
    <div class="card mt-2">
      <div class="card-body">
        <div v-if="showChart" ref="chartContainer" id="chart">
          <div
            v-for="(chart, index) in chartDataList"
            :key="index"
            class="card mb-3"
          >
            <div class="card-header">
              <h3 class="card-title">{{ chart.measuring_portion }}</h3>
            </div>
            <div class="card-body">
              <div
                v-if="chart.groupedStatuses && chart.groupedStatuses.length > 0"
              >
                <table class="table table-bordered text-center">
                  <thead>
                    <tr>
                      <th>No Work</th>
                      <th>Status</th>
                      <th>Tanggal</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(group, workId) in chart.groupedStatuses"
                      :key="workId"
                    >
                      <td>{{ group.workId }}</td>
                      <td>{{ group.statuses.join(', ') }}</td>
                      <td>{{ group.dates.join(', ') }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-else>
                <apexchart
                  :options="chart.chartOptions"
                  :series="chart.series"
                  type="line"
                  height="350"
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
              <th>Setting Date</th>
              <th>PIC</th>
              <th>Data Quality</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="Histories in GET_TOOLS_BY_LOCATION_FOR_FIRST_CHECK"
              :key="Histories.tool_history_id"
            >
              <td>{{ Histories.no }}</td>
              <td>{{ Histories.tool_no }}</td>
              <td>{{ Histories.created_dt }}</td>
              <td>{{ Histories.pic_check }}</td>
              <td>
                <button
                  class="btn btn-primary"
                  @click="grafikFirstCheck(Histories.tool_no)"
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
                v-for="itemsPerPage in [25, 50, 100]"
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
import {
  ACTION_GET_TOOLS_BY_LOCATION_FOR_FIRST_CHECK,
  GET_TOOLS_BY_LOCATION_FOR_FIRST_CHECK,
} from '@/store/TMS/FirstCheck.module'
import FirstCheckGraph from '@/components/TMS/Graphs/FirstCheckGraph.vue'
import {
  ACTION_GET_GRAPH_FIRST_CHECK_HISTORY,
  GET_HISTORY_GRAPH_FIRST_CHECK,
} from '@/store/TMS/FirstCheckHistory.module'
import moment from 'moment'

export default {
  name: 'HistorySetting',
  components: {
    apexchart: VueApexCharts,
    PaginationMaster,
    FirstCheckGraph,
  },
  data() {
    return {
      showFirstCheckChart: true,
      meta: {
        totalData: 0,
        currentPage: 1,
        itemsPerPage: 25,
        totalPages: 1,
      },
      showChart: false,
      chartDataList: [],
      chartSetList: [],
      optsLocation: [
        'Cam Shaft',
        'Crank Shaft',
        'Cylinder Head',
        'Cylinder Block',
      ],
      location: 'Cylinder Head',
    }
  },
  computed: {
    ...mapGetters([
      GET_META,
      GET_TOOLS_BY_LOCATION_FOR_FIRST_CHECK,
      GET_HISTORY_GRAPH_FIRST_CHECK,
    ]),
  },
  watch: {
    GET_META: function () {
      this.meta = this.GET_META
    },
    'meta.itemsPerPage': function () {
      this.$store.dispatch(ACTION_GET_TOOLS_BY_LOCATION_FOR_FIRST_CHECK, {
        location: this.location,
        meta: this.meta,
      })
    },
  },
  mounted() {
    this.$store.dispatch(ACTION_GET_TOOLS_BY_LOCATION_FOR_FIRST_CHECK, {
      location: this.location,
      meta: this.meta,
    })
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleClickOutside)
  },
  methods: {
    handlePageChange(page) {
      this.meta.currentPage = page
      this.$store
        .dispatch(ACTION_GET_TOOLS_BY_LOCATION_FOR_FIRST_CHECK, {
          location: this.location,
          meta: this.meta,
        })
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
      }
    },
    async grafikFirstCheck(tool_no) {
      try {
        // console.log(`Fetching graph data for tool_no: ${tool_no}`)
        const response = await this.$store.dispatch(
          ACTION_GET_GRAPH_FIRST_CHECK_HISTORY,
          tool_no,
        )
        if (response.status === 200) {
          const measurementData = response.data

          // Jika data adalah array kosong
          if (
            Array.isArray(measurementData.data) &&
            measurementData.data.length === 0
          ) {
            this.resetChartData()
            this.$swal(
              'Info',
              'No data found for the given tool number',
              'info',
            )
          }
          // Jika data adalah objek dengan isi
          else if (measurementData && Object.keys(measurementData).length > 0) {
            this.prepareChartData(measurementData)
            this.showChart = true

            // Scroll ke bagian chart setelah grafik dimuat
            this.$nextTick(() => {
              const chartElement = this.$refs.chartContainer
              if (chartElement) {
                chartElement.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start',
                })
              }
            })
          }
        }
      } catch (error) {
        console.error('Error during fetching graph data:', error)
        this.resetChartData()
        this.$swal('Error', 'Failed to load data', 'error')
      }
    },
    prepareChartData(data) {
      // console.log('Preparing chart data:', data)
      if (data && data.data) {
        this.chartDataList = [] // Reset data chart

        // Iterasi pada measuring portion (level pertama)
        Object.keys(data.data).forEach((portionName) => {
          const measuringData = data.data[portionName]
          if (!measuringData || !measuringData.values) {
            console.warn(`Missing values for portion: ${portionName}`)
            return // Skip jika data tidak valid
          }

          const { lower_limit, upper_limit, values } = measuringData
          // console.log(`Processing portion: ${portionName}`)
          // console.log(
          //   `Lower Limit: ${lower_limit}, Upper Limit: ${upper_limit}`,
          // )
          // console.log('Values:', values)

          // Parsing nilai
          const isStatusData = values.some(
            (valueObj) => valueObj.value === 'OK' || valueObj.value === 'NG',
          )

          if (isStatusData) {
            // Data status (OK/NG)
            // console.log(`Status data for portion: ${portionName}`)

            // Kelompokkan berdasarkan no_work dan tanggal
            const groupedByWorkAndDate = values.reduce((acc, valueObj) => {
              const { no_work, value, created_dt } = valueObj
              const date = moment(created_dt).format('DD-MM-YYYY') // Format tanggal

              // Gunakan kombinasi no_work dan tanggal sebagai key
              const key = `${no_work}-${date}`

              if (!acc[key])
                acc[key] = { statuses: [], dates: [], workId: no_work }
              acc[key].statuses.push(value) // Status OK/NG
              acc[key].dates.push(date) // Tanggal
              return acc
            }, {})

            // Simpan hasil pengelompokan ke chartDataList
            this.chartDataList.push({
              measuring_portion: portionName,
              groupedStatuses: Object.values(groupedByWorkAndDate), // Ubah menjadi array
            })
          } else {
            // Data numerik untuk grafik
            const seriesData = values.map((valueObj) => {
              const value = parseFloat(valueObj.value)
              return isNaN(value) ? 0 : value
            })

            // console.log('Parsed series data:', seriesData)

            // Menentukan rentang skala Y yang dinamis
            let minValue = Math.min(...seriesData)
            let maxValue = Math.max(...seriesData)

            // Mendeklarasikan lower_limit dan upper_limit terlebih dahulu
            const lowerLimit =
              lower_limit !== null ? parseFloat(lower_limit) : null
            const upperLimit =
              upper_limit !== null ? parseFloat(upper_limit) : null

            // Menambahkan 15% ruang di atas dan di bawah
            const margin = (maxValue - minValue) * 0.15 // 15% margin
            minValue =
              lowerLimit !== null
                ? Math.min(minValue, lowerLimit - margin)
                : minValue
            maxValue =
              upperLimit !== null
                ? Math.max(maxValue, upperLimit + margin)
                : maxValue

            // Menghitung rentang antara lower_limit dan upper_limit agar tetap proporsional
            const tickSpacing = (upperLimit - lowerLimit) / 6

            // Menentukan nilai-nilai di luar rentang upper_limit dan lower_limit
            const minOutsideValue = Math.min(
              ...seriesData.filter((val) => val < lowerLimit),
            )
            const maxOutsideValue = Math.max(
              ...seriesData.filter((val) => val > upperLimit),
            )

            // Jika ada nilai di luar lower_limit, sesuaikan minValue
            if (minOutsideValue < lowerLimit) {
              minValue = minOutsideValue // Menambahkan nilai yang lebih kecil dari lower_limit
            }

            // Jika ada nilai di luar upper_limit, sesuaikan maxValue
            if (maxOutsideValue > upperLimit) {
              maxValue = maxOutsideValue // Menambahkan nilai yang lebih besar dari upper_limit
            }

            // Menyiapkan kategori sumbu X
            const categories = values.map(
              (valueObj) =>
                `${moment(valueObj.created_dt).format('DD-MM-YYYY')} - ${
                  valueObj.no_work
                }`,
            )
            const series = [
              {
                name: portionName,
                data: seriesData,
              },
            ]

            // Menyiapkan konfigurasi chart
            const chartOptions = {
              chart: {
                id: `chart-${portionName}`,
                toolbar: {
                  show: false,
                },
              },
              xaxis: { categories },
              yaxis: {
                min: minValue,
                max: maxValue,
              },
              stroke: {
                curve: 'straight', // Membuat garis lebih halus
                width: 4, // Ketebalan garis
              },
              markers: {
                size: 6, // Ukuran marker
                colors: ['#FF4560'], // Warna marker
                strokeColors: '#fff', // Warna garis tepi marker
                strokeWidth: 2, // Ketebalan garis tepi marker
                hover: {
                  size: 8, // Ukuran marker saat di-hover
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
              dataLabels: {
                enabled: true,
              },
              annotations: {
                yaxis: [
                  ...(upperLimit !== null
                    ? [
                        {
                          y: upperLimit,
                          borderColor: '#FF4560', // Warna garis
                          strokeWidth: 3, // Ketebalan garis
                          strokeDashArray: 6, // Garis putus-putus
                          label: {
                            borderColor: '#FF4560', // Warna garis pada label
                            style: { color: '#fff', background: '#FF4560' }, // Warna teks dan latar belakang label
                            text: `Upper Limit: ${upperLimit}`, // Teks label
                          },
                        },
                      ]
                    : []),
                  ...(lowerLimit !== null
                    ? [
                        {
                          y: lowerLimit,
                          borderColor: '#FEB019', // Warna garis
                          strokeWidth: 3, // Ketebalan garis
                          strokeDashArray: 8, // Garis putus-putus
                          label: {
                            borderColor: '#FEB019', // Warna garis pada label
                            style: { color: '#fff', background: '#FEB019' }, // Warna teks dan latar belakang label
                            text: `Lower Limit: ${lowerLimit}`, // Teks label
                          },
                        },
                      ]
                    : []),
                ],
              },
            }

            // console.log('Chart options:', chartOptions)

            this.chartDataList.push({
              measuring_portion: portionName,
              chartOptions,
              series,
            })
          }
        })

        // console.log('Final chartDataList:', this.chartDataList)
      } else {
        console.error('Invalid data format: Missing data object.')
      }
    },
    resetChartData() {
      // console.log('Resetting chart data')
      this.chartDataList = []
      this.showChart = false
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
