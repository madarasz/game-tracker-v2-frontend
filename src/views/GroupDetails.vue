<template>
    <v-layout wrap row>
        <!-- Games -->
        <v-flex xs12 md8>
            <v-card class="ma-2">
                <v-card-title class="green white--text">
                    <span class="subheading">Games</span>
                </v-card-title>
            </v-card>
        </v-flex>
        <!-- Members -->
        <v-flex xs12 md4>
            <v-card class="ma-2" v-if="isSettingsVisible">
                <v-card-title class="orange white--text">
                    <span class="subheading">Settings</span>
                </v-card-title>
            </v-card>
            <v-card class="ma-2">
                <v-card-title class="green white--text">
                    <span class="subheading">Members</span>
                </v-card-title>
                <v-list v-if="groupDetailsLoaded" two-line>
                    <template v-for="(member) in groups.selectedGroup.members">
                        <!-- <v-list-tile :key="member.id"> -->
                            <user-with-avatar :user="member" :key="member-id"/>
                        <!-- </v-list-tile> -->
                    </template>
                </v-list>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
import UserWithAvatar from '@/components/UserWithAvatar';
import { mapState } from 'vuex';

export default {
        components: {
            UserWithAvatar
        },
        data() {
            return {
                groupDetailsLoaded: false
            }
        },
        computed: {
            ...mapState(['login', 'groups']),
            isSettingsVisible: function() {
                return this.groups.selectedGroup && (this.login.isAdmin || this.groups.selectedGroup.is_admin);
            },
            imageFolder:function() {
                return process.env.VUE_APP_BACKEND_IMG_URL;
            }
        },
        mounted: function() {
            this.$store.dispatch('groups/getGroupDetails', {id: this.$route.params.id}).then(() => {
                this.groupDetailsLoaded = true;
            });
        },
        methods: {
        }
    }
</script>