<template>
  <div class="register-container">
    <div class="register-box">
      <h2>Register</h2>
      <form @submit.prevent="handleRegister">
        <div class="input-group">
          <label for="username">Username</label>
          <input
            class="form-control"
            type="text"
            v-model="username"
            id="username"
            placeholder="Username"
            required
          />
        </div>
        <div class="input-group">
          <label for="name">Full Name</label>
          <input
            class="form-control"
            type="text"
            v-model="name"
            id="name"
            placeholder="Full Name"
            required
          />
        </div>
        <div class="input-group">
          <input @change="onFileChange" class="form-control" type="file" />
        </div>
        <div class="input-group">
          <label for="noreg">No Register</label>
          <input
            class="form-control"
            type="number"
            v-model="noreg"
            id="noreg"
            placeholder="No Register"
            required
          />
        </div>
        <div class="input-group">
          <label for="role">Role</label>
          <select class="form-control" v-model="role" id="role" required>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div class="input-group">
          <label for="password">Password:</label>
          <div class="input-group">
            <input
              class="form-control"
              :type="passwordVisible ? 'text' : 'password'"
              v-model="password"
              id="password"
              placeholder="Password"
              :class="{ 'input-error': passwordError }"
              required
            />
            <button
              type="button"
              @click="togglePasswordVisibility('password')"
              class="toggle-password"
            >
              <i
                :class="passwordVisible ? 'fas fa-eye-slash' : 'fas fa-eye'"
              ></i>
            </button>
          </div>
          <p v-if="passwordError" class="error-message">
            Password dan konfirmasi password tidak cocok
          </p>
        </div>
        <div class="input-group">
          <label for="confirm-password">Confirm Password:</label>
          <div class="input-group">
            <input
              class="form-control"
              :type="confirmPasswordVisible ? 'text' : 'password'"
              v-model="confirmPassword"
              id="confirm-password"
              placeholder="Confirm Password"
              :class="{ 'input-error': passwordError }"
              required
            />
            <button
              type="button"
              @click="togglePasswordVisibility('confirmPassword')"
              class="toggle-password"
            >
              <i
                :class="
                  confirmPasswordVisible ? 'fas fa-eye-slash' : 'fas fa-eye'
                "
              ></i>
            </button>
          </div>
        </div>
        <button type="submit" class="register-button" :disabled="passwordError">
          Register
        </button>
        <p v-if="error" class="error">{{ error }}</p>
        <p v-if="success" class="success">{{ success }}</p>
      </form>

      <div class="login-link">
        <p>
          Sudah punya akun?
          <router-link to="/sc/login">Login di sini</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ACTION_REGISTER } from '@/store/TMS/auth'

export default {
  name: 'Register',
  data() {
    return {
      username: '',
      name: '',
      noreg: '',
      role: 'user', // Default role adalah user
      password: '',
      confirmPassword: '',
      error: '',
      success: '',
      selectedFile: null,
      passwordVisible: false,
      confirmPasswordVisible: false,
    }
  },
  computed: {
    // Cek apakah password dan konfirmasi password cocok
    passwordError() {
      return (
        this.password &&
        this.confirmPassword &&
        this.password !== this.confirmPassword
      )
    },
  },
  methods: {
    togglePasswordVisibility(type) {
      if (type === 'password') {
        this.passwordVisible = !this.passwordVisible
      } else if (type === 'confirmPassword') {
        this.confirmPasswordVisible = !this.confirmPasswordVisible
      }
    },
    onFileChange(event) {
      const file = event.target.files[0]
      const maxSize = 500 * 1024 // 500 KB

      if (!file || !file.type.startsWith('image/')) {
        alert('Pilih file gambar yang valid.')
        return
      }

      if (file.size > maxSize) {
        alert('Ukuran file terlalu besar. Maksimal 500 KB.')
        return
      }

      // Menyimpan file yang dipilih
      this.selectedFile = file

      // Jika perlu, set previewUrl untuk menampilkan gambar
      const reader = new FileReader()
      reader.readAsDataURL(file)
    },
    async handleRegister() {
      if (this.password !== this.confirmPassword) {
        this.error = 'Password dan konfirmasi password tidak cocok.'
        return
      }
      this.error = ''
      this.success = ''

      try {
        const formData = new FormData()
        formData.append('username', this.username)
        formData.append('fullname', this.name)
        formData.append('noreg', this.noreg)
        formData.append('role', this.role)
        formData.append('password', this.password)

        if (this.selectedFile) {
          formData.append('ilustrations', this.selectedFile)
        }
        // Call the ACTION_REGISTER from Vuex store
        let result = await this.$store.dispatch(ACTION_REGISTER, {
          formData,
        })
        if (result.status === 201) {
          this.success = 'Registrasi berhasil!'

          setTimeout(() => {
            this.$router.push('/sc/login') // Redirect to login page after successful registration
          }, 1000) // Wait 1 second before redirect
        } else if (result.status === 400) {
          this.error = 'Data sudah terdaftar.'
        }
      } catch (err) {
        this.error = 'Registrasi gagal. Silakan coba lagi.'
      }
    },
    resetForm() {
      this.username = ''
      this.name = ''
      this.noreg = ''
      this.role = 'user'
      this.password = ''
      this.confirmPassword = ''
      this.error = ''
      this.success = ''
      this.selectedFile = null
    },
  },
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
  padding: 0 20px;
}

.register-box {
  background: rgba(255, 255, 255, 0.9);
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h2 {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 20px;
}

.input-group {
  margin-bottom: 15px;
}

input,
select {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
}

button[type='submit'] {
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button[type='submit']:hover {
  background-color: #0056b3;
}

button[type='submit']:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

input.input-error {
  border-color: #e74c3c !important;
  background-color: #f8d7da !important;
}

.error-message {
  color: #e74c3c;
  font-size: 0.875rem;
  margin-top: 5px;
}

.error {
  color: #e74c3c;
  text-align: center;
}

.success {
  color: #2ecc71;
  text-align: center;
}

.login-link {
  text-align: center;
  margin-top: 15px;
}

.login-link a {
  color: #007bff;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}
/* Agar label dan input terstruktur dengan rapi */
.input-group {
  margin-bottom: 15px;
}

/* Menyusun input dan select agar terlihat seragam */
input.form-control,
select.form-control {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
}
.toggle-password {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px; /* Sesuaikan ukuran ikon */
  color: #555; /* Warna ikon */
}
</style>
