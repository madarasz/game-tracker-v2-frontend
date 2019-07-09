<template>
    <div>
        <v-toolbar color="green" dark dense>
            <v-toolbar-title>
                <v-icon>offline_bolt</v-icon>
                <span class="subheading">Factions</span>       
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <div>
                <v-btn v-if="canEditFactions" color="green" class="white btn-small" icon dark flat @click="addSeason()" name="button-add-season">
                    <v-icon>add</v-icon>
                </v-btn>
            </div>
        </v-toolbar>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'FactionsCard',
    data () {
        return {
        }
    },
    computed: {
        ...mapState(['game']),
        canEditFactions() {
            return this.$store.getters['groups/isUserGroupMember']; // TODO
        },
    }
}
</script>