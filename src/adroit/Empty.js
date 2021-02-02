import {style} from ".";
import adroit from ".";
import { styles } from "./styles";

const classes = styles({
    root: {
        minWidth: "40%",
        maxWidth: "60%",
        marginTop: "16px",
        marginLeft: "auto",
        marginRight: "auto",
        border: "4px solid grey",
        borderRadius:"8px",
        padding: "16px",
        textAlign: "center",
    },
    code: {
        margin: "4px",
        border: "4px solid grey",
        borderRadius:"8px",
        padding: "4px",
        color: "green",
        backgroundColor: "lightgrey",
        textAlign: "left",
        "&pre": {
            margin: "0px",
            padding: "1px"
        }
    },
    footer: {
        textAlign: "right",
        fontSize: "66%"
    }
});

export default (props, ...children) =>
{
    return (<div>
        <div class={classes.root}>
            <>
                <h1>Welcome to Adroit</h1>
                <h2>You can create dynamic content with easy jsx functions</h2>
                <p>We'll see how well this works as we add stuff</p>
                <p>If you're seeing this you have an <code>index.html</code> and <code>index.js</code></p>
            </>
            <p>To create an app landing page:</p>
            <div class={classes.code}>
                <pre>// App.js</pre>
                <pre>import adroit from 'adroit';</pre>
                <br/>
                <pre>export default (&lt;div&gt;</pre>
                <pre>    &lt;h1&gt;Heading&lt;/h1&gt;</pre>
                <pre>&lt;/div&gt;)</pre>
            </div>
            <p>Then [what ever next]</p>
            <p class={classes.footer}><small><em>{props.date}</em></small></p>
        </div>
    </div>);
};
