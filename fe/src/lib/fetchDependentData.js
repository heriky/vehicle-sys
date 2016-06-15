export default (dispatch,components,params)=>{
	console.log(components);
	const needs = components.reduce((prev,current)=>{  // 备注一：needs是actionCreator的一个数组
		return (current.needs || [])
			.concat((current.WrappedComponent ? current.WrappedComponent.needs :[]) || [])
			.concat(prev)
	},[]) ;
	console.log('-----------------fetchDependentData中----------------')

	console.log(needs)
	const promises = needs.map(need=>dispatch(need(params))) // 备注二：要求该actionCreator返回promise类型
	return Promise.all(promises) 
}