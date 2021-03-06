<template>
    <div>
        <!-- Button -->
        <v-btn color="green" class="white btn-small" icon dark flat @click="displayDialog()" name="button-add-game">
            <v-icon>add</v-icon>
        </v-btn>
        <!-- Dialog -->
        <v-dialog v-model="showDialog" width="500" name="dialog-add-game">
            <v-toolbar color="green" dark>
                <v-toolbar-title>Add Game</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-text-field dark v-model.lazy="search" append-icon="search" ref="searchInput" name="searchInput"
                    label="Search" single-line hide-details class="pa-0" v-if="!selectedGame" color="white"/>
                <template v-slot:extension v-if="!selectedGame">
                    <v-layout>
                        <v-flex class="flex-center">
                            <v-radio-group row class="mb-0 small flex-center" v-model="gameType" dark>
                                <v-radio label="boardgame" value="1" color="white" name="radio-boardgame"/>
                                <v-radio label="videogame" value="2" color="white" name="radio-videogame"/>
                            </v-radio-group>
                        </v-flex>
                    </v-layout>
                </template>
            </v-toolbar>
            <v-card>
                <!-- Game list -->
                <v-card-text v-if="searching || search.length < minCharacters" class="text-xs-center pt-4">
                    <em v-if="searchResults.length == 0 && search.length < minCharacters">search for games</em>
                    <em v-if="searchResults.length == 0 && search.length >= minCharacters && !searching">no game found</em>
                    <em v-if="search.length >= minCharacters && searching">
                        <v-progress-circular indeterminate color="green" class="pa-3"/>
                        searching...
                    </em>
                </v-card-text>
                <v-list two-line>
                    <template v-for="(game, index) in selectedGame ? selectedGame : searchResults">
                        <v-list-tile :key="game.id" @click="selectGame(index)">
                            <!-- Game thumbnail -->
                            <v-list-tile-avatar tile size="64" class="mr-2">
                                <v-img v-if="gameImages.hasOwnProperty(game.id)" :src="gameImages[game.id]"/>
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
                    <v-btn flat @click="addGame()" class="green" dark name="button-dialog-add">Add Game</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import axios from 'axios';
import { repositoryFactory } from '@/api/repositoryFactory';
const gamesRepository = repositoryFactory.get('games');
var parseString = require('xml2js').parseString;
import { mapState } from 'vuex';

export default {
    name: 'AddGameDialog',
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
            apiSearch: 'https://api.geekdo.com/xmlapi2/search?limit=10&query=',
            apiDetails: 'https://api.geekdo.com/xmlapi2/thing?id=',
            gameType: '1'
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
            if (this.$refs.searchInput) {
                this.$nextTick(this.$refs.searchInput.focus);
            }
        },
        addGame: function() {
            let id = this.selectedGame[0].id;
            gamesRepository.addGame({
                'bgg_id': id,
                'name': this.selectedGame[0].name,
                'year': this.selectedGame[0].year,
                'thumbnail': this.gameImages[id],
                'designers': this.gameDesigners[id].join(', '),
                'type': parseInt(this.gameType),
                'group_id': this.groups.selectedGroup.id
            }).then(() => {
                this.showDialog = false;
                this.$store.dispatch('groups/getGroupDetails', {id: this.groups.selectedGroup.id});
            }).catch((error) => {
                if (error.response && error.response.data.error) {
                    this.$store.commit('toaster/showError', error.response.data.error);
                } else {
                    this.$store.commit('toaster/showError', 'Game not added');
                }
            });
        },
        searchGame: function() {
            if (this.search.length >= this.minCharacters) {
                this.searching = true;
                axios.get(`${this.apiSearch}${this.search}&type=${this.gameTypeString}`).then((response) => {
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
                                            } else {
                                                this.$set(this.gameImages, x.$.id, null);
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
    },
    computed: {
            ...mapState(['groups']),
            gameTypeString() {
                if (this.gameType == 1) {
                    return 'boardgame';
                }
                return 'videogame'
            }
    },
    watch: {
        gameType: function() {
            this.searchGame();
        },
        search: function() {
            this.searchGame();
        }
    }
}
</script>