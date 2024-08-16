<template>
  <div class="modal" tabindex="-1" id="modalUSers">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Add User</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="noreg" class="form-label">Noreg</label>
            <input
              type="text"
              class="form-control"
              id="noreg"
              v-model="noreg"
            />
          </div>
          <div class="mb-3">
            <label for="name" class="form-label">Fullname</label>
            <input
              type="text"
              class="form-control"
              id="name"
              v-model="fullname"
            />
          </div>
          <div class="mb-3">
            <label for="useIn" class="form-label">User Line</label>
            <select type="text" class="form-select" id="useIn" v-model="userln">
              <option value="TR">TR (Tool)</option>
              <option value="CR">CR (Clean Room)</option>
              <option value="CB">CB (Cylinder Block)</option>
              <option value="CAM">CAM (Cam Shaft)</option>
              <option value="CH">CH (Cylinder Head)</option>
              <option value="CRS">CRS (Crank Shaft)</option>
            </select>
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
            @click="addUsers"
            data-bs-dismiss="modal"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal" tabindex="-1" id="modalEditUsers">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Edit User</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="noreg" class="form-label">Noreg</label>
            <input
              type="text"
              class="form-control"
              id="noreg"
              v-model="editedUser.noreg"
            />
          </div>
          <div class="mb-3">
            <label for="name" class="form-label">Fullname</label>
            <input
              type="text"
              class="form-control"
              id="name"
              v-model="editedUser.fullname"
            />
          </div>
          <div class="mb-3">
            <label for="useIn" class="form-label">User Line</label>
            <select
              type="text"
              class="form-select"
              id="useIn"
              v-model="editedUser.user_ln"
            >
              <option value="TR">TR (Tool)</option>
              <option value="CR">CR (Clean Room)</option>
              <option value="CB">CB (Cylinder Block)</option>
              <option value="CAM">CAM (Cam Shaft)</option>
              <option value="CH">CH (Cylinder Head)</option>
              <option value="CRS">CRS (Crank Shaft)</option>
            </select>
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
            @click="saveEditUSer"
            data-bs-dismiss="modal"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal" tabindex="-1" id="modalDeleteUsers">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Delete User</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete this user?</p>
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
            @click="actionDeleteUser"
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
        <h4 class="text-center m-0">Master Users</h4>
        <CButton
          type="button"
          color="secondary"
          variant="outline"
          data-bs-toggle="modal"
          data-bs-target="#modalUSers"
          >Add User
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
              <th>Noreg</th>
              <th>Nama</th>
              <th>Use In</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(users, index) in GET_USERS" :key="index">
              <td>{{ users.no }}</td>
              <td>{{ users.noreg }}</td>
              <td>{{ users.fullname }}</td>
              <td>{{ users.user_ln }}</td>
              <td>
                <button
                  data-bs-toggle="modal"
                  data-bs-target="#modalEditUsers"
                  class="btn btn-primary"
                  @click="editUsers(users)"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  data-bs-toggle="modal"
                  data-bs-target="#modalDeleteUsers"
                  @click="prepareDelete(users.user_id)"
                  class="btn btn-danger ms-2"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </td>
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
              :totalPages="meta.totalPages"
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
import {
  GET_USERS,
  ACTION_ADD_USERS,
  ACTION_USER_META,
  ACTION_EDIT_USERS,
  ACTION_DELETE_USERS,
} from '@/store/TMS/USERS.module'
import { mapGetters } from 'vuex'
import { GET_META } from '@/store/TMS/META.module'
import PaginationMaster from '@/components/TMS/Pagination/PaginationMaster.vue'
import moment from 'moment'

export default {
  name: 'MasterUsers',
  components: {
    PaginationMaster,
  },
  data() {
    return {
      meta: {
        currentPage: 1,
        totalData: 0,
        itemsPerPage: 10,
      },
      fullname: '',
      userln: '',
      noreg: '',
      editedUser: {
        user_id: null,
        noreg: '',
        fullname: '',
        user_ln: '',
        created_dt: '',
      },
      deleteUser: {
        user_id: null,
      },
    }
  },
  computed: {
    ...mapGetters([GET_META, GET_USERS]),
  },
  mounted() {
    this.$store.dispatch(ACTION_USER_META, { meta: this.meta })
  },
  watch: {
    GET_META: function () {
      this.meta = this.GET_META
    },
    'meta.itemsPerPage': function () {
      this.$store.dispatch(ACTION_USER_META, { meta: this.meta })
    },
  },
  methods: {
    handlePageChange(page) {
      this.meta.currentPage = page
      this.$store.dispatch(ACTION_USER_META, { meta: this.meta })
    },
    async addUsers() {
      try {
        const payload = {
          noreg: this.noreg,
          fullname: this.fullname,
          user_ln: this.userln,
        }
        console.log(payload)

        let response = await this.$store.dispatch(ACTION_ADD_USERS, payload)
        if (response === 201) {
          this.$store.dispatch(ACTION_USER_META, { meta: this.meta })
          this.resetModal()
          this.$swal('Success', 'Data has been saved', 'success')
        } else {
          this.$swal('Error', 'Data gagal di simpan', 'error')
        }
      } catch (error) {
        console.log(error)
        this.$swal('Error', 'Data gagal di simpan', 'error')
      }
    },
    editUsers(users) {
      this.editedUser = users
    },
    async saveEditUSer() {
      try {
        const id = this.editedUser.user_id
        // console.log('id', id)
        const payload = {
          noreg: this.editedUser.noreg,
          fullname: this.editedUser.fullname,
          user_ln: this.editedUser.user_ln,
          created_dt: moment().format('YYYY-MM-DD HH:mm:ss'),
        }
        // console.log('payload', payload)
        let response = await this.$store.dispatch(ACTION_EDIT_USERS, {
          id: id,
          payload: payload,
        })
        if (response === 201) {
          this.$store.dispatch(ACTION_USER_META, { meta: this.meta })
          this.resetModal()
          this.$swal('Success', 'Data has been saved', 'success')
        } else {
          this.$swal('Error', 'Data gagal di simpan', 'error')
        }
      } catch (error) {
        console.log(error)
        this.$swal('Error', 'Data gagal di simpan', 'error')
      }
    },
    prepareDelete(users) {
      this.deleteUser = users
      // console.log('delete', this.deleteUser)
    },
    async actionDeleteUser() {
      try {
        const id = this.deleteUser
        // console.log('id', id)
        let response = await this.$store.dispatch(ACTION_DELETE_USERS, id)
        if (response === 201) {
          this.$store.dispatch(ACTION_USER_META, { meta: this.meta })
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
      this.fullname = ''
      this.userln = ''
      this.noreg = ''
      this.editedUser = {
        user_id: null,
        noreg: '',
        fullname: '',
        user_ln: '',
        created_dt: '',
      }
      this.deleteUser = {
        user_id: null,
      }
    },
  },
}
</script>
