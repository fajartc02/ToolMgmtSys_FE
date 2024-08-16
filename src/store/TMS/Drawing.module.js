import axios from 'axios'

const API_URL = process.env.VUE_APP_API_URL
import { SET_META } from './META.module'

export const GET_DRAWINGS = 'GET_DRAWINGS'
export const SET_DRAWINGS = 'SET_DRAWINGS'
export const ACTION_GET_DRAWING = 'ACTION_GET_DRAWING'
export const ACTION_GET_MEASUREMENTS = 'ACTION_GET_MEASUREMENTS'
export const SET_MEASUREMENTS = 'SET_MEASUREMENTS'
export const GET_MEASUREMENTS = 'GET_MEASUREMENTS'
export const ACTION_DELETE_MEASURING_PORTION = 'ACTION_DELETE_MEASURING_PORTION'
export const ACTION_ADD_DRAWING = 'ACTION_ADD_DRAWING'
export const ACTION_EDIT_DRAWING = 'ACTION_EDIT_DRAWING'
export const ACTION_ADD_MEASUREMENTS = 'ACTION_ADD_MEASUREMENTS'
export const ACTION_DELETE_DRAWING = 'ACTION_DELETE_DRAWING'
export const ACTION_SEARCH_DRAWING = 'ACTION_SEARCH_DRAWING'
export const SET_SEARCH_DRAWING = 'SET_SEARCH_DRAWING'
export const GET_SEARCH_DRAWING = 'GET_SEARCH_DRAWING'

const state = {
  MEASUREMENTS_DATA: [],
  DRAWING_DATA: [],
}

const getters = {
  GET_MEASUREMENTS: (state) => state.MEASUREMENTS_DATA,
  GET_DRAWINGS: (state) => state.DRAWING_DATA,
}

const mutations = {
  SET_MEASUREMENTS(state, Payload) {
    state.MEASUREMENTS_DATA = Payload
  },
  SET_DRAWINGS(state, Payload) {
    console.log('Mutation SET_DRAWINGS Data:', Payload) // Log data sebelum menyimpan
    state.DRAWING_DATA = Payload
  },
}

const actions = {
  async ACTION_GET_DRAWING({ commit }, query) {
    try {
      const response = await axios.get(`${API_URL}/tools/drawing`, {
        params: query,
      })
      commit(SET_META, response.data.data.meta)
      commit(SET_DRAWINGS, response.data.data.data)
      // console.log(response.data.data.data)
      return response.data.data.data
    } catch (error) {
      console.error('Error adding tool drawing:', error)
    }
  },
  async ACTION_GET_MEASUREMENTS({ commit }, query) {
    try {
      const response = await axios.get(`${API_URL}/tools/measurements`, {
        params: query,
      })
      commit(SET_MEASUREMENTS, response.data.data.data)
      // console.log('ini', response.data.data.data)

      return response.data.data.data
    } catch (error) {
      console.error('Error adding tool drawing:', error)
    }
  },
  async ACTION_DELETE_MEASURING_PORTION({ commit }, query) {
    try {
      const response = await axios.put(
        `${API_URL}/tools/measurements/delete/${query}`,
      )
      commit(SET_MEASUREMENTS, response.data.data.data)
      return response
    } catch (error) {
      console.log(error)

      return { status: error.response ? error.response.status : 500 }
    }
  },
  async ACTION_ADD_MEASUREMENTS({ commit }, payload) {
    try {
      const response = await axios.put(
        `${API_URL}/tools/measurements/add`,
        payload,
      )

      return response
    } catch (error) {
      console.error(error)
      return { status: error.response ? error.response.status : 500 }
    }
  },
  async ACTION_ADD_DRAWING({ commit }, formData) {
    try {
      const response = await axios.post(
        `${API_URL}/tools/drawing/add`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )
      return response
    } catch (error) {
      console.error(error)
      return { status: error.response ? error.response.status : 500 }
    }
  },
  async ACTION_EDIT_DRAWING({ commit }, { id, formData }) {
    try {
      const response = await axios.put(
        `${API_URL}/tools/drawing/edit/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )
      return response
    } catch (error) {
      console.error(error)
      return { status: error.response ? error.response.status : 500 }
    }
  },
  async ACTION_DELETE_DRAWING({ commit }, id) {
    try {
      const response = await axios.put(`${API_URL}/tools/delete/${id}`)
      return response
    } catch (error) {
      console.error('Error deleting drawing:', error)
      return { status: error.response ? error.response.status : 500 } // Kembalikan status error jika terjadi kesalahan
    }
  },
  async ACTION_SEARCH_DRAWING({ commit }, query) {
    try {
      const response = await axios.get(`${API_URL}/tools/search`, {
        params: query,
      })
      console.log('API Response Data:', response.data.data.data) // Log data dari API
      commit(SET_DRAWINGS, response.data.data.data)
      commit(SET_META, response.data.data.meta)
      return response.data.data.data // Kembalikan data jika diperlukan
    } catch (error) {
      console.error(error)
      return [] // Kembalikan array kosong jika terjadi error
    }
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
}
