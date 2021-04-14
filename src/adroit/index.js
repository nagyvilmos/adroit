import { getState, action, registerCallBack, extendProps } from "./context";
import { buildCssBlock, styles } from "./styles";


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

export { action, appendChild, fragment, styles, }
export default adroit;
