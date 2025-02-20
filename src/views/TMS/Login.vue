<template>
  <div v-if="showRegisterModal">
    <div class="modal" tabindex="-1" id="modalRegister">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <!-- Modal Header -->
            <h4>Masukkan Kata Sandi</h4>
            <button
              type="button"
              style="height: fit-content"
              class="btn-close"
              @click="showRegisterModal = false"
              aria-label="Close"
            ></button>
          </div>

          <!-- Modal Body -->
          <div class="modal-body">
            <div class="input-group">
              <input
                :type="tokenVisible ? 'text' : 'password'"
                v-model="registerToken"
                id="registerToken"
                class="form-control"
                placeholder="Secret Token"
              />
              <button
                type="button"
                @click="toggleTokenVisibility"
                class="toggle-password"
                aria-label="Toggle password visibility"
              >
                <i
                  :class="tokenVisible ? 'fas fa-eye-slash' : 'fas fa-eye'"
                ></i>
              </button>
            </div>
            <p v-if="registerError" class="text-danger mt-2">
              {{ registerError }}
            </p>
          </div>

          <!-- Modal Footer -->
          <div class="modal-footer">
            <button @click="submitRegisterToken" class="btn btn-primary">
              Submit
            </button>
            <button
              @click="showRegisterModal = false"
              class="btn btn-secondary"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="login-container">
    <div class="login-box">
      <h2>Login</h2>
      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <label for="username">Username:</label>
          <input
            type="text"
            v-model="username"
            id="username"
            placeholder="Username"
            required
          />
        </div>
        <div class="input-group password-container">
          <label for="password">Password:</label>
          <div class="input-group">
            <input
              :type="passwordVisible ? 'text' : 'password'"
              v-model="password"
              id="password"
              placeholder="Password"
              required
            />
            <button
              type="button"
              @click="togglePasswordVisibility"
              class="toggle-password"
            >
              <i
                :class="passwordVisible ? 'fas fa-eye-slash' : 'fas fa-eye'"
              ></i>
            </button>
          </div>
        </div>

        <button type="submit" class="login-button">Login</button>
        <p v-if="error" class="error">{{ error }}</p>
        <p v-if="success" class="success">{{ success }}</p>
      </form>

      <div class="register-link">
        <p>
          Belum punya akun?
          <a href="javascript:void(0)" @click="showRegisterModal = true">
            Daftar di sini
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ACTION_LOGIN } from '@/store/TMS/auth'

export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      error: '',
      success: '',
      passwordVisible: false,
      showRegisterModal: false,
      registerToken: '',
      tokenVisible: false,
      registerError: '',
    }
  },
  methods: {
    async handleLogin() {
      this.error = ''
      this.success = ''

      try {
        const payload = { username: this.username, password: this.password }
        let result = await this.$store.dispatch(ACTION_LOGIN, {
          payload,
        })
        if (result.status === 200) {
          this.success = 'Login berhasil!'

          setTimeout(() => {
            const redirectPath = localStorage.getItem('redirectAfterLogin')

            if (redirectPath) {
              localStorage.removeItem('redirectAfterLogin')
              this.$router.push(redirectPath)
            } else {
              this.$router.push('/tool/status')
            }
          }, 1000)
        } else if (result.status === 400) {
          this.error = 'Username atau password salah!'
        }
      } catch (err) {
        this.error = 'Username atau password salah!'
      }
    },
    togglePasswordVisibility() {
      this.passwordVisible = !this.passwordVisible
    },
    toggleTokenVisibility() {
      this.tokenVisible = !this.tokenVisible
    },
    submitRegisterToken() {
      const allowedToken = process.env.VUE_APP_ALLOWED_TOKEN
      if (this.registerToken === allowedToken) {
        this.$router.push({
          path: '/register',
          query: { access_token: allowedToken },
        })
      } else {
        this.registerError =
          'Token tidak valid! Anda tidak memiliki izin untuk mendaftar.'
      }
    },
  },
}
</script>
<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: rgba(0, 0, 0, 0.1);
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  text-align: center;
  border: 1px solid #ccc;
}
.modal-header {
  font-size: 1.5rem;
  background-color: white;
}
.modal-body {
  background-color: white;
}
.modal-footer {
  background-color: white;
}

.actions button {
  margin: 5px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.actions button:hover {
  background-color: #0056b3;
}
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;

  padding: 0 20px;
}
.login-box {
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

input {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.password-container {
  position: relative;
}

.input-wrapper {
  position: relative;
}

.input-wrapper input {
  width: 100%;
  padding-right: 40px; /* Spasi untuk ikon */
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

.toggle-password:hover {
  color: #007bff; /* Warna ikon saat hover */
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

.error {
  color: #e74c3c;
  text-align: center;
}

.success {
  color: #2ecc71;
  text-align: center;
}

.register-link {
  text-align: center;
  margin-top: 15px;
}

.register-link a {
  color: #007bff;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>
