import adroit from "../adroit";
import Film from "./Film"
import Filter from "./Filter"

export default (props) => {
    const {state} = props;
    const filterName = state?.filter?.name;
    return (<div>
        <Filter state={state.filter} />
        {state.list
            .filter(film => !filterName || film.title.toLowerCase().includes(filterName))
            .map(film => (<Film state={film} />))
        }
    </div>)
}