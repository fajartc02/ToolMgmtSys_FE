import axios from 'axios'
const API_URL = process.env.VUE_APP_API_URL
import moment from 'moment'

export const GET_SYSTEM = 'GET_SYSTEM'
export const GET_SYSTEM_OPTS = 'GET_SYSTEM_OPTS'
export const SET_SYSTEM = 'SET_SYSTEM'
export const ACTION_SYSTEM = 'ACTION_SYSTEM'
export const ACTION_ADD_SYSTEM = 'ACTION_ADD_SYSTEM'
export const ACTION_EDIT_SYSTEM = 'ACTION_EDIT_SYSTEM'
export const ACTION_DELETE_SYSTEM = 'ACTION_DELETE_SYSTEM'

const state = {
  SYSTEM_DATA: [],
}

const getters = {
  GET_SYSTEM(state) {
    return state.SYSTEM_DATA
  },
  GET_SYSTEM_OPTS(state) {
    return state.SYSTEM_DATA.map((system) => {
      return {
        id: system.system_value,
        label: system.system_value,
        selected: false,
        is_reason: system.system_value == 'LAIN LAIN' ? true : false,
      }
    })
  },
}

const mutations = {
  SET_SYSTEM(state, payload) {
    state.SYSTEM_DATA = payload.map((system) => {
      return {
        ...system,
        created_dt: moment(system.created_dt).format('DD-MM-YYYY'),
      }
    })
  },
}

const actions = {
  async ACTION_SYSTEM({ commit }, query) {
    try {
      const response = await axios.get(`${API_URL}/systems/get`, {
        params: query,
      })
      commit(SET_SYSTEM, response.data.data)
    } catch (error) {
      console.error(error)
      return error
    }
  },
  async ACTION_ADD_SYSTEM({ commit }, payload) {
    try {
      const response = await axios.post(`${API_URL}/systems/add`, payload)
      return response.status
    } catch (error) {
      console.error(error)
      return { status: error.response ? error.response.status : 500 }
    }
  },
  async ACTION_EDIT_SYSTEM({ commit }, { id, payload }) {
    try {
      const response = await axios.put(`${API_URL}/systems/edit/${id}`, payload)
      return response.status
    } catch (error) {
      console.error(error)
      return { status: error.response ? error.response.status : 500 }
    }
  },
  async ACTION_DELETE_SYSTEM({ commit }, id) {
    try {
      const response = await axios.put(`${API_URL}/systems/delete/${id}`)
      return response.status
    } catch (error) {
      console.error(error)
      return { status: error.response ? error.response.status : 500 }
    }
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
}
