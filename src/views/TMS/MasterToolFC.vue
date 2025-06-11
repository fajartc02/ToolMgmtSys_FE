<template>
  <div class="modal" tabindex="-1" id="modalToolFirstCheck">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ isEditMode ? 'Edit Tool' : 'Tambah Tool' }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="clearForm()"
          ></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col">
              <div class="mb-3 form-group">
                <label class="tool-drawing-label">Line </label>
                <select v-model="line_id" class="form-control">
                  <option
                    v-for="line in GET_LINES"
                    :key="line.line_id"
                    :value="line.line_id"
                  >
                    {{ line.line_nm }}
                  </option>
                </select>
              </div>
              <div class="mb-3 form-group">
                <label class="tool-drawing-label">OP </label>
                <input type="number" v-model="op" class="form-control" />
              </div>
              <div class="mb-3 form-group">
                <label class="tool-drawing-label">Tool No</label>
                <input type="text" v-model="tool_no" class="form-control" />
              </div>
              <div class="mb-3 form-group">
                <label class="tool-drawing-label">Nama Tool </label>
                <input v-model="toolNm" class="form-control" type="text" />
              </div>
              <div class="mb-3 form-group">
                <label class="tool-drawing-label">Nama Proses</label>
                <input v-model="toolDesc" class="form-control" type="text" />
              </div>
              <div class="mb-3 form-group">
                <label class="tool-drawing-label">Standart counter</label>
                <input v-model="counter" class="form-control" type="number" />
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
            @click="clearForm()"
          >
            Close
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="isEditMode ? updateTool() : addTool()"
            data-bs-dismiss="modal"
          >
            {{ isEditMode ? 'Update' : 'Save' }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal" tabindex="-1" id="modalDeleteToolFC">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Delete Tool</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete this tool?</p>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Close
          </button>
          <button
            type="button"
            class="btn btn-danger"
            @click="deleteTool"
            data-bs-dismiss="modal"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal text-center" tabindex="-1" id="modalMeasurement">
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title w-100 text-center">Standart First Check</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <!-- Tabel 1 -->
          <table class="table table-bordered table-striped text-center">
            <thead>
              <tr>
                <th>Line</th>
                <th>OP</th>
                <th>Tool No</th>
                <th>Tool</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="selectedTool">
                <td>{{ selectedTool.line_nm }}</td>
                <td>{{ selectedTool.op_no }}</td>
                <td>{{ selectedTool.tool_no }}</td>
                <td>{{ selectedTool.tool_nm }}</td>
              </tr>
            </tbody>
          </table>
          <!-- Tabel 2 -->
          <div class="table-responsive">
            <table class="table table-bordered table-striped text-center">
              <thead>
                <tr>
                  <th style="width: 30%">Proses Name</th>
                  <th style="width: 10%">Gauge</th>
                  <th style="width: 8%">Qty Check</th>
                  <th style="width: 8%">Value</th>
                  <th style="width: 8%">Upper Limit</th>
                  <th style="width: 8%">Lower Limit</th>
                  <th style="width: 10%">Unit</th>
                  <th style="width: 10%">Used In</th>
                  <th style="width: 10%">Action</th>
                </tr>
              </thead>
              <tbody v-if="stdCheck.length > 0">
                <tr v-for="(measurement, index) in stdCheck" :key="index">
                  <td>
                    <input
                      type="text"
                      v-model="measurement.measuring_portion"
                      class="form-control"
                      placeholder="Enter Process Name"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      v-model="measurement.gauge"
                      class="form-control"
                      placeholder="Enter Measure Name"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      class="form-control"
                      v-model="measurement.qty_check"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      v-model="measurement.dimension"
                      class="form-control"
                      placeholder="Enter Value"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      v-model="measurement.upper_limit"
                      class="form-control"
                      placeholder="Enter Upper Limit"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      v-model="measurement.lower_limit"
                      class="form-control"
                      placeholder="Enter Lower Limit"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      v-model="measurement.units"
                      class="form-control"
                      placeholder="Enter Unit"
                    />
                  </td>
                  <td>
                    <select
                      class="form-select"
                      v-model="measurement.system_std_used"
                    >
                      <option value="CH">C/H</option>
                      <option value="CB">C/B</option>
                      <option value="CS">C/S</option>
                      <option value="CAM">CAM</option>
                    </select>
                  </td>
                  <td>
                    <button type="button" class="btn" @click="deleteRow(index)">
                      <i class="fas fa-trash text-danger"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
              <tbody v-else>
                <tr>
                  <td colspan="9" class="text-center">No Data</td>
                </tr>
              </tbody>
            </table>
          </div>
          <button type="button" class="btn btn-primary" @click="addRow">
            Add Std Parameter
          </button>
          <!-- Note Global -->
          <div v-if="showValidationNote" class="alert alert-danger mt-3">
            Jika <strong>Value (Dimension)</strong> diisi, maka
            <strong>Upper Limit</strong>, <strong>Lower Limit</strong>, dan
            <strong>Unit</strong> harus diisi.
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Close
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="saveSTDFirstCheck"
            :disabled="isSaveDisabled"
            data-bs-dismiss="modal"
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
        <h4 class="text-center m-0">Master Tool</h4>
        <CButton
          type="button"
          color="secondary"
          variant="outline"
          data-bs-toggle="modal"
          data-bs-target="#modalToolFirstCheck"
          >Add Tool
        </CButton>
      </div>
    </div>

    <!-- filter search table -->
    <div class="card mt-2">
      <div class="card-header">
        <h5>Filter</h5>
      </div>
      <div class="d-flex align-items-end gap-2 p-2">
        <!-- select Line-->
        <div style="width: 30%">
          <label for="lineFilter" class="form-label" style="font-weight: bold">
            Line</label
          >
          <v-select
            id="lineFilter"
            :options="GET_LINES"
            v-model="lineFilter"
            label="line_nm"
            placeholder="Pilih Line..."
            :append-to-body="true"
            @update:modelValue="getMachines"
          >
          </v-select>
        </div>
        <!-- Select Mesin -->
        <div style="width: 30%">
          <label
            for="machineFilter"
            class="form-label"
            style="font-weight: bold"
            >Mesin</label
          >
          <v-select
            id="machineFilter"
            :options="GET_MACHINES_FOR_TOOL_CHANGE"
            v-model="machineForFC"
            label="machine_nm"
            placeholder="Pilih mesin..."
            :append-to-body="true"
            @update:modelValue="handleMachineChange"
          />
        </div>

        <!-- Select Tool No -->
        <div style="width: 30%">
          <label for="toolNoFilter" class="form-label" style="font-weight: bold"
            >Tool No</label
          >
          <v-select
            id="toolNoFilter"
            :options="GET_TOOLS_NO_FOR_TOOL_CHANGE"
            v-model="toolsForFC"
            :getOptionLabel="formatToolLabelTool"
            placeholder="Pilih Tool No..."
            :append-to-body="true"
            @update:modelValue="searchToolFC"
          />
        </div>
      </div>
    </div>

    <div class="card mt-2">
      <div class="card-body">
        <table
          style="text-align: center; width: 100%"
          class="table table-bordered table-striped table-responsive"
        >
          <thead>
            <tr>
              <th style="width: 4%">No</th>
              <th style="width: 6%">Line</th>
              <th style="width: 5%">OP</th>
              <th style="width: 8%">Tool No</th>
              <th style="width: 10%">Tool Name</th>
              <th
                style="width: 20%; white-space: normal; word-wrap: break-word"
              >
                Process
              </th>
              <th style="width: 8%">Std Ctr</th>
              <th style="width: 10%">Register Date</th>
              <th style="width: 10%">Register By</th>
              <th style="width: 8%">Std Check</th>
              <th style="width: 10%">Action</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(tool, tool_id) in GET_MASTER_TOOL_FC" :key="tool_id">
              <td>{{ tool.no }}</td>
              <td>{{ tool.line_nm }}</td>
              <td>{{ tool.op_no }}</td>
              <td>{{ tool.tool_no }}</td>
              <td>{{ tool.tool_nm }}</td>
              <td style="white-space: normal; word-wrap: break-word">
                {{ tool.process_nm }}
              </td>
              <td>{{ tool.std_ctr }}</td>
              <td>{{ tool.created_dt }}</td>
              <td>{{ tool.created_by }}</td>
              <td>
                <button
                  class="btn btn-sm"
                  data-bs-toggle="modal"
                  data-bs-target="#modalMeasurement"
                  @click="fetchStdCheck(tool.tool_id)"
                >
                  <i class="fas fa-book text-primary"></i>
                </button>
              </td>
              <td>
                <button
                  data-bs-toggle="modal"
                  data-bs-target="#modalToolFirstCheck"
                  class="btn btn-sm"
                  @click="prepareEdit(tool)"
                >
                  <i class="fas fa-edit text-primary"></i>
                </button>
                <button
                  data-bs-toggle="modal"
                  data-bs-target="#modalDeleteToolFC"
                  class="btn btn-sm ms-2"
                  @click="prepareDelete(tool.tool_id)"
                >
                  <i class="fas fa-trash text-danger"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="meta" class="card-footer">
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
  </div>
</template>
<script>
import {
  ACTION_ADD_STD_F_CHECK,
  ACTION_ADD_TOOL_FC,
  ACTION_DELETE_STD_F_CHECK,
  ACTION_DELETE_TOOL_FC,
  ACTION_EDIT_TOOL_FC,
  ACTION_GET_MASTER_TOOL_FC,
  ACTION_GET_STD_F_CHECK,
  GET_MASTER_TOOL_FC,
  GET_STD_F_CHECK,
} from '@/store/TMS/MasterToolFC.module'
import { mapGetters } from 'vuex'
import PaginationMaster from '@/components/TMS/Pagination/PaginationMaster.vue'
import { GET_META } from '@/store/TMS/META.module'
import { ACTION_GET_LINES, GET_LINES } from '@/store/TMS/LINES.module'
import {
  ACTION_GET_MACHINES_FOR_TOOL_CHANGE,
  ACTION_GET_TOOLS_NO_FOR_TOOL_CHANGE,
  GET_MACHINES_FOR_TOOL_CHANGE,
  GET_TOOLS_NO_FOR_TOOL_CHANGE,
} from '@/store/TMS/FirstCheck.module'

export default {
  name: 'MasterToolFC',
  components: {
    PaginationMaster,
  },
  data() {
    return {
      meta: {
        currentPage: 1,
        itemsPerPage: 10,
        totalData: 0,
      },
      line_id: null,
      op: '',
      tool_no: '',
      toolNm: '',
      toolDesc: '',
      counter: null,
      isEditMode: false, // Flag for edit mode
      currentToolId: null, // Store tool_id when editing
      selectedTool: null,
      stdCheck: [],
      lineFilter: null,
      machineForFC: null,
      toolsForFC: null,
    }
  },
  computed: {
    ...mapGetters([
      GET_META,
      GET_MASTER_TOOL_FC,
      GET_LINES,
      GET_STD_F_CHECK,
      GET_MACHINES_FOR_TOOL_CHANGE,
      GET_TOOLS_NO_FOR_TOOL_CHANGE,
    ]),
    isSaveDisabled() {
      return this.stdCheck.some((measurement) => {
        // Jika measuring_portion kosong, tombol Save dinonaktifkan
        if (!measurement.measuring_portion) {
          return true
        }
        // Jika dimension diisi, input lainnya harus terisi
        if (measurement.dimension) {
          return (
            !measurement.upper_limit || // Upper limit kosong
            !measurement.lower_limit || // Lower limit kosong
            !measurement.units
          )
        }
        return false // Jika dimension kosong, baris ini valid
      })
    },
    showValidationNote() {
      return this.stdCheck.some((measurement) => {
        return (
          measurement.dimension &&
          (!measurement.upper_limit ||
            !measurement.lower_limit ||
            !measurement.units)
        )
      })
    },
  },
  watch: {
    'toolsForFC.tool_id'(newVal, oldVal) {
      if (!newVal && oldVal) {
        // Saat tool_id dihapus setelah sebelumnya ada, balikin data awal
        this.$store.dispatch(ACTION_GET_MASTER_TOOL_FC, { meta: this.meta })
      }
    },
    GET_META: function () {
      this.meta = this.GET_META
    },
    'meta.itemsPerPage': function () {
      this.$store.dispatch(ACTION_GET_MASTER_TOOL_FC, { meta: this.meta })
    },
  },
  mounted() {
    this.$store.dispatch(ACTION_GET_MASTER_TOOL_FC, { meta: this.meta })
    this.$store.dispatch(ACTION_GET_LINES, { meta: this.meta })
  },
  methods: {
    async searchToolFC() {
      try {
        const payload = {
          line_id: this.lineFilter.line_id,
          tool_id: this.toolsForFC.tool_id,
        }
        await this.$store.dispatch(ACTION_GET_MASTER_TOOL_FC, payload)
      } catch (error) {
        console.log(error)
      }
    },
    async handleMachineChange() {
      console.log('kepanggil')

      try {
        const opNo = this.machineForFC.op_no
        console.log('Nilai op_no:', opNo)
        const op_no = opNo.replace(/\D/g, '') // Hapus semua karakter non-angka
        const payload = {
          op_no: op_no,
          location: this.lineFilter.line_nm,
        }
        console.log('Angka dari op_no:', op_no)
        console.log('payload', payload)
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
    async getMachines() {
      // console.log('kepanggil')

      try {
        const payload = { location: this.lineFilter.line_nm } // Menggunakan this.location
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
    formatToolLabelTool(option) {
      if (!option) return 'Tidak ada data' // Fallback jika option null atau undefined
      return `${option.tool_no || 'N/A'} / ${option.tool_nm || 'N/A'}`
    },
    handlePageChange(page) {
      this.meta.currentPage = page
      this.$store.dispatch(ACTION_GET_MASTER_TOOL_FC, { meta: this.meta })
    },
    async addTool() {
      try {
        const paylaod = {
          line_id: this.line_id,
          op_no: this.op,
          tool_no: this.tool_no,
          tool_nm: this.toolNm,
          process_nm: this.toolDesc,
          std_ctr: this.counter,
        }
        console.log('payload', paylaod)

        let response = await this.$store.dispatch(ACTION_ADD_TOOL_FC, paylaod)
        if (response.status === 201) {
          this.$store.dispatch(ACTION_GET_MASTER_TOOL_FC, { meta: this.meta })
          this.$swal('Success', 'Data has been added', 'success')
          this.clearForm()
        }
      } catch (error) {
        console.log(error)
        this.$swal('Error', 'Gagal menambah data', 'error')
      }
    },
    prepareEdit(tool) {
      this.isEditMode = true
      this.currentToolId = tool.tool_id
      this.line_id = tool.line_id
      this.op = tool.op_no
      this.tool_no = tool.tool_no
      this.toolNm = tool.tool_nm
      this.toolDesc = tool.process_nm
      this.counter = tool.std_ctr
    },
    async updateTool() {
      try {
        const payload = {
          tool_id: this.currentToolId,
          line_id: this.line_id,
          op_no: this.op,
          tool_no: this.tool_no,
          tool_nm: this.toolNm,
          process_nm: this.toolDesc,
          std_ctr: this.counter,
        }

        let response = await this.$store.dispatch(ACTION_EDIT_TOOL_FC, payload)
        if (response.status === 201) {
          this.$store.dispatch(ACTION_GET_MASTER_TOOL_FC, { meta: this.meta })
          this.$swal('Success', 'Data has been updated', 'success')
          this.clearForm()
        }
      } catch (error) {
        console.log(error)
        this.$swal('Error', 'Gagal menambah data', 'error')
      }
    },
    prepareDelete(tool) {
      this.currentToolId = tool
      console.log('delete', this.currentToolId)
    },

    async deleteTool() {
      try {
        let response = await this.$store.dispatch(
          ACTION_DELETE_TOOL_FC,
          this.currentToolId,
        )
        if (response.status === 201) {
          this.$store.dispatch(ACTION_GET_MASTER_TOOL_FC, { meta: this.meta })
          this.$swal('Success', 'Data has been deleted', 'success')
          this.clearForm()
        }
      } catch (error) {
        console.log(error)
        this.$swal('Error', 'Gagal menambah data', 'error')
      }
    },
    async fetchStdCheck(tool_id) {
      try {
        this.selectedTool = this.GET_MASTER_TOOL_FC.find(
          (tool) => tool.tool_id === tool_id,
        )
        if (this.selectedTool) {
          await this.$store.dispatch(ACTION_GET_STD_F_CHECK, {
            meta: this.meta,
          })
          this.stdCheck = this.GET_STD_F_CHECK.filter(
            (measurement) => measurement.tool_id === tool_id,
          )
          console.log('stdCheck', this.stdCheck)
        }
      } catch (error) {
        console.log(error)
        this.$swal('Error', 'Gagal menambah data', 'error')
      }
    },
    addRow() {
      let systemStd = ''

      // Pastikan selectedTool ada sebelum menentukan system_std_used
      if (this.selectedTool) {
        // Tentukan nilai system_std_used berdasarkan line_nm dari selectedTool
        if (this.selectedTool.line_nm === 'C/H') {
          systemStd = 'CH'
        } else if (this.selectedTool.line_nm === 'C/B') {
          systemStd = 'CB'
        } else if (this.selectedTool.line_nm === 'C/S') {
          systemStd = 'CS'
        } else {
          systemStd = 'CAM'
        }
      }

      this.stdCheck.push({
        measuring_portion: '',
        gauge: '',
        qty_check: '',
        dimension: '',
        upper_limit: '',
        lower_limit: '',
        units: '',
        system_std_used: systemStd,
      })
    },
    async deleteRow(index) {
      const measurement = this.stdCheck[index]
      console.log('measurement', measurement)

      // Cek apakah tool_type_std_id ada
      if (!measurement.tool_f_check_std_id) {
        this.stdCheck.splice(index, 1)
      } else {
        // Lanjutkan dengan pemanggilan backend
        let statusRespon = await this.$store.dispatch(
          ACTION_DELETE_STD_F_CHECK,
          measurement.tool_f_check_std_id,
        )
        if (statusRespon.status === 200) {
          this.$store.dispatch(ACTION_GET_STD_F_CHECK, { meta: this.meta })
          this.$swal('Success', 'Data berhasil dihapus', 'success')
          this.stdCheck.splice(index, 1)
        } else {
          this.$swal('Error', 'Gagal menghapus data', 'error')
        }
      }
    },
    async saveSTDFirstCheck() {
      try {
        const payload = this.stdCheck.map((measurement) => ({
          tool_id: this.selectedTool.tool_id,
          measuring_portion: measurement.measuring_portion,
          gauge: measurement.gauge,
          qty_check: measurement.qty_check,
          dimension: measurement.dimension,
          upper_limit: measurement.upper_limit,
          lower_limit: measurement.lower_limit,
          units: measurement.units,
          system_std_used: measurement.system_std_used,
        }))
        console.log('payload', payload)

        let statusResponse = await this.$store.dispatch(
          ACTION_ADD_STD_F_CHECK,
          payload,
        )
        if (statusResponse.status === 201) {
          this.$store.dispatch(ACTION_GET_STD_F_CHECK, { meta: this.meta })
          this.$swal('Success', 'Data has been saved', 'success')
        } else {
          this.$swal('Error', 'Gagal menyimpan data', 'error')
        }
      } catch (error) {
        console.log(error)
        this.$swal('Error', 'Gagal menyimpan data', 'error')
      }
    },

    clearForm() {
      this.isEditMode = false
      this.currentToolId = null
      this.line_id = ''
      this.op = ''
      this.tool_no = ''
      this.toolNm = ''
      this.toolDesc = ''
      this.counter = null
    },
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
.is-invalid {
  border-color: #dc3545;
}
</style>
