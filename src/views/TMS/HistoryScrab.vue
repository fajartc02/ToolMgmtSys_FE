<template>
  <div class="container-fluid">
    <div class="card p-2 mb-2">
      <div class="card p-2 mb-2">
        <div class="d-flex justify-content-between align-items-center">
          <h4 class="text-center m-0">History Tool scrab</h4>
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
        <!-- <div v-if="showRegrindingChart" class="card mb-2">
          <RegrindingChart
            v-if="chartRegList.length > 0"
            :chartData="chartRegList"
            :selectedPeriod="selectedPeriod"
          />
          <div v-else class="text-center">
            <h3>Belum Ada Input Regrinding</h3>
          </div>
        </div> -->

        <!-- <div v-if="showChart" id="chart">
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
        </div> -->
        <table
          class="table table-bordered table-striped"
          style="text-align: center"
        >
          <thead>
            <tr>
              <th>No</th>
              <th>Tool ID</th>
              <th>QR Tag</th>
              <th>Scrab Date</th>
              <th>PIC</th>
              <th>Std Counter</th>
              <th>Actual Counter</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="Histories in GET_SCRAB_HISTORIES"
              :key="Histories.tool_history_id"
            >
              <td>{{ Histories.no }}</td>
              <td>{{ Histories.tool_no }}</td>
              <td>{{ Histories.tool_qr }}</td>
              <td>{{ Histories.created_dt }}</td>
              <td>{{ Histories.pic_check }}</td>
              <td>{{ Histories.std_counter }}</td>
              <td>{{ Histories.act_counter }}</td>
              <td>{{ Histories.reason }}</td>
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
import { GET_META } from '@/store/TMS/META.module'
import { mapGetters } from 'vuex'
import {
  ACTION_SCRAB_HISTORIES,
  GET_SCRAB_HISTORIES,
} from '@/store/TMS/ScrabHistory.module'
import PaginationMaster from '@/components/TMS/Pagination/PaginationMaster.vue'
export default {
  name: 'HistoryScrab',
  components: {
    PaginationMaster,
  },
  data() {
    return {
      meta: {
        currentPage: 1,
        totalData: 0,
        itemsPerPage: 10,
      },
      selectedPeriod: '',
    }
  },
  computed: {
    ...mapGetters([GET_SCRAB_HISTORIES, GET_META]),
  },
  watch: {
    GET_META: function () {
      this.meta = this.GET_META
    },
    'meta.itemsPerPage': function () {
      this.$store.dispatch(ACTION_SCRAB_HISTORIES, { meta: this.meta })
    },
  },
  mounted() {
    this.$store.dispatch(ACTION_SCRAB_HISTORIES, { meta: this.meta })
  },
  methods: {
    handlePageChange(page) {
      this.meta.currentPage = page
      this.$store.dispatch(ACTION_SCRAB_HISTORIES, { meta: this.meta })
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
