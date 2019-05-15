<template>
    <v-dialog v-model="login.dialogLogin" width="500" @keydown.enter="loginWithPassword()">
      <v-card>
        <v-card-title class="headline green lighten-2" >
          Login to GameTracker
        </v-card-title>
        <!-- Login form -->
        <v-card-text>
          <v-form v-model="isValid">
            <v-text-field v-model="email" label="email address" :rules="emailRules" required></v-text-field>
            <v-text-field v-model="password" :rules="passwordRules" :append-icon="showPassword ? 'visibility' : 'visibility_off'" :type="showPassword ? 'text' : 'password'" @click:append="showPassword = !showPassword"></v-text-field>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <!-- Login button -->
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click="loginWithPassword()" :disabled="!isValid">
            Login
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
import { mapState } from 'vuex';
import { repositoryFactory } from '@/api/repositoryFactory';
const loginRepository = repositoryFactory.get('login');

export default {
    name: 'LoginDialog',
    data () {
        return {
            password: '',
            showPassword: false,
            email: '',
            isValid: false,
            emailRules: [
              v => !!v || 'E-mail is required',
              v => /.+@.+/.test(v) || 'E-mail must be valid'
            ],
            passwordRules: [
              v => !!v || 'Password is required',
            ]
        }
    },
    computed: {
      ...mapState(['login'])
    },
    methods: {
      // logging in with password
      loginWithPassword() {
        if (this.isValid) {
          loginRepository.loginWithPassword({
            email: this.email,
            password: this.password
          }).then((response) => {
            // successful login
            this.$store.commit('login/login', response.data);
            this.$store.commit('login/hideLoginDialog');
          }).catch(() => {
            // error handling
            this.$store.commit('toaster/showError', 'Unable to login');
          });        
        }
      }
    }
}
</script>