const API_URL = process.env.VUE_APP_API_URL
import axios from 'axios'
import { SET_META } from '@/store/TMS/META.module'

export const GET_SETTING_HISTORY = 'GET_SETTING_HISTORY'
export const SET_SETTING_HISTORY = 'SET_SETTING_HISTORY'
export const ACTION_GET_SETTING_HISTORY = 'ACTION_GET_SETTING_HISTORY'
export const ACTION_GET_MEASURING_SETTING = 'ACTION_GET_MEASURING_SETTING'
export const GET_SETTING_MEASURE_HISTORY = 'GET_SETTING_MEASURE_HISTORY'
export const SET_SETTING_MEASURE_HISTORY = 'SET_SETTING_MEASURE_HISTORY'
export const GET_SETTING_GRAPH = 'GET_SETTING_GRAPH'
export const SET_SETTING_GRAPH = 'SET_SETTING_GRAPH'
export const ACTION_GET_GRAPH_SETTING = 'ACTION_GET_GRAPH_SETTING'

const state = {
  SETTING_HISTORY_DATA: [],
  SETTING_MEASURE_HISTORY_DATA: [],
  SETTING_GRAPH_DATA: [],
}

const getters = {
  GET_SETTING_HISTORY: (state) => state.SETTING_HISTORY_DATA,
  GET_SETTING_MEASURE_HISTORY: (state) => state.SETTING_MEASURE_HISTORY_DATA,
  GET_SETTING_GRAPH: (state) => state.SETTING_GRAPH_DATA,
}

const mutations = {
  SET_SETTING_HISTORY(state, Payload) {
    state.SETTING_HISTORY_DATA = Payload
  },
  SET_SETTING_MEASURE_HISTORY(state, Payload) {
    state.SETTING_MEASURE_HISTORY_DATA = Payload
  },
  SET_SETTING_GRAPH(state, payload) {
    state.SETTING_GRAPH_DATA = payload
  },
}

const actions = {
  async ACTION_GET_SETTING_HISTORY({ commit }, query) {
    try {
      const response = await axios.get(`${API_URL}/setting/get`, {
        params: query,
      })
      commit(SET_SETTING_HISTORY, response.data.data.data)
      commit(SET_META, response.data.data.meta)
    } catch (error) {
      console.error(error)
      return { status: error.response ? error.response.status : 500 }
    }
  },
  async ACTION_GET_MEASURING_SETTING({ commit }, id) {
    try {
      const response = await axios.get(`${API_URL}/setting/measureGraph/${id}`)
      commit(SET_SETTING_MEASURE_HISTORY, response.data.data)
      return {
        status: response.status,
        data: response.data.data,
      }
    } catch (error) {
      console.error(error)
      return { status: error.response ? error.response.status : 500 }
    }
  },
  async ACTION_GET_GRAPH_SETTING({ commit }, period) {
    try {
      const response = await axios.get(
        `${API_URL}/setting/measureGraphSet/${period}`,
      )
      commit(SET_SETTING_GRAPH, response.data.data)
      return {
        status: response.status,
        data: response.data.data,
      }
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
