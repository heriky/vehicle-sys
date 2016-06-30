import {connect} from 'react-redux' ;
import ParkingState from '../components/ParkingState/ParkingState'

function mapStateToProps(state,ownProps){
	const {isFetching,distribute:{total,parking}} = state.monitor;
	return {
		total,parking,isFetching
	}
}

function mapDistpatchToProps(state,ownProps){
	return {} ;
}

export default connect(mapStateToProps,mapDistpatchToProps)(ParkingState)