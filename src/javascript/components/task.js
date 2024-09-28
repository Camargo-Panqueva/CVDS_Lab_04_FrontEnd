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
            'name',
            'description',
            'done'
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
        const done = this.attributes.done.value === 'true';

        return `
            <li class="task">
                <h2 class="task-name">${this.attributes.name.value}</h2>
                <p class="task-description">${this.attributes.description.value}</p>
                <app-button class="toggle-done-button" color="${done ? 'secondary' : 'primary'}">${done ? 'Undone' : 'Done'}</app-button>
                <app-button class="delete-button" color="danger">Delete</app-button>
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
                    background-color: var(--content-1);
                    border: 2px solid var(--content-4);

                    align-items: center;
                    grid-template-rows: min-content 1fr;
                    grid-template-columns: 1fr auto auto;

                    min-height: var(--min-task-height);
                    padding: 0.75rem;
                    border-radius: 0.5rem;

                    gap: 0 0.75rem;
                    
                    list-style: none;
                }

                .task-name {
                    font-size: 1.2rem;
                    font-weight: bold;
                    line-height: 0.5rem;
                    height: 0.5rem;

                    grid-column: 1 / 2;
                }

                .task-description {
                    font-size: 1rem;
                    line-height: 0.5rem;

                    grid-column: 1 / 2;
                }

                .toggle-done-button {
                    width: 100%;
                    justify-self: end;

                    grid-column: 2 / 3;
                    grid-row: 1 / 3;
                }

                .delete-button {
                    width: 100%;
                    justify-self: end;

                    grid-column: 3 / 4;
                    grid-row: 1 / 3;
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