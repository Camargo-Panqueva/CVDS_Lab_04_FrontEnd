class TaskList extends HTMLElement {
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
            <ul class="task-list">
                <task-item title="Task 1" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."></task-item>
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
    }

    disconnectedCallback() {
        this.remove()
    }
}

export default TaskList;