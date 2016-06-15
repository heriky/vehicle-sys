import React,{PropTypes} from 'react' ;
import {Link,IndexLink} from 'react-router' ;

const NavLink = (props)=>{
	const isIndex = props.isIndex || false;
	return isIndex?<IndexLink activeClassName = "nav-active" {...props}/> : <Link activeClassName = "nav-active" {...props}/>
};

export default NavLink ;
