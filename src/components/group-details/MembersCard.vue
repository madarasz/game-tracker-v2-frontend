<template>
    <div>
        <v-toolbar color="green" dark dense>
            <v-toolbar-title>
                <v-icon>face</v-icon>
                <span class="subheading">Members</span>       
            </v-toolbar-title>
        </v-toolbar>
        <v-card name="card-members">
            <v-list v-if="groups.selectedGroup && groups.selectedGroup.members">
                <template v-for="(member) in groups.selectedGroup.members">
                    <user-with-avatar :user="member" :key="member.id"/>
                </template>
            </v-list>
        </v-card>
    </div>
</template>

<script>
import UserWithAvatar from '@/components/group-details/UserWithAvatar';
import { mapState } from 'vuex';

export default {
    name: 'MembersCard',
    components: {
        UserWithAvatar
    },
    data() {
        return {
        }
    },
    computed: {
        ...mapState(['groups']),
    }
}
</script>