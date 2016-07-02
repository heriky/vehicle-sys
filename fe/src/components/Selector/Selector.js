import React,{PropTypes} from 'react' ;
import styles from './Selector.scss' ;
import classNames from 'classnames' ;
import connectSelector from '../../containers/HOC/connectSelector'
import { connect } from 'react-redux' ;
import {Link} from 'react-router' ;
import { selectorsAPI } from '../../actions/postActions' ;
//  这里要变成注解的形式，用于包装高阶组件。
//  

class Selector extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'Selector';
    }

    static nees = [
			selectorsAPI
    ]

    componentDidMount = ()=>{
    	const dispatch = this.props.dispatch ;
			dispatch(selectorsAPI()) ;
		}

  render() {
		const {ids,names} = this.props ;
    return <ul className={styles["root"]}>
			{ids.map((id,index)=>
				<li className={styles["list-item"]} key={index}>
					<Link  to={`/monitor/${id}`} className={styles["item-name"]}
					>{names[index]}</Link>
					<span className={styles["item-status"]}>运行状态良好</span>
				</li>
			)}
		</ul>
  }
}

export default connect((state)=>{
	return {
		ids: state.selector.ids,
		names:state.selector.names
	}
})(Selector);

