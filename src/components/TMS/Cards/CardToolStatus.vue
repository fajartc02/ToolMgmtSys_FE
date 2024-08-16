<template>
  <div class="d-flex justify-content-center align-items-start mt-2">
    <div class="card" style="width: 100%">
      <div class="card-header">
        <h6 class="text-center m-0">Tool Status</h6>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col">
            <h4 class="text-center">Tool Name</h4>
          </div>
          <div class="col">
            <h4 class="text-center">Tool Description</h4>
          </div>
          <div class="col">
            <h4 class="text-center">Position</h4>
          </div>
          <div
            class="col"
            v-if="location != 'Clean Room' && location != 'Tool Regrinding'"
          >
            <h4 class="text-center">Machine</h4>
          </div>
          <div class="col">
            <h4 class="text-center">Std Counter</h4>
          </div>
          <div class="col">
            <h4 class="text-center">Act Counter</h4>
          </div>
          <div class="col">
            <h4 class="text-center">Status</h4>
          </div>
        </div>
        <hr />
        <div v-if="GET_TOOL_DETAILS" class="row text-center">
          <div class="col">
            <h6 class="text-center">{{ GET_TOOL_DETAILS.tool_no }}</h6>
          </div>
          <div class="col">
            <h6 class="text-center">{{ GET_TOOL_DETAILS.tool_type_desc }}</h6>
          </div>
          <div class="col">
            <h6 class="text-center">{{ GET_TOOL_DETAILS.position }}</h6>
          </div>
          <div
            class="col"
            v-if="location != 'Clean Room' && location != 'Tool Regrinding'"
          >
            <h6 class="text-center">
              {{
                GET_TOOL_DETAILS.machine_nm ? GET_TOOL_DETAILS.machine_nm : '-'
              }}
            </h6>
          </div>
          <div class="col">
            <h6 class="text-center">{{ GET_TOOL_DETAILS.std_counter }}</h6>
          </div>
          <div class="col">
            <h6 class="text-center">{{ GET_TOOL_DETAILS.act_counter }}</h6>
          </div>
          <div class="col">
            <div
              v-if="
                GET_TOOL_DETAILS.regrinding_count > 0 &&
                !GET_TOOL_DETAILS.is_scrab
              "
              class="text-center badge bg-warning"
            >
              {{ GET_TOOL_DETAILS.regrinding_count }}x Regrinding
            </div>
            <div
              v-else-if="
                GET_TOOL_DETAILS.regrinding_count == 0 &&
                !GET_TOOL_DETAILS.is_scrab
              "
              class="text-center badge bg-success"
            >
              New
            </div>
            <div v-else class="text-center badge bg-danger">Scrab</div>
          </div>
        </div>
        <div v-else class="row text-center">
          <div class="col">
            <h6 class="text-center text-muted">
              Tool Belum di Registrasi / Tidak Ada
            </h6>
          </div>
        </div>
      </div>
      <div v-if="is_footer" class="card-footer text-center">
        <template v-if="location == 'Tool Regrinding'">
          <button
            class="btn btn-warning"
            @click="showModal('regrindingModal')"
            :disabled="GET_TOOL_DETAILS?.is_scrab || !GET_TOOL_DETAILS"
          >
            Regrinding
          </button>
          .
          <button
            class="btn btn-danger"
            @click="showModal('scrabModal')"
            :disabled="GET_TOOL_DETAILS?.is_scrab || !GET_TOOL_DETAILS"
          >
            Scrab
          </button>
          .
          <button
            class="btn btn-success"
            @click="transferConfirmation(1)"
            :disabled="GET_TOOL_DETAILS?.is_scrab || !GET_TOOL_DETAILS"
          >
            Transfer
          </button>
        </template>
        <template v-else-if="location == 'Clean Room'">
          <button
            class="btn btn-warning"
            @click="showModal('settingModal')"
            :disabled="GET_TOOL_DETAILS?.is_scrab || !GET_TOOL_DETAILS"
          >
            Setting
          </button>
          .
          <button
            class="btn btn-success"
            @click="showModal('transferModal')"
            :disabled="GET_TOOL_DETAILS?.is_scrab || !GET_TOOL_DETAILS"
          >
            Transfer
          </button>
        </template>
        <template
          v-else-if="
            location == 'Cam Shaft' ||
            location == 'Crank Shaft' ||
            location == 'Cylinder Head' ||
            location == 'Cylinder Block'
          "
        >
          <button
            class="btn btn-info"
            @click="showModal('toolChangeModal')"
            :disabled="GET_TOOL_DETAILS?.is_scrab || !GET_TOOL_DETAILS"
          >
            Tool Change
          </button>
          .
          <button
            class="btn btn-secondary"
            @click="showModal('toolUsedModal')"
            :disabled="GET_TOOL_DETAILS?.is_scrab || !GET_TOOL_DETAILS"
          >
            Tool Used
          </button>
          <!-- <button class="btn btn-success" @click="transferConfirmation(1)"
            :disabled="GET_TOOL_DETAILS?.is_scrab || !GET_TOOL_DETAILS">Transfer</button> -->
        </template>
      </div>
    </div>
  </div>
  <template v-if="GET_TOOL_DETAILS">
    <RegringingAction
      :modalShow="regrindingModal"
      :tool_type_id="GET_TOOL_DETAILS.tool_type_id"
      @modal-show="(state) => dismissModal('regrindingModal')"
    />
    <ScrabAction
      :modalShow="scrabModal"
      :tool_type_id="GET_TOOL_DETAILS.tool_type_id"
      @modal-show="(state) => dismissModal('scrabModal')"
    />
    <TransferAction
      :modalShow="transferModal"
      :tool_type_id="GET_TOOL_DETAILS.tool_type_id"
      @modal-show="(state) => dismissModal('transferModal')"
    />
    <SettingAction
      :modalShow="settingModal"
      :tool_type_id="GET_TOOL_DETAILS.tool_type_id"
      @modal-show="(state) => dismissModal('settingModal')"
    />

    <!-- PROD SCOPE -->
    <ToolChangeAction
      :modalShow="toolChangeModal"
      @modal-show="(state) => dismissModal('toolChangeModal')"
      :location="location"
    />
    <ToolUsedAction
      :modalShow="toolUsedModal"
      @modal-show="(state) => dismissModal('toolUsedModal')"
      :location="location"
    />
  </template>
</template>
<script>
import { ACTION_FOCUS_INPUT } from '@/store/TMS/focusInput.module'

import ToolChangeAction from '@/components/TMS/Modals/ToolChangeAction.vue'
import SettingAction from '../Modals/SettingAction.vue'
import RegringingAction from '../Modals/RegringingAction.vue'
import ToolUsedAction from '../Modals/ToolUsedAction.vue'
import ScrabAction from '../Modals/ScrabAction.vue'
import TransferAction from '../Modals/TransferAction.vue'

import { mapGetters } from 'vuex'
import {
  ACTION_TOOL_DETAILS,
  ACTION_UPDATE_TOOL_POS,
  GET_TOOL_DETAILS,
} from '@/store/TMS/TOOLS.module'

export default {
  name: 'CardToolStatus',
  data() {
    return {
      toolChangeModal: false,
      settingModal: false,
      regrindingModal: false,
      toolUsedModal: false,
      scrabModal: false,
      transferModal: false,
    }
  },
  computed: {
    ...mapGetters([GET_TOOL_DETAILS]),
  },
  methods: {
    dismissModal(keyModal) {
      this[keyModal] = false
      this.$store.dispatch(ACTION_FOCUS_INPUT, true)
    },
    showModal(keyModal) {
      try {
        this[keyModal] = true
        this.$store.dispatch(ACTION_FOCUS_INPUT, false)
      } catch (error) {
        console.log(error)
      }
    },
    showAlert() {
      this.$swal
        .fire({
          title: 'Apakah anda yakin ingin Scrab Tool?',
          showCancelButton: true,
          confirmButtonText: 'Ya, Saya ingin Scrab tool!',
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.$swal('Success to scrab tool!', '', 'success')
          }
        })
    },
    transferConfirmation(distribution_id) {
      this.$swal
        .fire({
          title: 'Are you sure want to Transfer?',
          showCancelButton: true,
          confirmButtonText: 'Yes, I am sure!',
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            await this.$store.dispatch(ACTION_UPDATE_TOOL_POS, {
              distribution_id,
              tool_qr: this.GET_TOOL_DETAILS.tool_qr,
            })
            await this.$store.dispatch(ACTION_TOOL_DETAILS, {
              tool_qr: this.GET_TOOL_DETAILS.tool_qr,
            })
            this.$swal('Success to Transfer!', '', 'success')
          }
        })
    },
  },
  components: {
    ToolChangeAction,
    SettingAction,
    RegringingAction,
    ToolUsedAction,
    ScrabAction,
    TransferAction,
  },
  props: {
    is_footer: {
      type: Boolean,
      default: false,
    },
    qrCode: {
      type: String,
      default: null,
    },
    location: {
      type: String,
      default: 'Tool Regrinding',
    },
  },
}
</script>
<style></style>
