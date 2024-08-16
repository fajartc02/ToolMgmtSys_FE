const API_URL = process.env.VUE_APP_API_URL
import axios from 'axios'
import { SET_META } from './META.module'

export const GET_SCRAB_HISTORIES = 'GET_SCRAB_HISTORIES'
export const SET_SCRAB_HISTORIES = 'SET_SCRAB_HISTORIES'
export const ACTION_SCRAB_HISTORIES = 'ACTION_SCRAB_HISTORIES'

const state = {
  SCRAB_HISTORIES: [],
}

const getters = {
  GET_SCRAB_HISTORIES: (state) => state.SCRAB_HISTORIES,
}

const mutations = {
  SET_SCRAB_HISTORIES: (state, payload) => {
    state.SCRAB_HISTORIES = payload
  },
}

const actions = {
  async ACTION_SCRAB_HISTORIES({ commit }, query) {
    try {
      const response = await axios.get(`${API_URL}/scrab/get`, {
        params: query,
      })

      commit(SET_SCRAB_HISTORIES, response.data.data.data)
      console.log('set_scrab', response.data.data.data)

      commit(SET_META, response.data.data.meta)
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
