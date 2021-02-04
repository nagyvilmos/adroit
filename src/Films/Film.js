import adroit, { styles } from "../adroit";

const classes = styles({
    card: {
        backgroundColor: "#e0e0b0",
        boxShadow: "10px 10px 5px 0px #b0b0e0",
        margin: "15px",
        textAlign: "center",
        paddingBottom: "10px",
    },
    year: {
        fontSize: "90%",
        fontWeight: "lighter",
        marginLeft:  "20px"
    },
    poster: {
        width: "40%",
        height: "auto"
    },
    info: {
        fontWeight: "lighter",
        backgroundColor: "#b0b090",
        margin: "12px"
    }
});

export default (props) => {
    const {state} = props;
    const star = state.cast ? state.cast[0] : "an unnamed star";
    const others = state.cast?.length>1 ? state.cast.filter((f,i) => i>0) : ["nobody"];
    return (<div class={classes.card}>
        <h2>{state.title} <span class={classes.year}>{state.year}</span></h2>
        <h4>Staring {star}</h4>
        <p>Featuring {others.join(", ")}.</p>
        <img class={classes.poster} src={state.xposter}/>
        {state.info && <p class={classes.info}>{state.info}</p>}
    </div>);
} 