<template>
    <v-toolbar color="green darken-2" dark fixed app dense>
        <v-toolbar-side-icon>
            <v-icon>videogame_asset</v-icon>
        </v-toolbar-side-icon>
        <v-toolbar-title :class="groups.selectedGroup == null ? 'hidden-xs-only' : 'hidden-sm-and-down'">GameTracker</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
            <!-- Game -->
            <v-btn flat :to="`/group/${groups.selectedGroup.id}/${$store.getters['groups/urlGroupName']}`" 
                v-if="groups.selectedGroup != null && !game.details.name" name="button-select-group">
                <span class="hidden-xs-only">Select Game</span>
                <span class="hidden-sm-and-up">Games</span>
            </v-btn>
            <v-btn flat v-if="groups.selectedGroup != null && game.details.name">
                <v-avatar size="32" tile class="mr-2">
                    <img :src="game.details.thumbnail" name="image-game" class="toolbar-border"/>
                </v-avatar>
                <span class="hidden-xs-only text-none">{{ game.details.name}}</span>
            </v-btn>
            <!-- Group -->
            <v-btn flat to="/" exact v-if="groups.selectedGroup == null" name="button-select-group">
                <span class="hidden-xs-only">Select Group</span>
                <span class="hidden-sm-and-up">Groups</span>
            </v-btn>
            <v-menu offset-y bottom left v-if="groups.selectedGroup != null">
                <template v-slot:activator="{ on }">
                    <v-btn flat class="text-transform-none pr-0" v-on="on" name="group-name">
                        <!-- Group avatar in hexagon -->
                        <v-avatar size="32" tile>
                            <div class="hexagon hexagon-small">
                                <div class="hexagon-in1">
                                    <div class="hexagon-in2">
                                        <div style="height: 30px" class="green darken-4" v-if="!groups.selectedGroup.imageFile"> 
                                            <v-icon name="placeholder-group-toolbar" class="green darken-4">group</v-icon>
                                        </div>
                                        <img v-if="groups.selectedGroup.imageFile" :src="imageFolder+groups.selectedGroup.imageFile" 
                                            name="image-group-toolbar"/>
                                    </div>
                                </div>
                            </div>
                        </v-avatar>
                        <span class="hidden-xs-only">{{ groups.selectedGroup.name }}</span>
                    <v-icon>arrow_drop_down</v-icon>
                    </v-btn>
                </template>
                <v-list dense>
                    <v-list-tile name="menu-group-details" :to="`/group/${groups.selectedGroup.id}/${$store.getters['groups/urlGroupName']}`">
                        <v-icon class="pr-2">more</v-icon>
                        <v-list-tile-title>Group details</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile to="/" name="menu-group-select" @click="unselectGroup()">
                        <v-icon class="pr-2">group</v-icon>
                        <v-list-tile-title>Select another</v-list-tile-title>              
                    </v-list-tile>
                </v-list>
            </v-menu>
            <!-- User -->
            <v-btn flat @click.native.stop="showLoginDialog()" v-if="!login.userId" name="button-login">Login</v-btn>
            <v-menu offset-y bottom left v-if="login.userId">
                <template v-slot:activator="{ on }">
                    <v-btn flat class="text-transform-none pr-0" v-on="on" name="user-name">
                        <v-avatar color="green darken-4" size="32" class="mr-2">
                            <v-icon v-if="login.imageFile == null" name="placeholder-profile-toolbar">face</v-icon>
                            <img v-if="login.imageFile" :src="imageFolder+login.imageFile" name="image-profile-toolbar"
                                class="toolbar-border"/>
                        </v-avatar>
                        <span class="hidden-xs-only">{{ login.userName }}</span>
                    <v-icon>arrow_drop_down</v-icon>
                    </v-btn>
                </template>
                <v-list dense>
                    <v-list-tile name="menu-profile" :to="`/profile/${login.userId}/${$store.getters['login/urlUserName']}`">
                        <v-icon class="pr-2">settings</v-icon>
                        <v-list-tile-title>Profile</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile @click="logout()" name="menu-logout">
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
        ...mapState(['login', 'groups', 'game']),
        imageFolder:function() {
            return process.env.VUE_APP_BACKEND_IMG_URL;
        }
    },
    mounted() {
        // restore login from local storage
        if (localStorage.loginData != null) {
            this.$store.commit('login/login', JSON.parse(localStorage.loginData));
            this.$store.dispatch('login/ping');
        }        

        // set selected group
        // this.$route is not ready on the first loaded page, using window.location.href instead
        const path = window.location.href.substr(window.location.href.indexOf('/',10)); 
        const pathParts = path.split('/').filter((el) => { return el != ''});
        if (path == '/') {
            // delete selected group if landed on group selection page
            this.$store.commit('groups/unselectGroup');
        } else if (pathParts[0] == 'group' && pathParts.length < 4) {
            // if landed on group details page
            // do nothing, GroupDetails will set selected group
        } else if (localStorage.selectedGroup) {
            // restore selected group anywhere else, if it's set 
            this.$store.commit('groups/setSelectedGroupFromLocalStorage');
        }
    },
    methods: {
        logout: function() {
            this.$store.commit('login/logout');
            this.$store.dispatch('groups/getGroups');
        },
        showLoginDialog: function() {
            this.$store.commit('login/showLoginDialog');
        },
        unselectGroup: function() {
            this.$store.commit('groups/unselectGroup');
        }
    }
}

</script>