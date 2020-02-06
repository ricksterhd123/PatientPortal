function showWelcome() {
  const element = React.createElement(Welcome, {
    name: "Ricky"
  });
  ReactDOM.render(element, document.getElementById('root'));
}

showWelcome();
console.log("test");