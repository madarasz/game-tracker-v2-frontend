<template>
    <div>
        <!-- Button -->
        <v-btn icon dark flat @click="displayDialog()" name="button-add-game">
            <v-icon>add</v-icon>
        </v-btn>
        <!-- Dialog -->
        <v-dialog v-model="showDialog" width="500">
            <v-toolbar color="green" dark>
                <v-toolbar-title>Add Game</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-text-field dark v-model.lazy="search" append-icon="search" ref="searchInput"
                    label="Search" single-line hide-details class="pa-0" v-if="!selectedGame"/>
            </v-toolbar>
            <v-card>
                <!-- Game list -->
                <v-card-text v-if="searchResults.length == 0" class="text-xs-center pt-4">
                    <em v-if="search.length < minCharacters">search for games</em>
                    <em v-if="search.length >= minCharacters && !searching">no game found</em>
                    <em v-if="search.length >= minCharacters && searching">searching...</em>
                </v-card-text>
                <v-list two-line>
                    <template v-for="(game, index) in selectedGame ? selectedGame : searchResults">
                        <v-list-tile :key="game.id" @click="selectGame(index)">
                            <!-- Game thumbnail -->
                            <v-list-tile-avatar tile size="64" class="mr-2">
                                <img v-if="gameImages.hasOwnProperty(game.id)" :src="gameImages[game.id]"/>
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                                <!-- Game name -->
                                <v-list-tile-title>
                                    {{ game.name }}
                                </v-list-tile-title>
                                <!-- Other info -->
                                <v-list-tile-sub-title>
                                    <em class="caption">
                                        <span v-if="gameDesigners.hasOwnProperty(game.id)">{{ gameDesigners[game.id].join(', ')}}</span>
                                        <span v-if="game.year"> ({{ game.year }})</span>
                                    </em>
                                </v-list-tile-sub-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </template>
                </v-list>
                <!-- Action buttons -->
                <v-card-actions v-if="selectedGame">
                    <v-btn flat @click="showDialog = false" name="button-dialog-cancel">Cancel</v-btn>
                    <v-btn flat @click="selectedGame = null" name="button-dialog-back">Back</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn flat class="green" dark name="button-dialog-upload">Add Game</v-btn>
                </v-card-actions>
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
            searching: false,
            gameImages: {},
            gameDesigners: {},
            selectedGame: null,
            minCharacters: 3,
            apiSearch: 'https://api.geekdo.com/xmlapi2/search?type=boardgame&limit=10&query=',
            apiDetails: 'https://api.geekdo.com/xmlapi2/thing?id='
        }
    },
    methods: {
        selectGame: function(index) {
            this.selectedGame = [ this.searchResults[index] ];
        },
        displayDialog: function() {
            this.search = '';
            this.searchResults = [],
            this.selectedGame = null;
            this.showDialog = true;
            // put focus on search field
            this.$nextTick(this.$refs.searchInput.focus);
        }
    },
    watch: {
        search: function(value) {
            if (value.length >= this.minCharacters) {
                this.searching = true;
                axios.get(`${this.apiSearch}${value}`).then((response) => {
                    parseString(response.data, (err, result) => {
                        this.searching = false;
                        if (result.items.$.total > 0) {
                            this.searchResults = result.items.item.sort((a, b) => { 
                                return a.name[0].$.value.length - b.name[0].$.value.length // display short titles first
                            }).slice(0, 6).map((x) => { 
                                // get thumbnail URL if unknown
                                if (!this.gameImages.hasOwnProperty(x.$.id)) {
                                    axios.get(`${this.apiDetails}${x.$.id}`).then((detailResponse) => {
                                        parseString(detailResponse.data, (err2, detailResult) => {
                                            // game image
                                            if (detailResult.items.item[0].thumbnail && detailResult.items.item[0].thumbnail.length > 0) {
                                                this.$set(this.gameImages, x.$.id, detailResult.items.item[0].thumbnail[0]);
                                            }
                                            // game designer
                                            var designers = detailResult.items.item[0].link.filter((link) => { return link.$.type == 'boardgamedesigner'});
                                            designers = designers.slice(0, 3).map((link) => {return link.$.value});
                                            this.$set(this.gameDesigners, x.$.id, designers);
                                        });
                                    })
                                }
                                // get game data
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
                });
            } else {
                this.searchResults = [];
            }
        }
    }
}
</script>