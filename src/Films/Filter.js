import adroit, {styles, action} from "../adroit";

const classes = styles({
    root: {
        display: "flex",
        justifyContent: "flex-end",
        backgroundColor: "#e0e0b0",
        boxShadow: "10px 10px 5px 0px #b0b0e0",
        textAlign: "center",
        paddingBottom: "10px",
    },
    filter: {
        border: "2px solid",
        borderRadius: "4px"
    }
});

export default (props) => {
    const { state } = props;
    console.log({state})
    return (<div class={classes.root}>
        <input 
            id="filmName"
            class={classes.filter}
            type="text"
            onInput={(ev) => action("films.filter.setFilm", ev.target.value)}
            initialValue={state?.film}
            placeholder="Film name"
        />
    </div>);
};
