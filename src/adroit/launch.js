import adroit from ".";
import Empty from "./Empty";

let _app = undefined;

export default (app) =>{
    console.log({setApp: app});
    _app = app || (<Empty date={new Date()} />);
    var appBlock = document.getElementById('app');
    appBlock.innerHTML = "";
    appBlock.append(_app);
}
