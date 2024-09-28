import { API_URL } from '../globals.js'

class TaskList extends HTMLElement {
    constructor() {
        super();
        this.shadowDOM = this.attachShadow({ mode: 'open' });
        this.tasks = [];
        this.isLoading = true;

        document.addEventListener('signal:task-fetched', () => {
            this.isLoading = false;
            this.render();
        })

        document.addEventListener('signal:task-added', (event) => {
            this.tasks.push(event.detail);
            this.render();
        })

        document.addEventListener('signal:task-deleted', (event) => {            
            const taskId = event.detail;
            this.tasks = this.tasks.filter(task => task.id !== taskId);            
            this.render();
        })

        document.addEventListener('signal:task-toggle-done', (event) => {
            const taskId = event.detail;
            this.tasks = this.tasks.map(task => {
                if (task.id === taskId) {
                    task.done = !task.done;
                }
                
                return task;
            });
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
        if (this.isLoading) {
            return `
                <div class="loading-wrapper">
                    <p>Loading tasks...</p>
                </div>
            `;
        }
        return `
            <ul class="task-list">
                ${this.tasks.map(task => {
                    return `<task-item task-id="${task.id}" name="${task.name}" description="${task.description}" done="${task.done}"></task-item>`
                }).join('')}
            </ul>
        `;
    }
 
    templateCss() {
        return `
            <style>
                .loading-wrapper {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 1.25rem;
                    color: var(--primary);

                    height: 100%;
                }
                
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
                id: "1",
                name: 'Task 1',
                description: 'Description 1',
                done: true
            },
            {
                id: "2",
                name: 'Task 2',
                description: 'Description 2',
                done: false
            }
        ]

        document.dispatchEvent(new CustomEvent('signal:task-fetched'));
    }

    disconnectedCallback() {
        this.remove()
    }
}

export default TaskList;