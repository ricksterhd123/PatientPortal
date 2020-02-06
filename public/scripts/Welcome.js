class Welcome extends React.Component {
  render() {
    let greeting = React.createElement("h1", null, "Welcome ", this.props.name);
    return greeting;
  }

}