import axios from 'axios'
const API_URL = process.env.VUE_APP_API_URL
import { SET_META } from './META.module'

export const GET_MACHINES = 'GET_MACHINES'
export const GET_MACHINES_OPTS = 'GET_MACHINES_OPTS'
export const SET_MACHINES = 'SET_MACHINES'
export const ACTION_MACHINES = 'ACTION_MACHINES'
export const ACTION_EDIT_MACHINES = 'ACTION_EDIT_MACHINES'
export const ACTION_ADD_MACHINES = 'ACTION_ADD_MACHINES'
export const ACTION_DELETE_MACHINES = 'ACTION_DELETE_MACHINES'
export const ACTION_MACHINES_OPTS = 'ACTION_MACHINES_OPTS'
export const SET_MANCHINES_OPTS = 'SET_MANCHINES_OPTS'
export const GET_MACHINES_TREESELECT = 'GET_MACHINES_TREESELECT'

const state = {
  MACHINES_DATA: [],
  DATA_MACHINES: [],
}

const getters = {
  GET_MACHINES(state) {
    return state.MACHINES_DATA
  },
  GET_MACHINES_OPTS(state) {
    return state.MACHINES_DATA.map((machine) => {
      return {
        id: machine.machine_id,
        label: machine.machine_nm,
      }
    })
  },
  GET_MACHINES_TREESELECT(state) {
    return state.DATA_MACHINES.map((machine) => {
      return {
        id: machine.machine_id,
        label: machine.machine_nm,
      }
    })
  },
}

const mutations = {
  SET_MACHINES(state, payload) {
    state.MACHINES_DATA = payload
  },
  SET_MANCHINES_OPTS(state, payload) {
    state.DATA_MACHINES = payload
  },
}

const actions = {
  async ACTION_MACHINES({ commit }, query) {
    try {
      console.log('CALL ACTION MACHINES')
      const response = await axios.get(`${API_URL}/machines/get`, {
        params: query,
      })

      commit(SET_META, response.data.data.meta)
      commit(SET_MACHINES, response.data.data.data)
      console.log(response.data.data.data)
    } catch (error) {
      console.error(error)
      return error
    }
  },
  async ACTION_ADD_MACHINES({ commit }, payload) {
    try {
      const response = await axios.post(`${API_URL}/machines/add`, payload)
      return response.status
    } catch (error) {
      console.error(error)
      return { status: error.response ? error.response.status : 500 }
    }
  },
  async ACTION_EDIT_MACHINES({ commit }, { id, payload }) {
    try {
      const response = await axios.put(
        `${API_URL}/machines/edit/${id}`,
        payload,
      )
      return response.status
    } catch (error) {
      console.error(error)
      return { status: error.response ? error.response.status : 500 }
    }
  },
  async ACTION_DELETE_MACHINES({ commit }, id) {
    try {
      const response = await axios.put(`${API_URL}/machines/delete/${id}`)
      return response.status
    } catch (error) {
      console.error(error)
      return { status: error.response ? error.response.status : 500 }
    }
  },
  async ACTION_MACHINES_OPTS({ commit }, query) {
    try {
      const response = await axios.get(`${API_URL}/machines/options/`, {
        params: query,
      })
      commit(SET_MANCHINES_OPTS, response.data.data)
      console.log(response.data.data)
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
