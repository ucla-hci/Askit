import React from 'react'
import {Row, Col, Card, Select, Input, Typography, Space, List} from 'antd'

import { AudioOutlined } from '@ant-design/icons';

import Highlighter from "react-highlight-words";

import axios from 'axios';


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

const demo = [
    {
        "answer": {
            "keywordlist": [
                "logo"
            ],
            "neglistm": [
                {
                    "Content": "knock off 1 star because the shape may limit it's use for other beverages",
                    "Rating": "1.0",
                    "Score": 200.0,
                    "Title": "Great bottle, but shape might limit its use for some"
                }
            ],
            "poslistm": [
                {
                    "Content": "convenient shape fits in the side pockets of my bag or book bag so I need never thirst again",
                    "Rating": "5.0",
                    "Score": 100.0,
                    "Title": "Great Product!"
                },
                {
                    "Content": "shaped like a Cola Bottle and has a screw top lid with a good size opening for drinking",
                    "Rating": "5.0",
                    "Score": 110.0,
                    "Title": "Awesome Cola Shape"
                },
                {
                    "Content": "normal oval or crescent shaped ice fits",
                    "Rating": "4.0",
                    "Score": 100.0,
                    "Title": ""
                },
                {
                    "Content": "The shape is a bit awkward, in my opinion, but it is a great alternative to any high end water bottle",
                    "Rating": "5.0",
                    "Score": 100.0,
                    "Title": "Good quality, you get what you see"
                },
                {
                    "Content": "Graceful shape, not too wide",
                    "Rating": "3.0",
                    "Score": 100.0,
                    "Title": "Beautiful, Functional"
                },
                {
                    "Content": "great shape",
                    "Rating": "3.0",
                    "Score": 100.0,
                    "Title": "Nice bottle, great shape"
                },
                {
                    "Content": "Pretty design and nice shape",
                    "Rating": "5.0",
                    "Score": 100.0,
                    "Title": "Cute and functional"
                }
              ],
            "summary1": "I got 17 related reviews, 10 are positive  including The advertisement showed a logo C for champion on the sleeve. The logo was not on the sleeve when it arrived. and I like how the champion logo looks and Like it. I am a women, and the size large fits good. I have long arms and torso, and size is good. Price is good, etc. I like Champion logo7 are negative, mentioned that  including After I wore it once I followed the washing instructions, when it came out of the wash the Champion logo was faded! I can not believe after one wash this has happened. The material is also very stiff and of low poor quality, I am questioning the products authenticity! and Not sure if this is a knockoff. I specifically purchased this one which was a little more expensive because it had the logo on the sleeve (according to the picture). When I received it, there was no logo leading me to believe it is a fake. Seem a bit thin as well. I bought it for a gift and it's a bit late to try to send it back now. and It looked good but the logos came off of the shirt after a few wears. It fit nicely but I wasn\u2019t impressed by the product.",
            "summaryT": {
                "intro1": "I got 23 related reviews, 22 are positive; the top related snippets are:",
                "intro2": "1 are negative; the top related snippets are:",
                "neg": [
                    "knock off 1 star because the shape may limit it's use for other beverages"
                ],
                "pos": [
                   "convenient shape fits in the side pockets of my bag or book bag so I need never thirst again",
                    "shaped like a Cola Bottle and has a screw top lid with a good size opening for drinking",
                    "normal oval or crescent shaped ice fits"
                    ]
            },
            "vsum": ""
        }
    }
]

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


class Product_D2 extends React.PureComponent {
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
            select:{},
            alt: ""
        };

    }

    handleChange = (value) =>{
        this.setState({
           alt: "i purchased this in white and applied a glossy vinyl sticker of my business logo. the 25 oz size is just too big to carry around with you. size has a slightly larger shape that doesn't fit most standard-size neoprene cozies."
        })
    };

    handleLink = (question) => {
            this.setState({
                responseFlag: true,
                response:"",
                summary1:demo[0]["answer"]["summary1"],
                poslistm:demo[0]["answer"]["poslistm"],
                neglistm:demo[0]["answer"]["neglistm"],
                vsum:demo[0]["answer"]["vsum"],
                keywordlist:demo[0]["answer"]["keywordlist"],
                summaryT:demo[0]["answer"]["summaryT"],
            });

    };



    render() {
        return <React.Fragment>
            <Row>
                <Col span={8}>
                    <Row>
                        <Col span={24}>
                    <img  style={{margin:"50px", height: "40vmin",marginLeft:"200px"}} src={"https://images-na.ssl-images-amazon.com/images/I/51i-PvOVOBL._AC_SY879_.jpg"} alt="shaped like a Cola Bottle,
the logo is sleek,
It is a flat pink with a few speckles of white mixed in the blue,
sized for the disposable plastic water bottles" /></Col>
                        <Col span={24}>
                    <Text mark style={{marginLeft:"50px"}}>[Alt-text]</Text>
                            <div style={{marginLeft:"50px"}}>
                            <Text >shaped like a Cola Bottle,
                    the logo is sleek,
                    It is a flat pink with a few speckles of white mixed in the blue,
                                sized for the disposable plastic water bottles</Text></div></Col>
                    </Row>
                </Col>
                <Col span={6}>
                    <Space  style={{margin:"50px"}} direction="vertical">
                        <Title level={4}>{this.props.title}</Title>
                        <ul>
                            <li><Text>Vacuum Insulated: The Simple Modern Wave water bottle is double-walled and vacuum insulated, which keeps your favorite beverage hot or cold for hours</Text></li>
                            <li><Text>Premium 18/8 Stainless Steel: Bottle is made from high-quality, food-grade 18/8 stainless steel and is coated in a durable finish</Text></li>
                            <li><Text>Premium Copper Coated Insulation Layer: The exterior of the inner wall, in the vacuum sealed area, is coated in a thin layer of copper for added insulation</Text></li>
                            <li><Text>Take it With You: Narrow mouth reduces spills and sloshing while you drink; 9oz and 17oz sizes fit in most cupholders</Text></li>
                            <li><Text>Why Simple Modern: Our core principles of Generosity and Excellence have inspired us to sell high quality products, act as great partners with everyone we interact with, and give away a minimum of 10% of our profits</Text></li>
                        </ul>


                    </Space>


                </Col>
                <Col span={10}>
                    <Row style={{margin:"50px"}}>
                        <Col span={24}>
                            <Search
                                placeholder="Please ask me a question!"
                                enterButton="Ask!"
                                size="large"
                                suffix={suffix}
                                onSearch={value => this.handleLink(value)}
                            />
                        </Col>
                        {this.state.responseFlag?<div>
                            <Col span={24}>
                                <Space  direction={"vertical"}>

                                    <Title level={4}>Summary: </Title>
                                    <Text>{this.state.vsum}</Text>
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

export default Product_D2
