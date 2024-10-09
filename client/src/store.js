import { legacy_createStore as createStore } from 'redux'

const initialState = {
    sidebarShow: true,
    theme: 'light',
    user: {},
}

const changeState = (state = initialState, { type, ...rest }) => {
    if (type === 'set') return { ...state, ...rest }
    return state
}

const store = createStore(changeState)
export default store
