const context = {};

export const initialContext = (config) => {
    if (!config)
    {
        return;
    }
    Object.entries(config.default || {}).forEach(([key, value]) => 
        context[key] = value
    );
    // how do we populate from memory?
    // how do we control what's persisted?
}

export const getState = (ctx) => {
    if (typeof ctx !== "string") {
        return ctx.map(getContext(ctx.name));
    }
    let ret = context;
    ctx.split(".").forEach(k => {
        ret = context[k] || {}; 
    })
    console.debug({ctx,ret});
    return ret;
}

