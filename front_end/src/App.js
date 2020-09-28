import React from 'react';
import logo from '../src/assets/img/empty.png';

import './App.css';
import { Input } from 'antd';

import axios from 'axios';

import Product from "../src/pages/product"
import Product_D from "../src/pages/product_demo"
const { Search } = Input;


class App extends React.PureComponent{
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
    const regex = /(?<=[/dp/]|$)([A-Z0-9]{10})/g;
    const found = link.match(regex);
    console.log(found[0]);

    if(!this.state.show){
      axios.get(" https://048d07daefef.ngrok.io/download/"+ found[0])
          .then(res => {
            const response = res.data;
            console.log("hi");
            console.log(response["success"]);
            console.log(response["success"]["title"])
            if(response["success"]){
                  this.setState({
                        show: true,
                        asin:found[0],
                        loading:"no",
                        img: response["success"]["img"],
                      pri:response["success"]["pri"],
                      info: response["success"]["des"].split("^"),
                      title:response["success"]["title"],
                      alt:response["success"]["alt"]
                  })
            }
            var audio = new Audio("juntos.mp3");
            audio.play();
          })
          .catch(error => console.log(error));
    }
  };


  handleHome = () => {
    this.setState({
      show:false,
      link:""
    })
  };


  render(){
    return(
        <div>
          {this.state.show? <Product asin={this.state.asin} img={this.state.img} alt ={this.state.alt} info={this.state.info} title={this.state.title}  />
              :<div className="App">
                <header className="App-header">
                  <img src={logo} className="App-logo" alt="logo" />
                  <p>
                    ASKIT
                  </p>
                  <Search style={{ width: 200 }} placeholder="Drop link here" onSearch={value => this.handleLink(value)} enterButton />
                  {/*{this.state.loading==="yes"?<Spin />:void(0)}*/}
                </header>
              </div>}
        </div>

    )
  }
}



export default App;
