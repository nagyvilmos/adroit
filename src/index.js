// Create the HTML elements needed for a card
import adroit from "./adroit";
import App from "./App";
import launch from "./adroit/launch";
import { initialContext } from "./adroit/context"
// const app = (<div>
//         <h1>head bar and stuff</h1>
//         <h2>and more n more</h2>
//         <p>lorum ipsum herre we go</p>
//     </div>
// );

initialContext({
    default: {
        dummy: {
            count: 12
        }
    }
});
const app = (<App context ="dummy"/>);
console.log({app})
launch(app);
//launch();
