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
            }
        },
        computed: {
            ...mapState(['login', 'groups']),
            isSettingsVisible: function() {
                return this.login.isAdmin || this.groups.selectedGroup.is_admin == true;
            },
        },
        mounted: function() {
        },
        methods: {
        }
    }
</script>