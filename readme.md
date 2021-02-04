# Adroit js

This is the initial cut for ***Adroit***.

The idea is a light framework for reactive web apps.
Supported functions aimed for v0.1:
- Pure JSX functions,
- Component level context, and
- Action & reducer model.
- Application router,

## Pure JSX functions
By design, ***Adroit*** is function based JSX components.
A component is designed as:

```
import adroit from "adroit";

export default (props) => {
    return (<div>
        <p>Lorum Ipsum</p>
    </div>
};
```

***Adroit*** supports jsx in code styles.

A style block can be added to any component, or scoped styles using the `style` function.

```
import adroit, {styles} from "adroit";

const classes = styles({
    special: {
        [...]
    }
})
export default (props) => {
    return (<div class={classes.special}>
        [...]
    </div>
};
```

The classes that are defined at this level are mapped to special
## Component level context

## Action & Reducer model
## Application router
