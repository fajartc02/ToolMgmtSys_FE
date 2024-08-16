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
      <CModalTitle>Tool Used</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <div class="card mt-2 p-2" style="z-index: 1">
        <CInputGroup class="mb-1">
          <CInputGroupText style="width: 150px"> PIC </CInputGroupText>
          <treeselect
            class="form-control p-0"
            v-model="form.pic_check"
            :options="users"
          />
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
      <CButton color="primary" @click="submitCheck">Save & Transfer</CButton>
    </CModalFooter>
  </CModal>
</template>
<script>
import MOCK_MACHINES_TREESELECT from '@/mock/MACHINES_TREESELECT.mock'
import MOCK_TOOL_NOTES_TREESELECT from '@/mock/NOTES_TOOL_TREESELECT.mock'
import MOCK_USERS_TREESELECT from '@/mock/USERS_TREESELECT.mock'
import { ACTION_SYSTEM, GET_SYSTEM_OPTS } from '@/store/TMS/SYSTEM.module'
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

export default {
  name: 'ToolUsedAction',
  data() {
    return {
      std_counter: 100,
      form: {
        act_counter: '',
        system_problem: null,
        reason: null,
        pic_check: null,
      },
      qr_used_tool: null,
      machines: MOCK_MACHINES_TREESELECT,
      users: MOCK_USERS_TREESELECT,
      tool_notes: MOCK_TOOL_NOTES_TREESELECT,
      problem_opts: [],
      user_ln: null,
    }
  },
  methods: {
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
            tool_id: this.GET_TOOL_DETAILS.tool_id,
            distribution_id: distribution_id, // Scrab
            system_activity: 'USED',
            regrinding_count: this.GET_TOOL_DETAILS.regrinding_count,
            system_problem: this.form.reason
              ? this.form.reason
              : this.form.system_problem,
          },
        }
        // console.log(payloadData);
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
        act_counter: 0,
        system_problem: null,
        reason: null,
        pic_check: null,
        system_problem: null,
      }
    },
  },
  watch: {
    async modalShow() {
      if (this.modalShow)
        await this.$store.dispatch(ACTION_SYSTEM, {
          system_type: 'SYSTEM_PROBLEM',
        })
      this.problem_opts = this.GET_SYSTEM_OPTS
      this.updateUserLn()
      this.$store.dispatch(ACTION_USERS_OPTS, this.user_ln)
      await this.$store.dispatch(ACTION_TOOL_DETAILS, {
        tool_qr: this.GET_TOOL_DETAILS.tool_qr,
      })
    },
    location(newLocation) {
      this.updateUserLn() // Call this method whenever location changes
    },
    GET_TOOL_DETAILS: {
      handler(newValue) {
        if (newValue) {
          this.std_counter = newValue.std_counter
        }
      },
    },
    GET_USERS_TREESELECT: function () {
      if (this.GET_USERS_TREESELECT.length > 0) {
        this.users = this.GET_USERS_TREESELECT
      }
    },
  },
  computed: {
    ...mapGetters([GET_TOOL_DETAILS, GET_SYSTEM_OPTS, GET_USERS_TREESELECT]),
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
  props: {
    modalShow: {
      type: Boolean,
      default: false,
    },
    location: {
      type: String,
      default: 'Cam Shaft',
    },
  },
  mounted() {
    // this.$store.dispatch(ACTION_USERS_OPTS, { meta: this.GET_META })
  },
}
</script>
<style></style>
