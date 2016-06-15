import React,{PropTypes} from 'react' ;
import Tab from '../common/Tab' ;
import styles from './ParkingState.scss'
import ParkingItem from './ParkingItem' ;
import StateIndicator from '../StatePreview/StateIndicator' ;
import ProgressBar from '../common/ProgressBar'

// 这里通过clearfix向Tab内部添加自定义的样式，按要求覆盖样式。
const ParkingState = ({total,parking,isFetching})=>(
	<Tab title="停车分布" >
		<StateIndicator clazz = {styles.indicator}/>
		{
			isFetching ? <div className = {styles.root}><ProgressBar /><v style = {{height:styles.minHeight}}/></div> : <div>
			{parking.map((item,index)=>
				<div className = {styles.wrapper} key = {index}>
					<ParkingItem {...parking[index]}/>
				</div>
			)}
		</div>
	}
	</Tab>
)


export default ParkingState;