<template>
    <v-data-table :headers="teamHeaders" :items="items" hide-headers hide-actions class="borderless" :name="name" :loading="loading">
        <template v-slot:items="group">
            <tr @click="selected(group.item.id, group.item.name)">
                <td style="width: 1%">
                    <!-- Group avatar in hexagon -->
                    <v-list-tile-avatar size="32" tile>
                        <div class="hexagon hexagon-small">
                            <div class="hexagon-in1">
                                <div class="hexagon-in2">
                                    <div style="height: 30px" class="grey" v-if="group.item.imageFile == null"> 
                                        <v-icon name="placeholder-group" class="grey">group</v-icon>
                                    </div>
                                    <img v-if="group.item.imageFile" :src="imageFolder+group.item.imageFile" name="image-group"/>
                                </div>
                            </div>
                        </div>
                    </v-list-tile-avatar>
                <td class="text-xs-left">{{ group.item.name }}</td>
                <td class="text-xs-right">
                    <v-icon v-if="group.item.is_group_admin || login.isAdmin" name="icon-settings">settings</v-icon>
                </td>
            </tr>
        </template>
    </v-data-table>
</template>

<script>
    import { mapState } from 'vuex';

    export default {
        name: 'GroupTable',
        props: {
            items: {},
            name: {
                type: String,
                default: ''
            },
            loading: {
                type: Boolean,
                default: false
            },
            isPrivate: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            ...mapState(['groups', 'login']),
            imageFolder:function() {
                return process.env.VUE_APP_BACKEND_IMG_URL;
            }
        },
        data () {
            return {
                teamHeaders: [
                    {
                        text: 'name',
                        value: 'name',
                        align: 'left'
                    }
                ]
            }
        },
        methods: {
            selected(groupId, groupName) {
                if (!this.isPrivate || this.login.isAdmin) {
                    this.$emit('selected', groupId, groupName);
                }
            }
        }
    }
</script>