<template>
    <v-layout wrap row>
        <!-- Groups -->
        <groups-card/>
    </v-layout>
</template>

<script>
import GroupsCard from '@/components/select-group/GroupsCard';


export default {
    components: {
        GroupsCard
    },
    data() {
        return {
        }
    },
    methods: {
    }
}
</script>