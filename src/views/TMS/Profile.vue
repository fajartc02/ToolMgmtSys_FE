<template>
  <div class="container-fluid">
    <div class="card profile-card">
      <div class="card-body">
        <div class="profile-header">
          <img :src="photo" alt="Profile Photo" class="profile-photo" />
        </div>
        <div class="profile-body">
          <h2 class="profile-name">{{ fullname }}</h2>
          <p class="profile-noreg">Noreg: {{ noreg }}</p>
        </div>
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
.container-fluid {
  display: flex;
  justify-content: center;
  align-items: center;
}

.profile-card {
  max-width: 400px;
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.profile-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
}

.profile-header {
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #bdf1ed, #2575fc);
  padding: 20px;
}

.profile-photo {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 5px solid #fff;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.profile-photo:hover {
  transform: scale(1.1);
}

.profile-body {
  text-align: center;
  padding: 20px;
}

.profile-name {
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.profile-noreg {
  font-size: 16px;
  color: #555;
  margin-bottom: 0;
}
</style>
