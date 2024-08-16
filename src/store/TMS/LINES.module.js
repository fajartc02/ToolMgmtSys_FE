import axios from 'axios'
const API_URL = process.env.VUE_APP_API_URL

export const GET_LINES = 'GET_LINES'
export const ACTION_GET_LINES = 'ACTION_GET_LINES'
export const SET_LINES = 'SET_LINES'
export const ACTION_ADD_LINES = 'ACTION_ADD_LINES'
export const ACTION_DELETE_LINES = 'ACTION_DELETE_LINES'
export const ACTION_EDIT_LINES = 'ACTION_EDIT_LINES'

const state = {
  LINE_DATAS: [],
}

const getters = {
  GET_LINES(state) {
    return state.LINE_DATA
  },
}

const mutations = {
  SET_LINES(state, payload) {
    state.LINE_DATA = payload
  },
}

const actions = {
  async ACTION_GET_LINES({ commit }, query) {
    try {
      const response = await axios.get(`${API_URL}/lines/get`, {
        params: query,
      })
      commit(SET_LINES, response.data.data.data)
      //   console.log(response.data.data.data)
    } catch (error) {
      console.error(error)
      return error
    }
  },

  async ACTION_ADD_LINES({ commit }, payload) {
    try {
      const response = await axios.post(`${API_URL}/lines/add`, payload)
      return response.status
    } catch (error) {
      console.error(error)
      return error
    }
  },
  async ACTION_DELETE_LINES({ commit }, payload) {
    try {
      const response = await axios.put(`${API_URL}/lines/delete/${payload}`)
      return response.status
    } catch (error) {
      console.error(error)
      return error
    }
  },
  async ACTION_EDIT_LINES({ commit }, { id, payload }) {
    try {
      const response = await axios.put(`${API_URL}/lines/edit/${id}`, payload)
      return response.status
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
