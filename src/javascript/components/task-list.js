import { API_URL } from '../globals.js'

class TaskList extends HTMLElement {
    constructor() {
        super();
        this.shadowDOM = this.attachShadow({ mode: 'open' });
        this.tasks = [];

        document.addEventListener('signal:task-fetched', () => {
            this.render();
        })

        document.addEventListener('signal:task-added', (event) => {
            this.tasks.push(event.detail);
            this.render();
        })
    }

    connectedCallback() {
        this.mapComponentAttributes();
        this.render();
        this.initComponent();
    }

    mapComponentAttributes() {
        const attributesMapping = [];
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
            <ul class="task-list">
                ${this.tasks.map(task => {
                    return `<task-item name="${task.name}" description="${task.description}" done="${task.done}"></task-item>`
                }).join('')}
            </ul>
        `;
    }
 
    templateCss() {
        return `
            <style>
                .task-list {
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;

                    overflow-y: auto;
                    height: 100%;
                    
                    gap: 1rem;
                    padding: 0;
                }
            </style>
        `;
    }

    initComponent() {
        this.$tag = this.shadowDOM.querySelector('.task-list');
        this.fetchTasks();
    }

    async fetchTasks() {
        const ENDPOINT = `${API_URL}/tasks`;

        // const response = await fetch(ENDPOINT);
        // const data = await response.json();

        this.tasks = [
            {
                name: 'Task 1',
                description: 'Description 1'
            },
            {
                name: 'Task 2',
                description: 'Description 2'
            }
        ]

        document.dispatchEvent(new CustomEvent('signal:task-fetched'));
    }

    disconnectedCallback() {
        this.remove()
    }
}

export default TaskList;