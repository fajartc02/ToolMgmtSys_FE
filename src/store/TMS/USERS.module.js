import axios from 'axios'
const API_URL = process.env.VUE_APP_API_URL
import { SET_META } from './META.module'

export const GET_USERS = 'GET_USERS'
export const GET_USERS_OPTS = 'GET_USERS_OPTS'
export const SET_USERS = 'SET_USERS'
export const ACTION_USERS = 'ACTION_USERS'
export const ACTION_USERS_OPTS = 'ACTION_USERS_OPTS'
export const SET_USERS_OPTS = 'SET_USERS_OPTS'
export const GET_USERS_TREESELECT = 'GET_USERS_TREESELECT'
export const ACTION_ADD_USERS = 'ACTION_ADD_USERS'
export const ACTION_EDIT_USERS = 'ACTION_EDIT_USERS'
export const ACTION_DELETE_USERS = 'ACTION_DELETE_USERS'
export const ACTION_USER_META = 'ACTION_USER_META'

const state = {
  USERS_DATA: [],
  DATA_USERS: [],
}

const getters = {
  GET_USERS(state) {
    return state.USERS_DATA
  },
  GET_USERS_OPTS(state) {
    return state.USERS_DATA.map((user) => {
      return {
        id: user.fullname,
        label: `${user.noreg}-${user.fullname}`,
      }
    })
  },

  GET_USERS_TREESELECT(state) {
    return state.DATA_USERS.map((user) => {
      return {
        id: user.fullname,
        label: `${user.noreg}-${user.fullname}`,
      }
    })
  },
}

const mutations = {
  SET_USERS(state, payload) {
    state.USERS_DATA = payload
  },
  SET_USERS_OPTS(state, payload) {
    state.DATA_USERS = payload
  },
}

const actions = {
  async ACTION_USERS({ commit }, query) {
    try {
      console.log('CALL ACTION USERS')
      const response = await axios.get(`${API_URL}/users/get`, {
        params: query,
      })
      commit(SET_USERS, response.data.data)
    } catch (error) {
      console.error(error)
      return error
    }
  },
  async ACTION_USERS_OPTS({ commit }, query) {
    try {
      const response = await axios.get(`${API_URL}/users/options/${query}`)
      commit(SET_USERS_OPTS, response.data.data)
      // console.log(response.data.data)
    } catch (error) {
      console.error(error)
      return { status: error.response ? error.response.status : 500 }
    }
  },
  async ACTION_USER_META({ commit }, query) {
    try {
      const response = await axios.get(`${API_URL}/users/meta`, {
        params: query,
      })
      commit(SET_USERS, response.data.data.data)
      commit(SET_META, response.data.data.meta)
      console.log(response.data.data)
    } catch (error) {
      console.error(error)
      return { status: error.response ? error.response.status : 500 }
    }
  },

  async ACTION_DELETE_USERS({ commit }, id) {
    try {
      const response = await axios.put(`${API_URL}/users/delete/${id}`)
      return response.status
    } catch (error) {
      console.error(error)
      return { status: error.response ? error.response.status : 500 }
    }
  },

  async ACTION_ADD_USERS({ commit }, payload) {
    try {
      const response = await axios.post(`${API_URL}/users/add`, payload)
      return response.status
    } catch (error) {
      console.error(error)
      return { status: error.response ? error.response.status : 500 }
    }
  },

  async ACTION_EDIT_USERS({ commit }, { id, payload }) {
    try {
      const response = await axios.put(`${API_URL}/users/edit/${id}`, payload)
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
