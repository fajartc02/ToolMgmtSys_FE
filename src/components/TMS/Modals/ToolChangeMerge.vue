<template>
  <CModal
    scrollable
    :visible="modalShow"
    @close="
      () => {
        $emit('modalShow', false)
      }
    "
  >
    <CModalHeader>
      <CModalTitle>Tool Change</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <div class="card p-2" style="z-index: 2">
        <!-- PIC Selection -->
        <CInputGroup class="mb-1">
          <CInputGroupText style="width: 150px"> PIC </CInputGroupText>
          <treeselect
            class="form-control p-0"
            v-model="form.pic_check"
            :options="users"
          />
        </CInputGroup>

        <!-- Machine Selection -->
        <CInputGroup class="mb-1">
          <CInputGroupText style="width: 150px"> Machine </CInputGroupText>
          <treeselect
            @update:modelValue="onMachineChange"
            class="form-control p-0"
            v-model="form.machine_id"
            :options="GET_MACHINES_TREESELECT"
          />
        </CInputGroup>

        <!-- Tool IN USED -->
        <CInputGroup class="mb-1">
          <CInputGroupText style="width: 150px"> Tool IN USED </CInputGroupText>
          <CFormInput v-model="tool_in_used" readonly />
          <CInputGroupText>{{ qr_used_tool }}</CInputGroupText>
        </CInputGroup>

        <CInputGroup class="mb-1">
          <CInputGroupText style="width: 150px"> Std Counter </CInputGroupText>
          <CFormInput
            type="number"
            v-model="std_counter"
            disabled
            placeholder="input standard counter"
          />
        </CInputGroup>
        <CInputGroup class="mb-1">
          <CInputGroupText style="width: 150px">
            Actual Counter
          </CInputGroupText>
          <CFormInput
            type="number"
            v-model="form.act_counter"
            placeholder="input actual counter"
          />
        </CInputGroup>
        <div v-if="isCounterNotAchieved && form.act_counter != 0" class="my-3">
          <label style="width: 150px"> Notes / Problem </label>
          <div
            class="d-flex flex-wrap justify-content-between align-items-center my-2"
          >
            <template v-for="(problem, i) in problem_opts" :key="problem">
              <button
                :class="`btn btn-sm mt-1 ${
                  problem.selected ? 'btn-primary' : 'btn-outline-primary'
                }`"
                @click="selectedNote(i)"
              >
                {{ problem.label }}
              </button>
              <br />
              <CFormTextarea
                v-if="problem.selected && problem.is_reason"
                rows="3"
                v-model="form.reason"
              >
              </CFormTextarea>
            </template>
          </div>
          <h6 class="text-danger">Counter Not Achieved!</h6>
        </div>
        <div
          v-else-if="isCounterAchieved && form.act_counter != 0"
          class="my-3"
        >
          <h6 class="text-success">Achieved Counter!</h6>
        </div>
        <div v-else class="my-3">
          <h6 class="text-muted">Please fill input!</h6>
        </div>
      </div>
    </CModalBody>
    <CModalFooter>
      <CButton
        color="secondary"
        @click="
          () => {
            $emit('modalShow', false)
          }
        "
        >Close</CButton
      >
      <CButton color="primary" @click="submitCheck">Save</CButton>
    </CModalFooter>
  </CModal>
</template>

<script>
import MOCK_MACHINES_TREESELECT from '@/mock/MACHINES_TREESELECT.mock'
import { ACTION_SYSTEM, GET_SYSTEM_OPTS } from '@/store/TMS/SYSTEM.module'
import MOCK_TOOL_NOTES_TREESELECT from '@/mock/NOTES_TOOL_TREESELECT.mock'
import MOCK_USERS_TREESELECT from '@/mock/USERS_TREESELECT.mock'
import {
  ACTION_GET_TOOL_USED_BY_LOCATION,
  ACTION_GET_TOOLS_BY_LOCATION_FOR_FIRST_CHECK,
} from '@/store/TMS/FirstCheck.module'
import {
  ACTION_MACHINES_OPTS,
  GET_MACHINES_TREESELECT,
} from '@/store/TMS/MACHINES.module'
import { GET_META } from '@/store/TMS/META.module'
import {
  ACTION_ADD_TOOL_HISTORY,
  ACTION_TOOL_DETAILS,
  GET_TOOL_DETAILS,
} from '@/store/TMS/TOOLS.module'
import {
  ACTION_USERS_OPTS,
  GET_USERS_TREESELECT,
} from '@/store/TMS/USERS.module'

import Treeselect from '@zanmato/vue3-treeselect'
import '@zanmato/vue3-treeselect/dist/vue3-treeselect.min.css'
import { mapGetters } from 'vuex'
import {
  ACTION_GET_TOOL_BY_TOOL_TYPE_ID,
  ACTION_GET_TOOL_USED_BY_MACHINE_ID,
  GET_TOOL_BY_TOOL_TYPE_ID,
  GET_TOOL_USED_BY_MACHINE_ID,
} from '@/store/TMS/MergeToolChangeUsed.module'

export default {
  name: 'ToolChangeAction',
  data() {
    return {
      std_counter: 0,
      form: {
        machine_id: null,
        pic_check: null,
        system_problem: null,
        reason: null,
        act_counter: '',
      },
      tool_used_id: null,
      tool_in_used: null,
      qr_used_tool: null,
      qr_new_tool: null,
      machines: MOCK_MACHINES_TREESELECT,
      users: MOCK_USERS_TREESELECT,
      user_ln: null,
      tool_notes: MOCK_TOOL_NOTES_TREESELECT,
      problem_opts: [],
    }
  },
  watch: {
    async modalShow() {
      if (this.modalShow)
        await this.$store.dispatch(ACTION_SYSTEM, {
          system_type: 'SYSTEM_PROBLEM',
        })
      this.problem_opts = this.GET_SYSTEM_OPTS
      await this.$store.dispatch(ACTION_MACHINES_OPTS, {
        location: this.location,
      })
      await this.$store.dispatch(ACTION_TOOL_DETAILS, {
        tool_qr: this.GET_TOOL_DETAILS.tool_qr,
      })
      this.updateUserLn()
    },
    location(newLocation) {
      this.updateUserLn()
    },
    user_ln(newUserLn) {
      // Fetch users options when user_ln changes
      if (newUserLn) {
        this.$store.dispatch(ACTION_USERS_OPTS, newUserLn)
      }
    },
    GET_USERS_TREESELECT(newUsers) {
      if (newUsers.length > 0) {
        this.users = newUsers
      }
    },
    GET_TOOL_DETAILS: {
      handler(newValue) {
        if (newValue) {
          this.std_counter = newValue.std_counter
        }
      },
    },
  },
  computed: {
    ...mapGetters([
      GET_META,
      GET_TOOL_DETAILS,
      GET_MACHINES_TREESELECT,
      GET_USERS_TREESELECT,
      GET_SYSTEM_OPTS,
      GET_TOOL_USED_BY_MACHINE_ID,
      GET_TOOL_BY_TOOL_TYPE_ID,
    ]),
    isCounterAchieved() {
      return this.form.act_counter >= this.std_counter
    },
    isCounterNotAchieved() {
      return this.form.act_counter < this.std_counter
    },
  },
  components: {
    Treeselect,
  },
  methods: {
    async onMachineChange() {
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
        if (!this.form.machine_id) return
        const payload = {
          machine_id: this.form.machine_id,
          distribution_id: distribution_id,
        }
        console.log('payload', payload)

        let response = await this.$store.dispatch(
          ACTION_GET_TOOL_USED_BY_MACHINE_ID,
          payload,
        )

        if (response.status === 200) {
          // console.log('action by machineId', this.GET_TOOL_USED_BY_MACHINE_ID)
          if (this.GET_TOOL_USED_BY_MACHINE_ID.length == 0) {
            this.tool_used_id = null
            this.tool_in_used = 'Tool Tidak Ditemukan'
            this.qr_used_tool = null
            return
          }
          // Ambil data yang cocok berdasarkan tool_type_id dari props
          let filteredTools = this.GET_TOOL_USED_BY_MACHINE_ID.filter(
            (tool) => tool.tool_type_id === this.tool_type_id,
          )

          // Ambil satu data dengan created_dt terbaru
          let latestTool = filteredTools.reduce((latest, tool) => {
            return !latest ||
              new Date(tool.created_dt) > new Date(latest.created_dt)
              ? tool
              : latest
          }, null)

          console.log('Latest Tool:', latestTool)
          const payload = {
            tool_type_id: this.tool_type_id,
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
            this.tool_in_used = tool.tool_no
            this.qr_used_tool = tool.tool_qr
            this.tool_used_id = tool.tool_id
          }
        }
      } catch (error) {
        console.log(error)
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
      console.log('User LN updated to:', this.user_ln)

      // // Dispatch action to fetch user options
      // if (this.user_ln) {
      //   this.$store.dispatch(ACTION_USERS_OPTS, this.user_ln)
      // }
    },
    selectedNote(i) {
      for (let index = 0; index < this.problem_opts.length; index++) {
        if (i == index) {
          this.problem_opts[i].selected = true
          this.form.system_problem = this.problem_opts[i].label
        } else {
          this.problem_opts[index].selected = false
        }
      }
    },
    async submitCheck() {
      try {
        this.$swal.showLoading()
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

        let payloadData = {
          headerData: {
            ...this.form,
            tool_id: this.GET_TOOL_DETAILS.tool_id,
            distribution_id,
            system_activity: 'IN USED',
            act_counter: `${this.GET_TOOL_DETAILS.act_counter}`,
            regrinding_count: this.GET_TOOL_DETAILS.regrinding_count,
          },
        }
        console.log('payloadData', payloadData)

        await this.$store.dispatch(ACTION_ADD_TOOL_HISTORY, payloadData)
        await this.$store.dispatch(ACTION_TOOL_DETAILS, {
          tool_qr: this.GET_TOOL_DETAILS.tool_qr,
        })
        await this.$store.dispatch(
          ACTION_GET_TOOLS_BY_LOCATION_FOR_FIRST_CHECK,
          {
            meta: this.meta,
            location: this.location,
          },
        )
        await this.submitCheckUsed()
        await this.$store.dispatch(ACTION_GET_TOOL_USED_BY_LOCATION, {
          meta: this.meta,
          location: this.location,
        })

        this.$emit('modal-show', false)
        this.$swal.hideLoading()

        this.clearForm()
      } catch (error) {
        console.log(error)
      }
    },
    async submitCheckUsed() {
      try {
        if (!this.tool_used_id) return
        this.$swal.showLoading()
        let distribution_id = null
        // IN MACHINE STATUS
        if (this.location == 'Crank Shaft') {
          distribution_id = 6
        } else if (this.location == 'Cam Shaft') {
          distribution_id = 3
        } else if (this.location == 'Cylinder Head') {
          distribution_id = 4
        } else if (this.location == 'Cylinder Block') {
          distribution_id = 5
        }

        let payloadData = {
          headerData: {
            ...this.form,
            tool_id: this.tool_used_id,
            distribution_id: distribution_id, // Scrab
            system_activity: 'USED',
            regrinding_count: this.GET_TOOL_DETAILS.regrinding_count,
            system_problem: this.form.reason
              ? this.form.reason
              : this.form.system_problem,
          },
        }
        // console.log('payloadData', payloadData)

        await this.$store.dispatch(ACTION_ADD_TOOL_HISTORY, payloadData)
        await this.$store.dispatch(ACTION_TOOL_DETAILS, {
          tool_qr: this.GET_TOOL_DETAILS.tool_qr,
        })
        this.$emit('modal-show', false)
        this.$swal.hideLoading()
        this.clearForm()
      } catch (error) {
        console.error(error)
        alert(error)
      }
    },
    clearForm() {
      this.form = {
        machine_id: null,
        pic_check: null,
        system_problem: null,
        reason: null,
        act_counter: 0,
      }
      this.tool_used_id = null
      this.tool_in_used = null
      this.qr_used_tool = null
    },
  },
  props: {
    modalShow: {
      type: Boolean,
      default: false,
    },
    location: {
      type: String,
      default: 'Cam Shaft',
    },
    tool_type_id: {
      type: Number,
      default: null,
    },
    meta: {
      type: Object,
      default: {
        totalData: 0,
        currentPage: 1,
        itemsPerPage: 25,
        totalPages: 1,
      },
    },
  },
  mounted() {
    // // Fetch users options when component is mounted if user_ln is available
    // if (this.user_ln) {
    //   this.$store.dispatch(ACTION_USERS_OPTS, this.user_ln)
    // }
    console.log('Tool Type ID:', this.tool_type_id)
  },
}
</script>
<style></style>
