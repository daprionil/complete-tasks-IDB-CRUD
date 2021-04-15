import {footerYear,btnMenu,menuHtmlRes,tasksBoxHtml,boxMessage} from '../selectores.js';
import {rowTaskHtml} from '../funciones.js';

class ControlUI{
    FYear(){
        const year = new Date().getFullYear();
        footerYear.textContent = year;
    };
    viewHtmlTasks(db,type = 'all',textSeeker = ''){
        this.cleanHtmlTasks();
        const objectStore = db.transaction('tasks').objectStore('tasks');
        const total = objectStore.count();

        total.onsuccess = () => {
            if(total.result > 0){
                objectStore.openCursor().onsuccess = (e) => {
                    const cursor = e.target.result;

                    if(cursor !== null){
                        const {conditionTask,titleTask} = cursor.value;
                        
                        switch (type){
                            case ('all'):
                                if((titleTask.toLowerCase()).includes(textSeeker)){
                                    tasksBoxHtml.appendChild(rowTaskHtml(cursor.value));
                                };
                                break;
                            case ('incompleto'):
                                if(conditionTask === 'incompleto' && (titleTask.toLowerCase()).includes(textSeeker)){
                                    tasksBoxHtml.appendChild(rowTaskHtml(cursor.value));
                                };
                                break;
                            case 'completo':
                                if(conditionTask === 'completo'&& (titleTask.toLowerCase()).includes(textSeeker)){
                                    tasksBoxHtml.appendChild(rowTaskHtml(cursor.value));
                                };
                                break;
                            default:
                                break;
                        }
                        cursor.continue();
                    };
                }; 
            }else{
                const notObjectsHtml = document.createElement('div');
                notObjectsHtml.textContent = "No hay tareas que mostar";

                tasksBoxHtml.appendChild(notObjectsHtml);
            };
        };
    };
    cleanHtmlTasks(){
        while(tasksBoxHtml.firstChild){
            tasksBoxHtml.removeChild(tasksBoxHtml.firstChild);
        };
    };
    message(text,type){
        this.cleanMessage();
        const msg = document.createElement('div');
        msg.classList.add('message');
        msg.textContent = text;
        msg.classList.add(type !== 'correcto'? 'incorrecto':'correcto');

        boxMessage.appendChild(msg);
        setTimeout( () => {
            this.cleanMessage();
        },3000);
    }
    cleanMessage(){
        while(boxMessage.firstChild){
            boxMessage.removeChild(boxMessage.firstChild);
        };
    };
    menuResponsive(){
        btnMenu.addEventListener('click',() => {
            if(!menuHtmlRes.classList.contains('active')){
                menuHtmlRes.classList.add('active');
                return;
            };
            menuHtmlRes.classList.remove('active');
        });
    };
};
export {ControlUI};