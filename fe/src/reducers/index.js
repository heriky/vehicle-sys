import {combineReducers} from 'redux' ;
import monitor from './monitorReducer' ;
import selector from './selectorsReducer'
export default combineReducers({
	monitor,selector
})

// 这个文件至关重要，直接决定了整个应用的状态树顶层结构。