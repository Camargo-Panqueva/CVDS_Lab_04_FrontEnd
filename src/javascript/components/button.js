/**
 * AppButton is a custom HTML element that represents a styled button component.
 * It uses the Shadow DOM to encapsulate its styles and structure.
 * 
 * @class
 * @extends HTMLElement
 * 
 * @example
 * <app-button color="primary">Click Me</app-button>
 */
class AppButton extends HTMLElement {
    constructor() {
        super();
        this.shadowDOM = this.attachShadow({mode: 'open'});
    }

    /**
     * Lifecycle method called when the custom element is appended to the DOM.
     * Initializes the component by mapping attributes, rendering the component,
     * and performing any additional setup required.
     */
    connectedCallback() {
        this.mapComponentAttributes();
        this.render();
        this.initComponent();
    }

    /**
     * Maps component attributes to ensure they have default values.
     * Iterates over a predefined list of attribute keys and checks if each key exists in the `attributes` object.
     * If an attribute key does not exist, it initializes it with an empty string value.
     */
    mapComponentAttributes() {
        const attributesMapping = [
            'color',
        ];
        attributesMapping.forEach(key => {
            if (!this.attributes[key]) {
                this.attributes[key] = {value: ''};
            }
        });
    }

    /**
     * Renders the component by setting the inner HTML of the shadow DOM.
     * It combines the CSS template and the main template.
     */
    render() {
        this.shadowDOM.innerHTML = `
            ${this.templateCss()}
            ${this.template()}
        `;
    }

    /**
     * Generates the HTML template for a button component.
     * 
     * @returns {string} The HTML string for the button component.
     */
    template() {
        return `
            <button class="app-button">
                <slot></slot>
            </button>
        `;
    }
 
    /**
     * Generates a template string containing CSS styles for the button component.
     * 
     * @returns {string} A template string containing the CSS styles.
     */
    templateCss() {
        const color = this.getColor();
        const foreground = this.getForeground();

        return `
            <style>
                .app-button {
                    --color: ${color};
                    --foreground: ${foreground};

                    font-size: 1rem;
                    font-weight: semibold;
                    border: none;
                    outline: none;
                    cursor: pointer;
                    padding: 0.75rem 1.5rem;
                    border-radius: 0.75rem;

                    background-color: var(--color);
                    color: var(--foreground);

                    transition: opacity 0.25s;

                    width: 100%;
                }
                
                .app-button:hover {
                    opacity: 0.75;
                }
            </style>
        `;
    }

    /**
     * Initializes the component by selecting the button element within the shadow DOM.
     * Sets the `$tag` property to the selected button element.
     */
    initComponent() {
        this.$tag = this.shadowDOM.querySelector('.app-button');
    }

    /**
     * Called when the element is disconnected from the document's DOM.
     * This method removes the element from the DOM.
     */
    disconnectedCallback() {
        this.remove()
    }

    /**
     * Retrieves the CSS variable corresponding to the button's color attribute.
     *
     * @returns {string} The CSS variable for the button's color.
     *                   - 'var(--primary)' for 'primary' color.
     *                   - 'var(--secondary)' for 'secondary' color.
     *                   - 'var(--danger)' for 'danger' color.
     *                   - 'var(--content-2)' for any other color.
     */
    getColor() {
        switch (this.attributes.color.value) {
            case 'primary':
                return 'var(--primary)';
            case 'secondary':
                return 'var(--secondary)';
            case 'danger':
                return 'var(--danger)';
            default:
                return 'var(--content-2)';
        }
    }

    /**
     * Retrieves the foreground color based on the button's color attribute.
     *
     * @returns {string} The CSS variable representing the foreground color.
     */
    getForeground() {
        switch (this.attributes.color.value) {
            case 'primary':
                return 'var(--primary-foreground)';
            case 'secondary':
                return 'var(--secondary-foreground)';
            case 'danger':
                return 'var(--danger-foreground)';
            default:
                return 'var(--content-1-foreground)';
        }
    }
}

export default AppButton;