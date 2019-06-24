<template>
    <v-layout wrap row>
        <v-flex xs12 md9 lg10 pa-2>
            <v-layout wrap row>
                <!-- Session Details/Editor -->
                <session-details/>
                <!-- Sessions -->
                <v-flex xs12>
                    <v-toolbar color="green" dark dense>
                        <v-toolbar-title>
                            <v-icon class="mr-2">event</v-icon>
                            <span class="subheading">Sessions</span>       
                        </v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-btn icon dark flat @click="addSession()" name="button-add-session">
                            <v-icon>add</v-icon>
                        </v-btn>
                    </v-toolbar>
                    <!-- Session Table -->
                    <session-table :items="game.details.sessions" :loaded="gameLoaded"/>
                </v-flex>
            </v-layout>
        </v-flex>
        <!-- Game info -->
        <v-flex xs12 md3 lg2 pa-2>
            <v-card>
                <!-- For mobile -->
                <v-layout wrap row class="hidden-md-and-up">
                    <v-flex grow class="hidden-xs-only">
                        <v-layout fill-height>
                            <v-img :src="gameImage" max-height="280" position="left center"/>
                        </v-layout>
                    </v-flex>
                    <v-flex shrink>
                        <game-info/>
                    </v-flex>
                </v-layout>
                <!-- For desktop -->
                <div class="hidden-sm-and-down">
                    <v-img :src="gameImage"/>
                    <game-info/>
                </div>              
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
import { mapState } from 'vuex';
import GameInfo from '@/components/GameInfo'
import SessionTable from '@/components/SessionTable'
import SessionDetails from '@/components/SessionDetails'

export default {
    components: {
        GameInfo, SessionTable, SessionDetails
    },
    data() {
        return {
            gameLoaded: false,
            gameId: 0,
            groupId: 0
        }
    },
    computed: {
        ...mapState(['login', 'groups', 'game', 'session']),
        gameImage: function() {
            if (this.game.bggStats.image == null) {
                return this.game.details.thumbnail;
            }
            return this.game.bggStats.image;
        }
    },
    mounted() {
        const pathParts = window.location.href.substr(window.location.href.indexOf('/',10))
            .split('/').filter((el) => { return el != ''});
        this.gameId = pathParts[3];
        this.groupId = pathParts[1];
        this.$store.commit('game/clearGame');
        this.$store.commit('session/clearSession');

        // get game details
        this.$store.dispatch('game/getGameDetails', {gameId: this.gameId, groupId: this.groupId}).then(() => {
            this.gameLoaded = true;
        }).catch(() => {
            this.$store.commit('toaster/showError', 'Could not load game details');
        });

        // get BGG stats
        this.$store.dispatch('game/getBGGStats', this.gameId).then(() => {

        }).catch(() => {
            this.$store.commit('toaster/showError', 'Could not load BGG stats');
        });
    },
    methods: {
        addSession() {
            this.$store.commit('session/addSession', {gameId: this.gameId, groupId: this.groupId});
        }
    }
}
</script>