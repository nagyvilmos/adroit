import fragment from "./fragment";
import adroit from ".";
export default (props, ...children) =>
{
    return (<div
        style={`
            min-width: 40%;
            margin-top: 16px;
            margin-left: auto;
            margin-right: auto;
            border:4px solid grey;
            border-radius:8px;
            padding: 16px;
            text-align: center;
        `}
    >
        <>
            <h1>Welcome to Adroit</h1>
            <h2>You can create dynamic content with easy jsx functions</h2>
            <p>We'll see how well this works as we add stuff</p>
            <p>If you're seeing this you have an <code>index.html</code> and <code>index.js</code></p>
        </>
        <p>To create an app landing page:</p>
        <div style={`
        margin: 4px;
        border:4px solid grey;
        border-radius:8px;
        padding: 4px;
        color: green;
        background-color: lightgrey;
        text-align: left;`}><p><code>// App.js<br/>
            import createElement from 'adroit/createElement.js;<br/>
            <br/>
            export default (&lt;div&gt;<br/>
                &lt;h1&gt;Heading&lt;/h1&gt;<br/>
            &lt;/div&gt;)</code></p></div>
            <p>Then [what ever next]</p>
        <p style={`text-align: right;`}><small><em>{props.date}</em></small></p>
    </div>);
};
