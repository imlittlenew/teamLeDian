import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import index from './components/index';
import brand from './components/brand';
import news from './components/news';
import branch from './components/branch';
import le from "./components/le";
import dian from "./components/dian";
import LogIn from './components/LogIn';
import Profile from './components/Profile';
import order from './components/order';

class App extends Component {
  render() {
    return (      
       <BrowserRouter>
        <div>
            <Switch>
             <Route path="/" component={index} exact/>
             <Route path="/index" component={index} exact/>
             <Route path="/brand" component={brand} exact/>
             <Route path="/news" component={news} exact/>
             <Route path="/branch/:id" component={branch} exact/>
             <Route path="/le" component={le} exact />
             <Route path="/dian" component={dian} exact />
             <Route path="/login" component={LogIn} />
             <Route path="/profile" component={Profile}/>
             <Route path="/order" component={order} exact/>
             
            <Route component={Error}/>
           </Switch>
        </div> 
      </BrowserRouter>
      
    );
  }
}

 
export default App;
