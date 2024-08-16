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
        <CInputGroup class="mb-1">
          <CInputGroupText style="width: 150px"> Machine </CInputGroupText>
          <treeselect
            class="form-control p-0"
            v-model="form.machine_id"
            :options="GET_MACHINES_TREESELECT"
          />
        </CInputGroup>
        <CInputGroup class="mb-1">
          <CInputGroupText style="width: 150px"> PIC </CInputGroupText>
          <treeselect
            class="form-control p-0"
            v-model="form.pic_check"
            :options="users"
          />
        </CInputGroup>
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
import MOCK_USERS_TREESELECT from '@/mock/USERS_TREESELECT.mock'
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

export default {
  name: 'ToolChangeAction',
  data() {
    return {
      form: {
        machine_id: null,
        pic_check: null,
      },
      qr_used_tool: null,
      qr_new_tool: null,
      machines: MOCK_MACHINES_TREESELECT,
      users: MOCK_USERS_TREESELECT,
      user_ln: null,
    }
  },
  watch: {
    async modalShow() {
      await this.$store.dispatch(ACTION_MACHINES_OPTS, {
        location: this.location,
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
  },
  computed: {
    ...mapGetters([
      GET_META,
      GET_TOOL_DETAILS,
      GET_MACHINES_TREESELECT,
      GET_USERS_TREESELECT,
    ]),
  },
  components: {
    Treeselect,
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

        await this.$store.dispatch(ACTION_ADD_TOOL_HISTORY, payloadData)
        await this.$store.dispatch(ACTION_TOOL_DETAILS, {
          tool_qr: this.GET_TOOL_DETAILS.tool_qr,
        })

        this.$emit('modal-show', false)
        this.$swal.hideLoading()

        // this.clearForm()
      } catch (error) {
        console.log(error)
      }
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
  },
  mounted() {
    // // Fetch users options when component is mounted if user_ln is available
    // if (this.user_ln) {
    //   this.$store.dispatch(ACTION_USERS_OPTS, this.user_ln)
    // }
  },
}
</script>
<style></style>
