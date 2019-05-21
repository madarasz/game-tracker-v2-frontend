<template>
    <v-layout wrap row>
        <!-- Teams -->
        <v-flex xs12 lg8 offset-lg2 text-xs-center>
            <v-card height="100%" name="groups-card">
                <v-card-title class="green white--text">
                    <span class="subheading">Groups</span>
                </v-card-title>
                <v-card-text class="pa-0">
                    <v-list dense>
                        <!-- My Groups -->                   
                        <v-subheader>My Groups</v-subheader>
                        <v-list-tile v-if="groupsLoaded && login.userId == null" >
                            <v-list-tile-title class="text-xs-center" name="my-groups-login">
                                <em>Login to view your Teams</em>
                            </v-list-tile-title>
                        </v-list-tile>
                        <v-data-table :headers="teamHeaders" :items="groups.groups.myGroups" hide-headers hide-actions class="borderless" 
                            v-if="groups.groups.myGroups && !groups.groups.myGroups.error" name="my-groups-table">
                            <template v-slot:items="team">
                                <td style="width: 1%">
                                    <v-list-tile-avatar color="grey" tile>
                                    </v-list-tile-avatar>
                                <td class="text-xs-left">{{ team.item.name }}</td>
                            </template>
                        </v-data-table>
                        <v-divider></v-divider>
                        <!-- Public Groups -->
                        <v-subheader>Public Groups</v-subheader>
                        <v-data-table :headers="teamHeaders" :items="groups.groups.publicGroups" hide-headers hide-actions 
                            class="borderless" name="public-groups-table">
                            <template v-slot:items="team">
                                <td style="width: 1%">
                                    <v-list-tile-avatar color="grey" tile>
                                    </v-list-tile-avatar>
                                <td class="text-xs-left">{{ team.item.name }}</td>
                            </template>
                        </v-data-table>
                        <v-divider></v-divider>
                        <!-- Private Groups -->
                        <v-subheader>Private Groups</v-subheader>
                        <v-data-table :headers="teamHeaders" :items="groups.groups.privateGroups" hide-headers hide-actions 
                            class="borderless" name="private-groups-table">
                            <template v-slot:items="team">
                                <td style="width: 1%">
                                    <v-list-tile-avatar color="grey" tile>
                                    </v-list-tile-avatar>
                                <td class="text-xs-left">{{ team.item.name }}</td>
                            </template>
                        </v-data-table>
                    </v-list>
                </v-card-text>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
    import { mapState } from 'vuex';

    export default {
        components: {
        },
        data() {
            return {
                groupsLoaded: false,
                teamHeaders: [
                    {
                        text: 'name',
                        value: 'name',
                        align: 'left'
                    }
                ]
            }
        },
        computed: {
            ...mapState(['groups', 'login'])
        },
        mounted: function() {
            this.$store.dispatch('groups/getGroups').then(() => {
                this.groupsLoaded = true;
            });
        },
        methods: {
        }
    }
</script>