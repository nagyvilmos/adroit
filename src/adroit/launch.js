import adroit, { appendChild } from "./index";
import Empty from "./Empty";

let _app = undefined;

export default (app) =>{
    _app = app || (<Empty date={new Date()} />);

    var appBlock = document.getElementById('app');
    appBlock.innerHTML = "";
    appendChild(appBlock, _app);
}
