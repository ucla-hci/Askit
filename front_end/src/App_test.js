import React from 'react';
import logo from '../src/assets/img/empty.png';

import './App.css';
import { Input } from 'antd';

import axios from 'axios';

import Product from "../src/pages/product"
import Product_D2 from "../src/pages/product_demo2"
const { Search } = Input;


class AppT extends React.PureComponent{
  constructor(){
    super();
    this.state = {
      show: false,
      data:{},
      asin:"",
      link: ""
    }
  }
  handleLink = (link) => {
      this.setState({
          show: true,
          loading:"no",
      })}


  handleHome = () => {
    this.setState({
      show:false,
      link:""
    })
  };


  render(){
    return(
        <div>
          {this.state.show? <Product_D2 asin={this.state.asin} img={this.state.img} alt ={this.state.alt} info={this.state.info} title={"Simple Modern 17 Ounce Wave Water Bottle - Stainless Steel Double Wall Vacuum Insulated Reusable Leakproof Ombre: Sweet Taffy"}  />
              :<div className="App">
                <header className="App-header">
                  <img src={logo} className="App-logo" alt="logo" />
                  <p>
                    REVAMP
                  </p>
                  <Search style={{ width: 200 }} placeholder="Drop link here" onSearch={value => this.handleLink(value)} enterButton />
                </header>
              </div>}
        </div>

    )
  }
}



export default AppT;
