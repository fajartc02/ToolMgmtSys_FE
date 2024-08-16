<template>
  <div class="modal" tabindex="-1" id="modalAddLineTMS">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Add Line</h5>
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
              <label for="lineName" class="form-label">Line Name</label>
              <input
                type="text"
                class="form-control"
                id="lineName"
                v-model="lineName"
              />
            </div>
            <div class="mb-3">
              <label for="lineDescription" class="form-label"
                >Line Description</label
              >
              <input
                type="text"
                class="form-control"
                id="lineDescription"
                v-model="lineDesc"
              />
            </div>
            <div class="mb-3">
              <label for="createdBy" class="form-label">Created By</label>
              <input
                type="text"
                class="form-control"
                id="createdBy"
                v-model="createdBy"
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
            data-bs-dismiss="modal"
            type="button"
            class="btn btn-primary"
            @click="addLinesTMS()"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal" tabindex="-1" id="modalEditLinesTMS">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Edit Line</h5>
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
              <label for="lineName" class="form-label">Line Name</label>
              <input
                type="text"
                class="form-control"
                id="lineName"
                v-model="editedLine.line_nm"
              />
            </div>
            <div class="mb-3">
              <label for="lineDescription" class="form-label"
                >Line Description</label
              >
              <input
                type="text"
                class="form-control"
                id="lineDescription"
                v-model="editedLine.line_desc"
              />
            </div>
            <div class="mb-3">
              <label for="createdBy" class="form-label">Created By</label>
              <input
                type="text"
                class="form-control"
                id="createdBy"
                v-model="editedLine.created_by"
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
            @click="saveEditLines()"
            data-bs-dismiss="modal"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal" tabindex="-1" id="modalDeleteLinesTMS">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Delete Line</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete this line?</p>
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
            @click="deleteLine()"
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
        <h4 class="text-center m-0">Master Line</h4>
        <CButton
          type="button"
          color="secondary"
          variant="outline"
          data-bs-toggle="modal"
          data-bs-target="#modalAddLineTMS"
          >Add Line
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
              <th>Line</th>
              <th>Line Description</th>
              <th>Created By</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(lines, line_id) in GET_LINES" :key="line_id">
              <td>{{ lines.no }}</td>
              <td>{{ lines.line_nm }}</td>
              <td>{{ lines.line_desc }}</td>
              <td>{{ lines.created_by }}</td>
              <td>
                <button
                  data-bs-toggle="modal"
                  data-bs-target="#modalEditLinesTMS"
                  class="btn btn-primary"
                  @click="editLinesTMS(lines)"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  data-bs-toggle="modal"
                  data-bs-target="#modalDeleteLinesTMS"
                  class="btn btn-danger ms-2"
                  @click="showDeleteLinesTMS(lines.line_id)"
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
import { mapGetters } from 'vuex'
import {
  ACTION_ADD_LINES,
  ACTION_GET_LINES,
  GET_LINES,
  ACTION_DELETE_LINES,
  ACTION_EDIT_LINES,
} from '@/store/TMS/LINES.module'

export default {
  name: 'MasterLine',

  data() {
    return {
      lineName: '',
      lineDesc: '',
      createdBy: '',
      editedLine: {
        line_id: null,
        line_nm: '',
        line_desc: '',
        created_by: '',
      },
      deletedLine: {
        line_id: null,
      },
      meta: {
        currentPage: 1,
        totalData: 0,
        itemsPerPage: 10,
      },
    }
  },
  computed: {
    ...mapGetters([GET_LINES]),
  },
  mounted() {
    this.$store.dispatch(ACTION_GET_LINES, { meta: this.meta })
  },
  methods: {
    async addLinesTMS() {
      try {
        const data = {
          line_nm: this.lineName,
          line_desc: this.lineDesc,
          created_by: this.createdBy,
        }
        let statusResponse = await this.$store.dispatch(ACTION_ADD_LINES, data)

        if (statusResponse === 201) {
          this.$store.dispatch(ACTION_GET_LINES, { meta: this.meta })
          this.$swal('Success', 'Data has been added', 'success')
          this.resetModal()
        }
      } catch (error) {
        console.error(error)
        this.$swal('Error', 'Gagal menambah data', 'error')
      }
    },
    editLinesTMS(lines) {
      this.editedLine = lines
      console.log('id', this.editedLine)
    },
    async saveEditLines() {
      try {
        const id = this.editedLine.line_id
        const payload = {
          line_nm: this.editedLine.line_nm,
          line_desc: this.editedLine.line_desc,
          created_by: this.editedLine.created_by,
        }
        let statusResponse = await this.$store.dispatch(ACTION_EDIT_LINES, {
          id,
          payload,
        })

        if (statusResponse === 201) {
          this.$store.dispatch(ACTION_GET_LINES, { meta: this.meta })
          this.$swal('Success', 'Data has been updated', 'success')
          this.resetModal()
        } else {
          this.$swal('Error', 'Gagal mengubah data', 'error')
        }
      } catch (error) {
        console.error(error)
        this.$swal('Error', 'Gagal mengubah data', 'error')
      }
    },
    showDeleteLinesTMS(lines) {
      this.deletedLine = lines
      // console.log('id', this.deletedLine)
    },
    resetModal() {
      this.lineName = ''
      this.lineDesc = ''
      this.createdBy = ''

      this.editedLine = {
        line_id: null,
        line_nm: '',
        line_desc: '',
        created_by: '',
      }
      this.deletedLine = {
        line_id: null,
      }
    },
    async deleteLine() {
      try {
        const id = this.deletedLine
        console.log('id', id)
        let statusResponse = await this.$store.dispatch(ACTION_DELETE_LINES, id)
        if (statusResponse === 201) {
          this.$store.dispatch(ACTION_GET_LINES, { meta: this.meta })
          this.$swal('Success', 'Data has been deleted', 'success')
          this.resetModal()
        }
      } catch (error) {
        console.log(error)
        this.$swal('Error', 'Gagal menghapus data', 'error')
      }
    },
    async saveEditLines() {
      try {
        let statusResponse = await this.$store.dispatch(
          ACTION_EDIT_LINES,
          this.editedLine,
        )
        if (statusResponse) {
          await this.$store.dispatch(ACTION_GET_LINES, { meta: this.meta })
          this.$swal('Success', 'Data has been edited', 'success')
          this.resetModal()
        }
      } catch (error) {
        console.log(error)
        this.$swal('Error', 'Gagal mengedit data', 'error')
      }
    },
  },
}
</script>
