/**
 * Warning message React component using bootstrap 'danger' alert component.
 * @param {*} props - Takes an error message, for example: {errorMsg: "Some errormessage"}
 * @returns React component
 */
function Warning(props){
    if (props.errorMsg) {
      return  <div class="alert alert-danger" role="alert">
                <p>{props.errorMsg}</p>
              </div>
    } else {
        return "";
    }
}