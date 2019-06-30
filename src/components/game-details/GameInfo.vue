
<template>
    <div class="pt-2">
        <v-card-title primary-title class="pt-2" name="card-game-details">
            <v-layout row wrap>
                <v-flex xs4 sm12 class="pr-2">
                    <v-img :src="game.details.thumbnail" class="hidden-sm-and-up"/>
                </v-flex>
                <v-flex xs8 sm12>
                    <div class="headline" name="game-title" v-if="game.details.name">{{ game.details.name }}</div>
                    <div class="caption" v-if="game.details.sessions">number of sessions: {{ game.details.sessions.length}}</div>
                </v-flex>
            </v-layout>
        </v-card-title>
        <v-divider/>
        <v-card-text>
            <div>
                <div v-if="game.bggStats.rating">
                    BGG rating: <span class="font-weight-bold" name="bgg-rating">{{ parseFloat(game.bggStats.rating).toFixed(2) }}</span>
                    <v-rating :value="parseFloat(game.bggStats.rating)" color="yellow darken-2" half-increments readonly small class="ml-1" length="10"/>
                </div>                        
                <div v-if="game.details.designers">
                    designer<span v-if="game.details.designers.indexOf(',') > -1">s</span>: 
                    <em class="caption" name="game-designer">{{ game.details.designers}}</em>
                </div>
            </div>
        </v-card-text>
        <div v-if="game.bggStats.ranks">
            <v-divider/>
            <v-card-text>
                <div>
                    BGG ranks:
                    <div v-for="rank in game.bggStats.ranks" :key="rank.type" class="caption ml-3">
                        {{ rank.type }}: #{{ rank.rank }}
                    </div>
                </div>
            </v-card-text>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'GameInfo',
    data () {
        return {
        }
    },
    computed: {
      ...mapState(['game'])
    }
}
</script>