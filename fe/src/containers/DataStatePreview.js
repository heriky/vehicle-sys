import StatePreview from '../components/StatePreview/StatePreview' ;
import {connect} from 'react-redux' ;

function mapStateToProps(state,ownProps){
	return {
		info:state.monitor.info,
		detail:state.monitor.detail,
		isFetching:state.monitor.isFetching
	}
}

function mapDispatchToProps(state,ownProps){
	return {} 
}

export default connect(mapStateToProps,mapDispatchToProps)(StatePreview) ;