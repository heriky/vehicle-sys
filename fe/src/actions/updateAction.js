import {RECIEVE_UPDATE_DATA} from './Constants' ;

export const receiveUpdateData = function(data){
	return {
		type: RECIEVE_UPDATE_DATA,
		data
	}
}