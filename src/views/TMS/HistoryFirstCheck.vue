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
              <h3 class="card-title">{{ chart.title }}</h3>
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

        <div class="d-flex align-items-end gap-2 p-2">
          <!-- Select Mesin -->
          <div style="width: 50%">
            <label
              for="machineFilter"
              class="form-label"
              style="font-weight: bold"
              >Mesin</label
            >
            <v-select
              id="machineFilter"
              :options="GET_MACHINES_FOR_TOOL_CHANGE"
              v-model="machineHistory"
              label="machine_nm"
              @update:modelValue="handleMachineFCHistory"
              placeholder="Pilih mesin..."
              :append-to-body="true"
            />
          </div>

          <!-- Select Tool No -->
          <div style="width: 50%">
            <label
              for="toolNoFilter"
              class="form-label"
              style="font-weight: bold"
              >Tool No</label
            >
            <v-select
              id="toolNoFilter"
              :options="GET_TOOLS_NO_FOR_TOOL_CHANGE"
              v-model="toolHistory"
              :getOptionLabel="formatToolLabelTool"
              @update:modelValue="searchToolHistory"
              placeholder="Pilih Tool No..."
              :append-to-body="true"
            />
          </div>
        </div>

        <table
          class="table table-bordered table-striped"
          style="text-align: center"
        >
          <thead>
            <tr>
              <th>No</th>
              <th>Tool Name</th>
              <th>Tool No</th>
              <th>Mesin</th>
              <th>QR Tag</th>
              <th>First Check Date</th>
              <th>PIC</th>
              <th>Data Quality</th>
            </tr>
          </thead>
          <tbody v-if="toolWithToolNo.length > 0">
            <tr
              v-for="Histories in toolWithToolNo"
              :key="Histories.tool_history_id"
            >
              <td>{{ Histories.no }}</td>
              <td>{{ Histories.tool_nm }}</td>
              <td>{{ Histories.tool_no }}</td>
              <td>{{ Histories.machine_nm }}</td>
              <td>{{ Histories.tool_qr }}</td>
              <td>{{ Histories.created_dt }}</td>
              <td>{{ Histories.pic_check }}</td>
              <td>
                <button
                  class="btn btn-primary"
                  @click="grafikFirstCheck(Histories.tool_nm)"
                >
                  <i class="fas fa-eye"></i>
                </button>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="8">Tidak ada data</td>
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
  ACTION_GET_MACHINES_FOR_TOOL_CHANGE,
  ACTION_GET_TOOL_HYSTORY_BY_QR,
  ACTION_GET_TOOL_NO,
  ACTION_GET_TOOLS_BY_LOCATION_FOR_FIRST_CHECK,
  ACTION_GET_TOOLS_NO_FOR_TOOL_CHANGE,
  GET_MACHINES_FOR_TOOL_CHANGE,
  GET_TOOL_NO,
  GET_TOOLS_BY_LOCATION_FOR_FIRST_CHECK,
  GET_TOOLS_NO_FOR_TOOL_CHANGE,
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
      searchQr: '',
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
      machineHistory: null,
      toolHistory: null,
    }
  },
  computed: {
    ...mapGetters([
      GET_META,
      GET_TOOLS_BY_LOCATION_FOR_FIRST_CHECK,
      GET_HISTORY_GRAPH_FIRST_CHECK,
      GET_TOOL_NO,
      GET_MACHINES_FOR_TOOL_CHANGE,
      GET_TOOLS_NO_FOR_TOOL_CHANGE,
    ]),
    toolWithToolNo() {
      let tools = this.GET_TOOLS_BY_LOCATION_FOR_FIRST_CHECK
      const inputToolNo = this.toolHistory?.tool_no?.trim()

      if (inputToolNo) {
        tools = tools.filter((tool) => {
          const toolNameNormalized = this.normalizeToolName(tool.tool_nm)
          const machineOpRaw = tool.machine_nm?.match(/\(([^)]+)\)/)?.[1] || ''
          const machineOpNo = machineOpRaw.replace(/[A-Za-z]+$/, '')

          const matchedTool = this.GET_TOOL_NO.find((t) => {
            const tNameNormalized = this.normalizeToolName(t.tool_nm)
            const toolNameMatch =
              tNameNormalized.includes(toolNameNormalized) ||
              toolNameNormalized.includes(tNameNormalized)
            const opMatch = t.op_no == machineOpNo

            return toolNameMatch && opMatch
          })

          const isMatched = matchedTool?.tool_no === inputToolNo
          if (!isMatched) {
            console.warn(
              `[NOT MATCHED] inputToolNo: ${inputToolNo} !== ${matchedTool?.tool_no}`,
            )
          }

          return isMatched
        })
      }

      return tools.map((tool) => {
        const toolNameNormalized = this.normalizeToolName(tool.tool_nm)
        const machineOpRaw = tool.machine_nm?.match(/\(([^)]+)\)/)?.[1] || ''
        const machineOpNo = machineOpRaw.replace(/[A-Za-z]+$/, '')

        const matchedTool = this.GET_TOOL_NO.find((t) => {
          const tNameNormalized = this.normalizeToolName(t.tool_nm)
          const toolNameMatch =
            tNameNormalized.includes(toolNameNormalized) ||
            toolNameNormalized.includes(tNameNormalized)
          const opMatch = t.op_no == machineOpNo

          return toolNameMatch && opMatch
        })

        return {
          ...tool,
          tool_no: matchedTool ? matchedTool.tool_no : null,
        }
      })
    },
  },
  watch: {
    'toolHistory.tool_no'(newVal, oldVal) {
      if (!newVal && oldVal) {
        // Saat tool_no dihapus setelah sebelumnya ada, balikin data awal
        this.$store.dispatch(ACTION_GET_TOOLS_BY_LOCATION_FOR_FIRST_CHECK, {
          location: this.location,
          meta: this.meta,
        })
      }
    },
    GET_META: function () {
      this.meta = this.GET_META
    },
    'meta.itemsPerPage': function () {
      this.$store.dispatch(ACTION_GET_TOOLS_BY_LOCATION_FOR_FIRST_CHECK, {
        location: this.location,
        meta: this.meta,
      })
    },
    location(newLocation) {
      this.$store.dispatch(ACTION_GET_TOOLS_BY_LOCATION_FOR_FIRST_CHECK, {
        location: newLocation,
        meta: this.meta,
      })
      this.$store.dispatch(ACTION_GET_TOOL_NO, { location: newLocation })
      this.getMachines()
    },
  },
  mounted() {
    this.$store
      .dispatch(ACTION_GET_TOOLS_BY_LOCATION_FOR_FIRST_CHECK, {
        location: this.location,
        meta: this.meta,
      })
      .then(() => {
        this.$store.dispatch(ACTION_GET_TOOL_NO, { location: this.location })
      })
    this.getMachines()
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleClickOutside)
  },
  methods: {
    async searchToolHistory() {
      const tool_no = this.toolHistory?.tool_no
      console.log('tool_no', tool_no)

      const payload = {
        location: this.location,
        machine_id: this.machineHistory.machine_id,
        meta: this.meta,
      }
      await this.$store.dispatch(
        ACTION_GET_TOOLS_BY_LOCATION_FOR_FIRST_CHECK,
        payload,
      )
    },
    formatToolLabelTool(option) {
      if (!option) return 'Tidak ada data' // Fallback jika option null atau undefined
      return `${option.tool_no || 'N/A'} / ${option.tool_nm || 'N/A'}`
    },
    async handleMachineFCHistory() {
      console.log('kepanggil')

      try {
        const opNo = this.machineHistory.op_no
        console.log('Nilai op_no:', opNo)
        const op_no = opNo.replace(/\D/g, '') // Hapus semua karakter non-angka
        const payload = {
          op_no: op_no,
          location: this.location,
        }
        console.log('Angka dari op_no:', op_no) // Output misalnya: "50"

        let response = await this.$store.dispatch(
          ACTION_GET_TOOLS_NO_FOR_TOOL_CHANGE,
          payload,
        )
        if (response.status === 200) {
          if (this.GET_TOOLS_NO_FOR_TOOL_CHANGE.length === 0) {
            this.GET_TOOLS_NO_FOR_TOOL_CHANGE = []
          }
        }
      } catch (error) {
        console.error(error)
      }
    },
    async getMachines() {
      // console.log('kepanggil')

      try {
        const payload = { location: this.location } // Menggunakan this.location
        // console.log('payload', payload)

        let response = await this.$store.dispatch(
          ACTION_GET_MACHINES_FOR_TOOL_CHANGE,
          payload,
        )
        if (response.status === 200) {
          // console.log('response', this.GET_MACHINES_FOR_TOOL_CHANGE)
        }
      } catch (error) {
        console.log(error)
      }
    },
    normalizeToolName(name) {
      if (!name) return ''

      // Hilangkan semua spasi
      const noSpaces = name.replace(/\s+/g, '').toUpperCase()

      // Cocokkan pola seperti DSDW-06465 atau DSDW06465
      const match = noSpaces.match(/^([A-Z]+)-?(\d{4,})/)
      if (!match) return noSpaces // fallback jika tidak cocok, kembalikan string tanpa spasi

      const [_, prefix, angka] = match
      return `${prefix}-${angka}` // jaga 0 tetap ada
    },
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
      console.log('Preparing chart data:', data)
      if (data && Array.isArray(data.data)) {
        this.chartDataList = [] // Reset data chart

        data.data.forEach((measuringData) => {
          const {
            measuring_portion: portionName,
            lower_limit,
            upper_limit,
            values,
            gauge,
          } = measuringData

          console.log(`Processing portion: ${portionName}`)
          console.log(
            `Lower Limit: ${lower_limit}, Upper Limit: ${upper_limit}`,
          )
          console.log('Values:', values)

          const isStatusData = values.some(
            (valueObj) => valueObj.value === 'OK' || valueObj.value === 'NG',
          )

          if (isStatusData) {
            // Penanganan data OK/NG
            const groupedByWorkAndDate = values.reduce((acc, valueObj) => {
              const { no_work, value, created_dt } = valueObj
              const date = moment(created_dt).format('DD-MM-YYYY')
              const key = `${no_work}-${date}`

              if (!acc[key])
                acc[key] = { statuses: [], dates: [], workId: no_work }
              acc[key].statuses.push(value)
              acc[key].dates.push(date)

              return acc
            }, {})

            this.chartDataList.push({
              title: `${gauge || 'Unknown'} - ${portionName}`,
              measuring_portion: portionName,
              groupedStatuses: Object.values(groupedByWorkAndDate),
            })
          } else {
            // Penanganan data numerik
            const seriesData = values.map((valueObj) => {
              const val = parseFloat(valueObj.value)
              return isNaN(val) ? 0 : val
            })

            let minValue = Math.min(...seriesData)
            let maxValue = Math.max(...seriesData)

            const parsedLower =
              lower_limit !== null ? parseFloat(lower_limit) : null
            const parsedUpper =
              upper_limit !== null ? parseFloat(upper_limit) : null

            const margin = (maxValue - minValue) * 0.15
            if (parsedLower !== null) {
              minValue = Math.min(minValue, parsedLower - margin)
            }
            if (parsedUpper !== null) {
              maxValue = Math.max(maxValue, parsedUpper + margin)
            }

            const minOutside = Math.min(
              ...seriesData.filter((val) => val < parsedLower),
            )
            const maxOutside = Math.max(
              ...seriesData.filter((val) => val > parsedUpper),
            )
            if (minOutside < parsedLower) minValue = minOutside
            if (maxOutside > parsedUpper) maxValue = maxOutside

            const categories = values.map(
              (v) =>
                `${moment(v.created_dt).format('DD-MM-YYYY')} - ${v.no_work}`,
            )

            const series = [
              {
                name: `${gauge || 'Unknown'} - ${portionName}`,
                data: seriesData,
              },
            ]

            const chartOptions = {
              chart: {
                id: `chart-${portionName}`,
                toolbar: { show: false },
              },
              xaxis: { categories },
              yaxis: { min: minValue, max: maxValue },
              stroke: { curve: 'straight', width: 4 },
              markers: {
                size: 6,
                colors: ['#FF4560'],
                strokeColors: '#fff',
                strokeWidth: 2,
                hover: { size: 8 },
              },
              grid: {
                xaxis: { lines: { show: true } },
                yaxis: { lines: { show: true } },
              },
              dataLabels: { enabled: true },
              annotations: {
                yaxis: [
                  ...(parsedUpper !== null
                    ? [
                        {
                          y: parsedUpper,
                          borderColor: '#FF4560',
                          strokeWidth: 3,
                          strokeDashArray: 6,
                          label: {
                            borderColor: '#FF4560',
                            style: { color: '#fff', background: '#FF4560' },
                            text: `Upper Limit: ${parsedUpper}`,
                          },
                        },
                      ]
                    : []),
                  ...(parsedLower !== null
                    ? [
                        {
                          y: parsedLower,
                          borderColor: '#FEB019',
                          strokeWidth: 3,
                          strokeDashArray: 8,
                          label: {
                            borderColor: '#FEB019',
                            style: { color: '#fff', background: '#FEB019' },
                            text: `Lower Limit: ${parsedLower}`,
                          },
                        },
                      ]
                    : []),
                ],
              },
              title: {
                text: `${gauge || 'Unknown'} - ${portionName}`,
                align: 'center',
                style: {
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#333',
                },
              },
            }

            this.chartDataList.push({
              measuring_portion: portionName,
              chartOptions,
              series,
            })
          }
        })

        console.log('Final chartDataList:', this.chartDataList)
      } else {
        console.error('Invalid data format: Missing or malformed data.')
      }
    },

    // prepareChartData(data) {
    //   console.log('Preparing chart data:', data)
    //   if (data && data.data) {
    //     this.chartDataList = [] // Reset data chart

    //     Object.keys(data.data).forEach((portionName) => {
    //       const measuringData = data.data[portionName]
    //       if (!measuringData || !measuringData.values) {
    //         console.warn(`Missing values for portion: ${portionName}`)
    //         return
    //       }

    //       const { lower_limit, upper_limit, values } = measuringData
    //       console.log(`Processing portion: ${portionName}`)
    //       console.log(
    //         `Lower Limit: ${lower_limit}, Upper Limit: ${upper_limit}`,
    //       )
    //       console.log('Values:', values)

    //       // Deteksi apakah sebagian besar value numerik
    //       const numericCount = values.filter(
    //         (v) => v.value?.trim() !== '' && !isNaN(parseFloat(v.value)),
    //       ).length
    //       const isMostlyNumeric = numericCount >= values.length / 2

    //       if (!isMostlyNumeric) {
    //         // === Data status (OK/NG) ===
    //         console.log(`Status data for portion: ${portionName}`)

    //         const groupedByWorkAndDate = values.reduce((acc, valueObj) => {
    //           const { no_work, value, created_dt } = valueObj
    //           const date = moment(created_dt).format('DD-MM-YYYY')
    //           const key = `${no_work}-${date}`

    //           if (!acc[key])
    //             acc[key] = { statuses: [], dates: [], workId: no_work }
    //           acc[key].statuses.push(value)
    //           acc[key].dates.push(date)
    //           return acc
    //         }, {})

    //         this.chartDataList.push({
    //           measuring_portion: portionName,
    //           groupedStatuses: Object.values(groupedByWorkAndDate),
    //         })
    //       } else {
    //         // === Data numerik ===
    //         const seriesData = values.map((valueObj) => {
    //           const value = parseFloat(valueObj.value)
    //           return isNaN(value) ? 0 : value
    //         })

    //         console.log('Parsed series data:', seriesData)

    //         let minValue = Math.min(...seriesData)
    //         let maxValue = Math.max(...seriesData)

    //         const lowerLimit =
    //           lower_limit !== null ? parseFloat(lower_limit) : null
    //         const upperLimit =
    //           upper_limit !== null ? parseFloat(upper_limit) : null

    //         const margin = (maxValue - minValue) * 0.15
    //         minValue =
    //           lowerLimit !== null
    //             ? Math.min(minValue, lowerLimit - margin)
    //             : minValue
    //         maxValue =
    //           upperLimit !== null
    //             ? Math.max(maxValue, upperLimit + margin)
    //             : maxValue

    //         const minOutsideValue = Math.min(
    //           ...seriesData.filter(
    //             (val) => lowerLimit !== null && val < lowerLimit,
    //           ),
    //         )
    //         const maxOutsideValue = Math.max(
    //           ...seriesData.filter(
    //             (val) => upperLimit !== null && val > upperLimit,
    //           ),
    //         )

    //         if (lowerLimit !== null && minOutsideValue < lowerLimit) {
    //           minValue = minOutsideValue
    //         }
    //         if (upperLimit !== null && maxOutsideValue > upperLimit) {
    //           maxValue = maxOutsideValue
    //         }

    //         const categories = values.map(
    //           (valueObj) =>
    //             `${moment(valueObj.created_dt).format('DD-MM-YYYY')} - ${
    //               valueObj.no_work
    //             }`,
    //         )
    //         const series = [
    //           {
    //             name: portionName,
    //             data: seriesData,
    //           },
    //         ]

    //         const chartOptions = {
    //           chart: {
    //             id: `chart-${portionName}`,
    //             toolbar: {
    //               show: false,
    //             },
    //           },
    //           xaxis: { categories },
    //           yaxis: {
    //             min: minValue,
    //             max: maxValue,
    //           },
    //           stroke: {
    //             curve: 'straight',
    //             width: 4,
    //           },
    //           markers: {
    //             size: 6,
    //             colors: ['#FF4560'],
    //             strokeColors: '#fff',
    //             strokeWidth: 2,
    //             hover: {
    //               size: 8,
    //             },
    //           },
    //           grid: {
    //             xaxis: {
    //               lines: { show: true },
    //             },
    //             yaxis: {
    //               lines: { show: true },
    //             },
    //           },
    //           dataLabels: {
    //             enabled: true,
    //           },
    //           annotations: {
    //             yaxis: [
    //               ...(upperLimit !== null
    //                 ? [
    //                     {
    //                       y: upperLimit,
    //                       borderColor: '#FF4560',
    //                       strokeWidth: 3,
    //                       strokeDashArray: 6,
    //                       label: {
    //                         borderColor: '#FF4560',
    //                         style: { color: '#fff', background: '#FF4560' },
    //                         text: `Upper Limit: ${upperLimit}`,
    //                       },
    //                     },
    //                   ]
    //                 : []),
    //               ...(lowerLimit !== null
    //                 ? [
    //                     {
    //                       y: lowerLimit,
    //                       borderColor: '#FEB019',
    //                       strokeWidth: 3,
    //                       strokeDashArray: 8,
    //                       label: {
    //                         borderColor: '#FEB019',
    //                         style: { color: '#fff', background: '#FEB019' },
    //                         text: `Lower Limit: ${lowerLimit}`,
    //                       },
    //                     },
    //                   ]
    //                 : []),
    //             ],
    //           },
    //         }

    //         console.log('Chart options:', chartOptions)

    //         this.chartDataList.push({
    //           measuring_portion: portionName,
    //           chartOptions,
    //           series,
    //         })
    //       }
    //     })

    //     console.log('Final chartDataList:', this.chartDataList)
    //   } else {
    //     console.error('Invalid data format: Missing data object.')
    //   }
    // },

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
