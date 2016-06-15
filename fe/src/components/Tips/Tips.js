import React,{PropTypes} from 'react' ;
import styles from './Tips.scss' ;

const Tips = ()=>(
	<div className = {styles.tips}>
		<span>Tips:</span>
		<p>1.鼠标移动至圆圈，可进行车位预约或者查看信息.</p>
		<p>2.当没有合适车位时，点击推荐按钮试试吧!</p>
		<div className= {styles.btn}>
			<button >点击这里查看新的车位吧</button>
		</div>
		
	</div>
)

export default Tips;