import { API_URL } from '../globals.js'

class CreationBar extends HTMLElement {
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
            <div class="create-task-bar-wrapper">
                <form id="create-task-bar" class="create-task-bar">
                    <input type="text" class="create-task-name-input" placeholder="Task title">
                    <input class="create-task-description-input" placeholder="Task description"></input>
                    <button class="create-task-button">Create</button>
                </form>
            </div>
        `;
    }
 
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

            this.dispatchLoadedStateEvent();

            taskNameInput.value = '';
            taskDescriptionInput.value = '';
            taskNameInput.focus();

            document.dispatchEvent(new CustomEvent('signal:task-added', {
                detail: {
                    name: taskName,
                    description: taskDescription,
                    done: false
                }
            }));
        })
    }

    disconnectedCallback() {
        this.remove()
    }

    dispatchAddTaskEvent(task) {
        document.dispatchEvent(new CustomEvent('signal:task-added', {
            detail: task
        }));
    }

    dispatchLoadingStateEvent() {
        document.dispatchEvent(new CustomEvent('signal:loading-state'));
    }

    dispatchLoadedStateEvent() {
        document.dispatchEvent(new CustomEvent('signal:loaded-state'));
    }
}

export default CreationBar;