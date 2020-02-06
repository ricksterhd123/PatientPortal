class Welcome extends React.Component {
    render(){
        let greeting = <h1>Welcome {this.props.name}</h1>;
        return greeting;
    }
}