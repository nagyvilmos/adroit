// Create the HTML elements needed for a card
import App from "./App";
import adroit from "./adroit";
import launch from "./adroit/launch";

// const app = (<div>
//         <h1>head bar and stuff</h1>
//         <h2>and more n more</h2>
//         <p>lorum ipsum herre we go</p>
//     </div>
// );
const app = (<App />);
console.log({app})
launch(app);
