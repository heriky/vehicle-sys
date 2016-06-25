import React,{propTypes} from 'react' ;
import NavLink from '../NavLink' ;

import styles from './NavbarMenu.scss' ;
import classNames from  'classnames' ;
const NavbarMenu = (props)=>{
	return <div>
	<button className = {styles.toggle}>|||</button>
	<ul className={styles.root}>
		<li className={styles['menu-item']} key="1" data-role = 'navlink'><NavLink to='/' isIndex = {true}><i className='iconfont'>&#xe604;</i>&nbsp;首页</NavLink></li>
		<li className={styles['menu-item']} key="2" data-role = 'navlink'><NavLink to='/monitor'><i className='iconfont'>&#xe603;</i>&nbsp;监控</NavLink></li>
		<li className={styles['menu-item']} key="3" data-role = 'navlink'><NavLink to='/recommend'><i className='iconfont'>&#xe601;</i>&nbsp;推荐</NavLink></li>
		<li className={styles['menu-item']} key="4" data-role = 'navlink'><NavLink to='/api'><i className='iconfont'>&#xe600;</i>&nbsp;API</NavLink></li>
		<li className={styles['menu-item']} key="5" data-role = 'navlink'><NavLink to='/feedback'><i className='iconfont'>&#xe602;</i>&nbsp;反馈</NavLink></li>
	</ul>
	</div>
}

export default NavbarMenu ;