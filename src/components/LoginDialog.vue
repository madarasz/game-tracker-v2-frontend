<template>
    <v-dialog v-model="login.dialogLogin" width="500">
      <v-card>
        <v-card-title class="headline green lighten-2" >
          Login to Game Tracker
        </v-card-title>
        <!-- Login form -->
        <v-card-text>
          <v-form>
            <v-text-field v-model="email" label="email address" :rules="emailRules" required></v-text-field>
            <v-text-field v-model="password" :append-icon="showPassword ? 'visibility' : 'visibility_off'" :type="showPassword ? 'text' : 'password'" @click:append="showPassword = !showPassword"></v-text-field>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <!-- Login button -->
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click="dialog = false">
            Login
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'LoginDialog',
    data () {
        return {
            password: '',
            showPassword: false,
            email: '',
            emailRules: [
                v => !!v || 'E-mail is required',
                v => /.+@.+/.test(v) || 'E-mail must be valid'
            ]
        }
    },
    computed: {
        ...mapState(['login'])
    } 
}
</script>