const API_URL = process.env.VUE_APP_API_URL

import axios from 'axios'

import { SET_META } from './META.module'

export const ACTION_GET_MASTER_TOOL_FC = 'ACTION_GET_MASTER_TOOL_FC'
export const SET_MASTER_TOOL_FC = 'SET_MASTER_TOOL_FC'
export const GET_MASTER_TOOL_FC = 'GET_MASTER_TOOL_FC'

export const ACTION_ADD_TOOL_FC = 'ACTION_ADD_TOOL_FC'

export const ACTION_EDIT_TOOL_FC = 'ACTION_EDIT_TOOL_FC'

export const ACTION_DELETE_TOOL_FC = 'ACTION_DELETE_TOOL_FC'

export const ACTION_ADD_STD_F_CHECK = 'ACTION_ADD_STD_F_CHECK'

export const ACTION_GET_STD_F_CHECK = 'ACTION_GET_STD_F_CHECK'
export const SET_STD_F_CHECK = 'SET_STD_F_CHECK'
export const GET_STD_F_CHECK = 'GET_STD_F_CHECK'

export const ACTION_DELETE_STD_F_CHECK = 'ACTION_DELETE_STD_F_CHECK'

const state = {
  MASTER_TOOL_FC_DATA: [],
  STD_F_CHECK_DATA: [],
}

const getters = {
  GET_MASTER_TOOL_FC(state) {
    return state.MASTER_TOOL_FC_DATA
  },
  GET_STD_F_CHECK(state) {
    return state.STD_F_CHECK_DATA
  },
}

const mutations = {
  SET_MASTER_TOOL_FC(state, payload) {
    state.MASTER_TOOL_FC_DATA = payload.map((tool) => {
      let lineNm = tool.line_nm
      if (lineNm === 'Cylinder Head') {
        lineNm = 'C/H'
      } else if (lineNm === 'Cylinder Block') {
        lineNm = 'C/B'
      } else if (lineNm === 'Crank Shaft') {
        lineNm = 'C/S'
      } else if (lineNm === 'Cam Shaft') {
        lineNm = 'CAM'
      }

      return {
        ...tool,
        line_nm: lineNm,
      }
    })
  },
  SET_STD_F_CHECK(state, payload) {
    state.STD_F_CHECK_DATA = payload
  },
}

const actions = {
  async ACTION_GET_MASTER_TOOL_FC({ commit }, query) {
    try {
      const response = await axios.get(`${API_URL}/master-tool/get`, {
        params: query,
      })
      commit(SET_MASTER_TOOL_FC, response.data.data.data)
      commit(SET_META, response.data.data.meta)
      return response.data.data.data
    } catch (error) {
      console.error(error)
      return { status: error.response ? error.response.status : 500 }
    }
  },
  async ACTION_ADD_TOOL_FC({ commit }, query) {
    try {
      const response = await axios.post(`${API_URL}/master-tool/add`, query)
      return response
    } catch (error) {
      console.error(error)
      return { status: error.response ? error.response.status : 500 }
    }
  },
  async ACTION_EDIT_TOOL_FC({ commit }, query) {
    try {
      const response = await axios.put(`${API_URL}/master-tool/edit`, query)
      return response
    } catch (error) {
      console.error(error)
      return { status: error.response ? error.response.status : 500 }
    }
  },
  async ACTION_DELETE_TOOL_FC({ commit }, query) {
    try {
      const response = await axios.delete(
        `${API_URL}/master-tool/delete/${query}`,
      )
      return response
    } catch (error) {
      console.error(error)
      return { status: error.response ? error.response.status : 500 }
    }
  },
  async ACTION_ADD_STD_F_CHECK({ commit }, payload) {
    try {
      const response = await axios.post(`${API_URL}/std-f-check/add`, payload)
      return response
    } catch (error) {
      console.error(error)
      return { status: error.response ? error.response.status : 500 }
    }
  },
  async ACTION_GET_STD_F_CHECK({ commit }, query) {
    try {
      const response = await axios.get(`${API_URL}/std-f-check/get`, {
        params: query,
      })
      commit(SET_STD_F_CHECK, response.data.data.data)
      return response
    } catch (error) {
      console.error(error)
      return { status: error.response ? error.response.status : 500 }
    }
  },
  async ACTION_DELETE_STD_F_CHECK({ commit }, query) {
    try {
      const response = await axios.delete(
        `${API_URL}/std-f-check/delete/${query}`,
      )
      return response
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
