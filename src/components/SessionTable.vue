<template>
    <v-card>
        <v-card-text class="pt-0" :class="loaded ? '' : 'text-xs-center'">   
            <v-progress-circular indeterminate color="green" v-if="!loaded" class="ma-4"/>
            <v-data-table :items="items" :headers="sessionHeaders" :hide-actions="items.length <= defaultSessionsPerPage" class="borderless" 
                name="table-session" v-if="loaded" no-results-text="no sessions">
                <template v-slot:items="session">
                    <td class="text-xs-right">{{ session.item.date}}</td>
                    <td>{{ session.item.place}}</td>
                    <td></td>
                    <td></td>
                </template>
            </v-data-table>
        </v-card-text>
    </v-card>
</template>

<script>
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
