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
            console.debug({key, value, style: styles[0]})
        }
        else
        {
            styles.push(...(buildCssBlock(key, value).map(style => `${tag} ${style}`)));
        }
    });

    console.log({[prefix]:styles});
    if (!styles[0])
    {
        return styles.filter((s,i) => i>0);   
    }

    styles[0] = `${tag} \{${styles[0]}}`;
    return styles;
}

export const styles = (config) => {
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

    console.log({styles, classNames});

    const appCss = applicationStyles.textContent || "";
    applicationStyles.textContent = appCss
        ? [appCss, ...styles].join(" ")
        : styles.join(" ");
    
    return classNames;
}