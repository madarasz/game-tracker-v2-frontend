<template>
    <v-flex xs12 lg8 offset-lg2 text-xs-center>
        <v-toolbar color="green" dark dense>
            <v-toolbar-title>
                <v-icon>people</v-icon>
                <span class="subheading">Groups</span>       
            </v-toolbar-title>
        </v-toolbar>
        <v-card name="groups-card">
            <v-card-text class="pa-0">
                <v-progress-circular indeterminate color="green" v-if="groups.groups == null" class="ma-4"/>
                <v-list dense v-if="groups.groups != null">
                    <!-- My Groups -->                   
                    <v-subheader>My Groups</v-subheader>
                    <v-list-tile v-if="groups.groups != null && login.userId == null" >
                        <v-list-tile-title class="text-xs-center" name="my-groups-login">
                            <em>Login to view your Groups</em>
                        </v-list-tile-title>
                    </v-list-tile>
                    <group-table :items="groups.groups.myGroups" name="my-groups-table" @selected="selectGroup"/>
                    <v-divider></v-divider>
                    <!-- Public Groups -->
                    <v-subheader>Public Groups</v-subheader>
                    <group-table :items="groups.groups.publicGroups" name="public-groups-table" @selected="selectGroup"/>
                    <v-divider></v-divider>
                    <!-- Private Groups -->
                    <v-subheader>Private Groups</v-subheader>
                    <group-table :items="groups.groups.privateGroups" name="private-groups-table" @selected="selectGroup" is-private/>
                </v-list>
            </v-card-text>
        </v-card>
    </v-flex>
</template>

<script>
import { mapState } from 'vuex';
import GroupTable from '@/components/select-group/GroupTable';
import common from '@/common';

export default {
    components: {
        GroupTable
    },
    data() {
        return {
        }
    },
    computed: {
        ...mapState(['groups', 'login'])
    },
    mounted: function() {
        this.$store.dispatch('groups/getGroups').then(() => {
        });
    },
    methods: {
        selectGroup: function(id, groupName = '') {
            this.$router.push(`group/${id}/${common.urlFriendly(groupName)}`);
        }
    }
}
</script>