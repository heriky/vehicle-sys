import React,{propTypes} from 'react' ;
import DataStatePreview from '../../containers/DataStatePreview' ;
import DataParkingState from '../../containers/DataParkingState' ;
import Tips from '../Tips/Tips' ;
import styles from './Monitor.scss' ;
import ProgressBar from '../common/ProgressBar/ProgressBar' ;
import {infoAPI} from '../../actions/postActions'
import { browserHistory } from 'react-router' ;
import { connect } from 'react-redux' ;

// 组件只是负责内部的样式，至于组件之间的布局和样式都应该放在这里写！！！！！不应该放在组件内部写！！
// 从而达到复用的目的，
// 应用级的组件直接写在App之中即可，例如导航条和Footer之类的！！


class Monitor extends React.Component {
    constructor(props) {
      super(props);
      this.displayName = 'Monitor';
    }
		static needs = [
			infoAPI
		]
    
    componentDidMount(prevProps, prevState) {
      const {info} = this.props;
      if(info.id.length == 24 || (this.props.params.id && this.props.params.id.length == 24)){
        const id = info.id || this.props.params.id;
        const {dispatch} = this.props;
        this.constructor.needs.forEach((need,index)=>{
          return dispatch(infoAPI({id})) ; // infoAPI接收的是一个带有id的对象！！这里不能直接传递id值，而应该传{id}
        })  
      }else{
        browserHistory.push('/monitor') ;
      }
    }

    render() {
      const info = this.props.info;
      return(
        <section className={styles.main}>
              <DataStatePreview />
              <DataParkingState/>
              <Tips />
        </section>
      );
    }
}

export default connect(state=>state.monitor)(Monitor);

