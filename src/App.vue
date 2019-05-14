<template>
  <v-app id="inspire">
    <!-- Toolbar -->
    <v-toolbar color="green darken-2" dark fixed app dense>
      <v-toolbar-side-icon>
        <v-icon>videogame_asset</v-icon>
      </v-toolbar-side-icon>
      <v-toolbar-title>Game Tracker</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn flat>Select Team</v-btn>
        <v-btn flat @click.native.stop="login.dialogLogin=true">Login</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <!-- Login Dialog -->
    <LoginDialog/>
    <!-- Content -->
    <v-content>
      <v-container fluid fill-height>
        <v-layout justify-center align-center>
          <v-flex text-xs-center>
            <v-tooltip left>
              <v-btn icon large target="_blank" slot="activator">
                <v-icon large>code</v-icon>
              </v-btn>
              <span>Source</span>
            </v-tooltip>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>

</template>

<style lang="scss">
  @import 'assets/css/main.css';
</style>

<script>

import { mapState } from 'vuex';
import LoginDialog from '@/components/LoginDialog.vue';

export default {
  name: 'App',
  components: {
    LoginDialog
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapState(['login'])
  }
}
</script>
