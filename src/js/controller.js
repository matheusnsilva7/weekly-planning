"use strict";

class weeklyPlanning{ 
    _removeActivity = document.querySelector(".btn-remove");
    _addActivity = document.querySelector(".btn-add");
    _removeAllActivity = document.querySelector(".btn-removeAll")
    _weekly = document.querySelector(".weekly__container")
    _btnExit = Array.from(document.querySelectorAll(".weekly-activity-exit"));
    _btncheck = Array.from(document.querySelectorAll(".weekly-activity-box"));
    _containerAddActivity = document.querySelector(".add__activity");
    _form = document.querySelector(".add__activity-form");
    _localStorage = localStorage.getItem('name') ? JSON.parse(localStorage.getItem('name')) : [[],[],[],[],[]];

    constructor(){
        this._removeActivity.addEventListener("click", this._removeActivitycontainerHandler.bind(this));
        this._addActivity.addEventListener("click",this._addActivitycontainerHandler.bind(this));
        this._removeAllActivity.addEventListener("click",this._removeAllHandler.bind(this));
        this._containerAddActivity.addEventListener("click",this._closecontainerAddACtivityHandler.bind(this));
        this._form.addEventListener("submit",this._addHandlerActivity.bind(this));
        this._weekly.addEventListener("click",this._activityBtnHandler.bind(this));
        this._weekDays();
    }
    _pushLocalStorage(day,obj){
    this._localStorage[day].push(obj);
    localStorage.setItem("name", JSON.stringify(this._localStorage));
    }
    _cleanform(){
        document.querySelector(".add__activity-box-Activity").value = "";
        document.querySelector(".add__activity-box-time").value = "";
    }
    _removeDay(){
        Array.from(document.querySelectorAll(".days")).forEach(e => e.innerHTML = "");
    }
    _removeAllHandler(){
        localStorage.setItem("name", []);
        this._localStorage = localStorage.getItem('name') ? JSON.parse(localStorage.getItem('name')) : [[],[],[],[],[]];
        this._weekDays();
        this._removeActivitycontainerHandler();

    }
    _filterDays(e){
        if(e.length <= 1) return;
        e.sort((a,b) => +a.time.replace(":" ,"") - +b.time.replace(":" ,"")); 
    }
    _activitycheck(e){
        e.target.parentElement.parentElement.firstElementChild.classList.toggle("active");
        e.target.parentElement.parentElement.children[1].classList.toggle("not-active");
        e.target.parentElement.parentElement.children[2].classList.toggle("text-line");
        e.target.parentElement.parentElement.children[3].classList.toggle("text-line");
    }
    _activityBtnHandler(e){
        if(e.target.classList.contains("exit") || e.target.classList.contains("check") || e.target.classList.contains("ckecked")){
        const id= e.target.closest(".weekly__container-activity").id;
        const index = this._localStorage[+id[0]].findIndex(e => +e.id === +id);
        if(e.target.classList.contains("exit")){
            this._localStorage[+id[0]].splice(+index,1);
            localStorage.setItem("name", JSON.stringify(this._localStorage));
           this._weekDays();
           this._removeAllActivity.classList.remove("btn_active");
        };
        if(e.target.classList.contains("check")){
            this._localStorage[id[0]][index].check = true;
            localStorage.setItem("name", JSON.stringify(this._localStorage));
            this._activitycheck(e);
        };
        if( e.target.classList.contains("ckecked")){
            this._localStorage[id[0]][index].check = false;
            localStorage.setItem("name", JSON.stringify(this._localStorage));
            this._activitycheck(e);
        }
        }
    }
    _weekDays(){
        if(!localStorage.getItem('name')){
            this._removeDay();
            return;
        };
        this._localStorage.forEach((e,i) => {
            this._filterDays(e);
            this._desplayactivity(e , i);
        });
    }
    _desplayactivity(day, index){
        document.querySelector(`#day${index + 1}`).innerHTML = "";
        day.forEach(e => {
            const html = `
                <div class="weekly__container-activity" id="${e.id}">
                    <div class="weekly-activity-checked ${e.check === true ? "active" :""}">
                        <svg class="ckecked" xmlns="http://www.w3.org/2000/svg" height="20" width="20">
                            <path d="m8.938 13 4.958-4.938L12.833 7l-3.895 3.875-1.771-1.75-1.063 1.063ZM4.5 17q-.625 0-1.062-.438Q3 16.125 3 15.5v-11q0-.625.438-1.062Q3.875 3 4.5 3h11q.625 0 1.062.438Q17 3.875 17 4.5v11q0 .625-.438 1.062Q16.125 17 15.5 17Zm0-1.5h11v-11h-11v11Zm0-11v11-11Z"/>
                        </svg>
                    </div>
                    <div class="weekly-activity-box ${e.check === true ? "not-active" :""}">
                        <svg class="check" xmlns="http://www.w3.org/2000/svg" height="20" width="20">
                            <path d="M4.5 17q-.625 0-1.062-.438Q3 16.125 3 15.5v-11q0-.625.438-1.062Q3.875 3 4.5 3h11q.625 0 1.062.438Q17 3.875 17 4.5v11q0 .625-.438 1.062Q16.125 17 15.5 17Zm0-1.5h11v-11h-11v11Z"/>
                        </svg>
                    </div>
                    <div class="weekly-activity-time ${e.check === true ? "text-line" :""}">${e.time}</div>
                    <div class="weekly-activity-name ${e.check === true ? "text-line" :""}">${e.activity}</div>
                    <div class="weekly-activity-exit">
                        <svg class="exit" xmlns="http://www.w3.org/2000/svg" height="20" width="20">
                            <path d="M6.062 15 5 13.938 8.938 10 5 6.062 6.062 5 10 8.938 13.938 5 15 6.062 11.062 10 15 13.938 13.938 15 10 11.062Z"/>
                        </svg>
                    </div>
                </div>
                <hr>
            `;
            document.querySelector(`#day${index + 1}`).insertAdjacentHTML("beforeend", html);
        })
        this._btnExit = Array.from(document.querySelectorAll(".weekly-activity-exit"));
        this._btncheck = Array.from(document.querySelectorAll(".weekly-activity-box"));
    }
    _weekPush(activity){
        activity
        .filter(e => e[0].endsWith("day"))
        .forEach(e => this._pushLocalStorage([+e[0][0]],this._setId(activity,+e[0][0])));

        this._weekDays();
    }
    _setId(activity,index){
        const obj = Object.fromEntries(activity.filter(e => !e[0].endsWith("week")));
        obj.id = (Math.random() + index).toFixed(5);
        return obj;
    }
    _addHandlerActivity(e){
        e.preventDefault();
        const dataArr = [...new FormData(this._form)];
        if(dataArr.length < 3 || dataArr[0][1] === "" || dataArr[1][1] === "") {
            alert("form is not completely filled")
            return;
        }
        dataArr.push(["id", 0]);
        this._weekPush(dataArr);
        this._containerAddActivity.classList.remove("active");
        this._cleanform();
    }
    _closecontainerAddACtivityHandler(e){
        if(e.target.classList.contains("add__activity")){
            this._containerAddActivity.classList.remove("active");
        };
    }
    _addActivitycontainerHandler(){
        this._containerAddActivity.classList.add("active");
    }
    _removeActivitycontainerHandler(){
        this._btnExit.forEach(e =>{
            e.classList.toggle("active");
        });
        this._removeAllActivity.classList.toggle("btn_active");
    }
}

new weeklyPlanning();