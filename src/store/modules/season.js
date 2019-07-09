import { repositoryFactory } from '@/api/repositoryFactory';
const seasonRepository = repositoryFactory.get('seasons');

export const season = {
    namespaced: true,
    state: {
        seasonDialog: {},
        showSeasonDialog: false,
        dateType: '1',
        editMode: false
    },
    getters: {
    },
    actions: {
        addSeason({state, rootGetters}) {
            return seasonRepository.addSeason({
                group_id: rootGetters['groups/groupId'],
                game_id: rootGetters['game/gameId'],
                title: state.seasonDialog.title,
                description: state.seasonDialog.description,
                start_date: state.seasonDialog.startDate,
                end_date: state.seasonDialog.endDate
            }).then(() => {
                state.showSeasonDialog = false;
            });
        },
        updateSeason({state, rootGetters}) {
            return seasonRepository.updateSeason(state.seasonDialog.id, {
                group_id: rootGetters['groups/groupId'],
                game_id: rootGetters['game/gameId'],
                title: state.seasonDialog.title,
                description: state.seasonDialog.description,
                start_date: state.seasonDialog.startDate,
                end_date: state.seasonDialog.endDate
            }).then(() => {
                state.showSeasonDialog = false;
            });
        },
        deleteSeason(context, id) {
            return seasonRepository.deleteSeason(id);
        },
        showDialogForEditSeason({rootGetters, state}, id) { // should be a mutation
            const s = rootGetters['game/getSeasonWithId'](id);
            state.seasonDialog = {
                description: s.description,
                title: s.title,
                startDate: s.start_date,
                endDate: s.end_date,
                id: id
            };
            state.editMode = true;
            
            // set year and date type (year/custom)
            if (s.start_date.slice(4) == '-01-01' && s.end_date == s.start_date.slice(0,4)+'-12-31') {
                state.dateType = '1';
            } else {
                state.dateType = '2';
            }
            state.seasonDialog.year = parseInt(s.start_date.slice(0,4));

            state.showSeasonDialog = true;
        },
    },
    mutations: {
        showDialogForAddingSeason(state) {
            state.seasonDialog = {
                title: '',
                description: '',
                year: new Date().getFullYear(),
                startDate: new Date().getFullYear() + '-01-01',
                endDate: new Date().getFullYear() + '-12-31',
            };
            state.dateType = '1';
            state.editMode = false;
            state.showSeasonDialog = true;
        },
        hideDialog(state) {
            state.showSeasonDialog = false;
        },
        seasonYearChange(state) {
            state.seasonDialog.startDate = state.seasonDialog.year+'-01-01';
            state.seasonDialog.endDate = state.seasonDialog.year+'-12-31';
        },
        // keep start date before or equal to end date
        syncDates(state, changeStartDate = true) {
            if (state.seasonDialog.startDate > state.seasonDialog.endDate) {
                if (changeStartDate) {
                    state.seasonDialog.startDate = state.seasonDialog.endDate;
                } else {
                    state.seasonDialog.endDate = state.seasonDialog.startDate;
                }
            }
        }
    }
}