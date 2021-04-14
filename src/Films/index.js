import adroit from "../adroit";
import FilmList from "./FilmList"
import Filter from "./Filter"

export default (props) => {
    return (<div>
        <Filter context="films.filter" />
        <FilmList context={{
            context: "films",
            map: (ctx) => {
                return ctx.list; 
            }}}
        />
    </div>)
}