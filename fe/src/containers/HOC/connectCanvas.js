import React from 'react';

export default (config)=>(Compo)=>{
	return class WrappedComponent extends React.Component {
	    constructor(props) {
	        super(props);
	        this.displayName = 'WrappedComponent';
	    }
	    componentDidMount() {
	    	console.log(document.getElementById("stateGraphic"))
	    }
	    render() {
	        return <Compo />;
	    }
	}
}