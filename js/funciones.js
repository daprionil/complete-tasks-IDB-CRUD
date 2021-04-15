import Tasks from './Clases/Tasks.js';
import {ControlUI} from './Clases/ControlUI.js';
import {formAddTask} from './selectores.js';

const controlui = new ControlUI();
const tasks = new Tasks();

let db;

let objTaskGlobal = {
    titleTask:'',
    descTask:'',
    date:'',
    conditionTask:'incompleto'
};

function agregarNota(e){
    e.preventDefault();

    const titleTask = e.target.querySelector('#titleTask').value;
    const descTask = e.target.querySelector('#descTask').value;

    if(titleTask !== '' && descTask !== '' && titleTask.length < 100 && descTask.length < 350){
        if(!tasks.mode){
            objTaskGlobal.titleTask = titleTask.trim();
            objTaskGlobal.descTask = descTask.trim();
            objTaskGlobal.idTask = generateID();
            objTaskGlobal.date =  generateDate();

            tasks.addTasks({...objTaskGlobal});
            controlui.viewHtmlTasks(db);
            e.target.reset();
            resetObj();
            controlui.message('¡¡ Tarea Agregada con Exito !!','correcto');
            return;
        };
        objTaskGlobal.titleTask = titleTask.trim();
        objTaskGlobal.descTask = descTask.trim();
        objTaskGlobal.date =  generateDate();
        
        tasks.editTasks({...objTaskGlobal});

        controlui.viewHtmlTasks(db);
        formAddTask.btn.textContent = 'Agregar';
        e.target.reset();
        controlui.message('¡¡ Tarea Editada con Exito !!','correcto');
        resetObj();

        tasks.mode = false;
        return;
    };
    controlui.message('Debes Completar Correctamente todos los campos','incorrecto');
};
function seekerTasks(e){
    e.preventDefault();

    const seeker = e.target.seeker.value.toLowerCase();
    const condition = e.target.querySelector('input[name="condition"]:checked').value;

    if(condition){
        controlui.viewHtmlTasks(db,condition,seeker);
        return;
    };
};
function createDB(){
    const tasksDB = window.indexedDB.open('tasksDB');

    tasksDB.onerror = ()=>{console.log('error')};
    tasksDB.onsuccess = () => {
        db = tasksDB.result;
        controlui.viewHtmlTasks(db);
    };
    tasksDB.onupgradeneeded = (e) => {
        db = e.target.result;
        console.log('Re creada');

        const objectStore = db.createObjectStore('tasks',{keyPath:'idTask'});

        objectStore.createIndex('titleTask','titleTask',{unique:false});
        objectStore.createIndex('descTask','descTask',{unique:false});
        objectStore.createIndex('idTask','idTask',{unique:true});
        objectStore.createIndex('conditionTask','conditionTask',{unique:false});
    };
};
function rowTaskHtml(obj){
    const {titleTask,descTask,date,conditionTask} = obj;

    const trTask = document.createElement('tr');

    const tdDTitle = document.createElement('td');
    tdDTitle.innerHTML = `<p>${titleTask}</p>
    <p>${date}</p>`;

    const tdDesc = document.createElement('td');
    tdDesc.textContent = `${descTask}`;

    const tdCheckbox = document.createElement('td');
    const inputCheckbox = document.createElement('input');
    inputCheckbox.setAttribute('type','checkbox');
    inputCheckbox.checked = conditionTask === 'completo' ? true : false;
    inputCheckbox.onclick = () => {
        editCondition(inputCheckbox,obj);
    };
    tdCheckbox.appendChild(inputCheckbox);

    const tdButtons = document.createElement('td');

    const btnDelete = document.createElement('button');
    btnDelete.classList.add('btn','btnDelete');
    btnDelete.textContent = 'X';
    btnDelete.onclick = () => {
        deleteTask(obj);
    };
    const btnEdit = document.createElement('button');
    btnEdit.classList.add('btn','btnEditar');
    btnEdit.textContent = 'Editar✏️';
    btnEdit.onclick = () => {
        editTask(obj);
    };
    tdButtons.appendChild(btnDelete);
    tdButtons.appendChild(btnEdit);

    trTask.appendChild(tdDTitle);
    trTask.appendChild(tdDesc);
    trTask.appendChild(tdCheckbox);
    trTask.appendChild(tdButtons);

    return trTask;
};
function deleteTask(obj){
    const validate = confirm("¿Está seguro de Eliminar la Tarea?");
    if(validate){
        tasks.deleteTasks(obj);
        controlui.message('¡¡ Tarea correctamente Eliminada !!','incorrecto');
        controlui.viewHtmlTasks(db);
    };
};
function editTask(obj){
    objTaskGlobal = obj;
    const {titleTask,descTask} = obj;
    formAddTask.title.value = titleTask;
    formAddTask.descTask.value = descTask;
    
    formAddTask.btn.textContent = 'Editar';
    tasks.mode = true;
}
function editCondition(input,obj){
    if(input.checked){
        obj.conditionTask = 'completo';
    }else{
        obj.conditionTask = 'incompleto';
    };
    tasks.editTasks(obj);
};
function generateDate(){
    const date = new Date();
    const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov'];

    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};
function resetObj(){
    for(let prop in objTaskGlobal){
        objTaskGlobal[prop] = '';
    };
};
function generateID(){
    let id = '';
    const characters = {
        symbols:'*-&%$@/_',
        chartUpper:'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        chartLower:'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.toLowerCase(),
        numbers:'1234567890'
    };
    const {symbols,chartUpper,chartLower,numbers} = characters;
    for(let i = 0;i < 4;i++){
        const n1Chart = Math.floor(Math.random()*26);
        const n2Chart = Math.floor(Math.random()*26);
        const n3Sym = Math.floor(Math.random()*8);
        const n4Num = Math.floor(Math.random()*10);

        id += `${chartLower[n1Chart]}${chartUpper[n2Chart]}${symbols[n3Sym]}${numbers[n4Num]}`;
    };
    return id;
}
export {createDB,db,agregarNota,controlui,tasks,seekerTasks,rowTaskHtml};