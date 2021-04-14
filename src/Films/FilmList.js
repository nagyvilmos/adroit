import adroit from "../adroit";
import Film from "./Film";

export default (props, children) => {
    const {state} = props;
    return (
    <>
        {state
            .map(film => (<Film state={film} />))
        }
    </>);
}