<template>
  <CModal
    scrollable
    :visible="registerModal"
    @close="
      () => {
        registerModal = false
      }
    "
  >
    <CModalHeader>
      <CModalTitle>Register Tool</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <CInputGroup class="mb-1">
        <CInputGroupText style="width: 120px"> Type Tool </CInputGroupText>
        <treeselect
          class="form-control p-0"
          v-model="form.tool_type_id"
          :options="GET_TOOL_TYPES_OPTS"
        />
      </CInputGroup>
      <CInputGroup class="mb-1">
        <CInputGroupText style="width: 120px"> Process Desc. </CInputGroupText>
        <CFormInput
          v-if="selected_tool_type?.tool_type_desc"
          disabled
          type="text"
          v-model="selected_tool_type.tool_type_desc"
        />
        <CFormInput v-else disabled type="text" />
      </CInputGroup>
      <small class="text-muted">*Masukan Text di bawah ke QR Mesin Tool</small>
      <CInputGroup class="mb-1">
        <CInputGroupText style="width: 120px"> Tool QR (auto) </CInputGroupText>
        <CFormInput disabled type="text" v-model="form.tool_qr" />
      </CInputGroup>
      <small class="text-muted"
        >*Klik input di bawah lalu scan QR pada tool</small
      >
      <CInputGroup class="mb-1">
        <CInputGroupText style="width: 120px"> QR Code Tool </CInputGroupText>
        <CFormInput
          type="text"
          placeholder="Arahkan kursor ke input, lalu scan QR Code"
          v-model="form.tool_verify_qr"
          @change="verifyTool"
        />
      </CInputGroup>
      <small v-if="is_match_qr" class="text-success">QR Code Sesuai</small>
      <small
        v-if="!is_match_qr && form.tool_verify_qr != ''"
        class="text-danger"
        >QR Code Tidak Sesuai</small
      >
      <CInputGroup class="mb-1">
        <CInputGroupText style="width: 120px"> Std. Counter </CInputGroupText>
        <CFormInput type="text" v-model="form.std_counter" />
      </CInputGroup>
      <small class="text-muted"
        >*Kamu bisa ubah std counter di atas, apabila tidak sesuai</small
      >
    </CModalBody>
    <CModalFooter>
      <CButton
        color="secondary"
        @click="
          () => {
            registerModal = false
          }
        "
        >Close</CButton
      >
      <CButton v-if="IS_TOOL_VERIFIED" color="primary" @click="addTool"
        >Save</CButton
      >
      <CButton v-else color="secondary" disabled>Save</CButton>
    </CModalFooter>
  </CModal>
  <div class="container-fluid">
    <div class="card p-2 mb-2">
      <div class="d-flex justify-content-between align-items-center">
        <h4 class="text-center m-0">Tool Register</h4>
        <CButton
          type="button"
          color="secondary"
          variant="outline"
          @click="
            () => {
              registerModal = true
            }
          "
          >Add Tool
        </CButton>
      </div>
    </div>
    <div class="card">
      <div class="card-body">
        <table
          style="text-align: center"
          class="table table-bordered table-striped"
        >
          <thead>
            <tr>
              <th>No</th>
              <th>Tool Number</th>
              <th>QR Code</th>
              <th>Process</th>
              <th>Std Counter</th>
              <th>Register Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(tool, index) in GET_TOOL" :key="index">
              <td>{{ tool.no }}</td>
              <td>{{ tool.tool_no }}</td>
              <td>{{ tool.tool_qr }}</td>
              <td>{{ tool.tool_type_desc }}</td>
              <td>{{ tool.std_counter }}</td>
              <td>{{ tool.created_dt }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="card-footer">
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
</template>
<script>
import MOCK_TOOLTYPES_TREESELECT from '@/mock/TOOL_TYPES_TREESELECT.mock'
import {
  ACTION_TOOL_TYPES,
  GET_TOOL_TYPES_OPTS,
  GET_TOOL_TYPES,
} from '@/store/TMS/TOOL_TYPES.module'
import {
  ACTION_EMPTY_QR_TOOL,
  ACTION_GENERATE_TOOL,
  ACTION_TOOL,
  ACTION_TOOL_ADD,
  GET_TOOL,
  GET_TOOL_QR,
} from '@/store/TMS/TOOLS.module'

// import the component
import Treeselect from '@zanmato/vue3-treeselect'
import '@zanmato/vue3-treeselect/dist/vue3-treeselect.min.css'
import PaginationMaster from '@/components/TMS/Pagination/PaginationMaster.vue'

import { mapGetters } from 'vuex'
import { GET_META } from '@/store/TMS/META.module'

export default {
  name: 'ToolRegister',
  components: {
    Treeselect,
    PaginationMaster,
  },
  computed: {
    ...mapGetters([
      GET_TOOL_TYPES_OPTS,
      GET_TOOL_TYPES,
      GET_TOOL_QR,
      GET_TOOL,
      GET_META,
    ]),
    is_match_qr() {
      return this.form.tool_verify_qr == this.form.tool_qr
    },
  },
  data() {
    return {
      toolTypes: GET_TOOL_TYPES_OPTS ?? MOCK_TOOLTYPES_TREESELECT,
      registerModal: false,
      form: {
        tool_type_id: null,
        tool_qr: null,
        std_counter: null,
        tool_type_nm: null,
        tool_verify_qr: '',
      },
      meta: {
        totalData: 0,
        currentPage: 1,
        itemsPerPage: 10,
        totalPages: 1,
      },
      selected_tool_type: {
        tool_type_desc: null,
      },
      IS_TOOL_VERIFIED: false,
    }
  },
  watch: {
    'form.tool_type_id': async function () {
      this.selected_tool_type = this.GET_TOOL_TYPES.find(
        (toolType) => toolType.tool_type_id == this.form.tool_type_id,
      )
      if (this.selected_tool_type) {
        this.form.std_counter = this.selected_tool_type.std_counter
        this.form.tool_type_nm = this.selected_tool_type.tool_type_nm
        if (this.form.tool_type_id)
          await this.$store.dispatch(ACTION_GENERATE_TOOL)
        this.form.tool_qr = this.GET_TOOL_QR
      }
    },
    GET_META: function () {
      this.meta = this.GET_META
    },
    'meta.itemsPerPage': function () {
      this.$store.dispatch(ACTION_TOOL, { meta: this.meta })
    },
  },
  methods: {
    async addTool() {
      try {
        this.form.tool_qr = this.GET_TOOL_QR
        this.$swal.showLoading()
        await this.$store.dispatch(ACTION_TOOL_ADD, this.form)
        this.$swal.close()
        this.registerModal = false
        this.clearForm()
        this.$swal.fire('Success', 'Data kamu sudah bertambah', 'success')
        this.$store.dispatch(ACTION_TOOL, { meta: this.meta })
      } catch (error) {
        this.$swal.close()
        this.$swal.fire('Error', 'Gagal menambah data', 'error')
      }
    },
    verifyTool() {
      if (this.GET_TOOL_QR == this.form.tool_verify_qr)
        this.IS_TOOL_VERIFIED = true
      else this.IS_TOOL_VERIFIED = false
    },
    clearForm() {
      this.$store.dispatch(ACTION_EMPTY_QR_TOOL)
      this.form = {
        tool_type_id: null,
        tool_qr: null,
        std_counter: null,
        tool_type_nm: null,
        tool_verify_qr: '',
      }
    },
    handlePageChange(page) {
      this.meta.currentPage = page
      this.$store.dispatch(ACTION_TOOL, { meta: this.meta })
    },
  },
  mounted() {
    this.$store.dispatch(ACTION_TOOL_TYPES)
    this.$store.dispatch(ACTION_TOOL, { meta: this.meta })
  },
}
</script>
<style></style>
