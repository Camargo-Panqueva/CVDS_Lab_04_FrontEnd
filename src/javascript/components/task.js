class Task extends HTMLElement {
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
            'title',
            'description',
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
            <li class="task">
                <h2 class="task-title">${this.attributes.title.value}</h2>
                <p class="task-description">${this.attributes.description.value}</p>
            </li>
        `;
    }
 
    templateCss() {
        return `
            <style>
                * {
                    box-sizing: border-box;
                }

                .task {
                    --min-task-height: 3.75rem;

                    display: grid;
                    background-color: var(--content-2);
                    border: 2px solid var(--content-4);

                    align-items: center;
                    grid-template-rows: min-content 1fr;

                    min-height: var(--min-task-height);
                    padding: 0.75rem;
                    border-radius: 0.5rem;
                    
                    list-style: none;
                }

                .task-title {
                    font-size: 1.15rem;
                    font-weight: bold;
                    line-height: 0.5rem;
                    height: 0.5rem;
                }

                .task-description {
                    font-size: 1rem;
                    line-height: 0.5rem;
                }
            </style>
        `;
    }

    initComponent() {
        this.$tag = this.shadowDOM.querySelector('.task-list');
    }

    disconnectedCallback() {
        this.remove()
    }
}

export default Task;