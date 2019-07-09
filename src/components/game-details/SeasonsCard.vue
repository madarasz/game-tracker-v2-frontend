<template>
    <div class="mb-3">
        <v-toolbar color="green" dark dense>
            <v-toolbar-title>
                <v-icon>watch_later</v-icon>
                <span class="subheading">Seasons</span>       
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <div>
                <v-btn v-if="canEditSeasons" color="green" class="white btn-small" 
                        icon dark flat @click="addSeason()" name="button-add-season">
                    <v-icon>add</v-icon>
                </v-btn>
            </div>
        </v-toolbar>
        <v-card name="card-seasons">
            <v-card-text>
                <!-- Season list -->
                <v-data-table :items="seasons" hide-headers hide-actions class="borderless">
                    <template v-slot:items="sea">
                        <td>{{ sea.item.title }}</td>
                        <td style="width: 1%" class="text-xs-right">
                            <v-layout align-center>
                                <v-btn flat fab @click="editSeason(sea.item.id)" class="btn-small">
                                    <v-icon>edit</v-icon>
                                </v-btn>
                                <confirm-button icon buttonIcon="delete" class="btn-small"
                                            question="Do you want to delete the season?" :callback="function(){deleteSeason(sea.item.id)}" name="button-delete-season"/>
                            </v-layout>
                        </td>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
import ConfirmButton from '@/components/ConfirmButton';
import { mapState } from 'vuex';

export default {
    name: 'SeasonsCard',
    components: {
        ConfirmButton
    },
    data () {
        return {
            loading: false
        }
    },
    computed: {
        ...mapState(['game']),
        seasons() {
            if (this.game.details.seasons === undefined) {
                return [];
            }
            return this.game.details.seasons;
        },
        canEditSeasons() {
            return this.$store.getters['groups/isUserGroupMember'];
        },
    },
    methods: {
        addSeason() {
            this.$store.commit('season/showDialogForAddingSeason');
        },
        editSeason(id) {
            this.$store.dispatch('season/showDialogForEditSeason', id);
        },
        deleteSeason(id) {
            this.$store.dispatch('season/deleteSeason', id).then(() => {
                this.$store.dispatch('game/getGameDetails').then(() => {
                }).catch(() => {
                    this.$store.commit('toaster/showError', 'Could not refresh game data');
                })
            }).catch(() => {
                this.$store.commit('toaster/showError', 'Could not delete season');
            })
        }
    }
}
</script>