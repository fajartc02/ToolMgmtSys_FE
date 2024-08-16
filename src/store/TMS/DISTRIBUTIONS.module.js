import axios from 'axios'
const API_URL = process.env.VUE_APP_API_URL

export const GET_DISTRIBUTIONS = 'GET_DISTRIBUTIONS'
export const GET_DISTRIBUTIONS_OPTS = 'GET_DISTRIBUTIONS_OPTS'
export const SET_DISTRIBUTIONS = 'SET_DISTRIBUTIONS'
export const ACTION_DISTRIBUTIONS = 'ACTION_DISTRIBUTIONS'
export const ACTION_ADD_DISTRIBUTION = 'ACTION_ADD_DISTRIBUTION'
export const ACTION_EDIT_DISTRIBUTION = 'ACTION_EDIT_DISTRIBUTION'
export const ACTION_DELETE_DISTRIBUTION = 'ACTION_DELETE_DISTRIBUTION'
import moment from 'moment'

const state = {
  DISTRIBUTIONS_DATA: true,
}

const getters = {
  GET_DISTRIBUTIONS(state) {
    return state.DISTRIBUTIONS_DATA
  },
  GET_DISTRIBUTIONS_OPTS(state) {
    return state.DISTRIBUTIONS_DATA.map((distribution) => {
      return {
        id: distribution.distribution_id,
        label: distribution.distribution_nm,
      }
    })
  },
}

const mutations = {
  SET_DISTRIBUTIONS(state, payload) {
    state.DISTRIBUTIONS_DATA = payload.map((distribution) => {
      return {
        ...distribution,
        created_dt: moment(distribution.created_dt).format('DD-MM-YYYY'),
      }
    })
  },
}

const actions = {
  async ACTION_DISTRIBUTIONS({ commit }, query) {
    try {
      const response = await axios.get(`${API_URL}/distributions/get`, {
        params: query,
      })
      commit(SET_DISTRIBUTIONS, response.data.data)
    } catch (error) {
      console.error(error)
      return error
    }
  },
  async ACTION_ADD_DISTRIBUTION({ commit }, query) {
    try {
      const response = await axios.post(`${API_URL}/distributions/add`, query)
      return response.status
    } catch (error) {
      console.error(error)
      return { status: error.response ? error.response.status : 500 }
    }
  },
  async ACTION_EDIT_DISTRIBUTION({ commit }, { id, payload }) {
    try {
      const response = await axios.put(
        `${API_URL}/distributions/edit/${id}`,
        payload,
      )
      return response.status
    } catch (error) {
      console.error(error)
      return { status: error.response ? error.response.status : 500 }
    }
  },
  async ACTION_DELETE_DISTRIBUTION({ commit }, id) {
    try {
      const response = await axios.put(`${API_URL}/distributions/delete/${id}`)
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
