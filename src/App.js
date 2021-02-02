import adroit, {styles} from "./adroit";

const classes = styles({
    special: {
        "&p": {
            fontSize: "150%",
            border: "2px solid red"
        }
    },
    clever: {
        fontSize: "75%",
        border: "1px solid blue"
    }
});
console.log(classes);
export default (props) => {
    const {state} = props;
    return (<div>
        <h1>head bar and stuff</h1>
        <h2>and more n more</h2>
        <div class={classes.special}>
            <p >lorum ipsum here we go again</p>
        </div>
        <p class={classes.clever}>The current count is {state.count || 'not set'}</p>
    </div>);
};
