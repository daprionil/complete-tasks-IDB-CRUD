import {createDB,agregarNota,controlui,seekerTasks} from '../funciones.js';
import {formSeeker,formAddTask} from '../selectores.js';

export default class App{
    constructor(){
        this.app = this.initApp();
    };
    initApp(){
        //UI
        //AddEventListener
        formAddTask.addEventListener('submit',agregarNota);
        formSeeker.addEventListener('submit',seekerTasks);
        //Funciones
        createDB();
        //Control UI
        controlui.FYear();
        controlui.menuResponsive();
    };
};