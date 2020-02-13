/*
    Login panel component
*/

class LoginPanel extends React.Component{
    render(){
        return <div id="login">
                    <form action="/login">
                        <input type="text" id="email" name="email address" placeholder="Your email address.."></input>
                        <input type="password" id="password" name="password"></input>

                        <input id="login" type="submit" value="Login"></input>
                    </form>
                </div>
    }
}

function showLoginPanel(){
    const element = <LoginPanel/>;
    ReactDOM.render(element, document.getElementById("menu"));
}

showLoginPanel();