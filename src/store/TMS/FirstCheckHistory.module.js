const API_URL = process.env.VUE_APP_API_URL

import axios from 'axios'

import { SET_META } from './META.module'

export const ACTION_GET_GRAPH_FIRST_CHECK_HISTORY =
  'ACTION_GET_GRAPH_FIRST_CHECK_HISTORY'
export const SET_HISTORY_GRAPH_FIRST_CHECK = 'SET_HISTORY_GRAPH_FIRST_CHECK'
export const GET_HISTORY_GRAPH_FIRST_CHECK = 'GET_HISTORY_GRAPH_FIRST_CHECK'

const state = {
  HISTORY_FIRST_CHECK: [],
}

const getters = {
  GET_HISTORY_GRAPH_FIRST_CHECK(state) {
    return state.HISTORY_GRAPH_FIRST_CHECK
  },
}

const mutations = {
  SET_HISTORY_GRAPH_FIRST_CHECK(state, payload) {
    state.HISTORY_GRAPH_FIRST_CHECK = payload
  },
}

const actions = {
  async ACTION_GET_GRAPH_FIRST_CHECK_HISTORY({ commit }, payload) {
    const response = await axios.get(
      `${API_URL}/first-check-history/get/${payload}`,
    )
    commit(SET_HISTORY_GRAPH_FIRST_CHECK, response.data.data)
    return response
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
}
