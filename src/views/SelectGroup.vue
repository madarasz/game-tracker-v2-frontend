<template>
    <v-layout wrap row>
        <!-- Groups -->
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
                                <em>Login to view your Groups</em>
                            </v-list-tile-title>
                        </v-list-tile>
                        <group-table :items="groups.groups.myGroups" name="my-groups-table" :loading="groupsLoaded" @selected="selectGroup"/>
                        <v-divider></v-divider>
                        <!-- Public Groups -->
                        <v-subheader>Public Groups</v-subheader>
                        <group-table :items="groups.groups.publicGroups" name="public-groups-table" :loading="groupsLoaded" @selected="selectGroup"/>
                        <v-divider></v-divider>
                        <!-- Private Groups -->
                        <v-subheader>Private Groups</v-subheader>
                        <group-table :items="groups.groups.privateGroups" name="private-groups-table" :loading="groupsLoaded" @selected="selectGroup" is-private/>
                    </v-list>
                </v-card-text>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
    import { mapState } from 'vuex';
    import GroupTable from '@/components/GroupTable';

    export default {
        components: {
            GroupTable
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
            selectGroup: function(id, groupName = '') {
                this.$router.push(`group/${id}/${this.urlGroupName(groupName)}`);
            },
            urlGroupName: function(groupName) {
                // TODO: code duplication
                return groupName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
            }
        }
    }
</script>