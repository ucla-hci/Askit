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
                    "Content": "After I wore it once I followed the washing instructions, when it came out of the wash the Champion logo was faded! I can not believe after one wash this has happened. The material is also very stiff and of low poor quality, I am questioning the products authenticity!",
                    "Rating": "1.0",
                    "Score": 200.0,
                    "Title": "One wash logo faded!"
                },
                {
                    "Content": "Not sure if this is a knockoff. I specifically purchased this one which was a little more expensive because it had the logo on the sleeve (according to the picture). When I received it, there was no logo leading me to believe it is a fake. Seem a bit thin as well. I bought it for a gift and it's a bit late to try to send it back now.",
                    "Rating": "2.0",
                    "Score": 100.0,
                    "Title": "Not sure but I think it's a knockoff."
                },
                {
                    "Content": "It looked good but the logos came off of the shirt after a few wears. It fit nicely but I wasn\u2019t impressed by the product.",
                    "Rating": "2.0",
                    "Score": 100.0,
                    "Title": "Logos came off"
                },
                {
                    "Content": "Shrunk after first wash was xlarge now children's size yes that bad champion logo also garbageseller hippsh really bad stay away from them",
                    "Rating": "1.0",
                    "Score": 100.0,
                    "Title": "Worst shirt I ever bought"
                },
                {
                    "Content": "It\u2019s winter and I ordered this sweater and I got basically this, black, same logo and font but, I got a t shirt. Not the sweater, and a t shirt is not great at keeping me all that warm. Which defeats the purpose of why I bought it unfortunately.",
                    "Rating": "1.0",
                    "Score": 100.0,
                    "Title": "Doesn\u2019t keep me warm when it\u2019s a shirt"
                },
                {
                    "Content": "I like this shirt but it arrived with a hole right under the champion logo. I would have returned it but did not have the time to wait as my niece needed it for a school event.",
                    "Rating": "2.0",
                    "Score": 100.0,
                    "Title": "Hole in Shirt"
                },
                {
                    "Content": "Very over priced for what it is not very soft just a b look black shirt with champion logo",
                    "Rating": "1.0",
                    "Score": 100.0,
                    "Title": "Not worth 20 dollars"
                }
            ],
            "poslistm": [
                {
                    "Content": "Good product, the shirt fit really good on me the champion logo stays on there firm I have washed it many times and it still stays strong.",
                    "Rating": "5.0",
                    "Score": 100.0,
                    "Title": "Great buy !"
                },
                {
                    "Content": "I like how the champion logo looks",
                    "Rating": "5.0",
                    "Score": 110.0,
                    "Title": "Good service"
                },
                {
                    "Content": "Like it. I am a women, and the size large fits good. I have long arms and torso, and size is good. Price is good, etc. I like Champion logo",
                    "Rating": "4.0",
                    "Score": 100.0,
                    "Title": "Good shirt"
                },
                {
                    "Content": "it\u2019s a good fit and last you a while. the logo doesn\u2019t peel or get ugly after washes & is definitely worth buying. the size isn\u2019t too small not too big so get whatever size you usually wear.",
                    "Rating": "5.0",
                    "Score": 100.0,
                    "Title": "worth it"
                },
                {
                    "Content": "The picture shows a white longsleeve with an embroidered Champion logo but when it came in the mail there was a huge C in the middle of the chest and the words \u201cChampion\u201d written on both sleeves. It\u2019s not what it seems",
                    "Rating": "3.0",
                    "Score": 100.0,
                    "Title": "Not as advertised"
                },
                {
                    "Content": "I like this shirt, but the logo on the sleeve came off the first time I washed the shirt.",
                    "Rating": "3.0",
                    "Score": 100.0,
                    "Title": "bad glue"
                },
                {
                    "Content": "I got this shirt so long ago and I'm just now writing a review lmaooo but I love it and I wear it alot and still et compliments on it, the logo hasnt worn off except it did shrink a little when I put it in the dryer but I still like how it fits",
                    "Rating": "5.0",
                    "Score": 100.0,
                    "Title": "hasnt worn out yet"
                },
                {
                    "Content": "Nice thick long sleeve Champion cotton shirt. Classic design and I liked the little embroidered logo on the sleeve",
                    "Rating": "5.0",
                    "Score": 100.0,
                    "Title": "A Classic"
                },
                {
                    "Content": "I am 5\u201910 133lbs, might have to roll up sleeves if you have shorter arms, and I got a medium, bit long just tie it or tuck: Champion shirt looked as expected it\u2019s not thick or thin, don\u2019t really like fabric but it works, only flaw is the material is a bit itchy like or you could say scratchy and not soft, but you can have a tank top under fix that. Overall champion logo came in intact and shirt was almost as expected.",
                    "Rating": "4.0",
                    "Score": 100.0,
                    "Title": "Scratchy Fabric"
                }
            ],
            "summary1": "I got 17 related reviews, 10 are positive  including The advertisement showed a logo C for champion on the sleeve. The logo was not on the sleeve when it arrived. and I like how the champion logo looks and Like it. I am a women, and the size large fits good. I have long arms and torso, and size is good. Price is good, etc. I like Champion logo7 are negative, mentioned that  including After I wore it once I followed the washing instructions, when it came out of the wash the Champion logo was faded! I can not believe after one wash this has happened. The material is also very stiff and of low poor quality, I am questioning the products authenticity! and Not sure if this is a knockoff. I specifically purchased this one which was a little more expensive because it had the logo on the sleeve (according to the picture). When I received it, there was no logo leading me to believe it is a fake. Seem a bit thin as well. I bought it for a gift and it's a bit late to try to send it back now. and It looked good but the logos came off of the shirt after a few wears. It fit nicely but I wasn\u2019t impressed by the product.",
            "summaryT": {
                "intro1": "I got 17 related reviews, 10 are positive:",
                "intro2": "7 are negative, mentioned that:",
                "neg": [
                    "After I wore it once I followed the washing instructions, when it came out of the wash the Champion logo was faded",
                    "When I received it, there was no logo leading me to believe it is a fake",
                    "It looked good but the logos came off of the shirt after a few wears"
                ],
                "pos": [
                    "the shirt fit really good on me the champion logo stays on there firm I have washed it many times and it still stays strong",
                    "I like how the champion logo looks",
                    " I like Champion logo"
                ]
            },
            "vsum": "The logo is white. Main lettering on chest is printed but the sleeve logo is embroidered. The picture shows a white long sleeve with an embroidered Champion logo but when it came in the mail there was a huge C in the middle of the chest and the words “Champion” written on both sleeves."
        }
    },
    {
        "answer": {
            "keywordlist": [
                "color"
            ],
            "neglistm": [
                {
                    "Content": "Wasn\u2019t a royal blue color was very disappointed in it",
                    "Rating": "1.0",
                    "Score": 210.0,
                    "Title": "Wasn\u2019t the color shown"
                },
                {
                    "Content": "The color is not as pictured it\u2019s very faded",
                    "Rating": "1.0",
                    "Score": 210.0,
                    "Title": "Not the color I ordered"
                }
            ],
            "poslistm": [
                {
                    "Content": "I really like it nice color and fabric material.",
                    "Rating": "5.0",
                    "Score": 110.0,
                    "Title": "Five Stars"
                },
                {
                    "Content": "The color was on point but the shirt wasnt as comfortable as i thought it would be. It was a bit rough",
                    "Rating": "3.0",
                    "Score": 200.0,
                    "Title": "... color was on point but the shirt wasnt as comfortable as i thought it would be"
                },
                {
                    "Content": "Great fit!  Washes well, didn't shrink or loose colors or lettering",
                    "Rating": "5.0",
                    "Score": 110.0,
                    "Title": "Great buy"
                },
                {
                    "Content": "Came true to size and color. Would definitely recommend purchasing",
                    "Rating": "5.0",
                    "Score": 110.0,
                    "Title": "Exactly as described"
                },
                {
                    "Content": "Never seen this color at any store, great fit and style.",
                    "Rating": "5.0",
                    "Score": 110.0,
                    "Title": "great fit and style"
                },

                {
                    "Content": "Fits perfect! Definitely will be ordering a different color.",
                    "Rating": "5.0",
                    "Score": 110.0,
                    "Title": "Fits as expected"
                },
                {
                    "Content": "I love oversized shirts. This is PERFECT. I literally ordered all colors.",
                    "Rating": "5.0",
                    "Score": 110.0,
                    "Title": "Fits PERFECT. I LOVE IT!"
                },
                {
                    "Content": "Great shirt, love the color",
                    "Rating": "5.0",
                    "Score": 110.0,
                    "Title": "Perfect"
                },
                {
                    "Content": "Great fit. Decent material. Plan to order other colors.",
                    "Rating": "4.0",
                    "Score": 110.0,
                    "Title": "Nice"
                },
                {
                    "Content": "My 4th time purchasing the champion shirts, he now have all colors",
                    "Rating": "5.0",
                    "Score": 110.0,
                    "Title": "The fit is great and as shown in picture"
                },
                {
                    "Content": "Beautiful blue color that hasn't faded yet. My son LOVES this shirt!!",
                    "Rating": "5.0",
                    "Score": 110.0,
                    "Title": "Awesome shirt!"
                },
                {
                    "Content": "I love the color and it fitted great",
                    "Rating": "5.0",
                    "Score": 110.0,
                    "Title": "I love it"
                },
                {
                    "Content": "it looked good color is kinda lighter than picture",
                    "Rating": "4.0",
                    "Score": 110.0,
                    "Title": "decent shirt"
                },
                {
                    "Content": "My Daughter loves it & the color. Fit exactly like it should.",
                    "Rating": "5.0",
                    "Score": 110.0,
                    "Title": "Perfect fit"
                },
                {
                    "Content": "It's thinner than you'd think, the right size, the right color, a little bit of thread, it's pretty quick",
                    "Rating": "4.0",
                    "Score": 100.0,
                    "Title": "It's a little thin. It's ok"
                },
                {
                    "Content": "This is one of my favorite running shirts! Slim fit with breathable material and bright colors. #winner",
                    "Rating": "5.0",
                    "Score": 100.0,
                    "Title": "!"
                },
                {
                    "Content": "Love the color",
                    "Rating": "5.0",
                    "Score": 100.0,
                    "Title": "As expected"
                },
                {
                    "Content": "Wasn\u2019t that bad...color was off and not the true blue/normal blue that champion usually has.",
                    "Rating": "3.0",
                    "Score": 100.0,
                    "Title": "Not bad"
                },
                {
                    "Content": "Came a bit large, but after one wash it was the perfect size and held its color. Product is exactly as you\u2019d expect and I\u2019d highly recommend!",
                    "Rating": "5.0",
                    "Score": 100.0,
                    "Title": "Great for so many occasions!"
                }
            ],
            "summary1": "I got 43 related reviews, 41 are positive  including The color was on point but the shirt wasnt as comfortable as i thought it would be. It was a bit rough and Great fit!  Washes well, didn't shrink or loose colors or lettering and Color was off. Not what I expected material was well made.2 are negative, mentioned that  including Wasn\u2019t a royal blue color was very disappointed in it and The color is not as pictured it\u2019s very faded and ",
            "summaryT": {
                "intro1": "I got 43 related reviews, 41 are positive:",
                "intro2": "2 are negative, mentioned that:",
                "neg": [
                    "Wasn\u2019t a royal blue color was very disappointed in it",
                    "The color is not as pictured it\u2019s very faded"
                ],
                "pos": [
                    "I really like it nice color and fabric material.",
                    "  Washes well, didn't shrink or loose colors or lettering",
                    "The color was on point but the shirt wasnt as comfortable as i thought it would be"
                ]
            },
            "vsum": "The color is a bright, pretty, beautiful blue, not the true blue/normal blue that champion usually has, wasn’t a royal blue."
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


class Product_D extends React.PureComponent {
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
           alt: "A bright blue tee with Taped crew neck, Ribbed sleeve cuffs, C logo on left sleeve."
        })
    };

    handleLink = (question) => {

        if (question.includes("color")){
            this.setState({
                responseFlag: true,
                response:"",
                summary1:demo[1]["answer"]["summary1"],
                poslistm:demo[1]["answer"]["poslistm"],
                neglistm:demo[1]["answer"]["neglistm"],
                vsum:demo[1]["answer"]["vsum"],
                keywordlist:demo[1]["answer"]["keywordlist"],
                summaryT:demo[1]["answer"]["summaryT"],
            });
        }

        if (question.includes("logo")){
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
        }


    };



    render() {
        return <React.Fragment>
            <Row>
                <Col span={8}>
                    <img  style={{margin:"50px", height: "40vmin"}} src={"https://images-na.ssl-images-amazon.com/images/I/91cBhJhzLLL._AC_UX679_.jpg"} alt="A bright blue tee with Taped crew neck, Ribbed sleeve cuffs, C logo on left sleeve." />
                </Col>
                <Col span={6}>
                    <Space  style={{margin:"50px"}} direction="vertical">
                        <Title level={4}>{this.props.title}</Title>
                        <ul>
                            {this.props.info.map((item)=>{return <li><Text>{item}</Text></li>})}
                        </ul>


                        <Select placeholder={"Surf the Web"}  onChange={this.handleChange}>
                            <Option value="Oxford Gray">Oxford Gray</Option>
                            <Option value="Black">Black</Option>
                            <Option value="White">Oxford Gray</Option>
                            <Option value="Surf the Web">Surf the Web</Option>
                            <Option value="Team Red Scarlet">Team Red Scarlet</Option>
                            <Option value="...">...</Option>

                        </Select>

                        <Text mark>[Alt-text]</Text><Text>A bright blue tee with Taped crew neck, Ribbed sleeve cuffs, C logo on left sleeve.</Text>
                    </Space>


                </Col>
                <Col span={10}>
                    <Row style={{margin:"50px"}}>
                        <Col span={24}>
                            <Search
                                placeholder="Please ask me a question!"
                                enterButton="Search"
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

export default Product_D
