
<template>
    <!-- Dialog -->
    <v-dialog v-model="season.showSeasonDialog" width="500" name="dialog-season">
        <v-toolbar color="green" dark>
            <v-toolbar-title v-if="!season.editMode">Add Season</v-toolbar-title>
            <v-toolbar-title v-if="season.editMode">Edit Season</v-toolbar-title>
            <v-spacer></v-spacer>
        </v-toolbar>
        <v-card>
            <v-card-text>
                <v-form>
                    <v-text-field v-model="season.seasonDialog.title" label="title" name="input-title" required :rules="[v => !!v || 'Title is required']"/>
                    <v-textarea v-model="season.seasonDialog.description" rows="1" auto-grow label="description" name="input-description"/>
                    <v-layout row wrap>
                        <v-flex xs12 class="flex-center">
                            <v-radio-group v-model="season.dateType" row @change="yearChange()">
                                <v-radio label="full year" value="1" class="mb-1"/>
                                <v-radio label="custom dates" value="2"/>
                            </v-radio-group>
                        </v-flex>
                        <v-flex xs12 class="flex-center" v-if="season.dateType == 1">
                            <v-select label="year" :items="years" v-model="season.seasonDialog.year" 
                                @change="yearChange()" style="width: 60px;"/>
                        </v-flex>
                        <v-flex xs6 class="flex-center" v-if="season.dateType == 2">
                            <!-- start date -->
                            <v-menu  v-model="startDateDialog" :close-on-content-click="false" lazy
                                transition="scale-transition" full-width min-width="290px">
                                <template v-slot:activator="{ on }">
                                    <v-text-field label="start date" v-model="season.seasonDialog.startDate" readonly v-on="on" 
                                        prepend-icon="calendar_today" reverse style="max-width: 120px;"/>
                                </template>
                                <v-date-picker v-model="season.seasonDialog.startDate" @input="startDateDialog = false; syncDates(false)"/>
                            </v-menu>
                        </v-flex>
                        <v-flex xs6 class="flex-center" v-if="season.dateType == 2">
                            <!-- end date -->
                            <v-menu  v-model="endDateDialog" :close-on-content-click="false" lazy
                                transition="scale-transition" full-width min-width="290px">
                                <template v-slot:activator="{ on }">
                                    <v-text-field label="end date" v-model="season.seasonDialog.endDate" readonly v-on="on" 
                                        prepend-icon="calendar_today" reverse style="max-width: 120px;"/>
                                </template>
                                <v-date-picker v-model="season.seasonDialog.endDate" @input="endDateDialog = false; syncDates(true)"/>
                            </v-menu>
                        </v-flex>
                        <v-flex xs12 class="flex-center" v-if="season.dateType == 2">
                            <em>{{ seasonLengthInDays }} day{{ seasonLengthInDays > 1 ? 's' : '' }}</em>
                        </v-flex>
                    </v-layout>
                </v-form>
            </v-card-text>
            <!-- Action buttons -->
            <v-card-actions>
                <v-btn flat @click="season.showSeasonDialog = false" name="button-dialog-cancel">Cancel</v-btn>
                <v-spacer></v-spacer>
                <v-btn v-if="!season.editMode" flat @click="addSeason()" class="green" dark name="button-dialog-add">Add Season</v-btn>
                <v-btn v-if="season.editMode" flat @click="updateSeason()" class="green" dark name="button-dialog-update">Update Season</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'SeasonDialog',
    data () {
        return {
            startDateDialog: false,
            endDateDialog: false,
            validity: true
        }
    },
    methods: {
        yearChange() {
            if (this.season.dateType == 1) {
                this.$store.commit('season/seasonYearChange');
            }
        },
        addSeason() {
            this.$store.dispatch('season/addSeason').then(() => {
                this.$store.dispatch('game/getGameDetails').then(() => {
                }).catch(() => {
                    this.$store.commit('toaster/showError', 'Could not refresh game data');
                })
            }).catch(() => {
                this.$store.commit('toaster/showError', 'Could not add season');
            })

        },
        updateSeason() {
            this.$store.dispatch('season/updateSeason').then(() => {
                this.$store.dispatch('game/getGameDetails').then(() => {
                }).catch(() => {
                    this.$store.commit('toaster/showError', 'Could not refresh game data');
                })
            }).catch(() => {
                this.$store.commit('toaster/showError', 'Could not update season');
            });
        },
        syncDates(changeStartDate) {
            this.$store.commit('season/syncDates', changeStartDate);
        }
    },
    computed: {
            ...mapState(['season']),
            years() {
                return [...Array(11)].map((_,i)=>({text: new Date().getFullYear()+5-i}));
            },
            seasonLengthInDays() {
                const startDate = new Date(this.season.seasonDialog.startDate + 'Z');
                const endDate = new Date(this.season.seasonDialog.endDate + 'Z');
                const diffTime = endDate.getTime() - startDate.getTime();
                return Math.ceil(diffTime / (1000 * 60 * 60 * 24))+1;
            }
    },
}
</script>