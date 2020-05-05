function Warning(props){
    if (props.errorMsg) {
      return  <div class="alert alert-danger" role="alert">
                <p>{props.errorMsg}</p>
              </div>
    } else {
        return "";
    }
}