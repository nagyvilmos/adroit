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
import adroit from "adroit"; // required import

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

[tbc]

## Action & Reducer model

[tbc]

## Application router

[tbc]

## Setting up an **Adroit** project

### Dependancies

[tbc]

### Entry Page

The web app needs an entry point. SPA or multipage, the concept is the same.

All you need is a single page with a single `div` called `app`. We suggest you have some default content to show should there be a problem such as disabled javascript.

`index.html`
```
<!DOCTYPE html>
<html>
  <head>
   <title>Adroit Test</title>
   <meta charset="UTF-8" />
  </head>
 <body>
  <div id="app">
    <h1>Adroit Test</h1>
    <p>This is replaced by the application</p>
  </div>
</body>
</html>
```

Everything that's left is javascript.  Build an entry point, more on this later, and then start working from there.

`src/index.js`
```
import adroit  from "./adroit";
import launch from "./adroit/launch";

launch();
```

Then call the script from the page:
`index.html`
```
  ...
  </div>
  <script src="src/test.js"></script>
</body>
```

Now loading will show the default **adroit** page to let you know the wiring is in place.

