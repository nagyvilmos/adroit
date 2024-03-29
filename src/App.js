import adroit, {styles} from "./adroit";
import Films from "./Films";
const classes = styles({
    app: {
        minWidth: "40%",
        maxWidth: "60%",
        marginTop: "16px",
        marginLeft: "auto",
        marginRight: "auto",
        border: "4px solid grey",
        borderRadius:"8px",
        padding: "16px",
    }
});

export default (props) => {
    const {state} = props;
    console.debug("load");
    const film = (<div id="films-db" class={classes.app}>
        <h1>Films</h1>
        <Films id="films-list" />
    </div>);
    console.debug("done");
    return film;
};
