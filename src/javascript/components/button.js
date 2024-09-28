class AppButton extends HTMLElement {
    constructor() {
        super();
        this.shadowDOM = this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        this.mapComponentAttributes();
        this.render();
        this.initComponent();
    }

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

    render() {
        this.shadowDOM.innerHTML = `
            ${this.templateCss()}
            ${this.template()}
        `;
    }

    template() {
        return `
            <button class="app-button">
                <slot></slot>
            </button>
        `;
    }
 
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

    initComponent() {
        this.$tag = this.shadowDOM.querySelector('.app-button');
    }

    disconnectedCallback() {
        this.remove()
    }

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