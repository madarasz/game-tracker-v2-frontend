<template>
    <v-toolbar color="green darken-2" dark fixed app dense>
        <v-toolbar-side-icon>
            <v-icon>videogame_asset</v-icon>
        </v-toolbar-side-icon>
        <v-toolbar-title>GameTracker</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
            <!-- Team -->
            <v-btn flat>Select Team</v-btn>
            <!-- User -->
            <v-btn flat @click.native.stop="showLoginDialog()" v-if="!login.userId">Login</v-btn>
            <v-menu offset-y bottom left v-if="login.userId">
            <template v-slot:activator="{ on }">
                <v-btn flat class="text-transform-none" v-on="on">
                {{ login.userName }}
                <v-icon>arrow_drop_down</v-icon>
                </v-btn>
            </template>
            <v-list dense>
                <v-list-tile @click="logout()">
                <v-icon class="pr-2">exit_to_app</v-icon>
                <v-list-tile-title>Logout</v-list-tile-title>              
                </v-list-tile>
            </v-list>
            </v-menu>
        </v-toolbar-items>
    </v-toolbar>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'Toolbar',
    computed: {
        ...mapState(['login'])
    },
    methods: {
        logout: function() {
        this.$store.commit('login/logout');
        },
        showLoginDialog: function() {
        this.$store.commit('login/showLoginDialog');
        }
    }
}

</script>