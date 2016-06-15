import React,{propTypes} from 'react' ;
import DataStatePreview from '../../containers/DataStatePreview' ;
import DataParkingState from '../../containers/DataParkingState' ;
import Tips from '../Tips' ;
import styles from './Monitor.scss' ;
import ProgressBar from '../common/ProgressBar' ;
import connectCanvas from '../../containers/HOC/connectCanvas'
import {infoAPI} from '../../actions/postActions'

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
    render() {
      return <section className={styles.main}>
    		<DataStatePreview />
    		<DataParkingState/>
    		<Tips />
      </section>
    }
}

export default Monitor;

