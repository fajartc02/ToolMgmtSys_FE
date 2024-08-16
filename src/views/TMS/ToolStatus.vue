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
    <div v-if="search.tool_qr != ''" class="card mt-1">
      <HistoricalGraphVue :tool_qr="search.tool_qr" :system_activity="'USED'" />
    </div>
    <!-- <div v-if="search.tool_qr == 'A0167'" class="card mt-1">
      <HistoricalGraph167 v-if="search.tool_qr != ''" />
    </div>
    <div v-if="search.tool_qr == 'A0256'" class="card mt-1">
      <HistoricalGraphVue2 v-if="search.tool_qr != ''" />
    </div> -->
    <!-- v-if="search.tool_qr == 'A0167' || search.tool_qr == 'A0256'" -->
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
                <th>Date</th>
                <th>Tool Name</th>
                <th>Location</th>
                <th>Std Counter</th>
                <th>Actual Counter</th>
                <th>PIC</th>
                <th>Problem</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="GET_TOOL_HISTORIES.length > 0">
                <tr
                  v-for="toolHistory in GET_TOOL_HISTORIES"
                  :key="toolHistory.id"
                >
                  <td>{{ toolHistory.system_activity }}</td>
                  <td>{{ toolHistory.date_check }}</td>
                  <td>{{ toolHistory.tool_no }}</td>
                  <td>{{ toolHistory.distribution_nm }}</td>
                  <td>{{ toolHistory.std_counter }}</td>
                  <td>{{ toolHistory.act_counter }}</td>
                  <td>{{ toolHistory.pic_check }}</td>
                  <td>{{ toolHistory.system_problem }}</td>
                </tr>
              </template>
              <template v-else>
                <tr>
                  <th colspan="9">
                    <h3 class="text-center text-muted bg-transparent">
                      No data found
                    </h3>
                  </th>
                </tr>
              </template>
            </tbody>
          </table>
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
  ACTION_GET_TOOL_HISTORY,
  ACTION_TOOL_DETAILS,
  GET_TOOL_DETAILS,
  GET_TOOL_HISTORIES,
} from '@/store/TMS/TOOLS.module'

import HistoricalGraph167 from '@/components/TMS/Graphs/HistoricalGraph167.vue'
import HistoricalGraphVue from '@/components/TMS/Graphs/HistoricalGraph.vue'
import HistoricalGraphVue2 from '@/components/TMS/Graphs/HistoricalGraph2.vue'
import { mapGetters } from 'vuex'
import { GET_META } from '@/store/TMS/META.module'

export default {
  name: 'ToolStatus',
  data() {
    return {
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
    }
  },
  computed: {
    ...mapGetters([GET_TOOL_DETAILS, GET_META, GET_TOOL_HISTORIES]),
  },
  watch: {
    search: {
      async handler() {
        if (this.search.tool_qr.length === 5) {
          await this.$store.dispatch(ACTION_TOOL_DETAILS, this.search)
          await this.getToolsHistory()
        }
        if (this.search.tool_qr.length >= 10) {
          this.search.tool_qr = this.search.tool_qr.slice(5, 11)
        }
      },
      deep: true,
    },
  },
  methods: {
    async getToolsHistory() {
      try {
        await this.$store.dispatch(ACTION_GET_TOOL_HISTORY, {
          meta: this.GET_META,
          tool_qr: this.search.tool_qr,
        })
      } catch (error) {
        alert(error)
      }
    },
  },
  components: {
    CardToolStatus,
    PleaseScanQRTools,
    HistoricalGraphVue,
    HistoricalGraphVue2,
    HistoricalGraph167,
  },
  mounted() {
    document.getElementById('qr-input').onblur = function () {
      this.focus()
    }
    document.getElementById('qr-input').focus()
  },
}
</script>
