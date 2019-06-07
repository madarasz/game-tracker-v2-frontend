<template>
    <div>
        <v-btn icon dark flat @click="showDialog = true" name="button-add-game">
            <v-icon>add</v-icon>
        </v-btn>
        <v-dialog v-model="showDialog" width="500">
            <v-toolbar color="green" dark>
                <v-toolbar-title>Add Game</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-text-field dark v-model.lazy="search" append-icon="search" label="Search" single-line hide-details class="pa-0"/>
            </v-toolbar>
            <v-card>
                <v-list two-line>
                    <template v-for="game in searchResults">
                        <v-list-tile :key="game.id">
                            <v-list-tile-avatar tile size="64" class="mr-2">
                                <img v-if="gameImages.hasOwnProperty(game.id)" :src="gameImages[game.id]"/>
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                                <v-list-tile-title>
                                    {{ game.name }}
                                </v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </template>
                </v-list>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import axios from 'axios';
var parseString = require('xml2js').parseString;

export default {
    name: 'LoginDialog',
    data () {
        return {
            showDialog: false,
            search: '',
            searchResults: [],
            gameImages: {}
        }
    },
    watch: {
        search: function(value) {
            if (value.length > 3) {
                axios.get(`https://api.geekdo.com/xmlapi2/search?type=boardgame&limit=10&query=${value}`)
                    .then((response) => {
                        parseString(response.data, (err, result) => {
                            if (result.items.$.total > 0) {
                                this.searchResults = result.items.item.slice(0, 6).map((x) => { 
                                    axios.get(`https://api.geekdo.com/xmlapi2/thing?id=${x.$.id}`).then((detailResponse) => {
                                        parseString(detailResponse.data, (err2, detailResult) => {
                                            this.$set(this.gameImages, x.$.id, detailResult.items.item[0].thumbnail[0]);
                                        });
                                    })
                                    return { 
                                        id: x.$.id,
                                        name: x.name[0].$.value,
                                        year: x.yearpublished !== undefined ? x.yearpublished[0].$.value : null
                                    }
                                });
                            } else {
                                this.searchResults = [];
                            }
                        });
                    }
                );
            } else {
                this.searchResults = [];
            }
        }
    }
}
</script>