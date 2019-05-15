<template>
  <v-app id="inspire">
    <!-- Toolbar -->
    <Toolbar/>
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
    <!-- Toaster -->
    <Toaster/>
  </v-app>
</template>

<style lang="scss">
  @import 'assets/css/main.css';
</style>

<script>
import LoginDialog from '@/components/LoginDialog.vue';
import Toaster from '@/components/Toaster.vue';
import Toolbar from '@/components/Toolbar.vue';

export default {
  name: 'App',
  components: {
    LoginDialog, Toaster, Toolbar
  }
}
</script>
