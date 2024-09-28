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
        const attributesMapping = [];
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

    /**
     * Generates a template string containing CSS styles for the button component.
     * 
     * @returns {string} A template string containing the CSS styles.
     */
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

    /**
     * Initializes the component by selecting the task list element from the shadow DOM
     * and fetching the tasks to be displayed.
     */
    initComponent() {
        this.$tag = this.shadowDOM.querySelector('.task-list');
        this.fetchTasks();
    }

    /**
     * Fetches tasks from the API and updates the tasks property.
     * Dispatches a 'signal:task-fetched' event upon successful fetch.
     * 
     * @async
     * @function fetchTasks
     * @returns {Promise<void>} A promise that resolves when the tasks are fetched and the event is dispatched.
     */
    async fetchTasks() {
        const ENDPOINT = `${API_URL}/tasks`;

        const response = await fetch(ENDPOINT);
        const data = await response.json();

        this.tasks = data

        document.dispatchEvent(new CustomEvent('signal:task-fetched'));
    }

    /**
     * Called when the element is disconnected from the document's DOM.
     * This method removes the element from the DOM.
     */
    disconnectedCallback() {
        this.remove()
    }
}

export default TaskList;