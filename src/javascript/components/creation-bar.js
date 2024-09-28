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
                    <input type="text" class="create-task-input" placeholder="Create a new task">
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
                }

                .create-task-bar-wrapper {
                    display: flex;

                    width: 100%;
                    height: 100%;
                }

                .create-task-bar {
                    display: grid;
                    grid-template-columns: 1fr auto;

                    width: 100%;
                    height: 3.5rem;

                    border-radius: 0.75rem;
                    border: 2px solid var(--primary);

                    overflow: hidden;
                }

                .create-task-input {
                    font-size: 1rem;
                    border: none;
                    padding: 0 1rem;

                    width: 100%;

                    outline: none;
                }

                .create-task-button {
                    font-size: 1rem;
                    border: none;
                    cursor: pointer;
                    outline: none;

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

            const element = this.shadowDOM.querySelector('.create-task-input');
            const task = element.value.trim();

            if (!task) {
                return;
            }
            
            const ENDPOINT = `${API_URL}/tasks`;

            const response = await fetch(ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({task})
            });

            if (response.status !== 201) {
                alert('Failed to create task');
                return;
            }

            element.value = '';

            document.dispatchEvent(new CustomEvent('signal:task-created'), {
                detail: {
                    name: task,
                    description: ''
                }
            });
        })
    }

    disconnectedCallback() {
        this.remove()
    }
}

export default CreationBar;