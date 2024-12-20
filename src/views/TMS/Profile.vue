<template>
  <div class="profile-container">
    <div class="profile-card">
      <div class="profile-header">
        <img :src="photo" alt="Profile Photo" class="profile-photo" />
      </div>
      <div class="profile-body">
        <h2 class="profile-name">{{ fullname }}</h2>
        <p class="profile-noreg">Noreg: {{ noreg }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'UserProfile',
  computed: {
    ...mapGetters(['getUserLogin']),
    photo() {
      const API_URL = process.env.VUE_APP_API_URL
      return this.getUserLogin && this.getUserLogin.photo
        ? `${API_URL}/${this.getUserLogin.photo}`
        : require('@/assets/images/luffy.jpg')
    },
    fullname() {
      return this.getUserLogin ? this.getUserLogin.fullname : 'Guest'
    },
    noreg() {
      return this.getUserLogin ? this.getUserLogin.noreg : '-'
    },
  },
}
</script>

<style scoped>
.profile-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f4f4f9;
  margin: 0;
}

.profile-card {
  background: #ffffff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
  text-align: center;
  width: 320px;
}

.profile-header {
  background: linear-gradient(to right, #6a11cb, #2575fc);
  padding: 20px;
}

.profile-photo {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 4px solid #ffffff;
}

.profile-body {
  padding: 20px;
}

.profile-name {
  font-size: 24px;
  font-weight: bold;
  margin: 10px 0;
  color: #333;
}

.profile-noreg {
  font-size: 16px;
  color: #777;
}
</style>
