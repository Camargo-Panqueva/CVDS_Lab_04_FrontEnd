/**
 * This module imports and defines custom elements for the application.
 * 
 * @module components
 * 
 * @requires ./components/button.js
 * @requires ./components/creation-bar.js
 * @requires ./components/task.js
 * @requires ./components/task-list.js
 * 
 * @description
 * The custom elements defined in this module are:
 * - `app-button`: Represents a custom button component.
 * - `creation-bar`: Represents a custom creation bar component.
 * - `task-item`: Represents a custom task item component.
 * - `task-list`: Represents a custom task list component.
 */

import AppButton from './components/button.js';
import CreationBar from './components/creation-bar.js';
import Task from './components/task.js';
import TaskList from './components/task-list.js';

window.customElements.define('app-button', AppButton);
window.customElements.define('creation-bar', CreationBar);
window.customElements.define('task-item', Task);
window.customElements.define('task-list', TaskList);