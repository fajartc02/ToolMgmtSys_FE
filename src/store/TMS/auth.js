import axios from 'axios'
const API_URL = process.env.VUE_APP_API_URL

// Constants
export const SET_AUTH_TOKEN = 'SET_AUTH_TOKEN'
export const SET_USER = 'SET_USER'
export const ACTION_LOGIN = 'ACTION_LOGIN'
export const ACTION_LOGOUT = 'ACTION_LOGOUT'
export const ACTION_REGISTER = 'ACTION_REGISTER'

// State
const state = {
  authToken: localStorage.getItem('auth_token') || '',
  user: JSON.parse(localStorage.getItem('user')) || null, // Menyimpan data user
}

// Getters
const getters = {
  isAuthenticated(state) {
    return !!state.authToken
  },
  getUserLogin(state) {
    return state.user
  },
}

// Mutations
const mutations = {
  [SET_AUTH_TOKEN](state, token) {
    state.authToken = token
    if (token) {
      localStorage.setItem('auth_token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      localStorage.removeItem('auth_token')
      delete axios.defaults.headers.common['Authorization']
    }
  },
  [SET_USER](state, user) {
    state.user = user
    localStorage.setItem('user', JSON.stringify(user)) // Menyimpan user di localStorage
  },
  [ACTION_LOGOUT](state) {
    state.authToken = ''
    state.user = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user') // Menghapus data user dari localStorage
    delete axios.defaults.headers.common['Authorization']
  },
}

// Actions
const actions = {
  async ACTION_LOGIN({ commit }, { payload }) {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, payload)
      const { token, user } = response.data

      if (!token || !user) {
        throw new Error('Invalid API response: Missing token or user')
      }

      commit(SET_AUTH_TOKEN, token)
      commit(SET_USER, user) // Menyimpan data user ke state dan localStorage
      console.log('user', user)

      return response
    } catch (error) {
      console.error('Login error:', error)
      const message =
        error.response?.data?.message || 'Invalid username or password'
      return { status: error.response?.status || 500, message }
    }
  },

  async ACTION_REGISTER({ commit }, { formData }) {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response
    } catch (error) {
      console.error('Registration error:', error)
      const message = error.response?.data?.message || 'Registration failed'
      return { status: error.response?.status || 500, message }
    }
  },

  [ACTION_LOGOUT]({ commit }) {
    commit(ACTION_LOGOUT)
  },

  async validateToken({ state, dispatch }) {
    if (!state.authToken) return false

    try {
      await axios.get(`${API_URL}/auth/validate`, {
        headers: {
          Authorization: `Bearer ${state.authToken}`,
        },
      })
      return true
    } catch (error) {
      console.warn('Invalid or expired token:', error)
      dispatch(ACTION_LOGOUT)
      return false
    }
  },
}

// Module Export
export default {
  state,
  getters,
  mutations,
  actions,
}
