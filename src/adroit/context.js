/*
The context is a tree object that can be read but should never altered.
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
        return context.map(getContext(ctx.context));
    }
    let ret = _context;
    context.split(".").forEach(k => {
        ret = ret[k] || {}; 
    })
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
            const newElement = cb.tag(cb.props, cb.children)
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
    if (!subName)
    {
        context[subContext] = newState;
        return;
    }
    if (!context[subContext])
    {
        context[subContext] = {};
    }
    setState(context[subContext], subName, newState)
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

export {action, createController, extendProps, loadContext, registerCallBack}