<template>
    <v-data-table :items="items" hide-actions hide-headers class="borderless groups-table" :name="name" :loading="loading" no-data-text="no such groups">
        <template v-slot:items="group">
            <tr @click="selected(group.item.id, group.item.name)">
                 <!-- Group avatar in hexagon -->
                <td style="width: 1%">
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
                <td style="width: 100%" class="text-xs-left">{{ group.item.name }}</td>
                <!-- Icons -->
                <td style="width: 1%">
                    <v-icon name="icon-settings" v-if="group.item.is_group_admin || login.isAdmin">settings</v-icon>
                </td>
                <td style="width: 1%">
                    <v-layout align-center v-if="group.item.gameCount > 0">
                        {{ group.item.gameCount }}
                        <v-icon>casino</v-icon>
                    </v-layout>
                </td>
                <td style="width: 1%">
                    <v-layout align-center v-if="group.item.memberCount > 0">
                        {{ group.item.memberCount }}
                        <v-icon>face</v-icon>
                    </v-layout>
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