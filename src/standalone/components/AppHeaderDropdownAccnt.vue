<!-- <template>
  <CDropdown variant="nav-item">
    <CDropdownToggle placement="bottom-end" class="py-0" href="javascript:void(0);">
      {{userName}}&ensp;
      <img  v-if="photo" :src="photo" class="rounded-circle" style="width: 36px; height: 36px;">
      <CAvatar v-else="" color="danger " text-color="white">{{initial}}</CAvatar>
    </CDropdownToggle>
    <CDropdownMenu class="pt-0">
      <CDropdownHeader component="h6" class="fw-semibold py-2">
        Account
      </CDropdownHeader>
      <CDropdownItem href="/#/sc/profile"> <CIcon icon="cil-user" /> Profile </CDropdownItem>
      <CDropdownDivider />
      <CDropdownItem href="#" @click="logout()">
        <CIcon icon="cilAccountLogout" /> Logout
      </CDropdownItem>
    </CDropdownMenu>
  </CDropdown>
</template>

<script>
import avatar from '@/standalone/assets/images/avatars/8.jpg'
import api from "@/apis/CommonAPI"
export default {
  name: 'AppHeaderDropdownAccnt',
  data(){
    return {
      photo: null,
      initial:'AA',
      userName: 'User Name 1'
    }
  },
  async created(){
    // let dataUser = await api.scQueryApi('/api/common/user-info','POST' );
    // this.photo = dataUser.data.photo
    // this.initial = dataUser.data.firstName.toUpperCase().charAt(0);
    // this.initial += dataUser.data.lastName?dataUser.data.lastName.toUpperCase().charAt(0):'';
    // this.userName = dataUser.data.firstName+' '+dataUser.data.lastName;
    // // localstorage set
    // localStorage.setItem('userName', this.userName);
  },
  setup() {
    return {
      avatar: avatar,
      itemsCount: 42,
    }
  },
  methods:{
    logout(){      
      localStorage.id_token = '';
      window.location.href=process.env.VUE_APP_CONTAINER_URL+'/';
    }
  }
}
</script> -->
<template>
  <CDropdown variant="nav-item">
    <CDropdownToggle
      placement="bottom-end"
      class="py-0"
      href="javascript:void(0);"
    >
      {{ userName }}&ensp;
      <img
        v-if="photo"
        :src="photo"
        class="rounded-circle"
        style="width: 36px; height: 36px"
      />
      <CAvatar v-else="" color="danger" text-color="white">{{
        initial
      }}</CAvatar>
    </CDropdownToggle>
    <CDropdownMenu class="pt-0">
      <CDropdownHeader component="h6" class="fw-semibold py-2">
        Account
      </CDropdownHeader>
      <CDropdownItem href="/#/sc/profile">
        <CIcon icon="cil-user" /> Profile
      </CDropdownItem>
      <CDropdownDivider />
      <CDropdownItem href="#" @click="logout()">
        <CIcon icon="cilAccountLogout" /> Logout
      </CDropdownItem>
    </CDropdownMenu>
  </CDropdown>
</template>

<script>
import avatar from '@/standalone/assets/images/avatars/8.jpg'
import { mapGetters } from 'vuex'

export default {
  name: 'AppHeaderDropdownAccnt',
  data() {
    return {
      photo: null,
      initial: 'AA',
      userName: 'User Name 1',
    }
  },
  computed: {
    ...mapGetters(['getUserLogin']), // Menambahkan akses ke Vuex store getter
    userName() {
      return this.getUserLogin ? `${this.getUserLogin.username}` : 'Guest'
    },
    photo() {
      const API_URL = process.env.VUE_APP_API_URL // URL API dari environment
      return this.getUserLogin?.photo
        ? `${API_URL}/${this.getUserLogin.photo}`
        : null
    },
    initial() {
      if (this.getUserLogin) {
        const firstInitial = this.getUserLogin.username.charAt(0).toUpperCase()

        return firstInitial
      }
      return 'N/A' // Default initials if no user data
    },
  },
  methods: {
    logout() {
      this.$store.dispatch('ACTION_LOGOUT') // Log out via Vuex action
      window.location.href = '/tool/status'
    },
  },
}
</script>
