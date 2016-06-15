import React,{PropTypes} from 'react' ;
import styles from './ParkingItem.scss'
import clazz from 'classnames';  // 合并样式

const ParkingItem = ({id,pos,currentStatus})=>{
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
	<div className={finalStyle}>
		<span>序号:{id}</span>
		<br/>
		<span>位置:{pos}</span>
	</div>
)}


export default ParkingItem;