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
      <CModalTitle>Transfer Tool</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <div class="card p-2 mb-4" style="z-index: 2">
        <CInputGroup class="mb-1 mt-2">
          <CInputGroupText style="width: 150px">
            Transfer Tool
          </CInputGroupText>
          <treeselect
            class="form-control p-0"
            v-model="form.distribution_id"
            :options="GET_DISTRIBUTIONS_OPTS"
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
      <CButton color="primary" @click="transfer">Save</CButton>
    </CModalFooter>
  </CModal>
</template>
<script>
import MOCK_MACHINES_TREESELECT from '@/mock/MACHINES_TREESELECT.mock'
import MOCK_USERS_TREESELECT from '@/mock/USERS_TREESELECT.mock'

import Treeselect from '@zanmato/vue3-treeselect'
import '@zanmato/vue3-treeselect/dist/vue3-treeselect.min.css'
import { mapGetters } from 'vuex'
import {
  ACTION_DISTRIBUTIONS,
  GET_DISTRIBUTIONS_OPTS,
} from '@/store/TMS/DISTRIBUTIONS.module'
import {
  ACTION_TOOL_DETAILS,
  ACTION_UPDATE_TOOL_POS,
  GET_TOOL_DETAILS,
} from '@/store/TMS/TOOLS.module'

export default {
  name: 'TransferAction',
  data() {
    return {
      form: {
        distribution_id: null,
        tool_qr: null,
      },
      machines: MOCK_MACHINES_TREESELECT,
      users: MOCK_USERS_TREESELECT,
      is_qr_avail: true,
    }
  },
  computed: {
    ...mapGetters([GET_DISTRIBUTIONS_OPTS, GET_TOOL_DETAILS]),
  },
  methods: {
    async transfer() {
      try {
        this.$swal.showLoading()
        this.form.tool_qr = this.GET_TOOL_DETAILS.tool_qr
        await this.$store.dispatch(ACTION_UPDATE_TOOL_POS, this.form)
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
      this.form.distribution_id = null
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
    this.$store.dispatch(ACTION_DISTRIBUTIONS, {
      meta: this.GET_META,
      system_std_used: 'CR',
    })
  },
}
</script>
<style></style>
