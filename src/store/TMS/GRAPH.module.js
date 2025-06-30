import axios from 'axios'
const API_URL = process.env.VUE_APP_API_URL

export const GET_GRAPH = 'GET_GRAPH'
export const SET_GRAPH = 'SET_GRAPH'
export const ACTION_GRAPH = 'ACTION_GRAPH'
export const RESET_GRAPH = 'RESET_GRAPH'

const state = {
  GRAPH_DATA: {
    data: [
      {
        name: 'Actual',
        data: [],
      },
      {
        name: 'Standard',
        data: [],
      },
    ],
    categories: [],
    annotations: {
      points: [],
    },
  },
}

const getters = {
  GET_GRAPH(state) {
    return state.GRAPH_DATA
  },
}

const mutations = {
  RESET_GRAPH(state) {
    state.GET_GRAPH = {
      data: [],
      categories: [],
      annotations: {},
    }
  },
  SET_GRAPH(state, payload) {
    state.GRAPH_DATA = payload
  },
}

const actions = {
  async ACTION_GRAPH({ commit }, query) {
    try {
      const response = await axios.get(`${API_URL}/graph/get`, {
        params: query,
      })
      // console.log('giloiki', response.data.data)
      commit(SET_GRAPH, response.data.data)
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
