import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import index from './components/index';
import brand from './components/brand';

 
class App extends Component {
  render() {
    return (      
       <BrowserRouter>
        <div>
            <Switch>
             <Route path="/" component={index} exact/>
             <Route path="/index" component={index} exact/>
             <Route path="/brand" component={brand} exact/>

            <Route component={Error}/>
           </Switch>
        </div> 
      </BrowserRouter>
      
    );
  }
}
 
export default App;