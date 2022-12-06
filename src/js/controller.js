"use strict";

import "core-js/stable";
import "regenerator-runtime/runtime";

class weeklyPlanning {
  _removeActivity = document.querySelector(".btn-remove");
  _addActivity = document.querySelector(".btn-add");
  _removeAllActivity = document.querySelector(".btn-removeAll");
  _weekly = document.querySelector(".weekly__containers");
  _btnExit = Array.from(document.querySelectorAll(".weekly-activity-exit"));
  _btncheck = Array.from(document.querySelectorAll(".weekly-activity-box"));
  _containerAddActivity = document.querySelector(".add__activity");
  _form = document.querySelector(".add__activity-form");
  _days = Array.from(document.querySelectorAll(".weekly_container"));
  _localStorage = localStorage.getItem("name")
    ? JSON.parse(localStorage.getItem("name"))
    : [[], [], [], [], []];
  _drop;
  constructor() {
    this._removeActivity.addEventListener(
      "click",
      this._removeActivityContainerHandler.bind(this)
    );
    this._addActivity.addEventListener(
      "click",
      this._addActivityContainerHandler.bind(this)
    );
    this._removeAllActivity.addEventListener(
      "click",
      this._removeAllHandler.bind(this)
    );
    this._containerAddActivity.addEventListener(
      "click",
      this._closeContainerAddACtivityHandler.bind(this)
    );
    document.addEventListener("dragstart", (e) => {
      if (!e.target.draggable) return;
      e.target.classList.add("dragging");
      this._btnExit.forEach((e) => {
        e.classList.remove("active");
      });
      this._removeAllActivity.classList.remove("btn_active");
      this._addActivity.classList.remove("btn_not-active");
    });
    document.addEventListener("dragend", (e) => {
      if (document.querySelector(".dragging") === null) return;
      const dragging = document.querySelector(".dragging");
      if (dragging.dragging) return;
      this._localStorage[dragging.id[0]] = this._localStorage[
        dragging.id[0]
      ].filter((a) => a.id !== dragging.id);
      this._localStorage[+this._drop.id[0]] = [
        ...this._localStorage[+this._drop.id[0]],
        this._drop,
      ];
      localStorage.setItem("name", JSON.stringify(this._localStorage));
      e.target.classList.remove("dragging");
      this._weekly = document.querySelector(".weekly_container");
      this._weekDays();
    });
    this._form.addEventListener("submit", this._addHandlerActivity.bind(this));
    this._weekly.addEventListener("click", this._activityBtnHandler.bind(this));
    this._days.forEach((item) => {
      item.addEventListener("dragover", (e) => {
        e.preventDefault();
        if (document.querySelector(".dragging") === null) return;
        const dragging = document.querySelector(".dragging");
        const obj = this._localStorage[dragging.id[0]].filter(
          (e) => e.id === dragging.id
        )[0];
        this._drop = {
          ...obj,
          id: (
            obj.id -
            obj.id[0] +
            +item.lastElementChild.id[item.lastElementChild.id.length - 1] -
            1
          ).toFixed(6),
        };
        const position = this._getNewPosition(item.lastElementChild);
        if (position) {
          position.insertAdjacentElement("afterend", dragging);
        } else {
          item.lastElementChild.prepend(dragging);
        }
      });
    });
    this._weekDays();
  }
  _getNewPosition(column) {
    const cards = Array.from(
      column.querySelectorAll(".weekly__container-activity:not(.dragging)")
    );
    const result = cards.filter(
      (e) => e.children[2].textContent < this._drop.time
    );
    return result[result.length - 1];
  }
  _pushLocalStorage(day, obj) {
    this._localStorage[day].push(obj);
    localStorage.setItem("name", JSON.stringify(this._localStorage));
  }
  _cleanForm() {
    document.querySelector(".add__activity-box-Activity").value = "";
    document.querySelector(".add__activity-box-time").value = "";
  }
  _removeDay() {
    Array.from(document.querySelectorAll(".days")).forEach(
      (e) => (e.innerHTML = "")
    );
  }
  _removeAllHandler() {
    localStorage.setItem("name", []);
    this._localStorage = localStorage.getItem("name")
      ? JSON.parse(localStorage.getItem("name"))
      : [[], [], [], [], []];
    this._weekDays();
    this._removeActivityContainerHandler();
  }
  _filterDays(e) {
    if (e.length <= 1) return;
    e.sort((a, b) => +a.time.replace(":", "") - +b.time.replace(":", ""));
  }
  _activityCheck(e) {
    e.target
      .closest(".weekly__container-activity")
      .firstElementChild.classList.toggle("active");
    e.target
      .closest(".weekly__container-activity")
      .children[1].classList.toggle("not-active");
    e.target
      .closest(".weekly__container-activity")
      .children[2].classList.toggle("text-line");
    e.target
      .closest(".weekly__container-activity")
      .children[3].classList.toggle("text-line");
  }
  _activityBtnHandler(e) {
    if (
      e.target.classList.contains("exit") ||
      e.target.classList.contains("check") ||
      e.target.classList.contains("checked")
    ) {
      const id = e.target.closest(".weekly__container-activity").id;
      const index = this._localStorage[+id[0]].findIndex((e) => +e.id === +id);
      if (e.target.classList.contains("exit")) {
        this._localStorage[+id[0]].splice(+index, 1);
        localStorage.setItem("name", JSON.stringify(this._localStorage));
        this._weekDays();
        this._removeAllActivity.classList.remove("btn_active");
        this._addActivity.classList.remove("btn_not-active");
      }
      if (e.target.classList.contains("check")) {
        this._localStorage[id[0]][index].check = true;
        localStorage.setItem("name", JSON.stringify(this._localStorage));
        this._activityCheck(e);
      }
      if (e.target.classList.contains("checked")) {
        this._localStorage[id[0]][index].check = false;
        localStorage.setItem("name", JSON.stringify(this._localStorage));
        this._activityCheck(e);
      }
    }
  }
  _weekDays() {
    if (!localStorage.getItem("name")) {
      this._removeDay();
      return;
    }
    this._localStorage.forEach((e, i) => {
      this._filterDays(e);
      this._desplayActivity(e, i);
    });
  }
  _desplayActivity(day, index) {
    document.querySelector(`#day${index + 1}`).innerHTML = "";
    day.forEach((e) => {
      const html = `
                <div class="weekly__container-activity" draggable="true" id="${
                  e.id
                }">
                    <div class="weekly-activity-checked ${
                      e.check === true ? "active" : ""
                    }">
                        <div class="checked-box checked">
                            <svg class="checked" xmlns="http://www.w3.org/2000/svg" height="20" width="20">
                                <path class="checked" d="m8.229 14.062-3.521-3.541L5.75 9.479l2.479 2.459 6.021-6L15.292 7Z"/>
                            </svg>
                        </div>
                    </div>
                    <div class="weekly-activity-box ${
                      e.check === true ? "not-active" : ""
                    }">
                        <div class="check"> </div>
                    </div>
                    <div class="weekly-activity-time ${
                      e.check === true ? "text-line" : ""
                    }">${e.time}</div>
                    <div class="weekly-activity-name ${
                      e.check === true ? "text-line" : ""
                    }">${e.ToDo}</div>
                    <div class="weekly-activity-exit">
                        <svg class="exit" xmlns="http://www.w3.org/2000/svg" height="20" width="20">
                            <path class="exit" d="M6.062 15 5 13.938 8.938 10 5 6.062 6.062 5 10 8.938 13.938 5 15 6.062 11.062 10 15 13.938 13.938 15 10 11.062Z"/>
                        </svg>
                    </div>
                </div>
            `;
      document
        .querySelector(`#day${index + 1}`)
        .insertAdjacentHTML("beforeend", html);
    });
    this._btnExit = Array.from(
      document.querySelectorAll(".weekly-activity-exit")
    );
    this._btncheck = Array.from(
      document.querySelectorAll(".weekly-activity-box")
    );
  }
  _weekPush(activity) {
    activity
      .filter((e) => e[0].endsWith("day"))
      .forEach((e) =>
        this._pushLocalStorage([+e[0][0]], this._setId(activity, +e[0][0]))
      );

    this._weekDays();
  }
  _setId(activity, index) {
    const obj = Object.fromEntries(
      activity.filter((e) => !e[0].endsWith("week"))
    );
    obj.id = (Math.random() + index).toFixed(5);
    return obj;
  }
  _addHandlerActivity(e) {
    e.preventDefault();
    const dataArr = [...new FormData(this._form)];
    if (dataArr.length < 3 || dataArr[0][1] === "" || dataArr[1][1] === "") {
      alert("form is not completely filled");
      return;
    }
    dataArr.push(["id", 0]);
    this._weekPush(dataArr);
    this._containerAddActivity.classList.remove("active");
    this._cleanForm();
  }
  _closeContainerAddACtivityHandler(e) {
    if (e.target.classList.contains("add__activity")) {
      this._containerAddActivity.classList.remove("active");
    }
  }
  _addActivityContainerHandler() {
    this._containerAddActivity.classList.add("active");
  }
  _removeActivityContainerHandler() {
    this._btnExit.forEach((e) => {
      e.classList.toggle("active");
    });
    this._removeAllActivity.classList.toggle("btn_active");
    this._addActivity.classList.toggle("btn_not-active");
  }
}

new weeklyPlanning();
