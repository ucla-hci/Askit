import React from 'react';
import {Input, Box, Button, Grid,Text } from '@chakra-ui/core';
import { FiCrosshair} from "react-icons/fi"
import {GrMicrophone} from "react-icons/gr"
import { IconButton, Heading } from "@chakra-ui/core";
import { List, ListItem} from "@chakra-ui/core";
import { MdSearch } from "react-icons/md";

import {
  InputGroup,
  InputRightElement

} from "@chakra-ui/core";
import "../assets/css/App2.css";
import axios from 'axios';
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();

class ReviewText extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      show:false
    }
  }
  handleClick() {
    if (this.state.show) {
      this.setState({ show: false })
    }
    else{
      this.setState({ show: true })
    }
  }
  render(){
    return(
        <div>
          <span>{this.props.reviews["Content"]}</span>
        </div>)
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
    // console.log(this.props.keywordslist);
    var list = this.props.list;
    // var keywordslist = this.props.keywordslist;
    console.log(list);
    return (
        <Grid>
          {(list === undefined)?void(0):<Grid templateColumns="repeat(1, 1fr)">
            <List aria-label="review list"
                  style={{maxHeight:"300px", overflowY: "scroll"}} spacing={3}>
              {list.map((item) =>
                  <ListItem marginLeft="-40px" aria-label="review detail"
                  >
                    <Grid templateColumns="repeat(1, 1fr)">

                        <span style={{
                          fontSize: "13px",
                          lineHeight: "19px",
                          color:'#111',
                          fontWeight:"700"}}>
                        {item["Title"]}
                      </span>

                      <Grid marginTop="-5px">
                        <ReviewText reviews={item}/>
                      </Grid>
                    </Grid>
                  </ListItem>)}
            </List>
          </Grid>}
        </Grid>
    );
  }
}



class Askit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      responseFlag:false,
      summary1:"",
      response:"",

      poslistm:[],
      summaryT:[],

      neglistm:[],

      question:""
    };
    this.testSpeech =  this.testSpeech.bind(this);
  }

  handleChange(e) {
    this.setState({question: e.target.value});
    console.log(this.state.question)
  }
  testSpeech() {
    console.log("1sdf");
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.start();
    var that = this;
    recognition.onresult = function(event) {
      var result = event.results[0][0].transcript.toLowerCase();
      console.log(result);

      if(result!==""){
        axios.get("https://048d07daefef.ngrok.io/"+this.props.asin+"/"+ result.replace(" ", "+"))
            .then(res => {
              const response = res.data;
              console.log(response["answer"]);
              that.setState({
                responseFlag: true,
                response:"",

                summary1:response["answer"]["summary1"],

                poslistm:response["answer"]["poslistm"],

                neglistm:response["answer"]["neglistm"],

                summaryT:response["answer"]["summaryT"],
                question:result
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
    recognition.onspeechend = function() {
      recognition.stop();
    };

    recognition.onerror = function(event) {

    };
    recognition.onaudiostart = function(event) {
      //Fired when the user agent has started to capture audio.
      console.log('SpeechRecognition.onaudiostart');
    };

    recognition.onaudioend = function(event) {
      //Fired when the user agent has finished capturing audio.
      console.log('SpeechRecognition.onaudioend');
    };

    recognition.onend = function(event) {
      //Fired when the speech recognition service has disconnected.
      console.log('SpeechRecognition.onend');
    };

    recognition.onnomatch = function(event) {
      //Fired when the speech recognition service returns a final result with no significant recognition. This may involve some degree of recognition, which doesn't meet or exceed the confidence threshold.
      console.log('SpeechRecognition.onnomatch');
    };

    recognition.onsoundstart = function(event) {
      //Fired when any sound — recognisable speech or not — has been detected.
      console.log('SpeechRecognition.onsoundstart');
    };

    recognition.onsoundend = function(event) {
      //Fired when any sound — recognisable speech or not — has stopped being detected.
      console.log('SpeechRecognition.onsoundend');
    };

    recognition.onspeechstart = function (event) {
      //Fired when sound that is recognised by the speech recognition service as speech has been detected.
      console.log('SpeechRecognition.onspeechstart');
    };
    recognition.onstart = function(event) {
      //Fired when the speech recognition service has begun listening to incoming audio with intent to recognize grammars associated with the current SpeechRecognition.
      console.log('SpeechRecognition.onstart');
    }
  };

  handleVClick () {
    console.log("v button clicked");
    var audio = new Audio("demo/src/sound.mp3");
    audio.play();
    this.testSpeech();
  }

  handleRClick (){
    if(this.state.responseFlag === true){
      this.setState({responseFlag:false});
    }
  }

  handleLClick (){
    if(this.state.responseFlag === false){
      this.setState({responseFlag:true});
    }
  }

  handleClick (event) {
    if(this.state.question!==""){
      axios.get("https://048d07daefef.ngrok.io/"+this.props.asin+"/"+ this.state.question.replace(" ", "+"))
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
    event.preventDefault();
  }




  render() {
    console.log('Sectioncard rendered');
    // let asin = this.props.asin;
    // let infolist = this.props.infolist;
    // let alt = this.props.alt;
    // let image = this.props.image;
    // let rating = this.props.rating;

    return (
        <Grid templateColumns="repeat(1, 1fr)" gap={6}>
          <Box style={{  display: 'flex',
            alignItems: 'center',
            width: '500px',
            padding: "0 10px",
            minHeight:"100px",
            overflowY:"scroll",
            overflowX:"hidden",
            backgroundColor: "#ffffff"}}>
            <Grid
                templateColumns="repeat(1, 1fr)">
              <Grid
                  role="main"
                  aria-label="Askit Search Bar"
                  aria-required="true"
                  style={{marginTop: "10px", marginBottom:"15px"}} templateColumns="repeat(1, 1fr)" gap={1}>
                <Grid templateColumns="repeat(1, 1fr)">
                  <Heading as="h1" size="md" style={{
                    fontWeight: "700",
                    fontSize: "21px",
                    lineHeight: "1.3",
                    fontFamily: "'Amazon Ember',Arial,sans-serif"
                  }}>
                    Have a question?
                  </Heading>
                  <Text style={{
                    marginTop:"-10px",
                    fontSize: "12px",
                    lineHeight: "1.5",
                    color:'#555'}}>Find answers in product info, Q&As, reviews</Text>
                </Grid>
                <form onSubmit={this.handleClick.bind(this)}>
                  <Grid templateColumns="repeat(1, 1fr)" >
                    <InputGroup width="400px">
                      <Input placeholder={"Please ask me a question!"}
                             value={this.state.question}
                             style={{
                               border: "1px solid #a6a6a6",
                               borderTopColor: "#949494",
                               borderRadius: "3px",
                               boxShadow:"0 1px 0 rgba(255,255,255,.5), 0 1px 0 rgba(0,0,0,.07) inset",
                               outline:"0"
                             }}
                             onChange={(e) => {this.handleChange(e)}}/>
                      <InputRightElement children={<Grid templateColumns="repeat(2, 1fr)"><IconButton
                          variant="outline"
                          leftIcon="add" variantColor="teal"
                          aria-label="Ask by Voice"
                          icon={GrMicrophone}
                          onClick= {this.handleVClick.bind(this)}
                      /> <IconButton
                          variantColor="teal" icon={MdSearch} type="submit" >
                      </IconButton></Grid>} />

                    </InputGroup>
                  </Grid>
                </form>
                {/*{this.state.responseFlag?<Button onClick={this.handleRClick.bind(this)} leftIcon={FiCrosshair} variantColor="red" variant="solid" width="150px">*/}
                {/*  Hide Reviews*/}
                {/*</Button>:void(0)}*/}
                {!this.state.responseFlag&&this.state.summary1!==""?<Button onClick={this.handleLClick.bind(this)} leftIcon={FiCrosshair} variantColor="green" variant="solid" width="150px">
                  Show Reviews
                </Button>:void(0)}

              </Grid>
              <Grid>
                <Grid>{this.state.attribute===""||!this.state.responseFlag?void(0):  <Grid templateColumns="repeat(1, 1fr)">
                  <Heading as="h1" size="md" style={{
                    fontWeight: "700",
                    fontSize: "21px",
                    lineHeight: "1.3",
                    fontFamily: "'Amazon Ember',Arial,sans-serif"
                  }}>
                    Visual Summary
                  </Heading>
                  <Text style={{
                    marginTop:"-10px",
                    fontSize: "13px",
                    lineHeight: "19px",
                    color:'#111'}}>{this.state.attribute}</Text>
                </Grid>}</Grid>
                {this.state.responseFlag?<Grid templateColumns="repeat(1, 1fr)" gap={2}>
                  <Grid
                      role="region"
                      templateColumns="repeat(1, 1fr)" gap={6}>
                    <Grid templateColumns="repeat(1, 1fr)">
                      <Heading as="h1" size="md" style={{
                        fontWeight: "700",
                        fontSize: "21px",
                        lineHeight: "1.3",
                        fontFamily: "'Amazon Ember',Arial,sans-serif"
                      }}>
                        Reviews Summary
                      </Heading>
                      <Text style={{
                        marginTop:"-10px",
                        fontSize: "13px",
                        lineHeight: "19px",
                        maxHeight:"300px",
                        overflowY:"scroll",
                        color:'#111'}}>{this.state.summaryT["intro1"]}<br/>
                        {this.state.summaryT["pos"].map((item) => <li>{item}</li> )}
                        {this.state.summaryT["intro2"]}
                        {this.state.summaryT["neg"].map((item) => <li>{item}</li> )}
                      </Text>
                    </Grid>
                    <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                      <Grid
                          role="region"
                          aria-label="Positive Reviews"
                          marginTop="-30px"
                      >
                        <Heading as="h2" size="md" style={{
                          fontWeight: "700",
                          fontSize: "21px",
                          lineHeight: "1.3",
                          fontFamily: "'Amazon Ember',Arial,sans-serif"
                        }}>
                          Positive Reviews List
                        </Heading>
                        <ReviewList aria-label="positive review list"
                                    list={this.state.poslistm}  flag={"pos"}/>


                      </Grid>
                      <Grid
                          role="region"
                          aria-label="Negative Reviews"
                          marginTop="-30px"
                      >
                        <Heading as="h2" size="md" style={{
                          fontWeight: "700",
                          fontSize: "21px",
                          lineHeight: "1.3",
                          fontFamily: "'Amazon Ember',Arial,sans-serif"
                        }}>
                          Negative Reviews List
                        </Heading>
                        <ReviewList aria-label="negative review list"
                                    list={this.state.neglistm} flag={"neg"}/>

                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>:void(0)}
              </Grid>
            </Grid>
          </Box>
        </Grid>
    );
  }
}

export default function Page(props) {

  return (
      <div >
        <Askit asin={props.asin} infolist={props.infolist} alt={props.alt} image={props.image} rating={props.rating} style={{overflowY:"scroll"}}/>
      </div>
  );
}
