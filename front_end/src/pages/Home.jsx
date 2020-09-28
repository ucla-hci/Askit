import React from 'react'
import {TitleComponent} from "../components/Utils/TitleComponent";
import AppT from '../App_test'
import App from '../App'
import Product from '../pages/product'
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class Home extends React.PureComponent {
    render() {
        return <React.Fragment>
            <TitleComponent title="ASKIT HOME" />
            <AppT/>
            {/*<Product/>*/}
        </React.Fragment>;
    }
}

export default Home
