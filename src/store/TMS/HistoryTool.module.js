const API_URL = process.env.VUE_APP_API_URL
import axios from 'axios'
import { SET_META } from './META.module'

export const GET_HISTORIES_TOOL = 'GET_HISTORIES_TOOL'
export const SET_HISTORIES_TOOL = 'SET_HISTORIES_TOOL'
export const ACTION_GET_HISTORIES_TOOL = 'ACTION_GET_HISTORIES_TOOL'
export const SET_MEASUREMENT_GRAPH = 'SET_MEASUREMENT_GRAPH'
export const GET_MEASUREMENT_GRAPH = 'GET_MEASUREMENT_GRAPH'
export const ACTION_GRAFIK_MEASUREMENTS = 'ACTION_GRAFIK_MEASUREMENTS'
export const SET_REGRINDING_GRAPH = 'SET_REGRINDING_GRAPH'
export const GET_REGRINDING_GRAPH = 'GET_REGRINDING_GRAPH'
export const ACTION_GET_GRAPH_REGRINDING = 'ACTION_GET_GRAPH_REGRINDING'

const state = {
  HISTORIES_TOOL: [],
  MEASUREMENT_GRAPH: [],
  REGRINDING_GRAPH: [],
}

const getters = {
  GET_HISTORIES_TOOL(state) {
    return state.HISTORIES_TOOL
  },
  GET_MEASUREMENT_GRAPH(state) {
    return state.MEASUREMENT_GRAPH
  },
  GET_REGRINDING_GRAPH(state) {
    return state.REGRINDING_GRAPH
  },
}

const mutations = {
  SET_HISTORIES_TOOL(state, payload) {
    state.HISTORIES_TOOL = payload.map((item) => {
      if (!item.system_problem) {
        item.system_problem = '-'
      }
      return item
    })
  },
  SET_MEASUREMENT_GRAPH(state, payload) {
    state.MEASUREMENT_GRAPH = payload
  },
  SET_REGRINDING_GRAPH(state, payload) {
    state.REGRINDING_GRAPH = payload
  },
}

const actions = {
  async ACTION_GET_HISTORIES_TOOL({ commit }, query) {
    try {
      const response = await axios.get(`${API_URL}/regrinding/get`, {
        params: query,
      })
      // console.log(response.data.data.data)
      commit(SET_HISTORIES_TOOL, response.data.data.data)
      commit(SET_META, response.data.data.meta)
    } catch (error) {
      console.error(error)
      return { status: error.response ? error.response.status : 500 }
    }
  },
  // Vuex action
  async ACTION_GRAFIK_MEASUREMENTS({ commit }, id) {
    try {
      const response = await axios.get(`${API_URL}/regrinding/graph/${id}`)
      // console.log(response.data.data)
      commit(SET_MEASUREMENT_GRAPH, response.data.data)
      return {
        status: response.status,
        data: response.data.data,
      }
    } catch (error) {
      console.error(error)
      return {
        status: error.response ? error.response.status : 500,
        data: null,
      }
    }
  },
  async ACTION_GET_GRAPH_REGRINDING({ commit }, period) {
    try {
      const response = await axios.get(
        `${API_URL}/regrinding/graphReg/${period}`,
      )
      console.log(response.data.data)
      commit(SET_REGRINDING_GRAPH, response.data.data)
      return {
        status: response.status,
        data: response.data.data,
      }
    } catch (error) {
      console.error(error)
      return {
        status: error.response ? error.response.status : 500,
        data: null,
      }
    }
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
}
