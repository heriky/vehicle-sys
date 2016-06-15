import React,{PropTypes} from 'react' ;
import Tab from '../common/Tab' ;
import styles from './StatePreview.scss'
import StateIndicator from './StateIndicator' ;
import ProgressBar from '../common/ProgressBar' ;
const StatePreview = ({info,detail,isFetching})=>{
	const {location,status} = info;
	return (
	<Tab title="状态预览">
		<div>{/*这个只是为了占位置，因为Tab中规定了children[0]和children[1]*/}</div>
		{isFetching ? <div className = {styles.root}><ProgressBar /><v style = {{height:styles.minHeight}}/></div> :
			<div>
				<div className={styles["state-graphic"]}>图信息</div>
				{/*<canvas id = 'stateGraphic'/>*/}
				<StateIndicator clazz = {styles['state-info']}  {...detail}/>
				<dl className = {styles['state-run']}>
					<dt className = {styles['state-title']}>传感器运行状态：</dt>
					<dd className = {styles['state-content']}>{status == 1 ? '正常':'停止'}</dd>
					<dt className = {styles['state-title']}>更新于:</dt>
					<dd className = {styles['state-content']}>{"时间容易造成前后端渲染不一致"}</dd>
					<br />
					<dt className = {styles['state-title']}>经纬度:</dt>
					<dd className = {styles['state-content']}>{`${location[0]} / ${location[1]}`}</dd>
					<dt className = {styles['state-title']}>当前位于:</dt>
					<dd className = {styles['state-content']}>内容生成4</dd>
				</dl>
				<button className = {styles['btn-stop']}>停止监控</button>
			</div>
		}
	</Tab>
) };

export default StatePreview;