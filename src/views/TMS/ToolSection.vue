<template>
  <div class="container-fluid">
    <div class="card p-2 mb-2">
      <div class="d-flex justify-content-between align-items-center">
        <h4 class="text-center m-0">
          <select class="form-control form-select" v-model="location">
            <option v-for="item in optsLocation" :key="item" :value="item">
              {{ item }}
            </option>
          </select>
        </h4>

        <div class="input-group" style="width: 350px">
          <span class="input-group-text">Scan QR</span>
          <input
            id="qr-input"
            type="text"
            class="form-control"
            placeholder="Scan your tools"
            v-model="search.tool_qr"
          />
          <CButton
            v-if="!GET_FOCUS_INPUT"
            type="button"
            color="secondary"
            variant="outline"
            @click="actionFocusToggle(true)"
          >
            Scan
          </CButton>
          <CButton
            v-else-if="GET_FOCUS_INPUT && search.tool_qr != ''"
            type="button"
            color="secondary"
            variant="outline"
            @click="actionFocusToggle(false)"
          >
            <CIcon icon="cilX" />
          </CButton>
        </div>
      </div>
    </div>
    <CardToolStatus
      v-if="search.tool_qr != ''"
      :is_footer="true"
      :location="location"
    />
    <PleaseScanQRTools v-else />
  </div>
</template>
<script>
import PleaseScanQRTools from '@/components/TMS/PleaseScanQRTools.vue'
import CardToolStatus from '@/components/TMS/Cards/CardToolStatus.vue'

import { mapGetters } from 'vuex'
import {
  ACTION_FOCUS_INPUT,
  GET_FOCUS_INPUT,
} from '@/store/TMS/focusInput.module'
import { ACTION_TOOL_DETAILS } from '@/store/TMS/TOOLS.module'

export default {
  components: { PleaseScanQRTools, CardToolStatus },
  name: 'ToolRegrindingSection',
  data() {
    return {
      is_focus: true,
      search: {
        tool_qr: '',
      },
      location: 'Tool Regrinding',
      optsLocation: [
        'Tool Regrinding',
        'Clean Room',
        'Cam Shaft',
        'Crank Shaft',
        'Cylinder Head',
        'Cylinder Block',
      ],
    }
  },
  computed: {
    ...mapGetters([GET_FOCUS_INPUT]),
  },
  watch: {
    GET_FOCUS_INPUT() {
      console.log('GET_FOCUS_INPUT', this.GET_FOCUS_INPUT)
      this.focusToggle(this.GET_FOCUS_INPUT)
    },
    search: {
      handler() {
        if (this.search.tool_qr.length === 5)
          this.$store.dispatch(ACTION_TOOL_DETAILS, this.search)
        if (this.search.tool_qr.length >= 10) {
          this.search.tool_qr = this.search.tool_qr.slice(5, 11)
        }
      },
      deep: true,
    },
  },
  methods: {
    actionFocusToggle(state) {
      this.$store.dispatch(ACTION_FOCUS_INPUT, state)
    },
    focusToggle() {
      if (this.GET_FOCUS_INPUT) {
        document.getElementById('qr-input').onblur = function () {
          this.focus()
        }
        document.getElementById('qr-input').focus()
      } else {
        document.getElementById('qr-input').onblur = function () {}
        document.getElementById('qr-input').focus({ focusVisible: false })
      }
    },
  },
  mounted() {
    if (this.GET_FOCUS_INPUT) {
      document.getElementById('qr-input').onblur = function () {
        this.focus()
      }
      document.getElementById('qr-input').focus()
    } else {
      document.getElementById('qr-input').onblur = function () {}
      document.getElementById('qr-input').focus({ focusVisible: false })
    }
  },
}
</script>
<style></style>
