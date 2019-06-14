<template>
    <v-layout wrap row>
        <v-flex xs12 md9 lg10>
        </v-flex>
        <v-flex xs12 md3 lg2>
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
        // load group details and set it as selected
        const pathParts = window.location.href.substr(window.location.href.indexOf('/',10))
            .split('/').filter((el) => { return el != ''});
        this.$store.commit('game/clearGame');
        this.$store.dispatch('game/getGameDetails', {gameId: pathParts[3], groupId: pathParts[1]});
        this.$store.dispatch('game/getBGGStats', pathParts[3]);
    },
    methods: {

    }
}
</script>