<template>
    <span>
        <v-list-tile v-if="listTile">
            <v-list-tile-avatar :color="color" class="mr-2">
                <v-icon v-if="user.imageFile == null" :user="`placeholder-user-${user.id}`">face</v-icon>
                <img v-if="user.imageFile" :src="imageFolder+user.imageFile" :name="`image-user-${user.id}`"/>
            </v-list-tile-avatar>
            <v-list-tile-content>
                <v-list-tile-title>
                    {{ user.name }}
                </v-list-tile-title>
                <v-list-tile-sub-title>
                    <em v-if="user.is_group_admin" class="caption orange--text font-weight-bold" name="membership-group-admin">(group admin) </em>
                    <em v-if="user.is_admin" class="caption purple--text font-weight-bold" name="membership-admin">(admin)</em>
                </v-list-tile-sub-title>
            </v-list-tile-content>
        </v-list-tile>
        <span v-if="inline">
            <v-avatar size="28" :color="color">
                <v-icon v-if="user.imageFile == null" :user="`placeholder-user-${user.id}`">face</v-icon>
                <img v-if="user.imageFile" :src="imageFolder+user.imageFile" :name="`image-user-${user.id}`"/>
            </v-avatar>
            {{ user.name }}
        </span>
    </span>
</template>

<script>
export default {
    name: 'UserWithAvatar',
    props: {
        user: {
            type: Object,
            default: function() { 
                return {
                    name: '',
                    imageFile: null,
                    id: 0
                }
            }
        },
        color: {
            type: String,
            default: 'blue'
        },
        listTile: {
            type: Boolean,
            default: false
        },
        inline: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        imageFolder:function() {
            return process.env.VUE_APP_BACKEND_IMG_URL;
        }
    }
}
</script>