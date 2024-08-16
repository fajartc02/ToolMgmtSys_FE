<template>
  <div class="modal" tabindex="-1" id="modalAddMachine">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Add Machine</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form>
            <div>
              <label for="machineName" class="form-label">Line Name</label>
              <select v-model="selectedLine" class="form-control">
                <option disable selected>Pilih Line</option>
                <option
                  v-for="line in GET_LINES"
                  :key="line.line_id"
                  :value="line.line_id"
                >
                  {{ line.line_nm }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label for="machineName" class="form-label">Machine Name</label>
              <input
                type="text"
                class="form-control"
                id="machineName"
                v-model="machineName"
              />
            </div>
            <div class="mb-3">
              <label for="maker" class="form-label">Maker</label>
              <input
                type="text"
                class="form-control"
                id="maker"
                v-model="maker"
              />
            </div>
            <div class="mb-3">
              <label for="machineDescription" class="form-label">OP NO</label>
              <input
                type="text"
                class="form-control"
                id="machineDescription"
                v-model="opNo"
              />
            </div>
            <div class="mb-3">
              <label for="machineDescription" class="form-label">PIC</label>
              <input
                type="text"
                class="form-control"
                id="machineDescription"
                v-model="pic"
              />
            </div>
          </form>
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
            data-bs-dismiss="modal"
            @click="addMachineTMS()"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal" tabindex="-1" id="modalEditMachineTMS">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Edit Machine</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form>
            <div class="mb-3">
              <label for="registerDate" class="form-label">Register Date</label>
              <input
                type="date"
                class="form-control"
                id="registerDate"
                v-model="editedMachine.created_dt"
              />
            </div>
            <div class="mb-3">
              <label for="machineName" class="form-label">Machine Name</label>
              <input
                type="text"
                class="form-control"
                id="machineName"
                v-model="editedMachine.machine_nm"
              />
            </div>
            <div class="mb-3">
              <label for="cell" class="form-label">Maker</label>
              <input
                type="text"
                class="form-control"
                id="cell"
                v-model="editedMachine.maker"
              />
            </div>
            <div class="mb-3">
              <label for="opNo" class="form-label">OP NO</label>
              <input
                type="text"
                class="form-control"
                id="opNo"
                v-model="editedMachine.op_no"
              />
            </div>
            <div class="mb-3">
              <label for="pic" class="form-label">PIC</label>
              <input
                type="text"
                class="form-control"
                id="pic"
                v-model="editedMachine.created_by"
              />
            </div>
          </form>
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
            @click="saveEditMachine()"
            data-bs-dismiss="modal"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal" tabindex="-1" id="modalDeleteMachineTMS">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Delete Machine</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete this machine?</p>
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
            @click="ActiondeleteMachineTMS()"
            data-bs-dismiss="modal"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="container-fluid">
    <div class="card p-2 mb-2">
      <div class="d-flex justify-content-between align-items-center">
        <h4 class="text-center m-0">Master Machine</h4>
        <CButton
          type="button"
          color="secondary"
          variant="outline"
          data-bs-toggle="modal"
          data-bs-target="#modalAddMachine"
          >Add Machine
        </CButton>
      </div>
    </div>

    <div class="card mt-2">
      <div class="card-body">
        <table
          style="text-align: center"
          class="table table-bordered table-striped"
        >
          <thead>
            <tr>
              <th>No</th>
              <th>Machine Name</th>
              <th>Maker</th>
              <th>OP NO</th>
              <th>Register Date</th>
              <th>Register By</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(machines, machine_id) in GET_MACHINES"
              :key="machine_id"
            >
              <td>{{ machines.no }}</td>
              <td>{{ machines.machine_nm }}</td>
              <td>{{ machines.maker }}</td>
              <td>{{ machines.op_no }}</td>
              <td>{{ machines.created_dt }}</td>
              <td>{{ machines.created_by }}</td>
              <td>
                <button
                  data-bs-toggle="modal"
                  data-bs-target="#modalEditMachineTMS"
                  class="btn btn-primary"
                  @click="editMachineTMS(machines)"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  data-bs-toggle="modal"
                  data-bs-target="#modalDeleteMachineTMS"
                  class="btn btn-danger ms-2"
                  @click="deleteMachineTMS(machines.machine_id)"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
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
  </div>
</template>
<script>
import {
  ACTION_ADD_MACHINES,
  ACTION_EDIT_MACHINES,
  ACTION_MACHINES,
  ACTION_DELETE_MACHINES,
  GET_MACHINES,
} from '@/store/TMS/MACHINES.module'
import { GET_META } from '@/store/TMS/META.module'
import { mapGetters } from 'vuex'
import PaginationMaster from '@/components/TMS/Pagination/PaginationMaster.vue'
import { ACTION_GET_LINES, GET_LINES } from '@/store/TMS/LINES.module'
import moment from 'moment'
export default {
  name: 'MasterMachine',
  components: {
    PaginationMaster,
  },
  data() {
    return {
      selectedLine: '',
      machineName: '',
      maker: '',
      opNo: '',
      pic: '',
      editedMachine: {
        machine_id: null,
        machine_nm: '',
        maker: '',
        op_no: '',
        created_by: '',
        created_dt: '',
      },
      deletedMachine: {
        machine_id: null,
      },
      meta: {
        totalData: 0,
        currentPage: 1,
        itemsPerPage: 10,
        totalPages: 1,
      },
    }
  },
  mounted() {
    this.$store.dispatch(ACTION_MACHINES, { meta: this.meta })
    this.$store.dispatch(ACTION_GET_LINES, { meta: this.meta })
  },
  computed: {
    ...mapGetters([GET_MACHINES, GET_META, GET_LINES]),
  },

  watch: {
    GET_META: function () {
      this.meta = this.GET_META
    },
    'meta.itemsPerPage': function () {
      this.$store.dispatch(ACTION_MACHINES, { meta: this.meta })
    },
  },

  methods: {
    handlePageChange(page) {
      this.meta.currentPage = page
      this.$store.dispatch(ACTION_MACHINES, { meta: this.meta })
    },
    async addMachineTMS() {
      try {
        const payload = {
          machine_nm: this.machineName,
          line_id: this.selectedLine,
          maker: this.maker,
          op_no: this.opNo,
          created_by: this.pic,
        }
        console.log(payload)
        let response = await this.$store.dispatch(ACTION_ADD_MACHINES, payload)
        if (response === 201) {
          this.$store.dispatch(ACTION_MACHINES, { meta: this.meta })
          this.$swal('Success', 'Data berhasil ditambahkan', 'success')
          this.resetModal()
        } else {
          this.$swal('Error', 'Data gagal ditambahkan', 'error')
        }
      } catch (error) {
        console.log(error)
        this.$swal('Error', 'Data gagal ditambahkan', 'error')
      }
    },

    editMachineTMS(machines) {
      this.editedMachine = machines
      this.editedMachine.created_dt = this.goToday()
    },
    goToday() {
      return moment().format('YYYY-MM-DD')
    },

    async saveEditMachine() {
      try {
        const id = this.editedMachine.machine_id
        const payload = {
          machine_nm: this.editedMachine.machine_nm,
          maker: this.editedMachine.maker,
          op_no: this.editedMachine.op_no,
          created_by: this.editedMachine.created_by,
        }
        let response = await this.$store.dispatch(ACTION_EDIT_MACHINES, {
          id,
          payload,
        })
        if (response === 201) {
          this.$store.dispatch(ACTION_MACHINES, { meta: this.meta })
          this.$swal('Success', 'Data has been updated', 'success')
          this.resetModal()
        }
      } catch (error) {
        console.log(error)
      }
    },
    deleteMachineTMS(machines) {
      this.deletedMachine = machines
      console.log('id', this.deletedMachine)
    },

    async ActiondeleteMachineTMS() {
      try {
        const id = this.deletedMachine
        console.log('id', id)

        let response = await this.$store.dispatch(ACTION_DELETE_MACHINES, id)
        if (response === 201) {
          this.$store.dispatch(ACTION_MACHINES, { meta: this.meta })
          this.$swal('Success', 'Data has been deleted', 'success')
          this.resetModal()
        } else {
          this.$swal('Error', 'Data gagal di hapus', 'error')
        }
      } catch (error) {
        console.log(error)
        this.$swal('Error', 'Data gagal di hapus', 'error')
      }
    },
    resetModal() {
      this.machineName = ''
      this.maker = ''
      this.machineDescription = ''
      this.pic = ''
      this.selectedLine = ''
      this.editedMachine = {
        machine_id: null,
        machine_nm: '',
        maker: '',
        op_no: '',
        created_by: '',
      }
      this.deletedMachine = {
        machine_id: null,
      }
    },
  },
}
</script>
