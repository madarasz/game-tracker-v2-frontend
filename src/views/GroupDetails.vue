<template>
    <v-layout wrap row>
        <!-- Games -->
        <v-flex xs12 md8>
            <v-card class="ma-2" name="card-games">
                <v-card-title class="green white--text">
                    <span class="subheading">Games</span>
                </v-card-title>
            </v-card>
        </v-flex>
        <v-flex xs12 md4>
            <!-- Settings -->
            <v-card class="ma-2" v-if="isSettingsVisible" name="card-group-settings">
                <v-card-title class="orange white--text">
                    <span class="subheading">Settings</span>
                </v-card-title>
            </v-card>
            <!-- Members -->
            <v-card class="ma-2" name="card-members">
                <v-card-title class="green white--text">
                    <span class="subheading">Members</span>
                </v-card-title>
                <v-list v-if="groups.selectedGroup && groups.selectedGroup.members" two-line>
                    <template v-for="(member) in groups.selectedGroup.members">
                        <user-with-avatar :user="member" :key="member.id"/>
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
                return this.groups.selectedGroup && (this.login.isAdmin || this.$store.getters['groups/isUserGroupAdmin'](this.login.userId));
            },
            imageFolder:function() {
                return process.env.VUE_APP_BACKEND_IMG_URL;
            }
        },
        mounted: function() {
            // load group details and set it as selected
            const pathParts = window.location.href.substr(window.location.href.indexOf('/',10)).split('/').filter((el) => { return el != ''});
            const groupId = parseInt(pathParts[1]);
            this.$store.dispatch('groups/getGroupDetails', {id: groupId}).then(() => {
                this.groupDetailsLoaded = true;
            });
        },
        methods: {
        }
    }
</script>