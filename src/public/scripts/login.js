/* jshint esversion: 6 */
class LoginPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      success: true
    };
    this.userInputHandle = this.userInputHandle.bind(this);
    this.passInputHandle = this.passInputHandle.bind(this);
    this.submitHandle = this.submitHandle.bind(this);
  }

  userInputHandle(event) {
    this.setState({
      username: event.target.value
    });
  }

  passInputHandle(event) {
    this.setState({
      password: event.target.value
    });
  }

  submitHandle(event) {
    let xmlHttp = new XMLHttpRequest();
    let self = this;
    xmlHttp.open("POST", "/api/login", false);
    xmlHttp.setRequestHeader("Authorization", "Basic " + btoa(this.state.username + ":" + this.state.password));

    xmlHttp.onload = function (e) {
      if (xmlHttp.readyState === 4) {
        if (xmlHttp.status === 200) {
          console.log(xmlHttp.responseText);
          let success = JSON.parse(xmlHttp.responseText).success;

          if (success) {
            window.location.href = "/";
          } else {
            self.setState({
              success: false
            });
          }
        } else {
          console.error(xmlHttp.statusText);
        }
      }
    };

    xmlHttp.onerror = function (e) {
      console.error(xhr.statusText);
    };

    xmlHttp.send(null);
    console.log("happened"); // send request, don't care about response

    event.preventDefault();
  }

  render() {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "The Nuffield Center GP"), /*#__PURE__*/React.createElement("p", null, this.state.success ? "" : "Failed to login please try again"), /*#__PURE__*/React.createElement("input", {
      type: "text",
      name: "username",
      placeholder: "Username",
      onChange: this.userInputHandle
    }), /*#__PURE__*/React.createElement("input", {
      type: "password",
      name: "password",
      onChange: this.passInputHandle
    }), /*#__PURE__*/React.createElement("button", {
      type: "submit",
      value: "Login",
      onClick: this.submitHandle
    }, "Login"), /*#__PURE__*/React.createElement("p", null, "Not registered?"), /*#__PURE__*/React.createElement("a", {
      href: "/register"
    }, "Sign up"));
  }

}

function showLoginPanel() {
  const element = /*#__PURE__*/React.createElement(LoginPanel, null);
  ReactDOM.render(element, document.getElementById("menu"));
}

showLoginPanel();