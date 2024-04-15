import './App.css';
import HomePage from "./Pages/HomePage";
import ChatPage from "./Pages/ChatPage";
import StackPage from "./Pages/StackPage";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ChatState } from './Context/ChatProvider';
import { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import ProfileCreate from './Pages/ProfileCreate';

function App() {

  

  
  return (
    <div className="App">


      <Route path="/" component={HomePage} exact />
      <Route path="/chats" component={ChatPage}exact/>
      <Route path="/profileCreate" component={ProfileCreate}exact/>
      <Route path="/stack" component={StackPage} exact/>

        

        
    </div>
  );
}

export default App;
