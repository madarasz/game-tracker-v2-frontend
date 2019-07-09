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
                <!-- Current season -->
                <div class="text-xs-center">
                    <strong>current season:</strong> <span :class="currentSeason.id == null ? 'font-italic' : ''">{{ currentSeason.title }}</span>
                </div>
                <div class="text-xs-center" v-if="currentSeason.id != null">
                    {{ currentSeason.start_date }} <v-icon>chevron_right</v-icon> {{ currentSeason.end_date }}
                    <div class="font-italic">remaining days: {{ currentSeason.remainingDays }}</div>
                </div>
            </v-card-text>
            <v-divider/>
            <v-card-text>
                <!-- Season list -->
                <v-data-table :items="seasons" hide-headers hide-actions class="borderless">
                    <template v-slot:items="sea">
                        <tr>
                            <td class="pl-1" :class="sea.item.id == null ? 'font-italic' : ''">{{ sea.item.title }}</td>
                            <td class="text-xs-right pr-1">
                                {{ countSessions(sea.item.id) }}<v-icon>event</v-icon>
                            </td>
                            <td style="width: 1%" class="text-xs-right  pl-0 pr-1" v-if="canEditSeasons">
                                <v-layout align-center v-if="sea.item.id != null">
                                    <v-btn flat fab @click="editSeason(sea.item.id)" class="btn-small ma-0" color="grey darken-1">
                                        <v-icon size="20">edit</v-icon>
                                    </v-btn>
                                    <confirm-button icon buttonIcon="delete" class="btn-small ma-0" iconColor="grey darken-1"
                                                question="Do you want to delete the season?" :callback="function(){deleteSeason(sea.item.id)}" name="button-delete-season"/>
                                </v-layout>
                            </td>
                        </tr>
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
            loading: false,
            withoutSeason: { title: 'without season', id: null }
        }
    },
    computed: {
        ...mapState(['game']),
        seasons() {
            if (this.game.details.seasons === undefined) {
                return [];
            }
            return this.game.details.seasons.concat([this.withoutSeason]);
        },
        canEditSeasons() {
            return this.$store.getters['groups/isUserGroupAdmin'];
        },
        currentSeason() {
            const date = new Date().toISOString();
            const currentSeason = this.seasons.find((x) => { return x.start_date <= date && x.end_date >= date});
            if (currentSeason === undefined) return this.withoutSeason;
            const endDate = new Date(currentSeason.end_date);
            currentSeason.remainingDays = Math.ceil((endDate.getTime() - new Date().getTime())/(1000 * 60 * 60 * 24));
            return currentSeason;
        }
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
        },
        countSessions(seasonId) {
            return this.game.details.sessions.filter((x) => { return x.season_id == seasonId}).length;
        }
    }
}
</script>