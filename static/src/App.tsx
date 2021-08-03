import React from "react";
import test from "./routes/App";
import Landing from "routes/Landing";
import { Switch, Route } from "react-router";
import "./index.css";
import Auth from "routes/Auth";
import Dashboard from "routes/Dashboard";
import Profile from "routes/Profile";
import Faq from "routes/Faq";

function App() {
    return (<Switch>
        <Route exact path="/app" component={test} />
        <Route exact path="/faq" component={Faq} />
        <Route exact path="/profile" component={Profile} />
        <Route exact path="/" component={Landing} />
        <Route exact path="/auth" component={Auth} />
        <Route exact path="/dash" component={Dashboard} />
    </Switch>);
}

export default App;