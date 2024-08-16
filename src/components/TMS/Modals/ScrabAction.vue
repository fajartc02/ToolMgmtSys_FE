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
      <CModalTitle>Scrab Tool</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <div class="card p-2 mb-4" style="z-index: 2">
        <CFormTextarea
          class="form-control"
          label="Reason"
          rows="3"
          v-model="form.reason"
        ></CFormTextarea>
        <CInputGroup class="mb-1 mt-2">
          <CInputGroupText style="width: 150px"> PIC </CInputGroupText>
          <treeselect
            class="form-control p-0"
            v-model="form.pic_check"
            :options="users"
          />
        </CInputGroup>
      </div>
    </CModalBody>
    <CModalFooter class="mt-4">
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
  name: 'ScrabAction',
  data() {
    return {
      form: {
        reason: null,
        pic_check: null,
      },
      machines: MOCK_MACHINES_TREESELECT,
      users: MOCK_USERS_TREESELECT,
      is_qr_avail: true,
      user_ln: 'TR',
    }
  },
  computed: {
    ...mapGetters([GET_TOOL_DETAILS, GET_USERS_TREESELECT]),
  },
  methods: {
    async submitCheck() {
      try {
        this.$swal.showLoading()
        let payloadData = {
          headerData: {
            ...this.form,
            tool_id: this.GET_TOOL_DETAILS.tool_id,
            distribution_id: 16, // Scrab
            system_activity: 'SCRAB',
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
        this.clearForm()
      } catch (error) {
        console.error(error)
        alert(error)
      }
    },
    clearForm() {
      this.form = {
        reason: null,
        pic_check: null,
      }
    },
  },
  watch: {
    modalShow: function () {
      if (this.modalShow) {
        this.$store.dispatch(ACTION_USERS_OPTS, this.user_ln)
      }
    },
    GET_USERS_TREESELECT: function () {
      if (this.GET_USERS_TREESELECT.length > 0) {
        this.users = this.GET_USERS_TREESELECT
      }
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
  },
  mounted() {
    // this.$store.dispatch(ACTION_USERS_OPTS, this.user_ln)
  },
}
</script>
<style></style>
