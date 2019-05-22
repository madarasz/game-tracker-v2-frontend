<template>
    <v-toolbar color="green darken-2" dark fixed app dense>
        <v-toolbar-side-icon>
            <v-icon>videogame_asset</v-icon>
        </v-toolbar-side-icon>
        <v-toolbar-title>GameTracker</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
            <!-- Team -->
            <v-btn flat to="/" exact>
                    Select Group
            </v-btn>
            <!-- User -->
            <v-btn flat @click.native.stop="showLoginDialog()" v-if="!login.userId" name="button-login">Login</v-btn>
            <v-menu offset-y bottom left v-if="login.userId">
                <template v-slot:activator="{ on }">
                    <v-btn flat class="text-transform-none" v-on="on" name="user-name">
                        <v-avatar color="green darken-4" size="32" class="mr-2">
                            <v-icon>person</v-icon>
                        </v-avatar>
                        {{ login.userName }}
                    <v-icon>arrow_drop_down</v-icon>
                    </v-btn>
                </template>
            <v-list dense>
                <v-list-tile name="button-user-settings" :to="`/profile/${login.userId}/${$store.getters['login/urlUserName']}`">
                    <v-icon class="pr-2">settings</v-icon>
                    <v-list-tile-title>Profile</v-list-tile-title>
                </v-list-tile>
                <v-list-tile @click="logout()" name="button-logout">
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
            this.$store.dispatch('groups/getGroups');
        },
        showLoginDialog: function() {
            this.$store.commit('login/showLoginDialog');
        }
    }
}

</script>