<template>
    <v-flex xs12 md8 pa-2>
        <v-toolbar color="green" dark dense>
            <v-toolbar-title>
                <v-icon>casino</v-icon>
                <span class="subheading">Games</span>       
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <add-game-dialog v-if="isGroupMember"/>
        </v-toolbar>
        <!-- Game list -->
        <v-card name="card-games">
            <v-list two-line>
                <template v-for="game in groups.selectedGroup.games">
                    <v-list-tile :key="game.id" name="list-group-games" 
                        :to="`/group/${groups.selectedGroup.id}/${$store.getters['groups/urlGroupName']}/${game.id}/${urlFriendly(game.name)}`">
                        <!-- Game thumbnail -->
                        <v-list-tile-avatar tile size="64">
                            <img v-if="game.thumbnail" :src="game.thumbnail"/>
                        </v-list-tile-avatar>
                        <v-list-tile-content class="ml-2">
                            <!-- Game name -->
                            <v-list-tile-title>
                                {{ game.name }}
                            </v-list-tile-title>
                            <!-- Other info -->
                            <v-list-tile-sub-title>
                                <em class="caption">
                                    <span>{{ game.designers }}</span>
                                    <span v-if="game.year"> ({{ game.year }})</span>
                                </em>
                            </v-list-tile-sub-title>
                        </v-list-tile-content>
                        <!-- Buttons -->
                        <v-list-tile-action>
                            <v-layout align-center v-if="game.session_count > 0">
                                {{ game.session_count }}<v-icon>event</v-icon>
                            </v-layout>
                            <confirm-button v-if="isGroupMember && game.session_count == 0" icon ripple buttonIcon="delete" iconColor="grey darken-1" name="button-delete-game"
                                question="Do you want to remove game from group?" :callback="function(){deleteGame(game.id)}"/>
                        </v-list-tile-action>
                    </v-list-tile>
                </template>
            </v-list>
        </v-card>
    </v-flex>
</template>

<script>
import AddGameDialog from '@/components/group-details/AddGameDialog';
import ConfirmButton from '@/components/ConfirmButton';
import { mapState } from 'vuex';
import common from '@/common';
import { repositoryFactory } from '@/api/repositoryFactory'; // TODO: refactor to store
const gamesRepository = repositoryFactory.get('games');

export default {
    name: 'GamesCard',
    components: {
        AddGameDialog, ConfirmButton
    },
    data() {
        return {
        }
    },
    computed: {
        ...mapState(['login', 'groups', 'game']),
        isGroupMember: function() { // can be site admin as well
            return this.$store.getters['groups/isUserGroupMember'];
        },
    },
    methods: {
        deleteGame: function(gameId) {
            gamesRepository.deleteGame({group_id: this.groups.selectedGroup.id, game_id: gameId}).then(() => {
                this.getGroupDetails(this.groups.selectedGroup.id);
                this.$store.commit('toaster/showConfirm', 'Game removed from group');
            }).catch(() => {
                this.$store.commit('toaster/showError', 'Unable to remove game from group');
            })
        },
        getGroupDetails: function(groupId) {
            this.$store.dispatch('groups/getGroupDetails', { id: groupId }).then(() => {
            }).catch(() => {
                this.$store.commit('toaster/showError', 'Unable to refresh group details');
            });
        },
        urlFriendly: function(str) {
            return common.urlFriendly(str);
        }
    }
}
</script>