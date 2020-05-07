import React from 'react';
import * as table from './table'

export interface Profile {
    ScreenName: string
    Username: string
    Id: number
    Title: string
    ContactPhone: string
    ContactEmail: string
    Picture: string
}


export interface ProfileProps {
    isLoggedIn: boolean
    profile: Profile
    onProfileChange: (isLoggedIn: boolean, profile: Profile) => void
}


export class ProfileCpn extends React.Component<ProfileProps> {
    render() {
        let data: table.KeyValue[] = [
            {Key: "ScreenName", Val: this.props.profile.ScreenName},
            {Key: "Username", Val: this.props.profile.Username},
            {Key: "Id", Val: this.props.profile.Id},
            {Key: "Title", Val: this.props.profile.Title},
            {Key: "Phone", Val: this.props.profile.ContactPhone},
            {Key: "Email", Val: this.props.profile.ContactEmail},
        ];
        return (<div className="myBigBorder">
            <img id="profilePicture"
                 alt="profilePicture"
                 style={{
                     display: "block",
                     marginLeft: "auto",
                     marginRight: "auto",
                     maxWidth: "80%",
                     height: "256px",
                     width: "256px",
                 }}
                 src={process.env.PUBLIC_URL + this.props.profile.Picture}
            />
            <div id="profileDetail">
                <table.TableTwoColsCpn data={data}/>
            </div>
        </div>);
    }
}


export class LoginCpn extends React.Component<ProfileProps> {
    state: LoginState;

    constructor(props: any) {
        super(props);
        this.handleChangeUsername = this.handleChangeUsername.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.state = {
            Username: "", Password: "", Error: "", Response: undefined,
        }
    }

    render() {
        return (
            <div className="myBigBorder">
                <form id="loginForm" onSubmit={this.handleSubmit}>
                    Username
                    <input className="fit" autoComplete="on"
                           placeholder="Username"
                           disabled={this.props.isLoggedIn}
                           onChange={this.handleChangeUsername}>
                    </input>
                    Password
                    <input className="fit" autoComplete="on"
                           placeholder="Password"
                           disabled={this.props.isLoggedIn}
                           onChange={this.handleChangePassword}>
                    </input>
                    <span className="error">{this.state.Error}</span>
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        paddingTop: "15px",
                    }}>
                        <input className="loginButton" type="submit"
                               value="Login" disabled={this.props.isLoggedIn}/>
                        <a href="#login" style={{fontSize: "80%"}}>
                            forgot password
                        </a>
                    </div>
                </form>
                <button className="loginButton"
                        disabled={!this.props.isLoggedIn}
                        onClick={this.handleLogout}>
                    Logout
                </button>
            </div>
        );
    }

    handleChangeUsername(event: React.FormEvent<HTMLInputElement>) {
        this.setState({Username: event.currentTarget.value});
    }

    handleChangePassword(event: React.FormEvent<HTMLInputElement>) {
        this.setState({Password: event.currentTarget.value});
    }

    async handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault(); // do not refresh page
        let loginUrl = `${process.env.REACT_APP_BACKEND_ADDRESS}/login`;
        let req = {method: "POST", body: JSON.stringify(this.state)};
        console.log(`about to fetch: url: ${loginUrl}`, req);
        try {
            let resp = await fetch(loginUrl, req);
            if (!resp.ok) {
                throw new Error(`response status: ${resp.status} ${resp.statusText}`)
            }
            let res = await resp.json();
            console.log("received response: ", res);
            this.setState({Error: res.Error, Response: res});
            if (!res.Error) {
                this.props.onProfileChange(true, {
                    ScreenName: res.StaffDetail.ScreenName,
                    Username: res.StaffDetail.Username,
                    Id: res.StaffDetail.Id,
                    Title: res.StaffDetail.Title,
                    ContactPhone: res.StaffDetail.ContactPhone,
                    ContactEmail: res.StaffDetail.ContactEmail,
                    Picture: "lulu.gif",
                })
            }
        } catch (err) {
            let errMsg = `error when fetch: ${err.message}`;
            console.log(errMsg);
            this.setState({Error: errMsg, Response: undefined});
        }
    }

    handleLogout() {
        this.props.onProfileChange(false, DefaultProfile)
    }
}

export const DefaultProfile: Profile = {
    ScreenName: "Guess",
    Username: "guess",
    Id: 0,
    Title: "",
    ContactPhone: "",
    ContactEmail: "guess@mail.com",
    Picture: "gopher.png",
};


interface LoginState {
    Username: string
    Password: string
    Error: string
    Response?: LoginResp
}

interface LoginResp {
    "Error": string,
    "AuthToken": string,
    "StaffDetail": {
        "Id": number,
        "DepartmentId": number,
        "Department": {
            "Id": number,
            "Company": {
                "Id": number,
                "Name": string,
                "ContactPhone": string,
                "ContactEmail": string,
                "Address": string
            },
            "Name": string,
            "Address": string
        },
        "Username": string,
        "ScreenName": string,
        "ContactPhone": string,
        "ContactEmail": string,
        "Title": string,
        "Role": string
    }
}