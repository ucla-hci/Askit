//React
import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Switch} from "react-router-dom";

//CSS

import "antd/dist/antd.css";
import './assets/css/index.css'
import { ThemeProvider } from "@chakra-ui/core";

//Components
import Home from "./pages/Home"
import MyNav from "./components/Utils/MyNav";

ReactDOM.render(
    <ThemeProvider>
        <MyNav/>
        <BrowserRouter>
            <Switch>
                <Route path='/home' component={Home}/>
            </Switch>
        </BrowserRouter>
    </ThemeProvider>,
    document.getElementById('root')
);
