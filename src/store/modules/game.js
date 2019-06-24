import { repositoryFactory } from '@/api/repositoryFactory';
import common from '@/common';
import axios from 'axios';
const gameRepository = repositoryFactory.get('games');
const bggEndpoint = 'https://api.geekdo.com/xmlapi2/thing?stats=1&id=';
var parseString = require('xml2js').parseString;
import Vue from 'vue'

export const game = {
    namespaced: true,
    state: {
        details: {},
        bggStats: {
            image: null,
            rating: null
        }
    },
    getters: {
        urlGameName: (state) => {
            return common.urlFriendly(state.details.name);
        },
    },
    actions: {
        getGameDetails(context, {gameId, groupId}) {
            return gameRepository.getGameDetails(groupId, gameId).then((response) => {
                context.state.details = response.data;
            });
        },
        getBGGStats(context, gameId) {
            return axios.get(`${bggEndpoint}${gameId}`).then((response) => {
                parseString(response.data, (err, result) => {
                    const root = result.items.item[0];
                    const stats = root.statistics[0].ratings[0];
                    Vue.set(context.state.bggStats, 'image', root.image[0]);
                    Vue.set(context.state.bggStats, 'rating', stats.average[0].$.value);
                    if (stats.ranks) {
                        Vue.set(context.state.bggStats, 'ranks', []);
                        stats.ranks[0].rank.forEach(element => {
                            Vue.set(context.state.bggStats.ranks, context.state.bggStats.ranks.length, {
                                type: element.$.friendlyname == "Board Game Rank" ? "Overall Rank" : element.$.friendlyname,
                                rank: element.$.value
                            });
                        });
                    }
                });
            });
        }
    },
    mutations: {
        clearGame(state) {
            state.details = {};
            state.bggStats = {};
        }
    }
}