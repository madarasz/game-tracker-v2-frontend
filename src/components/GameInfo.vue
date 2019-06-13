
<template>
    <div class="pt-2">
        <v-card-title primary-title class="pt-2">
            <!-- <div> -->
                <v-layout row wrap>
                    <v-flex xs4 sm12>
                        <v-img :src="game.details.thumbnail" class="hidden-sm-and-up"/>
                    </v-flex>
                    <v-flex xs8 sm12 class="pl-2">
                        <div class="headline">{{ game.details.name }}</div>
                        <div class="caption">number of sessions:</div>
                    </v-flex>
                </v-layout>
            <!-- </div> -->
        </v-card-title>
        <v-divider/>
        <v-card-text>
            <div>
                <div v-if="game.bggStats.rating">
                    BGG rating: <span class="font-weight-bold">{{ parseFloat(game.bggStats.rating).toFixed(2) }}</span>
                    <v-rating :value="parseFloat(game.bggStats.rating)" color="yellow darken-2" half-increments readonly small class="ml-1" length="10"/>
                </div>                        
                <div v-if="game.details.designers">
                    designer<span v-if="game.details.designers.indexOf(',') > -1">s</span>: 
                    <em class="caption">{{ game.details.designers}}</em>
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