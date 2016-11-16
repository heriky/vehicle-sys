import React,{PropTypes} from 'react' ;
import styles from './ParkingItem.scss'
import clazz from 'classnames';  // 合并样式
import { userOrder } from '../../actions/userActions' ;
import ProgressBar from '../common/ProgressBar/ProgressBar' ;

const ParkingItem = ({dispatch,vehicleId,id,pos,currentStatus,sensorFetching})=>{
	let statusStyle ;
	switch (currentStatus) {
		case 'busy':
			statusStyle = styles.busy;
			break;
		case 'ordered':
			statusStyle = styles.ordered;
			break;
		case 'idle':
			statusStyle = styles.idle;
			break;
		default:
			break;
	}
	const finalStyle = clazz(styles.root,statusStyle)
	return (
		<div className = { styles.extra } onClick = {e =>{
			if (currentStatus === 'ordered') {
				alert('无效的操作，该车位已被预订!')
				e.stopPropagation() ;
				return ;
			}
			if (currentStatus === 'busy') {
				alert('车位是占用状态，别乱点了！');
				e.stopPropagation() ;
				return ;
			}
			dispatch(userOrder({id:vehicleId,sensorId:id,statusMsg:currentStatus}))}
		}>
			<div className={finalStyle}>
				<div style = {{display:'inline-block',width:'100%',verticalAlign:'middle'}}>
					<span>序号:{id}</span>
					<span>位置:{pos[0]+'/'+pos[1]}</span>
				</div>
				<i style = {{display:'inline-block',height:'100%',verticalAlign:'middle'}}></i>
			</div>
			<div className= { styles.backface }>
				{ sensorFetching!==undefined && sensorFetching === true ? <ProgressBar /> : <span>点击预订车位</span> }
				
			</div>
		</div>
	
)}

/*
{isOk !==undefined ? (isOk === true ? <span>预订成功</span> : <span>预订失败</span>): '' }
 */

export default ParkingItem;