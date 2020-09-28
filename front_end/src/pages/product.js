import React from 'react'
import {Row, Col, Card, Select, Input, Typography, Space, List} from 'antd'

import { AudioOutlined } from '@ant-design/icons';

import Highlighter from "react-highlight-words";


import axios from 'axios';
import {yellow} from "color-name";

const {Option} = Select;
const { Search } = Input;

const suffix = (
    <AudioOutlined
        style={{
            fontSize: 16,
            color: '#1890ff',
        }}
    />
);

const { Title, Text, Link } = Typography;

const Highlight = ({ children, highlightIndex }) => (
    <span className="newmark">{children}</span>
)

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class ReviewText extends React.Component{
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render(){
        return(
            <Highlighter
                highlightClassName="span"
                highlightTag={Highlight}
                searchWords={this.props.keywordlist}
                textToHighlight={this.props.reviews}
            />
            )
    }

}


class ReviewList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        console.log('ReviewList rendered');

        var list = this.props.list;
        var keywordlist = this.props.keywordlist;

        return (
            <Space direction={"vertical"}>

                {(list === undefined)?void(0):
                    <div aria-label="review list"
                          style={{maxHeight:"300px", overflowY: "scroll"}} spacing={3}>
                        {list.map((item) =>
                            <Card  aria-label="review detail"
                            >
                                <Text mark>[Title]</Text>
                        <Text>
                        {item["Title"]}
                        </Text><br/>
                                <Text mark>[Content]</Text>
                                <ReviewText reviews={item["Content"]} keywordlist={keywordlist} />

                            </Card>)}
                    </div>
              }
            </Space>
        );
    }
}


class Product extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            responseFlag:false,
            summary1:"",
            response:"",
            keywordlist:[],
            poslistm:[],
            summaryT:[],
            neglistm:[],
            vsum:[],
            question:"",
            select:{}
        };

    }

    handleChange = (value) =>{
        this.setState({
            select: this.props.alt[value]
        })
    };

    handleLink = (question) => {
        if(question!==""){
            axios.get(" https://048d07daefef.ngrok.io/"+ this.props.asin+"/"+ question.replace(" ", "+"))
                .then(res => {
                    const response = res.data;
                    console.log("hi");
                    console.log(response["answer"]);
                    this.setState({
                        responseFlag: true,
                        response:"",
                        summary1:response["answer"]["summary1"],
                        poslistm:response["answer"]["poslistm"],
                        neglistm:response["answer"]["neglistm"],
                        vsum:response["answer"]["vsum"],
                        keywordlist:response["answer"]["keywordlist"],
                        summaryT:response["answer"]["summaryT"],
                    });
                    var audio = new Audio("demo/src/juntos.mp3");
                    audio.play();
                    if(response["answer"]["attributes"]!==""){
                        var msg = new SpeechSynthesisUtterance(response["answer"]["attributes"]);
                        window.speechSynthesis.speak(msg);
                    }
                })
                .catch(error => console.log(error));
        }
    };



    render() {
        return <React.Fragment>
            <Row>
                <Col span={8}>
                    <img aria-label="Image" style={{margin:"50px", height: "40vmin"}} src={this.props.img} alt="A bright blue tee with Taped crew neck, Ribbed sleeve cuffs, C logo on left sleeve." />
                </Col>
                <Col span={6}>

                        <Space aria-label="Product Infomation" style={{margin:"50px"}} direction="vertical">
                            <Title level={4}>{this.props.title}</Title>
                            <ul>
                                {this.props.info.map((item)=>{return <li><Text>{item}</Text></li>})}
                            </ul>


                            <Select placeholder={"Please select variant"}  style={{ width: 120 }} onChange={this.handleChange}>
                                {Object.keys(this.props.alt).map((key)=>{return<Option value={key}>{key}</Option>})}
                            </Select>

                            <Text mark>[Alt-text]</Text><Text>{this.state.select["color"]}</Text>
                        </Space>


                </Col>
                <Col span={10}>
                    <Row style={{margin:"50px"}}>
                        <Col span={24}>
                            <Search
                                aria-label="Askit Search Bar"
                                placeholder="Please ask me a question!"
                                enterButton="Search"
                                size="large"
                                suffix={suffix}
                                onSearch={value => this.handleLink(value)}
                            />
                        </Col>
                        {this.state.responseFlag?<div>
                            <Col span={24}>
                                <Space  aria-label="Summary" direction={"vertical"}>

                                    <Title level={4}>Summary: </Title>
                                    {Object.keys(this.state.vsum).map((key)=>{return <Text>{this.state.vsum[key].join(" ")}</Text>})}
                                    <Text>{this.state.summaryT["intro1"]}</Text>
                                    <Text> {this.state.summaryT["pos"].map((item) => <li>{item}</li> )}</Text>
                                    <Text>  {this.state.summaryT["intro2"]}</Text>
                                    <Text>{this.state.summaryT["neg"].map((item) => <li>{item}</li> )}</Text>

                                </Space>


                            </Col>
                            <Col span={24}>
                                {/*    reviewlists*/}
                                {console.log(this.state.poslistm)}
                                {console.log(this.state.neglistm)}
                                <Row>
                                    <Col span={12}>
                                        <Title level={4}>Positive List</Title>
                                        <ReviewList aria-label="positive review list"
                                                    list={this.state.poslistm} keywordlist={this.state.keywordlist} flag={"pos"}/>
                                    </Col>
                                    <Col span={12}>
                                        <Title level={4}>Negtive List</Title>
                                        <ReviewList aria-label="negtive review list"
                                                    list={this.state.neglistm} keywordlist={this.state.keywordlist} flag={"neg"}/>
                                    </Col>
                                </Row>
                            </Col>
                        </div>:void(0)}

                    </Row>
                </Col>
            </Row>
        </React.Fragment>
    }
}

export default Product
