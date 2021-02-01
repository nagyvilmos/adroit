import fragment from "./adroit/fragment";
import adroit from "./adroit";

export default (props) => {
    return (<div>
        <style>{{special: {
                clever: {
                    fontSize: "150%",
                    border: "2px solid red"
                }
            },
            "clever": {
                fontSize: "75%",
                border: "1px solid blue"
            }
        }}
        </style>
        <h1>head bar and stuff</h1>
        <h2>and more n more</h2>
        <div class="special">
        <p class="clever">lorum ipsum here we go again</p>
        </div>
        <p class="clever">lorum ipsum here we go again</p>
    </div>);
};
