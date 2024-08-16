<template>
  <div class="modal" tabindex="-1" id="modalToolDrawing">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Tambah Drawing</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col">
              <div class="mb-3 form-group">
                <label class="tool-drawing-label">Nama Tool Drawing</label>
                <input v-model="toolNm" class="form-control" type="text" />
              </div>
              <div class="mb-3 form-group">
                <label class="tool-drawing-label">Tool Desc</label>
                <input v-model="toolDesc" class="form-control" type="text" />
              </div>
              <div class="mb-3 form-group">
                <label class="tool-drawing-label">Material</label>
                <input v-model="material" class="form-control" type="text" />
              </div>
              <div class="mb-3 form-group">
                <label class="tool-drawing-label">Drawing</label>
                <input
                  name="ilustrations"
                  @change="onFileChange"
                  class="form-control"
                  type="file"
                />
              </div>

              <div class="mb-3 form-group">
                <label class="tool-drawing-label">Maker Tool</label>
                <input v-model="maker" class="form-control" type="text" />
              </div>
              <div class="mb-3 form-group">
                <label class="tool-drawing-label">Counter Tool</label>
                <input v-model="counter" class="form-control" type="text" />
              </div>
              <div class="mb-3 form-group">
                <label class="tool-drawing-label">PIC</label>
                <input v-model="pic" class="form-control" type="text" />
              </div>
            </div>
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
            @click="saveMasterDrawing"
            data-bs-dismiss="modal"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
  <!-- modalToolDrawing -->

  <div class="modal" tabindex="-1" id="modalMeasurement">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Measurement</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <!-- Tabel 1 -->
          <table class="table table-bordered table-striped">
            <tr>
              <th>Tool Drawing Name</th>
              <th>Maker</th>
              <th>Counter Tool</th>
            </tr>
            <tbody>
              <tr v-if="selectedDrawing">
                <td>{{ selectedDrawing.tool_type_nm }}</td>
                <td>{{ selectedDrawing.maker }}</td>
                <td>{{ selectedDrawing.std_counter }}</td>
              </tr>
            </tbody>
          </table>
          <!-- Tabel 2 -->
          <div class="table-responsive">
            <table class="table table-bordered table-striped">
              <thead>
                <tr>
                  <th style="width: 30%">Measure Name</th>
                  <th style="width: 14%">Value</th>
                  <th style="width: 14%">Upper Limit</th>
                  <th style="width: 14%">Lower Limit</th>
                  <th style="width: 14%">Unit</th>
                  <th style="width: 14%">Used In</th>
                  <th style="width: 14%">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(measurement, index) in sortedMeasurements"
                  :key="index"
                >
                  <td>
                    <input
                      type="text"
                      v-model="measurement.measuring_portion"
                      class="form-control"
                      placeholder="Enter Measure Name"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      v-model="measurement.dimension"
                      class="form-control"
                      placeholder="Enter Value"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      v-model="measurement.upper_limit"
                      class="form-control"
                      placeholder="Enter Upper Limit"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      v-model="measurement.lower_limit"
                      class="form-control"
                      placeholder="Enter Lower Limit"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      v-model="measurement.units"
                      class="form-control"
                      placeholder="Enter Unit"
                    />
                  </td>
                  <td>
                    <select
                      class="form-select"
                      v-model="measurement.system_std_used"
                    >
                      <option value="TR">TR</option>
                      <option value="CR">CR</option>
                    </select>
                  </td>
                  <td>
                    <button
                      type="button"
                      class="btn btn-danger"
                      @click="deleteRow(index)"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <button type="button" class="btn btn-primary" @click="addRow">
            Add Standart Check
          </button>
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
            @click="saveMeasurements"
            data-bs-dismiss="modal"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- modalMeasurement -->

  <div class="modal" tabindex="-1" id="modalEditDrawing">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Edit Drawing</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col">
              <div class="mb-3 form-group">
                <label class="tool-drawing-label">Register Date </label>
                <input
                  v-model="editedDrawings.created_dt"
                  class="form-control"
                  type="date"
                />
              </div>
              <div class="mb-3 form-group">
                <label class="tool-drawing-label">Nama Tool</label>
                <input
                  v-model="editedDrawings.tool_type_nm"
                  class="form-control"
                  type="text"
                />
              </div>
              <div class="mb-3 form-group">
                <label class="tool-drawing-label">Tool Desc</label>
                <input
                  v-model="editedDrawings.tool_type_desc"
                  class="form-control"
                  type="text"
                />
              </div>
              <div class="mb-3 form-group">
                <label class="tool-drawing-label">Material</label>
                <input
                  v-model="editedDrawings.tool_material"
                  class="form-control"
                  type="text"
                />
              </div>
              <div class="mb-3 form-group">
                <label class="tool-drawing-label">Drawing</label>
                <input
                  @change="onFileChange"
                  class="form-control"
                  type="file"
                />
              </div>

              <div class="mb-3 form-group">
                <label class="tool-drawing-label">Maker Tool</label>
                <input
                  v-model="editedDrawings.maker"
                  class="form-control"
                  type="text"
                />
              </div>
              <div class="mb-3 form-group">
                <label class="tool-drawing-label">Counter Tool</label>
                <input
                  v-model="editedDrawings.std_counter"
                  class="form-control"
                  type="text"
                />
              </div>
              <div class="mb-3 form-group">
                <label class="tool-drawing-label">PIC</label>
                <input
                  v-model="editedDrawings.created_by"
                  class="form-control"
                  type="text"
                />
              </div>
            </div>
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
            @click="saveEditDrawing"
            data-bs-dismiss="modal"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- modalPreview -->
  <div class="modal" tabindex="-1" id="modalPreview">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Preview Drawing</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <img :src="previewUrl" class="img-fluid" alt="Preview" />
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal" tabindex="-1" id="modalDeleteDrawing">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Delete Drawing</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete this drawing?</p>
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
            @click="deleteDrawing"
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
        <h4 class="text-center m-0">Master Drawing</h4>
        <CButton
          type="button"
          color="secondary"
          variant="outline"
          data-bs-toggle="modal"
          data-bs-target="#modalToolDrawing"
          >Add Drawing
        </CButton>
      </div>
    </div>

    <div ref="searchCard" class="card">
      <div class="card-body">
        <div class="mb-3 d-flex justify-content-end">
          <input
            placeholder="Search Drawing..."
            class="form-control"
            type="text"
            v-model="search"
            style="width: 20%"
          />
          <button type="button" class="btn btn-primary" @click="searchDrawing">
            <i class="fas fa-search"></i>
          </button>
        </div>
        <table
          style="text-align: center"
          class="table table-bordered table-striped"
        >
          <thead>
            <tr>
              <th>No</th>
              <th>Register Date</th>
              <th>Tool Drawing Name</th>
              <th>Tool Material</th>
              <th>Maker</th>
              <th>Counter</th>
              <th>Drawing</th>
              <th>PIC</th>
              <th>Measurement</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(drawings, tool_type_id) in GET_DRAWINGS"
              :key="tool_type_id"
            >
              <td>{{ drawings.no }}</td>
              <td>{{ drawings.created_dt }}</td>
              <td>{{ drawings.tool_type_nm }}</td>
              <td>{{ drawings.tool_material }}</td>
              <td>{{ drawings.maker }}</td>
              <td>{{ drawings.std_counter }}</td>
              <td>
                <button
                  class="btn btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#modalPreview"
                  @click="previewDrawing(drawings.ilustrations)"
                >
                  <i class="fas fa-eye"></i>
                </button>
              </td>
              <td>{{ drawings.created_by }}</td>
              <td>
                <button
                  class="btn btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#modalMeasurement"
                  @click="fetchMeasurement(drawings.tool_type_id)"
                >
                  <i class="fas fa-book"></i>
                </button>
              </td>
              <td>
                <button
                  data-bs-toggle="modal"
                  data-bs-target="#modalEditDrawing"
                  class="btn btn-primary"
                  @click="editDrawing(drawings)"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  data-bs-toggle="modal"
                  data-bs-target="#modalDeleteDrawing"
                  @click="showDeleteConfirmation(drawings.tool_type_id)"
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
  ACTION_GET_DRAWING,
  GET_DRAWINGS,
  ACTION_GET_MEASUREMENTS,
  GET_MEASUREMENTS,
  ACTION_DELETE_MEASURING_PORTION,
  ACTION_ADD_DRAWING,
  ACTION_EDIT_DRAWING,
  ACTION_ADD_MEASUREMENTS,
  ACTION_DELETE_DRAWING,
  ACTION_SEARCH_DRAWING,
} from '@/store/TMS/Drawing.module'
import { mapGetters } from 'vuex'
import { GET_META } from '@/store/TMS/META.module'

import PaginationMaster from '@/components/TMS/Pagination/PaginationMaster.vue'
const API_URL = process.env.VUE_APP_API_URL
import moment from 'moment'

export default {
  name: 'MasterDrawing',
  components: {
    PaginationMaster,
  },
  data() {
    return {
      meta: {
        totalData: 0,
        currentPage: 1,
        itemsPerPage: 10,
        totalPages: 1,
      },
      toolNm: '',
      maker: '',
      counter: '',
      pic: '',
      photo: '',
      selectedFile: null,
      toolDesc: '',
      material: '',
      selectedDrawing: null,
      measurements: [],
      previewUrl: '',
      editedDrawings: {
        tool_type_id: null,
        created_dt: '',
        tool_type_nm: '',
        tool_type_desc: '',
        tool_material: '',
        maker: '',
        std_counter: '',
        ilustrasion: '',
        created_by: '',
        selectedFile: null,
      },
      search: '',
    }
  },
  mounted() {
    this.$store.dispatch(ACTION_GET_DRAWING, { meta: this.meta })
    this.$store.dispatch(ACTION_GET_MEASUREMENTS, { meta: this.meta })
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleClickOutside)
  },
  computed: {
    ...mapGetters([GET_DRAWINGS, GET_META, GET_MEASUREMENTS]),
    sortedMeasurements() {
      return this.measurements.slice().sort((a, b) => {
        if (a.system_std_used === 'TR' && b.system_std_used === 'CR') {
          return -1
        }
        if (a.system_std_used === 'CR' && b.system_std_used === 'TR') {
          return 1
        }
        return 0
      })
    },
  },
  watch: {
    GET_META: function () {
      this.meta = this.GET_META
    },
    'meta.itemsPerPage': function () {
      this.$store.dispatch(ACTION_GET_DRAWING, { meta: this.meta })
    },
  },

  methods: {
    handlePageChange(page) {
      this.meta.currentPage = page
      this.$store.dispatch(ACTION_GET_DRAWING, { meta: this.meta })
    },
    onFileChange(event) {
      const file = event.target.files[0]
      const maxSize = 500 * 1024 // 500 KB

      if (!file || !file.type.startsWith('image/')) {
        alert('Pilih file gambar yang valid.')
        return
      }

      if (file.size > maxSize) {
        alert('Ukuran file terlalu besar. Maksimal 500 KB.')
        return
      }

      // Menyimpan file yang dipilih
      this.selectedFile = file
      this.editedDrawings.selectedFile = file

      // Jika perlu, set previewUrl untuk menampilkan gambar
      const reader = new FileReader()
      reader.onload = () => {
        this.previewUrl = reader.result // Simpan data URL gambar untuk preview
      }
      reader.readAsDataURL(file)
    },
    async searchDrawing() {
      try {
        // Dispatch action dan tunggu hasilnya
        await this.$store.dispatch(ACTION_SEARCH_DRAWING, {
          meta: this.meta,
          search: this.search,
        })
        if (this.GET_DRAWINGS.length == 0) {
          this.$swal('Error', 'Tidak ada data yang ditemukan', 'error')
        }
      } catch (error) {
        console.log(error)
        this.$swal('Error', 'Terjadi kesalahan saat mencari drawing', 'error')
      }
    },
    resetSearch() {
      this.search = ''
      this.$store.dispatch(ACTION_GET_DRAWING, { meta: this.meta })
    },
    handleClickOutside(event) {
      const searchCard = this.$refs.searchCard

      // Pastikan searchCard tidak null sebelum mengakses contains
      if (searchCard && !searchCard.contains(event.target)) {
        this.resetSearch() // Reset pencarian dan muat ulang data
      }
    },

    async fetchMeasurement(tool_type_id) {
      // Temukan drawing yang dipilih berdasarkan tool_type_id
      this.selectedDrawing = this.GET_DRAWINGS.find(
        (drawing) => drawing.tool_type_id === tool_type_id,
      )

      // console.log('Selected Drawing:', this.selectedDrawing) // Tambahkan log

      // Pastikan selectedDrawing ditemukan
      if (this.selectedDrawing) {
        await this.$store.dispatch(ACTION_GET_MEASUREMENTS, { meta: this.meta })
        // Filter measurements berdasarkan tool_type_id yang sama dengan selectedDrawing
        this.measurements = this.GET_MEASUREMENTS.filter(
          (measurement) => measurement.tool_type_id === tool_type_id,
        )

        // console.log('Measurements:', this.measurements) // Tambahkan log
      } else {
        // Jika tidak ada drawing ditemukan, reset measurements
        this.measurements = []
      }
    },

    addRow() {
      this.measurements.push({
        measuring_portion: '',
        dimension: '',
        upper_limit: '',
        lower_limit: '',
        units: '',
        system_std_used: '',
      })
    },
    async deleteRow(index) {
      const sortedMeasurement = this.sortedMeasurements[index]
      console.log('sortedMeasurement', sortedMeasurement)

      // Cek apakah tool_type_std_id ada
      if (!sortedMeasurement.tool_type_std_id) {
        const originalIndex = this.measurements.findIndex(
          (measurement) => measurement === sortedMeasurement,
        )
        if (originalIndex !== -1) {
          this.measurements.splice(originalIndex, 1)
        }
      } else {
        // Lanjutkan dengan pemanggilan backend
        let statusRespon = await this.$store.dispatch(
          ACTION_DELETE_MEASURING_PORTION,
          sortedMeasurement.tool_type_std_id,
        )
        if (statusRespon.status === 201) {
          this.$store.dispatch(ACTION_GET_MEASUREMENTS, { meta: this.meta })
          this.$swal('Success', 'Data berhasil dihapus', 'success')
          const originalIndex = this.measurements.findIndex(
            (measurement) => measurement === sortedMeasurement,
          )
          if (originalIndex !== -1) {
            this.measurements.splice(originalIndex, 1)
          }
        } else {
          this.$swal('Error', 'Gagal menghapus data', 'error')
        }
      }
    },

    async saveMeasurements() {
      try {
        const payload = this.measurements.map((measurement) => ({
          tool_type_id: this.selectedDrawing.tool_type_id,
          measuring_portion: measurement.measuring_portion,
          dimension: measurement.dimension,
          upper_limit: measurement.upper_limit,
          lower_limit: measurement.lower_limit,
          units: measurement.units,
          system_std_used: measurement.system_std_used,
        }))
        console.log('payload', payload)

        let statusResponse = await this.$store.dispatch(
          ACTION_ADD_MEASUREMENTS,
          payload,
        )
        if (statusResponse.status === 201) {
          this.$store.dispatch(ACTION_GET_MEASUREMENTS, { meta: this.meta })
          this.$swal('Success', 'Data has been saved', 'success')
        } else {
          this.$swal('Error', 'Gagal menyimpan data', 'error')
        }
      } catch (error) {
        console.log(error)
        this.$swal('Error', 'Gagal menyimpan data', 'error')
      }
    },
    editDrawing(drawings) {
      this.editedDrawings = drawings
      // console.log('ini', this.editedDrawings)
      this.editedDrawings.created_dt = this.formatDateToInput()
    },
    formatDateToInput() {
      return moment().format('YYYY-MM-DD')
    },
    async saveMasterDrawing() {
      try {
        const formData = new FormData()
        formData.append('tool_type_nm', this.toolNm)
        formData.append('tool_type_desc', this.toolDesc)
        formData.append('tool_material', this.material)
        formData.append('maker', this.maker)
        formData.append('std_counter', this.counter)
        formData.append('created_by', this.pic)
        formData.append('ilustrations', this.selectedFile)

        console.log('FormData:', formData)

        let statusResponse = await this.$store.dispatch(
          ACTION_ADD_DRAWING,
          formData,
        )

        if (statusResponse.status === 201) {
          this.$store.dispatch(ACTION_GET_DRAWING, { meta: this.meta })
          this.$swal('Success', 'Data has been added', 'success')
          this.resetModal()
        } else {
          this.$swal('Error', 'Gagal menambah data', 'error')
        }
      } catch (error) {
        console.log(error)
        this.$swal('Error', 'Gagal menambah data', 'error')
      }
    },

    async saveEditDrawing() {
      try {
        const id = this.editedDrawings.tool_type_id
        console.log('id', id)
        // Convert the date from dd-mm-yyyy to yyyy-mm-dd
        const dateParts = this.editedDrawings.created_dt.split('-')
        const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`
        const formData = new FormData()
        formData.append('created_dt', formattedDate)
        formData.append('tool_type_nm', this.editedDrawings.tool_type_nm)
        formData.append('tool_type_desc', this.editedDrawings.tool_type_desc)
        formData.append('tool_material', this.editedDrawings.tool_material)
        formData.append('maker', this.editedDrawings.maker)
        formData.append('std_counter', this.editedDrawings.std_counter)
        formData.append('created_by', this.editedDrawings.created_by)
        formData.append('ilustrations', this.editedDrawings.selectedFile) // Jika file yang dipilih
        let statusResponse = await this.$store.dispatch(ACTION_EDIT_DRAWING, {
          id,
          formData,
        })

        if (statusResponse.status == 201) {
          this.$store.dispatch(ACTION_GET_DRAWING, { meta: this.meta })
          this.$swal('Success', 'Data has been updated', 'success')
          this.resetModal()
        } else {
          this.$swal('Error', 'Failed to update data', 'error')
        }
      } catch (error) {
        console.log(error)
        this.$swal('Error', 'Failed to update data', 'error')
      }
    },

    resetModal() {
      this.registerDate = ''
      this.toolNm = ''
      this.toolDesc = ''
      this.material = ''
      this.maker = ''
      this.counter = ''
      this.pic = ''
      this.selectedFile = null
      this.previewUrl = ''
      this.editedDrawings = {
        tool_type_id: null,
        created_dt: '',
        tool_type_nm: '',
        tool_type_desc: '',
        tool_material: '',
        maker: '',
        std_counter: '',
        ilustrasion: '',
        created_by: '',
      }
      this.deleteConfirmation = null
      this.sortedMeasurements = []
    },
    previewDrawing(ilustrasionUrl) {
      const relativePath = ilustrasionUrl
        ? ilustrasionUrl.replace(/\\/g, '/')
        : null
      this.previewUrl = relativePath ? `${API_URL}/${relativePath}` : null
      console.log(this.previewUrl)
    },

    showDeleteConfirmation(masterDrawing) {
      this.deleteConfirmation = masterDrawing
      console.log('delete', this.deleteConfirmation)
    },
    async deleteDrawing() {
      try {
        const id = this.deleteConfirmation
        const response = await this.$store.dispatch(ACTION_DELETE_DRAWING, id)

        if (response.status === 201) {
          this.$store.dispatch(ACTION_GET_DRAWING, { meta: this.meta })
          this.$swal('Success', 'Data has been deleted', 'success')
          this.resetModal()
        } else {
          // Menangani kasus di mana status bukan 200
          this.$swal('Failed', 'Failed to delete data', 'error')
        }
      } catch (error) {
        console.log(error)
        this.$swal('Error', 'Failed to delete data', 'error')
      }
    },
  },
}
</script>
