<template>
    <v-layout wrap row>
        <!-- Sessions -->
        <v-flex xs12 md9 lg10 pa-2>
            <v-toolbar color="green" dark dense>
                <v-toolbar-title>
                    <v-icon class="mr-2">event</v-icon>
                    <span class="subheading">Sessions</span>       
                </v-toolbar-title>
                <v-spacer></v-spacer>
            </v-toolbar>
            <v-card>
                <v-card-text class="pt-0" :class="gameLoaded ? '' : 'text-xs-center'">
                    <v-progress-circular indeterminate color="green" v-if="!gameLoaded" class="ma-4"/>
                    <v-data-table :items="game.details.sessions" :headers="sessionHeaders" :hide-actions="game.details.sessions.length <= defaultSessionsPerPage" class="borderless" name="table-session" :loading="!gameLoaded" v-if="gameLoaded"
                        no-results-text="no sessions">
                        <template v-slot:items="session">
                            <td class="text-xs-right">{{ session.item.date}}</td>
                            <td>{{ session.item.place}}</td>
                            <td></td>
                            <td></td>
                        </template>
                    </v-data-table>
                </v-card-text>
            </v-card>
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

export default {
    components: {
        GameInfo
    },
    data() {
        return {
            gameLoaded: false,
            sessionHeaders: [
                {
                    text: 'date',
                    align: 'right',
                    sortable: true
                },
                {
                    text: 'place',
                    align: 'left',
                    sortable: false
                },
                {
                    text: 'players',
                    align: 'left',
                    sortable: false
                },
                {
                    text: '',
                    align: 'right',
                    sortable: false,
                    name: 'icons'
                },
            ],
            defaultSessionsPerPage: '20'
        }
    },
    computed: {
        ...mapState(['login', 'groups', 'game']),
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
        this.$store.commit('game/clearGame');

        // get game details
        this.$store.dispatch('game/getGameDetails', {gameId: pathParts[3], groupId: pathParts[1]}).then(() => {
            this.gameLoaded = true;
        }).catch(() => {
            this.$store.commit('toaster/showError', 'Could not load game details');
        });

        // get BGG stats
        this.$store.dispatch('game/getBGGStats', pathParts[3]).then(() => {

        }).catch(() => {
            this.$store.commit('toaster/showError', 'Could not load BGG stats');
        });
    },
    methods: {

    }
}
</script>