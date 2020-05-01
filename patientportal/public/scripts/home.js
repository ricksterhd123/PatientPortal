/* jshint esversion: 6 */
class IndexNavigation extends React.Component {
  render() {
    return /*#__PURE__*/React.createElement("div", {
      id: this.props.id
    }, /*#__PURE__*/React.createElement("h1", {
      id: "name"
    }, this.props.name), /*#__PURE__*/React.createElement("div", {
      id: "links"
    }, /*#__PURE__*/React.createElement("a", {
      id: "appointments",
      className: "big-button",
      href: "/appointments"
    }, "Appointments"), /*#__PURE__*/React.createElement("a", {
      id: "contact",
      className: "big-button",
      href: "/contact"
    }, "Contact GP"), /*#__PURE__*/React.createElement("a", {
      id: "symptoms",
      className: "big-button",
      href: "https://www.google.com/"
    }, "Symptom search"), /*#__PURE__*/React.createElement("a", {
      id: "settings",
      className: "big-button",
      href: "/settings"
    }, "Settings")), /*#__PURE__*/React.createElement("a", {
      id: "logout",
      href: "/api/logout"
    }, "Logout"));
  }

}

function showWelcome() {
  const element = /*#__PURE__*/React.createElement(IndexNavigation, {
    id: "foo",
    name: "Nuffield health center"
  });
  ReactDOM.render(element, document.getElementById("menu"));
}

showWelcome();