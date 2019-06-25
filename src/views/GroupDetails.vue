<template>
    <v-layout wrap row :align-center="!groupDetailsLoaded">
        <!-- Loading Spinner -->
        <v-flex v-if="!groupDetailsLoaded" class="text-xs-center">
            <v-progress-circular indeterminate color="green"/>
        </v-flex>
        <!-- Games -->
        <games-card v-if="groupDetailsLoaded"/>
        <v-flex xs12 md4 pa-2 v-if="groupDetailsLoaded"> 
            <!-- Group details -->
            <group-details-card/>
            <!-- Members -->
            <members-card/>
        </v-flex>
    </v-layout>
</template>

<script>
import GamesCard from '@/components/group-details/GamesCard';
import GroupDetailsCard from '@/components/group-details/GroupDetailsCard';
import MembersCard from '@/components/group-details/MembersCard';
import { mapState } from 'vuex';

export default {
        components: {
            GamesCard, GroupDetailsCard, MembersCard
        },
        data() {
            return {
                groupDetailsLoaded: false,
            }
        },
        computed: {
            ...mapState(['groups']),
        },
        mounted: function() {
            // load group details and set it as selected
            const pathParts = window.location.href.substr(window.location.href.indexOf('/',10))
                .split('/').filter((el) => { return el != ''});
            const groupId = parseInt(pathParts[1]);
            this.getGroupDetails(groupId);
            this.$store.commit('game/clearGame');
        },
        methods: {
            getGroupDetails: function(groupId) {
                this.$store.dispatch('groups/getGroupDetails', {
                    id: groupId
                }).then(() => {
                    this.groupDetailsLoaded = true;
                }).catch(() => {
                    this.$store.commit('toaster/showError', 'Unable to load group details');
                });
            },
        }
    }
</script>