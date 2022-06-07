const state = {
    isNavOpen: true,
    isExpandedList: false,
    navigationClicked: Date.now(),
}
    
const mutations = {
        setIsNavOpen(yesno) {
            state.isNavOpen = yesno;
        },
        setIsExpandedList(yesno) {
            state.isExpandedList = yesno;
        },
        toggleNav() {
            state.isNavOpen = !state.isNavOpen;
        },
        toggleNavOpen() {
            state.isNavOpen = false;
        },
        toggleNavClose() {
            state.isNavOpen = true;
        },
        navigationClicked(){
            state.navigationClicked = Date.now();
        }

    
}

export const sidebar = {
    namespaced: true,
    state,
    mutations
}