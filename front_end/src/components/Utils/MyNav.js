import React from 'react'


const Mininavbar = (props) => {
    const { toggle } = props

    return(
        (toggle === true)?
            <div className="topnav responsive">
                {/*<a href='/dafinder'>DaFinder</a>*/}
                {/*<a href='/daplanner'>DaPlanner</a>*/}
                {/*<a href='dascheduler'>DaScheduler</a>\*/}
                {/*<a href='/damarketplace'>DaMarket</a>*/}
                {/*<a href='/aboutus'>About Us</a>*/}
                {/*<a href='/dalogin'>Sign In</a>*/}
            </div>
            : null
    )
}

class Navbar extends React.PureComponent {
    constructor(){
        super();
        this.state  = {
            Nav: false,
        }
    }

    render() {
        return(
            <div className="topnav">
                <span>REVAMP</span>
                {/*<a href='/dalogin'>Sign In</a>*/}
                {/*<a href='/aboutus'>About Us</a>*/}
                {/*<a href='/damarketplace'>DaMarket</a>*/}
                {/*<a href='/dascheduler'>DaScheduler</a>*/}
                {/*<a href='daplanner'>DaPlanner</a>*/}
                {/*<a href='/dafinder'>DaFinder</a>*/}
                {/*<button className="icon" onClick={() => (this.setState({Nav: !this.state.Nav}))}>*/}
                {/*    <i className="fa fa-bars"></i>*/}
                {/*    <Mininavbar toggle={this.state.Nav} />*/}
                {/*</button>*/}
            </div>
        )
    }
}

export default Navbar
