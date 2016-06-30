import Selector from '../../components/Selector/Selector' ;
import {selectorsAPI} from '../../actions/postActions' ;

 const connectSelector = ({mapStateToProps,dispatch})=>(Compo)=>(
 	class WrappedComponent extends React.Component{ // 外部实际上操作的是这个组件
		constructor(props){
			super(props);
			this.displayName = 'WrappedComponent' ;
		}
		componentDidMount = ()=>{
			dispatch(selectorsAPI()) ;
		}
		render = (ownProps)=>{ // ownProps来自于高阶组件接收到的参数
			<Compo {...(mapStateToProps(ownProps))}/>
		}
 	}
 )

 export default connectSelector ;