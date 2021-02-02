import { getState } from "./context";

const extendProps = (props) => {
    const {context} = props || {};
    if (!context)
    {
        return props || {};
    }
    return {...props, state: getState(context)};
}

const appendChild = (parent, child) => {
	if (Array.isArray(child))
		child.forEach((nestedChild) => appendChild(parent, nestedChild))
	else
		parent.appendChild(
			child.nodeType ? child : document.createTextNode(child)
		)
}

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

const buildCss = (struct) => {
    const styles = [];
    Object.entries(struct).forEach(([k,v]) => {
        styles.push(...buildCssBlock(k,v));
    });
    console.log({buildCss:styles});
    return styles.join("");
}
export const fragment = (props, ...children) => {
    return children;
};

export default (tag, props, ...children) => {
	if (typeof tag === "function") {
		return tag(extendProps(props), children);
    }
	console.debug({tag,props,children});

	const element = document.createElement(tag);

    if (tag === "style")
    {
        // all css is scoped

        element.toggleAttribute("scoped");
        // turn the props into html body:
        const style = children
            .map(c => buildCss(c))
            .join(" ");
        console.debug({style});
        element.innerHTML = style;
        return element;
    }

    Object.entries(extendProps(props)).forEach(([name, value]) => {
		if (name.startsWith('on') && name.toLowerCase() in window) {
			//element.addEventListener(name.toLowerCase().substr(2), value);
		}
        else
        {
            if (name === "context")
            {
                element.setAttribute("state", getContext(value));
            }
            element.setAttribute(name, value.toString());
        }
	})

	children.forEach((child) => {
		appendChild(element, child);
	})

	return element;
}
