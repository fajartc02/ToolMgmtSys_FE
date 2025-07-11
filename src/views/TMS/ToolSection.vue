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

  <!-- <div class="modal" tabindex="-1" id="modalToolChange">
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
  </div> -->

  <div class="modal" tabindex="-1" id="modalToolChange">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Tool Change</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            @click="resetModal"
          ></button>
        </div>
        <div class="modal-body">
          <!-- Input Mesin -->
          <div class="mb-3">
            <label for="machineFilter" class="form-label">Mesin</label>
            <v-select
              id="machineFilter"
              :options="GET_MACHINES_FOR_TOOL_CHANGE"
              v-model="machinesForTc"
              label="machine_nm"
              @update:modelValue="
                (val) => {
                  handleMachineChange(val)
                  setelahPilihMesin(val)
                }
              "
              placeholder="Pilih mesin..."
            />
          </div>

          <!-- Input Tool No -->
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

          <!-- STD Counter (readonly) -->
          <div class="mb-3">
            <label class="form-label">STD Counter</label>
            <input
              type="number"
              class="form-control"
              :value="std_ctr"
              readonly
            />
          </div>

          <!-- Tool IN USED -->
          <div class="mb-3">
            <label class="form-label">Tool IN USED</label>
            <div class="input-group">
              <input
                type="text"
                class="form-control"
                v-model="tool_used"
                readonly
              />
              <span class="input-group-text">{{ qr_tool_used }}</span>
            </div>
          </div>

          <!-- ACT Counter -->
          <div class="mb-3">
            <label class="form-label">ACT Counter</label>
            <input
              v-model.number="act_ctr"
              type="number"
              class="form-control"
              placeholder="Masukkan nilai Act"
            />
          </div>

          <!-- Problem -->
          <div class="mb-3" v-if="act_ctr < std_ctr">
            <label class="form-label">Problem</label>
            <input
              v-model="problemDescription"
              type="text"
              class="form-control"
              placeholder="Jelaskan masalahnya"
            />
          </div>

          <!-- PIC -->
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

    <!-- filter search table -->
    <div
      v-if="this.location != 'Tool Regrinding' && this.location != 'Clean Room'"
      class="card mt-2"
    >
      <!--card tool chnage tanpa QR CODE-->
      <div v-if="search.tool_qr == ''" class="mt-2 mb-2">
        <div class="card-header">
          <h5>Tool Change Tool Without QR</h5>
        </div>
        <div class="card-body">
          <button
            class="btn btn-info me-2"
            data-bs-toggle="modal"
            data-bs-target="#modalToolChange"
          >
            Tool Change
          </button>
        </div>
      </div>

      <div class="card-header">
        <h5>Filter Search Data Tool Change</h5>
      </div>
      <!-- Row: 2 Dropdown + 2 Tombol -->
      <div class="row align-items-start p-2">
        <!-- Filter Tool -->
        <div class="col-md-6">
          <h5 class="fw-bold mb-3">Filter Tool</h5>
          <div class="row">
            <div class="col-md-6">
              <v-select
                id="machineFilter"
                :options="GET_MACHINES_FOR_TOOL_CHANGE"
                v-model="selectedSearchMachine"
                label="machine_nm"
                @update:modelValue="handleSearchMachine"
                placeholder="Pilih mesin..."
                :append-to-body="true"
                class="w-100"
              />
            </div>
            <div class="col-md-6">
              <v-select
                id="toolNoFilter"
                :options="GET_TOOLS_NO_FOR_TOOL_CHANGE"
                v-model="selectedSearchTool"
                :getOptionLabel="formatToolLabelTool"
                @update:modelValue="searchTool"
                placeholder="Pilih Tool No..."
                :append-to-body="true"
                class="w-100"
              />
            </div>
          </div>
        </div>

        <!-- Filter Table -->
        <div
          class="col-md-6 d-flex flex-column justify-content-between h-100 border-start ps-4"
        >
          <h5 class="fw-bold mb-3">Filter Table</h5>
          <div class="row h-100">
            <div class="col-md-6 d-flex align-items-start">
              <button
                class="btn btn-danger w-100"
                :class="{ active: activeTable === 'firstCheck' }"
                @click="activeTable = 'firstCheck'"
              >
                First Check
              </button>
            </div>
            <div class="col-md-6 d-flex align-items-start">
              <button
                class="btn btn-danger w-100"
                :class="{ active: activeTable === 'toolUsed' }"
                @click="activeTable = 'toolUsed'"
              >
                Tool Used
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabel Data Tools untuk first cek -->
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
      <div v-if="activeTable === 'firstCheck'">
        <div class="card-header">
          <h5>First Check {{ location }}</h5>
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
                v-for="(tool, index) in toolsWithStatus"
                :key="tool.tool_history_id"
                :class="{ 'row-red': !tool.isFound }"
              >
                <td>
                  {{ meta.itemsPerPage * (meta.currentPage - 1) + index + 1 }}
                </td>
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
      </div>

      <div v-if="activeTable === 'toolUsed'">
        <div class="card-header">
          <h5>Tool Used {{ location }}</h5>
        </div>
        <div class="card-body">
          <table class="table table-hover text-center table-bordered">
            <thead>
              <tr>
                <th scope="col">No</th>
                <th scope="col">Tanggal</th>
                <th scope="col">PIC</th>
                <th scope="col">Tool</th>
                <th scope="col">Tool No</th>
                <th scope="col">QR Code</th>
                <th scope="col">Mesin</th>
                <th scope="col">Std Counter</th>
                <th scope="col">Act Counter</th>
                <th scope="col">Keterangan</th>
                <!-- <th>jam</th> -->
              </tr>
            </thead>
            <tbody v-if="toolUsedWithToolNo.length > 0">
              <tr v-for="(tool, index) in toolUsedWithToolNo" :key="index">
                <td>
                  {{ meta.itemsPerPage * (meta.currentPage - 1) + index + 1 }}
                </td>
                <td>{{ tool.created_dt }}</td>
                <td>{{ tool.pic_check }}</td>
                <td>{{ tool.tool_nm }}</td>
                <td>{{ tool.tool_no }}</td>
                <td>{{ tool.tool_qr }}</td>
                <td>{{ tool.machine_nm }}</td>
                <td>{{ tool.std_ctr }}</td>
                <td>{{ tool.act_counter ?? tool.act_ctr }}</td>
                <td>{{ tool.system_problem }}</td>
                <!-- <td>
                  <div v-if="tool.selected_time">
                    {{ tool.selected_time }}
                  </div>
                  <TimePickerCell
                    v-else
                    @update="(val) => setSelectedTime(index, val)"
                  />
                </td> -->
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="10">Tidak ada data</td>
              </tr>
            </tbody>
          </table>
        </div>
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
import {
  ACTION_ADD_TOOL_HISTORY,
  ACTION_TOOL_DETAILS,
  GET_TOOL_DETAILS,
} from '@/store/TMS/TOOLS.module'
import {
  ACTION_ADD_H_TOOL_F_CHECK,
  ACTION_ADD_HISTORY_TOOL_NO_QR,
  ACTION_GET_HISTORY_FIRST_CHECK,
  ACTION_GET_MACHINES_FOR_TOOL_CHANGE,
  ACTION_GET_STD_TOOL_F_CHECK,
  ACTION_GET_TOOL_NO,
  ACTION_GET_TOOL_USED_BY_LOCATION,
  ACTION_GET_TOOLS_BY_LOCATION_FOR_FIRST_CHECK,
  ACTION_GET_TOOLS_NO_FOR_TOOL_CHANGE,
  ACTION_UPDATE_MACHINE_FOR_TOOL_CHANGE,
  GET_HISTORY_TOOL_F_CHECK,
  GET_MACHINES_FOR_TOOL_CHANGE,
  GET_STD_TOOL_F_CHECK,
  GET_TOOL_NO,
  GET_TOOL_USED_BY_LOCATION,
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
import {
  ACTION_GET_TOOL_BY_TOOL_TYPE_ID,
  ACTION_GET_TOOL_USED_BY_MACHINE_ID,
  GET_TOOL_BY_TOOL_TYPE_ID,
  GET_TOOL_USED_BY_MACHINE_ID,
} from '@/store/TMS/MergeToolChangeUsed.module'

export default {
  components: {
    PleaseScanQRTools,
    CardToolStatus,
    PaginationMaster,
    vSelect,
    TimePickerCell: () => import('@/views/TMS/testingjam.vue'),
  },
  name: 'ToolRegrindingSection',
  data() {
    return {
      activeTable: 'firstCheck',
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
      act_ctr: '',
      std_ctr: '',
      problemDescription: '',
      editTool: null,
      selectedMachine: null,
      originalMachineId: null,
      filteredTools: null,
      toolUsedId: null,
      tool_used: null,
      qr_tool_used: null,
      selectedSearchMachine: null,
      selectedSearchTool: null,
    }
  },
  computed: {
    ...mapGetters([
      GET_TOOL_USED_BY_MACHINE_ID,
      GET_META,
      GET_FOCUS_INPUT,
      GET_TOOLS_BY_LOCATION_FOR_FIRST_CHECK,
      GET_STD_TOOL_F_CHECK,
      GET_HISTORY_TOOL_F_CHECK,
      GET_MACHINES_FOR_TOOL_CHANGE,
      GET_TOOLS_NO_FOR_TOOL_CHANGE,
      GET_USERS_TREESELECT,
      GET_TOOL_NO,
      GET_TOOL_USED_BY_LOCATION,
      GET_TOOL_BY_TOOL_TYPE_ID,
      GET_TOOL_DETAILS,
    ]),
    toolsWithStatus() {
      let tools = this.GET_TOOLS_BY_LOCATION_FOR_FIRST_CHECK
      const inputToolNo = this.selectedSearchTool?.tool_no?.trim()

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

          return isMatched
        })
      }

      return tools.map((tool) => {
        const isFound = this.historyFCheckData.some((history) => {
          return (
            history.tool_history_id === tool.tool_history_id ||
            history.tool_history_no_qr_id === tool.tool_history_id
          )
        })

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
          isFound,
          tool_no: matchedTool ? matchedTool.tool_no : null,
        }
      })
    },
    toolUsedWithToolNo() {
      let tools = this.GET_TOOL_USED_BY_LOCATION
      const inputToolNo = this.selectedSearchTool?.tool_no?.trim()

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
          std_ctr: matchedTool?.std_ctr || null, // misal kamu butuh ini
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
    activeTable() {
      if (this.selectedSearchMachine?.machine_id) {
        this.searchTool()
      }
    },
    'selectedSearchTool.tool_no'(newVal, oldVal) {
      if (!newVal && oldVal) {
        // Saat tool_no dihapus setelah sebelumnya ada, balikin data awal
        this.$store.dispatch(ACTION_GET_TOOLS_BY_LOCATION_FOR_FIRST_CHECK, {
          location: this.location,
          meta: this.meta,
        })
        this.$store.dispatch(ACTION_GET_TOOL_USED_BY_LOCATION, {
          location: this.location,
          meta: this.meta,
        })
      }
    },
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

      this.$store.dispatch(ACTION_GET_TOOL_USED_BY_LOCATION, {
        location: this.location,
        meta: this.meta,
      })

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
    async setelahPilihMesin() {
      try {
        await this.$nextTick() // Tunggu reactivity selesai
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
        if (!this.machinesForTc.machine_id) return
        const payload = {
          machine_id: this.machinesForTc.machine_id,
          distribution_id: distribution_id,
        }

        await this.$store.dispatch(ACTION_GET_TOOL_USED_BY_MACHINE_ID, payload)
      } catch (error) {
        console.log(error)
      }
    },
    async handleToolChange() {
      try {
        const selectedTool = this.toolsForTc

        this.std_ctr = selectedTool.std_ctr

        if (this.GET_TOOL_USED_BY_MACHINE_ID.length == 0) {
          this.toolUsedId = null
          this.tool_used = 'Tool Tidak Ditemukan'
          this.qr_tool_used = null
          return
        }
        console.log(
          'this.GET_TOOL_USED_BY_MACHINE_ID',
          this.GET_TOOL_USED_BY_MACHINE_ID,
        )

        let normalizedSelectedToolNm = selectedTool.tool_nm
          .replace(/[\s-]/g, '')
          .toLowerCase()

        let filteredTools = this.GET_TOOL_USED_BY_MACHINE_ID.filter((tool) => {
          let normalizedToolNo = tool.tool_no
            .replace(/[\s-]/g, '')
            .toLowerCase()
          return normalizedToolNo.includes(normalizedSelectedToolNm)
        })

        if (filteredTools.length == 0) {
          this.toolUsedId = null
          this.tool_used = 'Tool Tidak Ditemukan'
          this.qr_tool_used = null
          return
        }

        // Ambil satu data dengan created_dt terbaru
        let latestTool = filteredTools.reduce((latest, tool) => {
          return !latest ||
            new Date(tool.created_dt) > new Date(latest.created_dt)
            ? tool
            : latest
        }, null)

        const payload = {
          tool_type_id: latestTool.tool_type_id,
          tool_id: latestTool.tool_id,
        }
        let response = await this.$store.dispatch(
          ACTION_GET_TOOL_BY_TOOL_TYPE_ID,
          payload,
        )
        if (
          response.status === 200 &&
          this.GET_TOOL_BY_TOOL_TYPE_ID.length > 0
        ) {
          const tool = this.GET_TOOL_BY_TOOL_TYPE_ID[0] // Ambil data pertama
          this.tool_used = tool.tool_no
          this.qr_tool_used = tool.tool_qr
          this.toolUsedId = tool.tool_id
        }
      } catch (error) {
        console.log(error)
      }
    },
    async searchTool() {
      try {
        const payload = {
          location: this.location,
          machine_id: this.selectedSearchMachine.machine_id,
          meta: this.meta,
        }
        if (!payload.machine_id) {
          return
        }
        const actionName =
          this.activeTable === 'firstCheck'
            ? ACTION_GET_TOOLS_BY_LOCATION_FOR_FIRST_CHECK
            : ACTION_GET_TOOL_USED_BY_LOCATION

        await this.$store.dispatch(actionName, payload)
      } catch (error) {
        console.log('Error in searchTool:', error)
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

    formatToolLabelTool(option) {
      if (!option) return 'Tidak ada data' // Fallback jika option null atau undefined
      return `${option.tool_no || 'N/A'} / ${option.tool_nm || 'N/A'}`
    },
    openModal(type) {},
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
      try {
        const opNo = this.machinesForTc.op_no

        const op_no = opNo.replace(/\D/g, '') // Hapus semua karakter non-angka
        const payload = {
          op_no: op_no,
          location: this.location,
        }

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
    async handleSearchMachine() {
      try {
        const opNo = this.selectedSearchMachine.op_no

        const op_no = opNo.replace(/\D/g, '') // Hapus semua karakter non-angka
        const payload = {
          op_no: op_no,
          location: this.location,
        }

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
          distribution_id: distribution_id,
          machine_id: this.machinesForTc?.machine_id || null,
          tool_id: this.toolsForTc?.tool_id || null,
          system_activity: 'IN USED',
          pic: this.picTc.id || null,
        }
        await this.$store.dispatch(ACTION_ADD_HISTORY_TOOL_NO_QR, payload)
        this.submitToolUsed()
      } catch (error) {
        console.error('Error submitting tool change:', error)
        this.$swal.fire('Error', 'Gagal menambah data', 'error')
      }
    },

    async submitToolUsed() {
      try {
        let distribution_id = null

        // Tentukan distribution_id berdasarkan lokasi
        if (this.location === 'Crank Shaft') {
          distribution_id = 6
        } else if (this.location === 'Cam Shaft') {
          distribution_id = 3
        } else if (this.location === 'Cylinder Head') {
          distribution_id = 4
        } else if (this.location === 'Cylinder Block') {
          distribution_id = 5
        }

        // === CASE 1: Tanpa QR tool ===
        if (!this.qr_tool_used) {
          const payload = {
            distribution_id: distribution_id,
            machine_id: this.machinesForTc?.machine_id || null,
            tool_id: this.toolsForTc?.tool_id || null,
            act_ctr: this.act_ctr,
            system_activity: 'USED',
            system_problem: this.problemDescription,
            pic: this.picTc?.id || null,
          }

          let response = await this.$store.dispatch(
            ACTION_ADD_HISTORY_TOOL_NO_QR,
            payload,
          )
          if (response.status === 201) {
            await this.$store.dispatch(
              ACTION_GET_TOOLS_BY_LOCATION_FOR_FIRST_CHECK,
              {
                meta: this.meta,
                location: this.location,
              },
            )
            this.$swal.fire('Success', 'Data kamu sudah bertambah', 'success')
          }
        } else {
          const payloadData = {
            headerData: {
              tool_id: this.toolUsedId,
              distribution_id: distribution_id,
              system_activity: 'USED',
              system_problem: this.problemDescription,
              act_counter: this.act_ctr,
              machine_id: this.machinesForTc?.machine_id || null,
              pic_check: this.picTc?.id || null,
            },
          }

          let response = await this.$store.dispatch(
            ACTION_ADD_TOOL_HISTORY,
            payloadData,
          )

          if (response.status === 200) {
            await this.$store.dispatch(
              ACTION_GET_TOOLS_BY_LOCATION_FOR_FIRST_CHECK,
              {
                meta: this.meta,
                location: this.location,
              },
            )
            this.$swal.fire('Success', 'Data kamu sudah bertambah', 'success')
          }
          this.resetModal()
        }
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
      // Ambil semua data yang memiliki tool_history_id ATAU tool_history_no_qr_id yang sesuai
      const relevantData = this.historyFCheckData.filter((data) => {
        return (
          data.tool_history_id === tool_history_id ||
          data.tool_history_no_qr_id === tool_history_id
        )
      })

      // Jika tidak ada data yang cocok, kembalikan status default
      if (relevantData.length === 0) {
        return '-' // Atau gunakan nilai default lain
      }

      // Ambil status dari data yang cocok
      const statuses = relevantData.map((data) => data.status)

      // Jika ada NG, kembalikan NG. Jika tidak, kembalikan OK
      return statuses.includes('NG') ? 'NG' : 'OK'
    },

    getHistory(tool_history_id) {
      try {
        console.log('tool_history_id dalam getHistory()', tool_history_id)

        // Filter history data berdasarkan tool_id
        this.historyForTool = this.historyFCheckData.filter((history) => {
          return (
            history.tool_history_id === tool_history_id ||
            history.tool_history_no_qr_id === tool_history_id
          )
        })
        console.log('this.historyFCheckData', this.historyFCheckData)
        console.log('historyForTool', this.historyForTool)

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
          tool_no: tool.tool_no,
          tool_nm: formattedToolNo,
          location: this.location,
          machine_id: tool.machine_id,
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
        const tool_no = this.selectedTool.tool_nm
        const payload = this.stdFCheckData.flatMap((item) =>
          item.stdCheckValues.map((value, index) => ({
            tool_qr: this.selectedTool.tool_qr,
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
        // return
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
.btn.active {
  background-color: #c82333 !important;
  border-color: #bd2130 !important;
}
</style>
