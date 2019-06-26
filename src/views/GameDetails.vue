<template>
    <v-layout wrap row>
        <v-flex xs12 md9 lg10 pa-2>
            <v-layout wrap row>
                <!-- Session Details/Editor -->
                <session-details-card/>
                <!-- Sessions List -->
                <sessions-card/>
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
import GameInfo from '@/components/game-details/GameInfo'
import SessionsCard from '@/components/game-details/SessionsCard'
import SessionDetailsCard from '@/components/game-details/SessionDetailsCard'

export default {
    components: {
        GameInfo, SessionsCard, SessionDetailsCard
    },
    data() {
        return {
            gameId: 0,
            groupId: 0
        }
    },
    computed: {
        ...mapState(['game']),
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
        }).catch(() => {
            this.$store.commit('toaster/showError', 'Could not load game details');
        });

        // get group details
        this.$store.dispatch('groups/getGroupDetails', {id: this.groupId}).catch(() => {
            this.$store.commit('toaster/showError', 'Could not load group details');
        })

        // get BGG stats
        this.$store.dispatch('game/getBGGStats', this.gameId).then(() => {
        }).catch(() => {
            this.$store.commit('toaster/showError', 'Could not load BGG stats');
        });
    },
    methods: {
    }
}
</script>