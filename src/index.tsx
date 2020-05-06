import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import * as auth from './auth';
import * as priceBoard from './price_board'

interface IndexState {
    isLoggedIn: boolean
    profile: auth.Profile
}

class Index extends React.Component {
    state: IndexState;

    constructor(props: any) {
        super(props);
        // binding is necessary to make `this` work in the callback
        this.setStateProfile = this.setStateProfile.bind(this);
        this.state = {isLoggedIn: false, profile: auth.DefaultProfile};
    }

    render() {
        return (<div>
            <div id="leftNavigator" className="leftNavigator">
                <auth.ProfileCpn
                    isLoggedIn={this.state.isLoggedIn}
                    profile={this.state.profile}
                    onProfileChange={this.setStateProfile}
                />
                <auth.LoginCpn
                    isLoggedIn={this.state.isLoggedIn}
                    profile={this.state.profile}
                    onProfileChange={this.setStateProfile}
                />
            </div>
            <div id="content" className="content">
                <priceBoard.PriceBoardCpn/>
            </div>
        </div>);
    }

    setStateProfile(isLoggedIn: boolean, profile: auth.Profile) {
        if (isLoggedIn) {
            this.setState({isLoggedIn: true, profile: profile})
        } else {
            this.setState({isLoggedIn: false, profile: auth.DefaultProfile})
        }
    }
}

ReactDOM.render(
    <Index/>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
