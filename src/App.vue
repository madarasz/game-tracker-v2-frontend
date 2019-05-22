<template>
    <v-app id="inspire">
        <!-- Toolbar -->
        <Toolbar/>
        <!-- Dialogs -->
        <LoginDialog/>
        <!-- Content -->
        <v-content>
            <v-container fluid fill-height>
                <router-view></router-view>
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
