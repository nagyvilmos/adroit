//#region Logging
const logType = {
    none:0,
    debug:1,
    info:2,
    log:3,
    warn:4,
    error:5,
}

const _logset = {
    _:logType.warn,
    context:logType.info,
    launcher:logType.debug,
}

const log =(source, level, ...message) => {
    const reqLevel = (typeof level === "string" ? logType[level] : level) || logType.none
    const logLevel = _logset[source] ?? _logset._ ?? logType.none;
    if (logLevel<reqLevel)
    {
        return;
    }
    const func = [
        undefined,
        console.debug,
        console.log,
        console.log,
        console.warn,
        console.error,
    ][reqLevel];

    func && func({source, message});
}
//#endregion Logging

//#region Main DOM
const appendChild = (parent, child) => {
    if (!child)
    {
        return;
    }

    if (Array.isArray(child))
    {
		child.forEach((nestedChild) => appendChild(parent, nestedChild));
    }
    else
	{
    	parent.appendChild(
			child.nodeType ? child : document.createTextNode(child)
        );
    }
}

const buildCss = (struct) => {
    const styles = [];
    Object.entries(struct).forEach(([k,v]) => {
        styles.push(...buildCssBlock(k,v));
    });
    return styles.join("");
}

const fragment = (props, ...children) => {
    return children;
};

const adroit = (tag, props, ...children) => {
	if (typeof tag === "function") {
        return registerCallBack(tag, props, ...children);
    }
	const element = document.createElement(tag);

    if (tag === "style")
    {
        // all css is scoped

        element.toggleAttribute("scoped");
        // turn the props into html body:
        const style = children
            .map(c => buildCss(c))
            .join(" ");
        element.innerHTML = style;
        return element;
    }

    Object.entries(extendProps(props)).forEach(([name, value]) => {
		if (name.startsWith('on') && name.toLowerCase() in window) {
			element.addEventListener(name.toLowerCase().substr(2), value);
		}
        else if (value !== undefined)
        {
            element.setAttribute(name, value.toString());
        }
	})

	children.forEach((child) => {
		appendChild(element, child);
	})

    element.id = props?.id;
	return element;
}
//#endregion Main DOM

//#region Context
/*
The context is a tree object that can be read but should never be altered.
The controller provides a mechanism to amend the context.
Each controller is an object:
    {
        action: entry point to change the context
        reducer: reducer function to amend the context
        include: optional sub-controllers
    }
*/

let _actionActive = false;
const _actionsPending = [];
let _actionTimer;

const _context = {};
const _controller = {};
const _callBackFuncs= [];

const action = (actionName, args) => {
    _actionsPending.push({actionName, args});
    if (!_actionActive)
    {
        _actionActive = true;
        _actionTimer = setTimeout(processAction, 100);
    };
}

const createController = (action, reducer, include) => {
    const controller = {};
    if (action) controller.action = action;
    if (reducer) controller.reducer = reducer;
    if (include) controller.include = include;
    return controller;
}

const extendProps = (props) => {
    const {context } = props || {};
    if (!context)
    {
        return props || {};
    }
    return {...props, state: getState(context)};
}

const getAction = (actionName) => {
    const [actionPath, shortName] = splitPath(actionName,false);
    if (!actionPath)
    {
        return undefined;
    }

    const action = getController(_controller, actionPath)?.action;
    return action
        ?   (typeof action === "string")
            ? getAction(`${action}.${shortName}`)
            : action[shortName]
        : undefined;
};

const getController = (controllerBlock, controllerName) => {
    const [subController, subName] = splitPath(controllerName);
    let controller;
    if (subName &&
        controllerBlock[subController] &&
        controllerBlock[subController].include)
    {
        controller = getController(controllerBlock[subController].include,subName);
    }
    return controller || controllerBlock[subController];
}

const getReducer = (reducerName) => {
    const reducer = getController(_controller, reducerName)?.reducer;
    return reducer
        ?   (typeof reducer === "string")
            ? getReducer(reducer)
            : reducer
        : undefined;
};

const getState = (context) => {
    if (typeof context !== "string") {
        return context.map(getState(context.context));
    }
    let ret = _context;
    context.split(".").forEach(k => {
        ret = ret[k] || {}; 
    })
    console.debug({context,ret})
    return ret;
}

const loadContext = (config) => {
    if (!config)
    {
        return;
    }
    const {context, controller} = config;
    Object.entries(context.default || {}).forEach(([key, value]) => 
        _context[key] = value
    );
    // how do we populate from memory?
    // how do we control what's persisted?
    Object.entries(controller || {}).forEach(([key, value]) => 
        _controller[key] = value
    );
}

const processAction = () => {
    clearInterval(_actionTimer);

    while(_actionsPending.length > 0)
    {
        const actObj = _actionsPending.shift();
        if (_actionsPending.length>0 && _actionsPending[0].actionName === actObj.actionName)
        {
            // duplicate so ignore
            continue;
        }
        const {actionName, args} = actObj;
        console.debug({actionName, args});

        // name is controller[.controller].action
        const actionFunc = getAction(actionName);
        if (!actionFunc)
        {
            console.warn(`Undefined action:${actionName}`);
            return;
        }
        const actionOut = actionFunc(args);

        if (!actionOut)
        {
            return;
        }
        const [context, type] = splitPath(actionName, false);
        const reduceAction = {
            context,
            type,
            ... actionOut
        }
        // allows override from action:
        const contextName = reduceAction.context;
        console.debug({contextName, reduceAction});
            
        reduce(contextName, reduceAction);
    }
    _actionActive = false;
}

const reduce = (contextName, action) => {
    const reduceFunc = getReducer(contextName);
    if (!reduceFunc)
    {
        console.warn(`Undefined reducer:${contextName}`);
        return;
    }

    if (typeof reduceFunc === "string")
    {
        reduce(reduceFunc, action);
        return;
    }

    const oldState = getState(contextName);
    const newState = reduceFunc(oldState, action);
    if (!newState)
    {
        return;
    }
    if (typeof newState === "string")
    {
        reduce(newState, action);
        return;
    }
    // update the state!
    console.log({[contextName]:{oldState, newState, callBack: _callBackFuncs}});
    setState(_context, contextName, newState);

    const callBackContext = contextName.split(".")
    let callBacks = _callBackFuncs
        .filter(f => f.context === contextName);

    while (callBacks.length === 0 && callBackContext.length !== 0)
    {
        const parentContext = callBackContext.join(".");
        callBackContext.pop();
        callBacks = _callBackFuncs
            .filter(f => f.context === parentContext);
    }

    console.debug({callBacks});
    callBacks.forEach((cb) => {
        const element = document.getElementById(cb.id);
        console.debug({cb,element});
        if (element)
        {
            const newElement = cb.tag(extendProps(cb.props), cb.children)
            newElement.id = cb.id;
            element.parentNode.replaceChild(newElement, element);
        }
    });
};

const registerCallBack = (tag, props,children) => {
    const fullProps = props || {};
    const {context, id} = fullProps;
    if (!!context)
    {
        if (!id)
        {
            fullProps.id = `${context}.${Math.random().toString(36).substr(2, 6)}`;
        }
        _callBackFuncs.push({id : fullProps.id, context, tag, props: fullProps,children});;
        console.debug({...(_callBackFuncs[_callBackFuncs.length-1])})
    }
    const element = tag(extendProps(fullProps), children);
    element.id = fullProps.id;
    return element;
}

const setState = (context, stateName, newState) => {
    const [subContext, subName] = splitPath(stateName);
    console.debug({subContext, subName, newState})
    if (!subName)
    {
        context[subContext] = newState;
        console.debug({stateName,context})
        return;
    }
    if (!context[subContext])
    {
        context[subContext] = {};
    }
    setState(context[subContext], subName, newState)
    console.debug({stateName,context})
}

const splitPath = (path, first = true) => {
    const dot = first
        ? path.indexOf(".")
        : path.lastIndexOf(".");
    if (dot === -1)
    {
        return [
            first ? path : undefined,
            first ? undefined : path
        ];
    }
    return [
        path.substr(0,dot),
        path.substr(dot+1)
    ]
} 
//#endregion Context

//#region Styles
const applicationStyles = document.createElement('style');
document.head.append(applicationStyles);

const buildCssBlock = (prefix, struct) => {
    const tag = prefix.startsWith("&")
    ? prefix.substr(1) // tag
    : prefix.startsWith("#")
        ? prefix        // id
        : `.${prefix}`; // class
    const styles = [""];

    Object.entries(struct).forEach(([key, value]) =>
    {
        if (typeof value === "string")
        {
            styles[0] += `${key.replaceAll(/[A-Z]/g,x => "-" + x.toLowerCase())}: ${value};`
        }
        else
        {
            styles.push(...(buildCssBlock(key, value).map(style => `${tag} ${style}`)));
        }
    });

    if (!styles[0])
    {
        return styles.filter((s,i) => i>0);   
    }

    styles[0] = `${tag} \{${styles[0]}}`;
    return styles;
}

const styles = (config) => {
    // Whatever class names are used at the top level, will be inside class-xx
    // so bobby {...} is loaded to .bobby-234 {...}
    // the returned collection is all the class names so {bobby: ".bobby-234"}
    const classNames = {};

    const classSuffix = `-${Math.random().toString(36).substr(2, 6)}`;

    const styles = [];
    Object.entries(config).forEach(([k,v]) => {
        const mappedClass = `${k}${classSuffix}`;
        classNames[k] = mappedClass;
        styles.push(...buildCssBlock(mappedClass, v));
    });

    const appCss = applicationStyles.textContent || "";
    applicationStyles.textContent = appCss
        ? [appCss, ...styles].join(" ")
        : styles.join(" ");
    
    return classNames;
}
//#endregion Styles

//#region Empty Control
const Empty = (props) =>
{
    const classes = styles({
        root: {
            minWidth: "40%",
            maxWidth: "60%",
            marginTop: "16px",
            marginLeft: "auto",
            marginRight: "auto",
            border: "4px solid grey",
            borderRadius:"8px",
            padding: "16px",
            textAlign: "center",
        },
        code: {
            margin: "4px",
            border: "4px solid grey",
            borderRadius:"8px",
            padding: "4px",
            color: "green",
            backgroundColor: "lightgrey",
            textAlign: "left",
            "&pre": {
                margin: "0px",
                padding: "1px"
            }
        },
        footer: {
            textAlign: "right",
            fontSize: "66%"
        }
    });
    
    return (<div class={classes.root}>
        <>
            <h1>Welcome to Adroit</h1>
            <h2>You can create dynamic content with easy jsx functions</h2>
            <p>We'll see how well this works as we add stuff</p>
            <p>If you're seeing this you have an <code>index.html</code> and <code>index.js</code></p>
        </>
        <p>To create an app landing page:</p>
        <div class={classes.code}>
            <pre>// App.js</pre>
            <pre>import adroit from 'adroit';</pre>
            <br/>
            <pre>export default (&lt;div&gt;</pre>
            <pre>    &lt;h1&gt;Heading&lt;/h1&gt;</pre>
            <pre>&lt;/div&gt;)</pre>
        </div>
        <p class={classes.footer}><small><em>{props.date}</em></small></p>
    </div>);
};
//#endregion Empty Control

//#region Launcher
let _app = undefined;

const launch = (app) =>{
    log("launch", logType.debug, `launch adroit ${app ? "from" : "without"} config`)
    _app = app || (<Empty date={new Date()} />);

    var appBlock = document.getElementById("app");
    appBlock.innerHTML = "";
    appendChild(appBlock, _app);
};
//#endregion Launcher

//#region Exports
export {
    action,
    createController,
    launch,
    loadContext,
    styles
};

export default adroit;
//#endregion Exports
