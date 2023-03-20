<template>
 <div class="login-page">
    <div class="login-form">
      <div class="logo">
        <q-img src="icons/logo.png"/>
      </div>
      <q-form @submit="login">
        <q-input
          class="text-primary"
          v-model="username"
          label="Usuario"
          required
          outlined
          :rules="[val => !!val || 'Este campo es requerido']"
        />
        <q-input
          v-model="password"
          label="Contraseña"
          type="password"
          required
          outlined
          :rules="[val => !!val || 'Este campo es requerido']"
        />
        <q-btn
          type="submit"
          label="Iniciar sesión"
          class="login-btn"
          color="primary"
          :loading="btnDisable"
        />
      </q-form>
      <div class="links">
        <a href="#">¿Olvidaste tu contraseña?</a>
        <a href="#">Crear cuenta</a>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  data () {
    return {
      /**
       * Email User
       * @type {String}
       */
      username: '',
      /**
       * Password User
       * @type {String}
       */
      password: '',
      /**
       * Status button
       * @type{Boolean}
       */
      btnDisable: false
    }
  },
  methods: {
    /**
     * Set router
     * @param {Array} roles roles user
     */
    setRouter (roles) {
      const modules = []
      roles.forEach(role => {
        role.modules.forEach(module => {
          modules.push(module)
        })
      })
      const moduleFind = modules[0]
      this.$router.push({ name: moduleFind.route })
    },
    /**
     * Save local storage
     * @param {Object} data data user
     */
    setDataSessionStorage (data) {
      localStorage.setItem('accessToken', data.access_token)
      localStorage.setItem('refreshToken', data.refresh_token)
      localStorage.setItem('tokenType', data.token_type)
      localStorage.setItem('expiresIn', data.expires_in)
      localStorage.setItem('user', JSON.stringify(data.user))
    },
    /**
     * Login app
     */
    async login () {
      this.btnDisable = true
      this.$api.post('authentication/login', {
        username: this.username,
        password: this.password
      })
        .then(({ data }) => {
          this.setDataSessionStorage(data)
          this.$router.push({ name: 'Biller' })
          this.btnDisable = false
        })
        .catch((error) => {
          this.btnDisable = false
          this.$q.notify({
            message: error.message,
            color: 'negative'
          })
        })
    }
  }
})
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: radial-gradient(
    farthest-corner at 40px 40px,
    #26A69A 0%,
    #1976D2 100%
  );
  padding: 5px;
}

.login-form {
  max-width: 400px;
  width: 100%;
  padding: 20px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 1);
  text-align: center;
}

.login-btn {
  width: 100%;
}

.links {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.links a {
  color: gray;
}
</style>
