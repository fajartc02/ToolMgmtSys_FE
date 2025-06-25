import axios from 'axios'

import { SET_META } from './META.module'

const API_URL = process.env.VUE_APP_API_URL

export const ACTION_GET_TOOLS_BY_LOCATION_FOR_FIRST_CHECK =
  'ACTION_GET_TOOLS_BY_LOCATION_FOR_FIRST_CHECK'
export const SET_GET_TOOLS_BY_LOCATION_FOR_FIRST_CHECK =
  'SET_GET_TOOLS_BY_LOCATION_FOR_FIRST_CHECK'
export const GET_TOOLS_BY_LOCATION_FOR_FIRST_CHECK =
  'GET_TOOLS_BY_LOCATION_FOR_FIRST_CHECK'

export const ACTION_GET_STD_TOOL_F_CHECK = 'ACTION_GET_STD_TOOL_F_CHECK'
export const SET_STD_Tool_F_CHECK = 'SET_STD_Tool_F_CHECK'
export const GET_STD_TOOL_F_CHECK = 'GET_STD_TOOL_F_CHECK'

export const ACTION_ADD_H_TOOL_F_CHECK = 'ACTION_ADD_H_TOOL_F_CHECK'

export const ACTION_GET_HISTORY_FIRST_CHECK = 'ACTION_GET_HISTORY_FIRST_CHECK'
export const SET_HISTORY_TOOL_F_CHECK = 'SET_HISTORY_TOOL_F_CHECK'
export const GET_HISTORY_TOOL_F_CHECK = 'GET_HISTORY_TOOL_F_CHECK'

export const ACTION_GET_MACHINES_FOR_TOOL_CHANGE =
  'ACTION_GET_MACHINES_FOR_TOOL_CHANGE'
export const SET_MACHINES_FOR_TOOL_CHANGE = 'SET_MACHINES_FOR_TOOL_CHANGE'
export const GET_MACHINES_FOR_TOOL_CHANGE = 'GET_MACHINES_FOR_TOOL_CHANGE'

export const ACTION_GET_TOOLS_NO_FOR_TOOL_CHANGE =
  'ACTION_GET_TOOLS_NO_FOR_TOOL_CHANGE'
export const SET_TOOLS_NO_FOR_TOOL_CHANGE = 'SET_TOOLS_NO_FOR_TOOL_CHANGE'
export const GET_TOOLS_NO_FOR_TOOL_CHANGE = 'GET_TOOLS_NO_FOR_TOOL_CHANGE'

export const ACTION_ADD_HISTORY_TOOL_NO_QR = 'ACTION_ADD_HISTORY_TOOL_NO_QR'

export const ACTION_GET_TOOL_HYSTORY_BY_QR = 'ACTION_GET_TOOL_HYSTORY_BY_QR'

export const ACTION_UPDATE_MACHINE_FOR_TOOL_CHANGE =
  'ACTION_UPDATE_MACHINE_FOR_TOOL_CHANGE'

export const ACTION_GET_TOOL_NO = 'ACTION_GET_TOOL_NO'
export const GET_TOOL_NO = 'GET_TOOL_NO'
export const SET_TOOL_NO = 'SET_TOOL_NO'

export const ACTION_GET_TOOL_USED_BY_LOCATION =
  'ACTION_GET_TOOL_USED_BY_LOCATION'
export const GET_TOOL_USED_BY_LOCATION = 'GET_TOOL_USED_BY_LOCATION'
export const SET_TOOL_USED_BY_LOCATION = 'SET_TOOL_USED_BY_LOCATION'

const state = {
  TOOLS_BY_LOCATION_FOR_FIRST_CHECK: [],
  STD_TOOL_F_CHECK: [],
  HISTORY_TOOL_F_CHECK: [],
  MACHINES_FOR_TOOL_CHANGE: [],
  TOOLS_NO_FOR_TOOL_CHANGE: [],
  DATA_TOOLS_NO: [],
  TOOLS_USED_BY_LOCATION: [],
}

const getters = {
  GET_TOOLS_BY_LOCATION_FOR_FIRST_CHECK(state) {
    return state.TOOLS_BY_LOCATION_FOR_FIRST_CHECK
  },
  GET_STD_TOOL_F_CHECK(state) {
    return state.STD_TOOL_F_CHECK
  },
  GET_HISTORY_TOOL_F_CHECK(state) {
    return state.HISTORY_TOOL_F_CHECK
  },
  GET_MACHINES_FOR_TOOL_CHANGE(state) {
    return state.MACHINES_FOR_TOOL_CHANGE
  },
  GET_TOOLS_NO_FOR_TOOL_CHANGE(state) {
    return state.TOOLS_NO_FOR_TOOL_CHANGE
  },
  GET_TOOL_NO(state) {
    return state.DATA_TOOLS_NO
  },
  GET_TOOL_USED_BY_LOCATION(state) {
    return state.TOOLS_USED_BY_LOCATION
  },
}

const mutations = {
  SET_GET_TOOLS_BY_LOCATION_FOR_FIRST_CHECK(state, payload) {
    state.TOOLS_BY_LOCATION_FOR_FIRST_CHECK = payload
  },
  SET_STD_Tool_F_CHECK(state, payload) {
    state.STD_TOOL_F_CHECK = payload
  },
  SET_HISTORY_TOOL_F_CHECK(state, payload) {
    state.HISTORY_TOOL_F_CHECK = payload
  },
  SET_MACHINES_FOR_TOOL_CHANGE(state, payload) {
    // console.log('Payload before sorting:', payload)

    state.MACHINES_FOR_TOOL_CHANGE = payload
      .filter((machine) => typeof machine.machine_nm === 'string') // Filter data yang valid
      .sort((a, b) => {
        const regex = /^([a-zA-Z]+)-?(\d+)?$/
        const [_, prefixA, numberA] = a.machine_nm.match(regex) || []
        const [__, prefixB, numberB] = b.machine_nm.match(regex) || []

        // Bandingkan berdasarkan prefix (huruf)
        if (prefixA < prefixB) return -1
        if (prefixA > prefixB) return 1

        // Jika prefix sama, bandingkan berdasarkan angka
        const numA = numberA ? parseInt(numberA, 10) : 0
        const numB = numberB ? parseInt(numberB, 10) : 0

        return numA - numB
      })
  },

  SET_TOOLS_NO_FOR_TOOL_CHANGE(state, payload) {
    state.TOOLS_NO_FOR_TOOL_CHANGE = payload
  },
  SET_TOOL_NO(state, payload) {
    state.DATA_TOOLS_NO = payload
  },
  SET_TOOL_USED_BY_LOCATION(state, payload) {
    state.TOOLS_USED_BY_LOCATION = payload
  },
}

const actions = {
  async ACTION_GET_TOOLS_BY_LOCATION_FOR_FIRST_CHECK({ commit }, query) {
    try {
      const response = await axios.get(`${API_URL}/tools-by-location/get`, {
        params: {
          location: query.location,
          meta: query.meta,
          tool_qr: query.tool_qr,
          machine_id: query.machine_id,
        },
      })
      commit(SET_GET_TOOLS_BY_LOCATION_FOR_FIRST_CHECK, response.data.data.data)

      commit(SET_META, response.data.data.meta)

      return response
    } catch (error) {
      console.error('Error fetching tools:', error)
    }
  },
  async ACTION_GET_TOOL_USED_BY_LOCATION({ commit }, query) {
    try {
      const response = await axios.get(
        `${API_URL}/tools-by-location/get-tool-used-by-location`,
        {
          params: {
            location: query.location,
            meta: query.meta,
            tool_qr: query.tool_qr,
            machine_id: query.machine_id,
          },
        },
      )
      commit(SET_TOOL_USED_BY_LOCATION, response.data.data.data)
      commit(SET_META, response.data.data.meta)
      return response
    } catch (error) {
      console.error(error)
      return { status: error.response ? error.response.status : 500 }
    }
  },
  async ACTION_GET_STD_TOOL_F_CHECK({ commit }, query) {
    try {
      const response = await axios.get(`${API_URL}/tools-by-location/std`, {
        params: query,
      })
      commit(SET_STD_Tool_F_CHECK, response.data.data)
      return response
    } catch (error) {
      console.error(error)
      return { status: error.response ? error.response.status : 500 }
    }
  },
  async ACTION_ADD_H_TOOL_F_CHECK({ commit }, payload) {
    try {
      const response = await axios.post(
        `${API_URL}/tools-by-location/add`,
        payload,
      )
      return response
    } catch (error) {
      console.error(error)
      return { status: error.response ? error.response.status : 500 }
    }
  },
  async ACTION_GET_HISTORY_FIRST_CHECK({ commit }, query) {
    try {
      const response = await axios.get(`${API_URL}/tools-by-location/history`, {
        params: query,
      })
      commit(SET_HISTORY_TOOL_F_CHECK, response.data.data)
      return response
    } catch (error) {
      console.error(error)
      return { status: error.response ? error.response.status : 500 }
    }
  },
  async ACTION_GET_MACHINES_FOR_TOOL_CHANGE({ commit }, query) {
    try {
      const response = await axios.get(
        `${API_URL}/tools-by-location/search-machines`,
        {
          params: {
            location: query.location,
          },
        },
      )
      commit(SET_MACHINES_FOR_TOOL_CHANGE, response.data.data)
      return response
    } catch (error) {
      console.error(error)
      return { status: error.response ? error.response.status : 500 }
    }
  },
  async ACTION_GET_TOOLS_NO_FOR_TOOL_CHANGE({ commit }, query) {
    try {
      const response = await axios.get(
        `${API_URL}/tools-by-location/search-tools-no`,
        {
          params: {
            location: query.location,
            op_no: query.op_no,
          },
        },
      )
      commit(SET_TOOLS_NO_FOR_TOOL_CHANGE, response.data.data)
      return response
    } catch (error) {
      console.error(error)
      return { status: error.response ? error.response.status : 500 }
    }
  },
  async ACTION_ADD_HISTORY_TOOL_NO_QR({ commit }, query) {
    try {
      const response = await axios.post(
        `${API_URL}/tools-by-location/history-tool-no-qr`,
        query,
      )
      return response
    } catch (error) {
      console.error(error)
      return { status: error.response ? error.response.status : 500 }
    }
  },
  async ACTION_GET_TOOL_HYSTORY_BY_QR({ commit }, query) {
    try {
      const response = await axios.get(
        `${API_URL}/tools-by-location/get-tool-history-by-qr`,
        {
          params: query,
        },
      )
      commit(SET_GET_TOOLS_BY_LOCATION_FOR_FIRST_CHECK, response.data.data)
      return response
    } catch (error) {
      console.error(error)
      return { status: error.response ? error.response.status : 500 }
    }
  },

  async ACTION_UPDATE_MACHINE_FOR_TOOL_CHANGE({ commit }, query) {
    try {
      const response = await axios.put(
        `${API_URL}/tools-by-location/edit-machine`,
        query,
      )
      return response
    } catch (error) {
      console.error(error)
    }
  },
  async ACTION_GET_TOOL_NO({ commit }, query) {
    try {
      const response = await axios.get(
        `${API_URL}/tools-by-location/get-tool-no`,
        {
          params: query,
        },
      )
      commit(SET_TOOL_NO, response.data.data)
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
