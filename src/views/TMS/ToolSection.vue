<template>
  <div class="modal" tabindex="-1" id="modalEditMesin">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Edit Mesin</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            @click="editTool = null"
          ></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="machineFilter" class="form-label">Mesin</label>
            <v-select
              id="machineFilter"
              :options="GET_MACHINES_FOR_TOOL_CHANGE"
              v-model="selectedMachine"
              label="machine_nm"
              placeholder="Pilih mesin..."
              :reduce="(machine) => machine.machine_id"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
            @click="editTool = null"
          >
            Close
          </button>
          <button
            type="button"
            class="btn btn-primary"
            data-bs-dismiss="modal"
            @click="updateMachine"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal" tabindex="-1" id="modalStdFCheck">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Add Data First Check</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            @click="resetModal"
          ></button>
        </div>
        <div class="modal-body">
          <!-- Input untuk Jumlah Unit Check -->
          <div class="mb-4">
            <label for="unitCheckInput" class="form-label"
              ><strong>Jumlah Unit Check</strong></label
            >
            <input
              type="number"
              id="unitCheckInput"
              class="form-control"
              v-model="unitCheck"
              @change="updateUnitCheck"
              placeholder="Masukkan jumlah unit check"
            />
          </div>
          <!-- Input untuk Nomor Work -->
          <div
            class="mb-4"
            v-for="(workNo, index) in workNumbers"
            :key="'work-' + index"
          >
            <label :for="'workNoInput-' + index" class="form-label">
              <strong> Nomor Work (Unit {{ index + 1 }})</strong>
            </label>
            <input
              :id="'workNoInput-' + index"
              type="text"
              class="form-control"
              v-model="workNumbers[index]"
              placeholder="Masukkan nomor work"
              @input="workNumbers[index] = workNumbers[index]?.toUpperCase()"
            />
          </div>
          <!-- Daftar Hasil First Check -->
          <div v-if="stdFCheckData.length">
            <template
              v-for="(item, index) in stdFCheckData"
              :key="item.tool_f_check_std_id"
            >
              <template
                v-for="unitIndex in unitCheck"
                :key="item.tool_f_check_std_id + '-' + unitIndex"
              >
                <div class="mb-4">
                  <label class="form-label">
                    <strong
                      >{{ item.measuring_portion }} (Unit
                      {{ unitIndex }})</strong
                    >
                  </label>
                  <!-- Detail STD dan Qty Check -->
                  <div class="d-flex align-items-center mt-2">
                    <!-- STD -->
                    <small
                      v-if="
                        item.lower_limit !== null && item.upper_limit !== null
                      "
                      class="text-muted me-2"
                    >
                      <strong>STD:</strong>
                      {{ item.lower_limit }} ~ {{ item.upper_limit }}
                      {{ item.units || '' }}
                    </small>
                  </div>
                  <div class="input-group">
                    <!-- Gauge sebagai span -->
                    <span
                      class="input-group-text"
                      :class="{
                        'text-bg-success':
                          (item.is_judgment &&
                            item.stdCheckValues[unitIndex - 1] === 'OK') ||
                          (!item.is_judgment &&
                            item.stdCheckValues[unitIndex - 1] !== null &&
                            item.stdCheckValues[unitIndex - 1] !== undefined &&
                            item.stdCheckValues[unitIndex - 1] >=
                              item.lower_limit &&
                            item.stdCheckValues[unitIndex - 1] <=
                              item.upper_limit),
                        'text-bg-danger':
                          (item.is_judgment &&
                            item.stdCheckValues[unitIndex - 1] === 'NG') ||
                          (!item.is_judgment &&
                            item.stdCheckValues[unitIndex - 1] !== '' &&
                            item.stdCheckValues[unitIndex - 1] !== undefined &&
                            (item.stdCheckValues[unitIndex - 1] <
                              item.lower_limit ||
                              item.stdCheckValues[unitIndex - 1] >
                                item.upper_limit)),
                      }"
                    >
                      <strong>{{ item.gauge }}</strong>
                    </span>

                    <!-- Input Nilai STD -->
                    <input
                      v-if="!item.is_judgment"
                      type="number"
                      v-model="item.stdCheckValues[unitIndex - 1]"
                      class="form-control"
                      :class="{
                        'is-valid':
                          item.stdCheckValues[unitIndex - 1] >=
                            item.lower_limit &&
                          item.stdCheckValues[unitIndex - 1] <=
                            item.upper_limit,
                        'is-invalid':
                          item.stdCheckValues[unitIndex - 1] <
                            item.lower_limit ||
                          item.stdCheckValues[unitIndex - 1] > item.upper_limit,
                      }"
                      placeholder="Masukkan nilai STD"
                    />
                    <select
                      v-else
                      v-model="item.stdCheckValues[unitIndex - 1]"
                      class="form-select"
                    >
                      <option value="OK">OK</option>
                      <option value="NG">NG</option>
                    </select>
                    <span class="input-group-text">{{ item.units || '' }}</span>
                  </div>

                  <!-- Qty Check -->
                  <small v-if="item.qty_check !== null" class="text-muted">
                    <strong>Qty Check:</strong> {{ item.qty_check }}
                  </small>
                </div>
              </template>
            </template>
          </div>
          <div v-else>
            <p class="text-muted text-center">
              <strong>Note: Belum ada data standard check</strong>
            </p>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
            @click="resetModal"
          >
            Close
          </button>
          <button
            type="button"
            class="btn btn-primary"
            data-bs-dismiss="modal"
            @click="submitFCheck"
            :disabled="!isFormValid"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal" tabindex="-1" id="modalHistoryFCheck">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <!-- Header Modal -->
        <div class="modal-header">
          <h5 class="modal-title">Hasil First Check</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            @click="resetModal"
          ></button>
        </div>

        <!-- Body Modal -->
        <div class="modal-body">
          <div v-if="historyForTool?.length > 0">
            <table class="table table-bordered text-center">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>No. Work</th>
                  <th>PIC Check</th>
                  <th>Proses</th>
                  <th>Gauge</th>
                  <th>Qty Check</th>
                  <th>Standart</th>
                  <th>Hasil Check</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in historyForTool"
                  :key="item.tool_f_check_id"
                  :class="{
                    'table-danger': item.status === 'NG', // Baris akan diberi warna latar merah
                  }"
                >
                  <td>{{ item.created_dt }}</td>
                  <td>{{ item.no_work }}</td>
                  <td>{{ item.created_by }}</td>
                  <td>{{ item.measuring_portion }}</td>
                  <td>{{ item.gauge }}</td>
                  <td>{{ item.qty_check }}</td>
                  <td>{{ getStandart(item) }}</td>
                  <td>{{ formatValueCheck(item.value_check) }}</td>
                  <td :class="getStatusClassModal(item.status)">
                    <strong>{{ item.status }}</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else>
            <p class="text-center text-muted">
              <strong>Data First Check Belum Tersedia</strong>
            </p>
          </div>
        </div>

        <!-- Footer Modal -->
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
            @click="resetModal"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal" tabindex="-1" id="modalToolChange">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Tool Change - {{ modalTitle }}</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            @click="resetModal"
          ></button>
        </div>
        <div class="modal-body">
          <!-- Input Filter Mesin -->
          <div class="mb-3">
            <label for="machineFilter" class="form-label">Mesin</label>
            <v-select
              id="machineFilter"
              :options="GET_MACHINES_FOR_TOOL_CHANGE"
              v-model="machinesForTc"
              label="machine_nm"
              @update:modelValue="handleMachineChange"
              placeholder="Pilih mesin..."
            />
          </div>

          <!-- Input Filter Tool No -->
          <div class="mb-3">
            <label for="toolNoFilter" class="form-label">Tool No</label>
            <v-select
              id="toolNoFilter"
              :options="GET_TOOLS_NO_FOR_TOOL_CHANGE"
              v-model="toolsForTc"
              :getOptionLabel="formatToolLabelTool"
              @update:modelValue="handleToolChange"
              placeholder="Pilih Tool No..."
            />
          </div>
          <div v-if="modalTitle === 'Tool Bekas'" class="mb-3">
            <label for="actStdCounterFilter" class="form-label">Act</label>
            <div class="input-group">
              <input
                v-model="act_ctr"
                type="number"
                class="form-control"
                placeholder="Enter Act"
              />
              <span class="input-group-text">{{ std_ctr }}</span>
            </div>
          </div>
          <!-- Input Problem -->
          <div
            v-if="act_ctr < std_ctr && modalTitle === 'Tool Bekas'"
            class="mb-3"
          >
            <label for="problemInput" class="form-label">Problem</label>
            <input
              id="problemInput"
              v-model="problemDescription"
              type="text"
              class="form-control"
              placeholder="Describe the problem"
            />
          </div>
          <!-- Input Filter PIC -->
          <div class="mb-3">
            <label for="operatorFilter" class="form-label">PIC</label>
            <v-select
              id="operatorFilter"
              :options="GET_USERS_TREESELECT"
              v-model="picTc"
              label="label"
              placeholder="Pilih PIC..."
            />
          </div>
        </div>

        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
            @click="resetModal"
          >
            Close
          </button>
          <button
            type="button"
            class="btn btn-primary"
            data-bs-dismiss="modal"
            @click="submitToolChange"
            :disabled="!isModalValid"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="container-fluid">
    <div class="card p-2 mb-2">
      <div class="d-flex justify-content-between align-items-center">
        <h4 class="text-center m-0">
          <select class="form-control form-select" v-model="location">
            <option v-for="item in optsLocation" :key="item" :value="item">
              {{ item }}
            </option>
          </select>
        </h4>

        <div class="input-group" style="width: 350px">
          <span class="input-group-text">Scan QR</span>
          <input
            id="qr-input"
            type="text"
            class="form-control"
            placeholder="Scan your tools"
            v-model="search.tool_qr"
          />
          <CButton
            v-if="!GET_FOCUS_INPUT"
            type="button"
            color="secondary"
            variant="outline"
            @click="actionFocusToggle(true)"
          >
            Scan
          </CButton>
          <CButton
            v-else-if="GET_FOCUS_INPUT && search.tool_qr != ''"
            type="button"
            color="secondary"
            variant="outline"
            @click="actionFocusToggle(false)"
          >
            <CIcon icon="cilX" />
          </CButton>
        </div>
      </div>
    </div>
    <CardToolStatus
      v-if="search.tool_qr != ''"
      :is_footer="true"
      :location="location"
      :meta="meta"
    />
    <PleaseScanQRTools v-else />
    <div
      v-if="
        [
          'Cylinder Head',
          'Cylinder Block',
          'Crank Shaft',
          'Cam Shaft',
        ].includes(location)
      "
      class="card mt-2"
    >
      <div class="card-header">
        <h5>Tool Change Tool No QR</h5>
      </div>
      <div class="card-body">
        <button
          class="btn btn-info me-2"
          data-bs-toggle="modal"
          data-bs-target="#modalToolChange"
          @click="openModal('new')"
        >
          Tool Change (Tool Baru)
        </button>

        <button
          class="btn btn-secondary"
          data-bs-toggle="modal"
          data-bs-target="#modalToolChange"
          @click="openModal('old')"
        >
          Tool Change (Tool Bekas)
        </button>
      </div>
    </div>

    <!-- filter search table -->
    <div
      v-if="this.location != 'Tool Regrinding' && this.location != 'Clean Room'"
      class="card mt-2"
    >
      <div class="card-header">
        <h5>Filter</h5>
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
            v-model="machinesForTc"
            label="machine_nm"
            @update:modelValue="handleMachineChange"
            placeholder="Pilih mesin..."
            :append-to-body="true"
          />
        </div>

        <!-- Select Tool No -->
        <div style="width: 50%">
          <label for="toolNoFilter" class="form-label" style="font-weight: bold"
            >Tool No</label
          >
          <v-select
            id="toolNoFilter"
            :options="GET_TOOLS_NO_FOR_TOOL_CHANGE"
            v-model="toolsForTc"
            :getOptionLabel="formatToolLabelTool"
            @update:modelValue="searchTool"
            placeholder="Pilih Tool No..."
            :append-to-body="true"
          />
        </div>
      </div>
    </div>

    <!-- Tabel Data Tools -->
    <div
      v-if="
        [
          'Cylinder Head',
          'Cylinder Block',
          'Crank Shaft',
          'Cam Shaft',
        ].includes(location)
      "
      class="card mt-2"
    >
      <div class="card-header">
        <h5>List Tools Line {{ location }}</h5>
      </div>
      <div class="card-body">
        <table class="table table-hover text-center table-bordered">
          <thead>
            <tr>
              <th scope="col">No</th>
              <th scope="col">Tanggal</th>
              <th scope="col">PIC</th>
              <th scope="col">Tool</th>
              <th>Tool No</th>
              <th scope="col">QR Code</th>
              <th scope="col">Mesin</th>
              <th scope="col">Check</th>
              <th scope="col">View</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody v-if="toolsWithStatus.length > 0">
            <tr
              v-for="tool in toolsWithStatus"
              :key="tool.tool_history_id"
              :class="{ 'row-red': !tool.isFound }"
            >
              <td>{{ tool.no }}</td>
              <td>{{ tool.created_dt }}</td>
              <td>{{ tool.pic_check }}</td>
              <td>{{ tool.tool_nm }}</td>
              <td>{{ tool.tool_no }}</td>
              <td>{{ tool.tool_qr }}</td>
              <td>
                <div>
                  <div>{{ tool.machine_nm }}</div>
                  <!-- <button
                    data-bs-toggle="modal"
                    data-bs-target="#modalEditMesin"
                    class="btn btn-primary btn-sm mt-1"
                    @click="prepareEdit(tool)"
                  >
                    <i class="fas fa-edit"></i>
                  </button> -->
                </div>
              </td>
              <td>
                <button
                  class="btn btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#modalStdFCheck"
                  @click="stdFCheck(tool)"
                >
                  <i class="fas fa-edit"></i>
                </button>
              </td>
              <td>
                <button
                  class="btn btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#modalHistoryFCheck"
                  @click="getHistory(tool.tool_history_id)"
                >
                  <i class="fas fa-eye"></i>
                </button>
              </td>
              <td :class="getStatusClass(tool.tool_history_id)">
                <strong>{{ getStatus(tool.tool_history_id) }}</strong>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="10">Tidak ada data</td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Pagination Controls -->
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
</template>
<script>
import PleaseScanQRTools from '@/components/TMS/PleaseScanQRTools.vue'
import CardToolStatus from '@/components/TMS/Cards/CardToolStatus.vue'
import PaginationMaster from '@/components/TMS/Pagination/PaginationMaster.vue'
import { mapGetters } from 'vuex'
import {
  ACTION_FOCUS_INPUT,
  GET_FOCUS_INPUT,
} from '@/store/TMS/focusInput.module'
import { ACTION_TOOL_DETAILS } from '@/store/TMS/TOOLS.module'
import {
  ACTION_ADD_H_TOOL_F_CHECK,
  ACTION_ADD_HISTORY_TOOL_NO_QR,
  ACTION_GET_HISTORY_FIRST_CHECK,
  ACTION_GET_MACHINES_FOR_TOOL_CHANGE,
  ACTION_GET_STD_TOOL_F_CHECK,
  ACTION_GET_TOOL_NO,
  ACTION_GET_TOOLS_BY_LOCATION_FOR_FIRST_CHECK,
  ACTION_GET_TOOLS_NO_FOR_TOOL_CHANGE,
  ACTION_UPDATE_MACHINE_FOR_TOOL_CHANGE,
  GET_HISTORY_TOOL_F_CHECK,
  GET_MACHINES_FOR_TOOL_CHANGE,
  GET_STD_TOOL_F_CHECK,
  GET_TOOL_NO,
  GET_TOOLS_BY_LOCATION_FOR_FIRST_CHECK,
  GET_TOOLS_NO_FOR_TOOL_CHANGE,
} from '@/store/TMS/FirstCheck.module'
import { GET_META } from '@/store/TMS/META.module'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

import {
  ACTION_USERS_OPTS,
  GET_USERS_OPTS,
  GET_USERS_TREESELECT,
} from '@/store/TMS/USERS.module'

export default {
  components: {
    PleaseScanQRTools,
    CardToolStatus,
    PaginationMaster,
    vSelect,
  },
  name: 'ToolRegrindingSection',
  data() {
    return {
      unitCheck: 1, // Default jumlah unit check
      workNumbers: Array(this.unitCheck).fill(''),
      stdFCheckData: [], // Data STD First Check
      historyFCheckData: [],
      selectedTool: null,
      historyForTool: [],
      meta: {
        totalData: 0,
        currentPage: 1,
        itemsPerPage: 25,
        totalPages: 1,
      },
      is_focus: true,
      search: {
        tool_qr: '',
      },
      location: 'Tool Regrinding',
      optsLocation: [
        'Tool Regrinding',
        'Clean Room',
        'Cam Shaft',
        'Crank Shaft',
        'Cylinder Head',
        'Cylinder Block',
      ],
      machinesForTc: null,
      toolsForTc: null,
      modalTitle: '',
      user_ln: null,
      picTc: null,
      act_ctr: 0,
      std_ctr: '',
      problemDescription: '',
      editTool: null,
      selectedMachine: null,
      originalMachineId: null,
      filteredTools: null,
    }
  },
  computed: {
    ...mapGetters([
      GET_META,
      GET_FOCUS_INPUT,
      GET_TOOLS_BY_LOCATION_FOR_FIRST_CHECK,
      GET_STD_TOOL_F_CHECK,
      GET_HISTORY_TOOL_F_CHECK,
      GET_MACHINES_FOR_TOOL_CHANGE,
      GET_TOOLS_NO_FOR_TOOL_CHANGE,
      GET_USERS_TREESELECT,
      GET_TOOL_NO,
    ]),
    toolsWithStatus() {
      let tools = this.GET_TOOLS_BY_LOCATION_FOR_FIRST_CHECK

      const inputToolNo = this.toolsForTc?.tool_no?.trim()
      if (inputToolNo) {
        tools = tools.filter((tool) => {
          const toolNameNormalized = this.normalizeToolName(tool.tool_nm)

          const matchedTool = this.GET_TOOL_NO.find((t) => {
            const tNameNormalized = this.normalizeToolName(t.tool_nm)
            return (
              tNameNormalized.includes(toolNameNormalized) ||
              toolNameNormalized.includes(tNameNormalized)
            )
          })

          return matchedTool?.tool_no === inputToolNo
        })
      }

      return tools.map((tool) => {
        const isFound = this.historyFCheckData.some(
          (history) => history.tool_history_id === tool.tool_history_id,
        )

        const toolNameNormalized = this.normalizeToolName(tool.tool_nm)

        const matchedTool = this.GET_TOOL_NO.find((t) => {
          const tNameNormalized = this.normalizeToolName(t.tool_nm)
          return (
            tNameNormalized.includes(toolNameNormalized) ||
            toolNameNormalized.includes(tNameNormalized)
          )
        })

        return {
          ...tool,
          isFound,
          tool_no: matchedTool ? matchedTool.tool_no : null,
        }
      })
    },

    isFormValid() {
      // // Pastikan jumlah unit check sudah diisi
      if (this.unitCheck <= 0) return false

      // Periksa apakah semua workNumbers sudah diisi
      if (this.workNumbers.some((workNo) => !workNo)) return false

      // Periksa apakah semua stdCheckValues sudah diisi
      for (const item of this.stdFCheckData) {
        if (
          item.stdCheckValues.length !== this.unitCheck ||
          item.stdCheckValues.some((value) => value === null || value === '')
        ) {
          return false
        }
      }

      return true
    },
    isModalValid() {
      // Pastikan mesin sudah dipilih
      if (!this.machinesForTc) return false

      // Pastikan tool sudah dipilih
      if (!this.toolsForTc) return false

      // Pastikan PIC sudah dipilih
      if (!this.picTc) return false

      // Jika modalTitle adalah 'Tool Bekas', pastikan act_ctr valid
      if (this.modalTitle === 'Tool Bekas') {
        // Pastikan act_ctr sudah diisi dan lebih besar atau sama dengan std_ctr
        if (this.act_ctr <= 0) return false

        // Jika act_ctr < std_ctr, pastikan problemDescription sudah diisi
        if (this.act_ctr < this.std_ctr && !this.problemDescription)
          return false
      }

      return true // Semua kondisi valid
    },
  },
  watch: {
    // GET_FOCUS_INPUT() {
    //   console.log('GET_FOCUS_INPUT', this.GET_FOCUS_INPUT)
    //   this.focusToggle(this.GET_FOCUS_INPUT)
    // },
    GET_FOCUS_INPUT() {
      this.focusToggle()
    },

    search: {
      handler() {
        // console.log('search', this.search)

        if (this.search.tool_qr.length === 5)
          this.$store.dispatch(ACTION_TOOL_DETAILS, this.search)
        if (this.search.tool_qr.length >= 10) {
          this.search.tool_qr = this.search.tool_qr.slice(5, 11)
        }
      },
      deep: true,
    },
    location() {
      // console.log(`[DEBUG] Location changed to: ${this.location}`)
      this.meta.currentPage = 1
      this.$store.dispatch(ACTION_GET_TOOLS_BY_LOCATION_FOR_FIRST_CHECK, {
        location: this.location,
        meta: this.meta,
      })
      this.$store.dispatch(ACTION_GET_TOOL_NO, {
        location: this.location,
      })
      console.log('data get tool_no', this.GET_TOOL_NO)
      this.getMachines()
      this.getFCheck()
      this.updateUserLn()
    },
    user_ln(newUserLn) {
      // Fetch users options when user_ln changes
      if (newUserLn) {
        this.$store.dispatch(ACTION_USERS_OPTS, newUserLn).then(() => {
          // console.log('get_user_treselec', this.GET_USERS_TREESELECT)
        })
      }
    },
    GET_META: function () {
      this.meta = this.GET_META
    },
    'meta.itemsPerPage': function () {
      this.$store.dispatch(ACTION_GET_TOOLS_BY_LOCATION_FOR_FIRST_CHECK, {
        meta: this.meta,
        location: this.location,
      })
    },

    unitCheck(newVal, oldVal) {
      // console.log(`unitCheck changed: ${oldVal} -> ${newVal}`)
      this.updateUnitCheck() // Perbarui data
    },
    stdFCheckData: {
      deep: true,
      handler(newVal) {
        // console.log('Updated stdFCheckData:', newVal)
      },
    },
  },
  methods: {
    async searchTool() {
      const tool_no = this.toolsForTc?.tool_no
      console.log('tool_no', tool_no)

      if (!tool_no) {
        // Kosongkan hasil filter kalau tool_no kosong
        this.filteredTools = null
        return
      }

      const payload = {
        location: this.location,
        machine_id: this.machinesForTc.machine_id,
        meta: this.meta,
      }
      await this.$store.dispatch(
        ACTION_GET_TOOLS_BY_LOCATION_FOR_FIRST_CHECK,
        payload,
      )
    },
    normalizeToolName(name) {
      return name?.toLowerCase().replace(/[\s\-]/g, '')
    },
    prepareEdit(tool) {
      this.editTool = tool
      this.selectedMachine = tool.machine_id
      this.originalMachineId = tool.machine_id
    },
    async updateMachine() {
      try {
        const payload = {
          old_machine_id: this.originalMachineId, // sebelum diubah
          new_machine_id: this.selectedMachine, // setelah diubah
          tool_history_id: this.editTool.tool_history_id,
          tool_id: this.editTool.tool_id,
          system_activity: this.editTool.system_activity,
          location: this.location,
          tool_qr: this.editTool.tool_qr,
        }
        console.log('payload', payload)

        let response = await this.$store.dispatch(
          ACTION_UPDATE_MACHINE_FOR_TOOL_CHANGE,
          { meta: this.meta, payload },
        )
        if (response.status === 200) {
          this.$store.dispatch(ACTION_GET_TOOLS_BY_LOCATION_FOR_FIRST_CHECK, {
            meta: this.meta,
            location: this.location,
          })
          this.$swal('Success', 'Sukses Edit Mesin', 'success')
        }
      } catch (error) {
        console.log(error)
        this.$swal('Error', 'Gagal Edit Mesin', 'error')
      }
    },
    async handleToolChange() {
      try {
        const selectedTool = this.toolsForTc
        // console.log('payload', selectedTool)
        this.std_ctr = selectedTool.std_ctr
      } catch (error) {
        console.log(error)
      }
    },
    formatToolLabelTool(option) {
      if (!option) return 'Tidak ada data' // Fallback jika option null atau undefined
      return `${option.tool_no || 'N/A'} / ${option.tool_nm || 'N/A'}`
    },
    openModal(type) {
      if (type === 'new') {
        this.modalTitle = 'Tool Baru' // Untuk modal tool baru
      } else {
        this.modalTitle = 'Tool Bekas' // Untuk modal tool bekas
      }
    },
    updateUserLn() {
      const locationMap = {
        'Crank Shaft': 'CRS',
        'Cam Shaft': 'CAM',
        'Cylinder Block': 'CB',
        'Cylinder Head': 'CH',
      }
      this.user_ln = locationMap[this.location] || null
      // console.log('User LN updated to:', this.user_ln)
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
    async handleMachineChange() {
      console.log('kepanggil')

      try {
        const opNo = this.machinesForTc.op_no
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
          // console.log('response', this.GET_TOOLS_NO_FOR_TOOL_CHANGE)
        }
      } catch (error) {
        console.error(error)
      }
    },
    async submitToolChange() {
      try {
        let distribution_id = null
        // IN MACHINE STATUS
        if (this.location == 'Crank Shaft') {
          distribution_id = 10
        } else if (this.location == 'Cam Shaft') {
          distribution_id = 7
        } else if (this.location == 'Cylinder Head') {
          distribution_id = 8
        } else if (this.location == 'Cylinder Block') {
          distribution_id = 9
        }
        const payload = {
          distribution_id,
        }

        if (this.modalTitle === 'Tool Bekas') {
          payload.machine_id = this.machinesForTc?.machine_id || null
          payload.tool_id = this.toolsForTc?.tool_id || null
          payload.act_ctr = this.act_ctr
          payload.system_activity = 'USED'

          // Tambahkan masalah jika act < std
          if (this.act_ctr < this.std_ctr) {
            payload.problem = this.problemDescription
          }
        } else if (this.modalTitle === 'Tool Baru') {
          payload.machine_id = this.machinesForTc?.machine_id || null
          payload.tool_id = this.toolsForTc?.tool_id || null
          payload.system_activity = 'IN USED'

          // Tambahkan logika spesifik untuk Tool Baru jika diperlukan
        }

        payload.pic = this.picTc.id || null // PIC dari modal

        // console.log('Payload toolchange:', payload)
        let response = await this.$store.dispatch(
          ACTION_ADD_HISTORY_TOOL_NO_QR,
          payload,
        )
        if (response.status === 201) {
          this.$store.dispatch(ACTION_GET_TOOLS_BY_LOCATION_FOR_FIRST_CHECK, {
            meta: this.meta,
            location: this.location,
          })
          this.$swal.fire('Success', 'Data kamu sudah bertambah', 'success')
        }
        this.resetModal()
      } catch (error) {
        console.error('Error submitting tool change:', error)
        this.$swal.fire('Error', 'Gagal menambah data', 'error')
      }
    },

    formatValueCheck(value) {
      // console.log('value', value) // Debug log untuk melihat tipe dan nilai

      // Periksa apakah value adalah angka atau string yang dapat dikonversi menjadi angka
      if (!isNaN(parseFloat(value)) && isFinite(value)) {
        return `${value} mm` // Tambahkan 'mm' jika nilai valid
      }
      return value // Kembalikan nilai asli jika bukan angka
    },

    getStandart(item) {
      if (item.measuring_portion === 'Visual') {
        return 'Visual'
      }
      if (!item.lower_limit && !item.upper_limit) {
        return 'Go/No-Go'
      }
      if (item.lower_limit && item.upper_limit) {
        return `${item.lower_limit} - ${item.upper_limit} mm`
      }
      return '-' // Default jika tidak memenuhi kondisi di atas
    },
    getStatusClassModal(status) {
      if (status === 'OK') {
        return 'text-success' // Hijau untuk OK
      } else if (status === 'NG') {
        return 'text-danger' // Merah untuk NG
      }
      return '' // Default jika tidak ada status
    },
    getStatusClass(toolHistoryId) {
      const status = this.getStatus(toolHistoryId)
      if (status === 'OK') {
        return 'text-success' // Hijau tebal
      } else if (status === 'NG') {
        return 'text-danger' // Merah tebal
      }
      return '' // Default tanpa styling tambahan
    },
    getStatus(tool_history_id) {
      // Ambil semua data yang memiliki tool_history_id yang sesuai
      const relevantData = this.historyFCheckData.filter(
        (data) => data.tool_history_id === tool_history_id,
      )

      // Jika tidak ada data yang cocok, kembalikan status default
      if (relevantData.length === 0) {
        return '-' // Atau gunakan nilai default lain
      }

      // Periksa status dari data yang relevan
      const statuses = relevantData.map((data) => data.status)

      // Jika ada status NG, kembalikan NG, jika tidak OK
      return statuses.includes('NG') ? 'NG' : 'OK'
    },
    getHistory(tool_history_id) {
      try {
        // console.log('tool_history_id dalam getHistory()', tool_history_id)

        // Filter history data berdasarkan tool_id
        this.historyForTool = this.historyFCheckData.filter(
          (history) => history.tool_history_id === tool_history_id,
        )
        // console.log('this.historyFCheckData', this.historyFCheckData)

        // console.log('historyForTool', this.historyForTool)

        if (this.historyForTool.length > 0) {
          // Proses data history yang sesuai dengan tool_id
          // console.log('History data for this tool:', this.historyForTool)
          // Di sini Anda bisa melakukan tindakan lebih lanjut, misalnya menampilkan data di UI
        } else {
          // console.log('No history data found for this tool')
        }
      } catch (error) {
        console.log(error)
      }
    },
    async getFCheck() {
      try {
        const payload = {
          location: this.location,
        }
        // console.log('payload', payload)

        // Mengambil data dari Vuex Store
        let response = await this.$store.dispatch(
          ACTION_GET_HISTORY_FIRST_CHECK,
          payload,
        )

        if (response.status === 200) {
          this.historyFCheckData = this.GET_HISTORY_TOOL_F_CHECK
          // console.log(
          //   `[DEBUG] this.historyFCheckData:`,
          //   this.GET_HISTORY_TOOL_F_CHECK,
          // )
        }
      } catch (error) {
        console.log('Error in getFCheck:', error)
      }
    },
    isToolInHistory(tool_history_id) {
      const exists = this.historyFCheckData.some(
        (history) => history.tool_history_id === tool_history_id,
      )
      // console.log(
      //   `[DEBUG] Checking tool_history_id: ${tool_history_id}, Exists in history: ${exists}`,
      // )
      return exists
    },
    formatDate(date) {
      const optionsDate = { day: '2-digit', month: '2-digit', year: 'numeric' }
      const optionsTime = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }

      const formattedDate = new Date(date).toLocaleDateString(
        'id-ID',
        optionsDate,
      )
      const formattedTime = new Date(date).toLocaleTimeString(
        'id-ID',
        optionsTime,
      )

      return `${formattedDate.replace(/\//g, '-')} ${formattedTime}`
    },

    updateUnitCheck() {
      // Perbarui workNumbers agar sesuai dengan jumlah unitCheck
      const updatedWorkNumbers = Array(this.unitCheck)
        .fill('')
        .map((_, index) => {
          return this.workNumbers[index] || '' // Pertahankan nilai lama jika ada
        })

      // Ganti seluruh array workNumbers agar reaktif
      this.workNumbers = updatedWorkNumbers

      // Perbarui stdCheckValues pada setiap item di stdFCheckData
      this.stdFCheckData.forEach((item) => {
        const updatedValues = Array(this.unitCheck)
          .fill('')
          .map((_, index) => {
            return item.stdCheckValues[index] || '' // Pertahankan nilai lama jika ada
          })
        item.stdCheckValues = updatedValues // Ganti seluruh array
      })
    },

    async stdFCheck(tool) {
      try {
        this.selectedTool = tool
        // console.log('selectedTool', this.selectedTool)

        // Perlakuan khusus untuk tool_no
        let formattedToolNo = tool.tool_nm

        // Cek apakah sesuai dengan pola khusus (termasuk angka tambahan seperti -10)
        const specialPattern = /^([A-Z]+)\s*-\s*(\d+)\s*CH\s*OP\s*(10)(-\d+)?$/
        const match = formattedToolNo.match(specialPattern)

        if (match) {
          // Format menjadi "DSDW-06465-OP10"
          formattedToolNo = `${match[1]}-${match[2]}-OP${match[3]}`
        } else {
          // Format default jika tidak sesuai pola
          formattedToolNo = tool.tool_nm
            .replace(/\s*-\s*/g, '-') // Hapus spasi di sekitar tanda '-'
            .replace(/([a-zA-Z0-9]+-\d+).*$/, '$1') // Ambil hanya bagian dengan format huruf-angka
        }

        // console.log('formattedToolNo', formattedToolNo)

        // Buat payload dengan tool_no yang telah diformat
        const payload = {
          tool_nm: formattedToolNo,
          location: this.location,
        }

        let response = await this.$store.dispatch(
          ACTION_GET_STD_TOOL_F_CHECK,
          payload,
        )
        if (response.status === 200 && this.GET_STD_TOOL_F_CHECK.length > 0) {
          this.stdFCheckData = this.GET_STD_TOOL_F_CHECK
          this.workNumbers = Array(this.unitCheck).fill('') // Pastikan workNumbers direset
          this.stdFCheckData.forEach((item) => {
            item.stdCheckValues = Array(this.unitCheck).fill('') // Siapkan array untuk setiap unit
          })
        } else {
          this.stdFCheckData = []
          this.workNumbers = []
        }
        // console.log('this.stdFCheckData', this.stdFCheckData)
      } catch (error) {
        console.error(error)
      }
    },

    async submitFCheck() {
      try {
        const pic_check = this.selectedTool.pic_check
        const tool_history_id = this.selectedTool.tool_history_id
        const tool_no = this.selectedTool.tool_no
        const payload = this.stdFCheckData.flatMap((item) =>
          item.stdCheckValues.map((value, index) => ({
            tool_f_check_std_id: item.tool_f_check_std_id,
            tool_id: item.tool_id,
            tool_no: tool_no,
            no_work: this.workNumbers[index] || `Unit-${index + 1}`, // Nomor Work
            measuring_portion: item.measuring_portion, // Bagian pengukuran
            value_check: value, // Nilai aktual yang dimasukkan
            upper_limit: item.upper_limit, // Batas atas
            lower_limit: item.lower_limit, // Batas bawah
            status: item.is_judgment
              ? value // Jika judgment, gunakan nilai langsung sebagai status
              : value >= item.lower_limit && value <= item.upper_limit
              ? 'OK'
              : 'NG', // Status berdasarkan batas atas dan bawah
            pic_check: pic_check,
            tool_history_id: tool_history_id,
          })),
        )
        // Log payload untuk memverifikasi data
        // console.log('Payload yang akan dikirim:', payload)
        let response = await this.$store.dispatch(
          ACTION_ADD_H_TOOL_F_CHECK,
          payload,
        )

        if (response.status === 201) {
          this.getFCheck()
          this.$swal('Success', 'Data has been saved', 'success')
        }

        // Panggil fungsi stdFCheck dengan payload yang telah disiapkan
        await this.stdFCheck(payload)
      } catch (error) {
        console.error(error)
        this.$swal('Error', 'Failed to save data', 'error')
      }
      // Buat payload berdasarkan data dari modal
    },

    handlePageChange(page) {
      this.meta.currentPage = page
      this.$store
        .dispatch(ACTION_GET_TOOLS_BY_LOCATION_FOR_FIRST_CHECK, {
          meta: this.meta,
          location: this.location,
        })
        .then(() => {
          this.chartDataList = []
        })
    },
    actionFocusToggle(state) {
      this.$store.dispatch(ACTION_FOCUS_INPUT, state)
    },
    // focusToggle() {
    //   if (this.GET_FOCUS_INPUT) {
    //     document.getElementById('qr-input').onblur = function () {
    //       this.focus()
    //     }
    //     document.getElementById('qr-input').focus()
    //   } else {
    //     document.getElementById('qr-input').onblur = function () {}
    //     document.getElementById('qr-input').focus({ focusVisible: false })
    //   }
    // },
    // focusToggle() {
    //   const qrInput = document.getElementById('qr-input')
    //   if (this.GET_FOCUS_INPUT) {
    //     qrInput.onblur = function () {
    //       this.focus({ preventScroll: true }) // Fokus tanpa scroll
    //     }
    //     qrInput.focus({ preventScroll: true }) // Fokus tanpa scroll
    //   } else {
    //     qrInput.onblur = null // Hapus event handler
    //   }
    // },
    focusToggle() {
      const qrInput = document.getElementById('qr-input')
      let isBlurHandled = false // Flag untuk mencegah rekursi

      if (this.GET_FOCUS_INPUT) {
        qrInput.onblur = function () {
          if (isBlurHandled) return // Cegah rekursi
          isBlurHandled = true // Set flag
          this.focus({ preventScroll: true }) // Fokus kembali
        }
        qrInput.focus({ preventScroll: true }) // Fokus saat awal
      } else {
        qrInput.onblur = null // Hapus handler
      }
    },

    resetModal() {
      this.unitCheck = 1 // Atur ulang unitCheck ke nilai default
      this.workNumbers = Array(this.unitCheck).fill('') // Reset workNumbers
      this.stdFCheckData.forEach((item) => {
        item.stdCheckValues = Array(this.unitCheck).fill('') // Reset stdCheckValues
      })
      this.updateUnitCheck() // Sinkronkan data setelah reset
      this.machinesForTc = []
      this.toolsForTc = []
      this.act_ctr = 0
      this.std_ctr = ''
      this.picTc = null
      this.problemDescription = ''
    },
  },
  // mounted() {
  //   if (this.GET_FOCUS_INPUT) {
  //     document.getElementById('qr-input').onblur = function () {
  //       this.focus()
  //     }
  //     document.getElementById('qr-input').focus()
  //   } else {
  //     document.getElementById('qr-input').onblur = function () {}
  //     document.getElementById('qr-input').focus({ focusVisible: false })
  //   }
  //   this.$store.dispatch(ACTION_GET_TOOLS_BY_LOCATION_FOR_FIRST_CHECK, {
  //     location: this.location,
  //     meta: this.meta,
  //   })
  // },
  mounted() {
    this.focusToggle()
    this.$store.dispatch(ACTION_GET_TOOLS_BY_LOCATION_FOR_FIRST_CHECK, {
      location: this.location,
      meta: this.meta,
    })

    this.updateUnitCheck()
  },
}
</script>
<style>
.table-bordered th,
.table-bordered td {
  border: 1px solid #000 !important;
}
.table-bordered th {
  background-color: rgb(198, 240, 240);
  height: 50px;
}

.row-red td {
  background-color: rgba(255, 0, 0, 0.2); /* Merah dengan transparansi 20% */
}
.table-danger {
  background-color: rgba(255, 0, 0, 0.2);
}
.auto-width-label {
  display: block;
  width: 200px; /* Atur lebar yang sesuai untuk semua label */
}

.auto-width-select {
  display: block;
  width: 200px; /* Samakan dengan lebar label */
}
</style>
