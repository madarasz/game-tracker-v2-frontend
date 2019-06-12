<template>
    <v-layout wrap row>
        <v-flex xs12>
            <div v-if="isSettingsVisible">
                <v-toolbar color="orange" dark dense>
                    <v-toolbar-title>
                        <span class="subheading">Settings</span>       
                    </v-toolbar-title>
                </v-toolbar>
                <v-card name="card-profile-settings">
                    <v-card-text>
                        <v-avatar color="blue" size="48" class="mr-2">
                            <v-icon size="36" v-if="login.imageFile == null" name="placeholder-profile">face</v-icon>
                            <img v-if="login.imageFile" :src="imageFolder+login.imageFile" name="image-profile"/>
                        </v-avatar>
                        <image-uploader is-square @uploaded="updateProfileImage" type="user" :parentid="login.userId"/>
                        <v-btn v-if="login.imageFile" @click="removeProfileImage" name="button-remove-profile-image">
                            Remove
                        </v-btn>
                    </v-card-text>
                </v-card>
            </div>
            
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
            },
            imageFolder:function() {
                return process.env.VUE_APP_BACKEND_IMG_URL;
            }
        },
        methods: {
            removeProfileImage: function() {
                this.$store.dispatch('login/removeProfileImage');
            },
            updateProfileImage: function(filename) {
                this.$store.dispatch('login/setProfileImage', filename);
            }

        }
    }
</script>