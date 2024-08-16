<template>
  <div class="modal" tabindex="-1" id="modalAddDistribution">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Add Distribution</h5>
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
              <label for="distributionName" class="form-label"
                >Distribution Name</label
              >
              <input
                type="text"
                class="form-control"
                id="distributionName"
                v-model="distribution_nm"
              />
            </div>
            <div class="mb-3">
              <label for="distributionDescription" class="form-label"
                >Distribution Description</label
              >
              <input
                type="text"
                class="form-control"
                id="distributionDescription"
                v-model="distribution_desc"
              />
            </div>
            <div class="mb-3">
              <label for="createdBy" class="form-label">Created By</label>
              <input
                type="text"
                class="form-control"
                id="createdBy"
                v-model="created_by"
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
            @click="saveDistribution"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal" tabindex="-1" id="modalEditDistribution">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Edit Distribution</h5>
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
              <label for="editDistributionName" class="form-label"
                >Distribution Name</label
              >
              <input
                type="text"
                class="form-control"
                id="editDistributionName"
                v-model="editedDistribution.distribution_nm"
              />
            </div>
            <div class="mb-3">
              <label for="editDistributionDescription" class="form-label"
                >Distribution Description</label
              >
              <input
                type="text"
                class="form-control"
                id="editDistributionDescription"
                v-model="editedDistribution.distribution_desc"
              />
            </div>
            <div class="mb-3">
              <label for="editCreatedBy" class="form-label">Created By</label>
              <input
                type="text"
                class="form-control"
                id="editCreatedBy"
                v-model="editedDistribution.created_by"
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
            @click="saveEditDistribution"
            data-bs-dismiss="modal"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal" tabindex="-1" id="modalDeleteDistribution">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Delete Distribution</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete this distribution?</p>
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
            @click="deleteDataDistribution"
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
        <h4 class="text-center m-0">Master Distribution</h4>
        <button
          type="button"
          class="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#modalAddDistribution"
        >
          Add Distribution
        </button>
      </div>
    </div>

    <div class="card mt-2">
      <div class="card-body">
        <table
          class="table table-bordered table-striped"
          style="text-align: center"
        >
          <thead>
            <tr>
              <th>No</th>
              <th>Distribution Name</th>
              <th>Description</th>
              <th>Created By</th>
              <th>Register Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(DISTRIBUTIONS_DATA, index) in GET_DISTRIBUTIONS"
              :key="DISTRIBUTIONS_DATA.distirbution_id"
            >
              <td>{{ index + 1 }}</td>
              <td>{{ DISTRIBUTIONS_DATA.distribution_nm }}</td>
              <td>{{ DISTRIBUTIONS_DATA.distribution_desc }}</td>
              <td>{{ DISTRIBUTIONS_DATA.created_by }}</td>
              <td>{{ DISTRIBUTIONS_DATA.created_dt }}</td>
              <td>
                <button
                  class="btn btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#modalEditDistribution"
                  @click="editDataDistribution(DISTRIBUTIONS_DATA)"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  class="btn btn-danger ms-2"
                  data-bs-toggle="modal"
                  data-bs-target="#modalDeleteDistribution"
                  @click="
                    showDeleteConfirmation(DISTRIBUTIONS_DATA.distribution_id)
                  "
                >
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import {
  GET_DISTRIBUTIONS,
  ACTION_DISTRIBUTIONS,
  ACTION_ADD_DISTRIBUTION,
  ACTION_EDIT_DISTRIBUTION,
  ACTION_DELETE_DISTRIBUTION,
} from '@/store/TMS/DISTRIBUTIONS.module'
import { mapGetters } from 'vuex'
import moment from 'moment'

export default {
  name: 'MasterDistribution',
  data() {
    return {
      distribution_nm: '',
      distribution_desc: '',
      created_by: '',
      editedDistribution: {
        distribution_id: null,
        distribution_nm: '',
        distribution_desc: '',
        created_dt: '',
        created_by: '',
      },
      deletedDistribution: {
        distribution_id: null,
      },
    }
  },
  computed: {
    ...mapGetters([GET_DISTRIBUTIONS]),
  },
  mounted() {
    this.$store.dispatch(ACTION_DISTRIBUTIONS)
  },
  methods: {
    async saveDistribution() {
      try {
        const payload = {
          distribution_nm: this.distribution_nm,
          distribution_desc: this.distribution_desc,
          created_by: this.created_by,
        }
        let response = await this.$store.dispatch(
          ACTION_ADD_DISTRIBUTION,
          payload,
        )
        if (response === 201) {
          this.$store.dispatch(ACTION_DISTRIBUTIONS)
          this.$swal('Success', 'Data has been saved', 'success')
          this.resetForm()
        } else {
          this.$swal('Error', 'Gagal menyimpan data', 'error')
        }
      } catch (error) {
        console.log(error)
        this.$swal('Error', 'Gagal menyimpan data', 'error')
      }
    },
    editDataDistribution(distribution) {
      this.editedDistribution = distribution
      this.editDataDistribution.created_dt = this.goToday()
      console.log(this.editedDistribution)
    },
    goToday() {
      return moment().format('YYYY-MM-DD')
    },
    async saveEditDistribution() {
      try {
        const id = this.editedDistribution.distribution_id
        console.log('id', id)
        const payload = {
          distribution_nm: this.editedDistribution.distribution_nm,
          distribution_desc: this.editedDistribution.distribution_desc,
          created_by: this.editedDistribution.created_by,
          created_dt: this.editedDistribution.created_dt,
        }
        console.log('payload', payload)
        let response = await this.$store.dispatch(ACTION_EDIT_DISTRIBUTION, {
          id,
          payload,
        })
        if (response === 201) {
          this.$store.dispatch(ACTION_DISTRIBUTIONS)
          this.$swal('Success', 'Data has been saved', 'success')
          this.resetForm()
        }
      } catch (error) {
        console.log(error)
        this.$swal('Error', 'Gagal menyimpan data', 'error')
      }
    },
    showDeleteConfirmation(DISTRIBUTIONS_DATA) {
      this.deletedDistribution = DISTRIBUTIONS_DATA
      // console.log('id', this.deletedDistribution)
    },
    async deleteDataDistribution() {
      try {
        const id = this.deletedDistribution
        console.log('distribution_id', id)
        let response = await this.$store.dispatch(
          ACTION_DELETE_DISTRIBUTION,
          id,
        )
        if (response === 201) {
          this.$store.dispatch(ACTION_DISTRIBUTIONS)
          this.$swal('Success', 'Data has been deleted', 'success')
          this.resetForm()
        } else {
          this.$swal('Error', 'Data gagal di hapus', 'error')
        }
      } catch (error) {
        console.log(error)
        this.$swal('Error', 'Data gagal di hapus', 'error')
      }
    },
    resetForm() {
      this.distribution_nm = ''
      this.distribution_desc = ''
      this.created_by = ''
      this.editedDistribution = {
        distribution_id: null,
        distribution_nm: '',
        distribution_desc: '',
        created_dt: '',
        created_by: '',
      }
      this.deletedDistribution = {
        distirbution_id: null,
      }
    },
  },
}
</script>
