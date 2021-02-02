import { getState } from "./context";
import { buildCssBlock, styles } from "./styles";

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

const adroit = (tag, props, ...children) => {
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

export { styles }
export default adroit;