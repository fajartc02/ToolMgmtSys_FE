const API_URL = process.env.VUE_APP_API_URL

import axios from 'axios'

export const ACTION_GET_TOOL_BY_TOOL_TYPE_ID = 'ACTION_GET_TOOL_BY_TOOL_TYPE_ID'
export const SET_TOOL_BY_TOOL_TYPE_ID = 'SET_TOOL_BY_TOOL_TYPE_ID'
export const GET_TOOL_BY_TOOL_TYPE_ID = 'GET_TOOL_BY_TOOL_TYPE_ID'

export const ACTION_GET_TOOL_USED_BY_MACHINE_ID =
  'ACTION_GET_TOOL_USED_BY_MACHINE_ID'
export const SET_TOOL_USED_BY_MACHINE_ID = 'SET_TOOL_USED_BY_MACHINE_ID'
export const GET_TOOL_USED_BY_MACHINE_ID = 'GET_TOOL_USED_BY_MACHINE_ID'

const state = {
  TOOL_USED_BY_TOOL_TYPE_ID: [],
  TOOL_USED_BY_MACHINE_ID: [],
}

const getters = {
  GET_TOOL_BY_TOOL_TYPE_ID(state) {
    return state.TOOL_USED_BY_TOOL_TYPE_ID
  },
  GET_TOOL_USED_BY_MACHINE_ID(state) {
    return state.TOOL_USED_BY_MACHINE_ID
  },
}

const mutations = {
  SET_TOOL_BY_TOOL_TYPE_ID(state, payload) {
    state.TOOL_USED_BY_TOOL_TYPE_ID = payload
  },
  SET_TOOL_USED_BY_MACHINE_ID(state, payload) {
    state.TOOL_USED_BY_MACHINE_ID = payload
  },
}

const actions = {
  async ACTION_GET_TOOL_USED_BY_MACHINE_ID({ commit }, query) {
    try {
      const response = await axios.get(`${API_URL}/tool-used-by-qr/get-tool`, {
        params: query,
      })
      commit(SET_TOOL_USED_BY_MACHINE_ID, response.data.data)
      // console.log('ini', response.data.data)

      return response
    } catch (error) {
      console.error(error)
    }
  },
  async ACTION_GET_TOOL_BY_TOOL_TYPE_ID({ commit }, query) {
    try {
      const response = await axios.get(`${API_URL}/tool-used-by-qr/get`, {
        params: {
          tool_type_id: query.tool_type_id,
          tool_id: query.tool_id,
        },
      })
      commit(SET_TOOL_BY_TOOL_TYPE_ID, response.data.data)
      return response
    } catch (error) {
      console.error(error)
    }
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
}
