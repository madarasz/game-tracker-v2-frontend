<template>
    <v-layout wrap row>
        <v-flex xs12>
            <v-card name="profile-settings" v-if="isSettingsVisible" color="blue lighten-5">
                <v-card-title class="blue white--text">
                    Profile Settings
                </v-card-title>
                <v-card-text>
                    <v-avatar color="blue" size="48" class="mr-2">
                        <v-icon size="36">person</v-icon>
                    </v-avatar>
                    <image-uploader/>
                </v-card-text>
            </v-card>
            <v-card name="card-profile" class="mt-2">
                <v-card-title class="green">
                    Profile
                </v-card-title>
                <v-card-text>
                    TODO
                </v-card-text>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
    import { mapState } from 'vuex';
    import ImageUploader from '@/components/ImageUploader.vue';

    export default {
        components: {
            ImageUploader
        },
        data() {
            return {
            }
        },
        computed: {
            ...mapState(['login']),
            isSettingsVisible: function() {
                return this.login.isAdmin || this.login.userId == this.$route.params.id;
            }
        },
        methods: {
        }
    }
</script>