<template>
    <v-card>
        <v-card-text class="pt-0" :class="loaded ? '' : 'text-xs-center'">   
            <v-progress-circular indeterminate color="green" v-if="!loaded" class="ma-4"/>
            <v-data-table :items="items" :headers="sessionHeaders" :hide-actions="items.length <= defaultSessionsPerPage" class="borderless" 
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
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'SessionTable',
    props: {
        items: {
            type: Array
        },
        loaded: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        ...mapState(['session'])
    },
    methods: {
        selectRow(sessionId) {
            this.$store.commit('session/selectSession', this.items.find((x) => { return x.id == sessionId}));
            // scroll to top
            document.body.scrollTop = 0; // For Safari
            document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
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
