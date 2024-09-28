import { API_URL } from '../globals.js'

/**
 * CreationBar is a custom HTML element that provides a form for creating tasks.
 * It uses the Shadow DOM to encapsulate its styles and structure.
 * 
 * @class
 * @extends {HTMLElement}
 */
class CreationBar extends HTMLElement {
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
        return `
            <div class="create-task-bar-wrapper">
                <form id="create-task-bar" class="create-task-bar">
                    <input type="text" class="create-task-name-input" placeholder="Task title">
                    <input class="create-task-description-input" placeholder="Task description"></input>
                    <button class="create-task-button">Create</button>
                </form>
            </div>
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
                * {
                    box-sizing: border-box;
                    font-family: 'Nunito', sans-serif;
                }

                .create-task-bar-wrapper {
                    display: flex;

                    width: 100%;
                    height: 100%;
                }

                .create-task-bar {
                    display: grid;
                    grid-template-columns: 1fr auto;
                    grid-template-rows: auto auto;

                    width: 100%;
                    height: fit-content;

                    border-radius: 0.75rem;
                    border: 2px solid var(--primary);

                    overflow: hidden;
                }

                .create-task-name-input {
                    font-size: 1.2rem;
                    font-weight: bold;
                    color: var(--content-4-foreground);
                    border: none;
                    padding: 0 1rem;

                    width: 100%;
                    height: 4rem;
                    grid-column: 1 / 2;

                    outline: none;
                }

                .create-task-description-input {
                    justify-self: stretch;
                    align-self: center;

                    font-size: 1rem;
                    border: none;
                    padding: 0 1rem;

                    width: 100%;
                    padding: 1rem;

                    outline: none;
                    resize: none;

                    border-top: 2px dashed var(--content-4);
                }

                .create-task-button {
                    font-size: 1.25rem;
                    border: none;
                    cursor: pointer;
                    outline: none;

                    grid-column: 2 / 3;
                    grid-row: 1 / 3;

                    aspect-ratio: 1 / 1;

                    background-color: var(--primary);
                    color: var(--primary-foreground);

                    font-weight: bold;

                    transition: background-color 0.25s;
                }
            </style>
        `;
    }

    /**
     * Initializes the component by selecting the task list element from the shadow DOM
     * and fetching the tasks to be displayed.
     */
    initComponent() {
        this.$tag = this.shadowDOM.querySelector('.appButton');

        this.shadowDOM.querySelector('#create-task-bar').addEventListener('submit', async (event) => { 
            event.preventDefault();

            const taskNameInput = this.shadowDOM.querySelector('.create-task-name-input');
            const taskDescriptionInput = this.shadowDOM.querySelector('.create-task-description-input');

            const taskName = taskNameInput.value.trim();
            const taskDescription = taskDescriptionInput.value.trim();

            if (!taskName) {
                taskNameInput.focus();
                return;
            }

            if (!taskDescription) {
                taskDescriptionInput.focus();
                return;
            }
            
            const ENDPOINT = `${API_URL}/tasks`;

            this.dispatchLoadingStateEvent();

            const response = await fetch(ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: taskName, description: taskDescription, done: false })
            });

            if (response.status !== 201) {
                alert('Failed to create task');
                return;
            }

            const task = await response.json();

            console.log({task});
            

            this.dispatchLoadedStateEvent();

            taskNameInput.value = '';
            taskDescriptionInput.value = '';
            taskNameInput.focus();

            document.dispatchEvent(new CustomEvent('signal:task-added', {
                detail: task
            }));
        })
    }

    /**
     * Called when the element is disconnected from the document's DOM.
     * This method removes the element from the DOM.
     */
    disconnectedCallback() {
        this.remove()
    }

    /**
     * Dispatches a custom event 'signal:task-added' with the provided task as the event detail.
     *
     * @param {Object} task - The task object to be included in the event detail.
     */
    dispatchAddTaskEvent(task) {
        document.dispatchEvent(new CustomEvent('signal:task-added', {
            detail: task
        }));
    }

    /**
     * Dispatches a custom event 'signal:loading-state' to indicate a loading state.
     */
    dispatchLoadingStateEvent() {
        document.dispatchEvent(new CustomEvent('signal:loading-state'));
    }

    /**
     * Dispatches a custom event 'signal:loaded-state' to notify that the state has been loaded.
     * This event can be listened to by other parts of the application to perform actions
     * once the state is fully loaded.
     */
    dispatchLoadedStateEvent() {
        document.dispatchEvent(new CustomEvent('signal:loaded-state'));
    }
}

export default CreationBar;