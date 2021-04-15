import {db}  from '../funciones.js';

export default class Tasks{
    constructor(){
        this.mode = false;
    }
    addTasks(obj){
        const transaction = db.transaction('tasks','readwrite');
        const objectStore = transaction.objectStore('tasks');

        objectStore.add(obj);
    };
    editTasks(obj){
        const transaction = db.transaction('tasks','readwrite');
        const objectStore = transaction.objectStore('tasks');

        objectStore.put(obj);
    };
    deleteTasks(obj){
        const {idTask} = obj;
        const transaction = db.transaction('tasks','readwrite');
        const objectStore = transaction.objectStore('tasks');

        objectStore.delete(idTask);
        transaction.oncomplete = () => {console.log('Eliminado...')};
    };
};