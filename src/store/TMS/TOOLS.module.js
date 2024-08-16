import axios from 'axios'
import { SET_META } from './META.module'
const API_URL = process.env.VUE_APP_API_URL

export const GET_TOOL = 'GET_TOOL'
export const GET_TOOL_DETAILS = 'GET_TOOL_DETAILS'
export const GET_TOOL_QR = 'GET_TOOL_QR'
export const GET_TOOL_OPTS = 'GET_TOOL_OPTS'
export const GET_TOOL_HISTORIES = 'GET_TOOL_HISTORIES'

export const SET_TOOL = 'SET_TOOL'
export const SET_TOOL_DETAILS = 'SET_TOOL_DETAILS'
export const SET_TOOL_QR = 'SET_TOOL_QR'
export const SET_TOOL_HISTORIES = 'SET_TOOL_HISTORIES'

export const ACTION_TOOL = 'ACTION_TOOL'
export const ACTION_UPDATE_TOOL_POS = 'ACTION_UPDATE_TOOL_POS'
export const ACTION_GET_TOOL_HISTORY = 'ACTION_GET_TOOL_HISTORY'
export const ACTION_ADD_TOOL_HISTORY = 'ACTION_ADD_TOOL_HISTORY'
export const ACTION_TOOL_DETAILS = 'ACTION_TOOL_DETAILS'
export const ACTION_TOOL_ADD = 'ACTION_TOOL_ADD'
export const ACTION_GENERATE_TOOL = 'ACTION_GENERATE_TOOL'
export const ACTION_EMPTY_QR_TOOL = 'ACTION_EMPTY_QR_TOOL'

const state = {
  TOOL_DATA: true,
  TOOL_DETAILS: null,
  TOOL_QR: null,
  TOOL_HISTORIES: [],
}

const getters = {
  GET_TOOL(state) {
    return state.TOOL_DATA
  },
  GET_TOOL_DETAILS(state) {
    return state.TOOL_DETAILS
  },
  GET_TOOL_QR(state) {
    return state.TOOL_QR
  },
  GET_TOOL_OPTS(state) {
    return state.TOOL_DATA.map((toolType) => {
      return {
        id: toolType.tool_type_id,
        label: toolType.tool_type_nm,
      }
    })
  },
  GET_TOOL_HISTORIES(state) {
    return state.TOOL_HISTORIES
  },
}

const mutations = {
  SET_TOOL(state, payload) {
    state.TOOL_DATA = payload
  },
  SET_TOOL_QR(state, payload) {
    state.TOOL_QR = payload[0].tool_qr
  },
  SET_TOOL_DETAILS(state, payload) {
    state.TOOL_DETAILS = payload[0]
  },
  SET_TOOL_HISTORIES(state, payload) {
    state.TOOL_HISTORIES = payload
  },
}

const actions = {
  async ACTION_TOOL({ commit }, query) {
    try {
      const response = await axios.get(`${API_URL}/tools/get`, {
        params: query,
      })

      commit(SET_META, response.data.data.meta)
      commit(SET_TOOL, response.data.data.data)
      console.log(response.data.data.data)

    } catch (error) {
      console.error(error)
      return error
    }
  },
  async ACTION_TOOL_DETAILS({ commit }, query) {
    try {
      const response = await axios.get(`${API_URL}/tools/details`, {
        params: query,
      })
      commit(SET_TOOL_DETAILS, response.data.data ? response.data.data : null)
    } catch (error) {
      console.error(error)
      return error
    }
  },
  async ACTION_TOOL_ADD({ commit }, payload) {
    try {
      const response = await axios.post(`${API_URL}/tools/add`, payload)
      return response
    } catch (error) {
      console.error(error)
      return error
    }
  },
  async ACTION_GENERATE_TOOL({ commit }) {
    try {
      const response = await axios.get(`${API_URL}/tools/generateQR`)
      commit(SET_TOOL_QR, response.data.data)
    } catch (error) {
      console.error(error)
      return error
    }
  },
  async ACTION_GET_TOOL_HISTORY({ commit }, query) {
    try {
      const response = await axios.get(`${API_URL}/tools/history`, {
        params: query,
      })
      console.log(response.data.data.data)

      commit(SET_TOOL_HISTORIES, response.data.data.data)
      commit(SET_META, response.data.data.meta)
    } catch (error) {
      console.error(error)
      return error
    }
  },
  async ACTION_ADD_TOOL_HISTORY({ commit }, payload) {
    try {
      const response = await axios.post(`${API_URL}/tools/history`, payload)
      console.log(response)
    } catch (error) {
      console.error(error)
      return error
    }
  },
  async ACTION_UPDATE_TOOL_POS({ commit }, payload) {
    try {
      const tool_qr = payload.tool_qr
      delete payload.tool_qr
      const response = await axios.put(`${API_URL}/tools/position`, payload, {
        params: { tool_qr },
      })
      console.log(response)
    } catch (error) {
      console.error(error)
      return error
    }
  },
  ACTION_EMPTY_QR_TOOL({ commit }) {
    try {
      commit(SET_TOOL_QR, null)
    } catch (error) {
      console.error(error)
      return error
    }
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
}
