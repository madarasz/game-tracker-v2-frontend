<template>
    <v-flex xs12>
        <v-toolbar color="green" dark dense>
            <v-toolbar-title>
                <v-icon>event</v-icon>
                <span class="subheading">Sessions</span>       
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <div>
                <v-btn color="green" class="white btn-small" icon dark flat @click="addSession()" name="button-add-session">
                    <v-icon>add</v-icon>
                </v-btn>
            </div>
        </v-toolbar>
        <!-- Session Table -->
        <v-card>
            <v-card-text class="pt-0" :class="loaded ? '' : 'text-xs-center'">   
                <v-progress-circular indeterminate color="green" v-if="!loaded" class="ma-4"/>
                <v-data-table :items="game.details.sessions" :headers="sessionHeaders" :hide-actions="sessionCount <= defaultSessionsPerPage" class="borderless" 
                    name="table-session" v-if="loaded" no-data-text="no sessions yet">
                    <template v-slot:items="sess">
                        <tr v-bind:class="{'selected-row': session.currentSession && sess.item.id == session.currentSession.id}" @click="selectRow(sess.item.id)">
                            <td class="text-xs-right">{{ sess.item.date}}</td>
                            <td>{{ sess.item.place}}</td>
                            <td></td>
                            <td></td>
                        </tr>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>
    </v-flex>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'SessionsCard',
    props: {
    },
    computed: {
        ...mapState(['session', 'game']),
        loaded() {
            return this.game.details != {}
        },
        sessionCount() {
            if (!this.loaded || this.game.details.sessions === undefined) {
                return 0
            }
            return this.game.details.sessions.length;
        }
    },
    methods: {
        selectRow(sessionId) {
            // TODO confirmation dialog if other session is being edited
            this.$store.commit('session/selectSession', this.game.details.sessions.find((x) => { return x.id == sessionId}));
            // scroll to top
            document.body.scrollTop = 0; // For Safari
            document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
        },
        addSession() {
            this.$store.commit('session/addSession', {gameId: this.gameId, groupId: this.groupId});
        }
    },
    data () {
        return {
            sessionHeaders: [
                {
                    text: 'date',
                    align: 'right',
                    sortable: true,
                    value: 'date'
                },
                {
                    text: 'place',
                    align: 'left',
                    sortable: false,
                    value: 'place'

                },
                {
                    text: 'players',
                    align: 'left',
                    sortable: false,
                    value: 'players'
                },
                {
                    text: '',
                    align: 'right',
                    sortable: false,
                    name: 'icons'
                },
            ],
            defaultSessionsPerPage: 20
        }
    }
}
</script>
