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
            'content',
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
                ${this.attributes.content.value}
            </button>
        `;
    }
 
    templateCss() {
        return `
            <style>
                .app-button {
                    font-size: 1rem;
                    border: none;
                    outline: none;
                    cursor: pointer;
                    padding: 1rem 2rem;
                    border-radius: 1rem;

                    transition: background-color 0.25s;
                }
                
                .app-button:hover {
                    background-color: #666;
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
}

export default AppButton;