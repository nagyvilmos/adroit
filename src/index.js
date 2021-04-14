// Create the HTML elements needed for a card
import adroit from "./adroit";
import data from "./data";
import App from "./App";
import launch from "./adroit/launch";
import { createController, loadContext } from "./adroit/context"

const context = {
    default: data,
}


const filterController = createController(
    {
        setFilm: (film) => {
            return {
                film
            }
        }
    },
    (state, action) => {
        switch (action.type)
        {
            case "setFilm":
                return {
                    ...state,
                    film: action.film
                }
        }
        return "films"; //go up the chain
    }
)

const filmsController = createController(
    {},
    (state, action)=> {
        return undefined;
    },
    {filter: filterController}
);

const controller = {
    films: filmsController
}

loadContext({
    context,
    controller
});

const app = (<App/>);
launch(app);
//launch();
