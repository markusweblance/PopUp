"use strict";
let stylesheet = document.createElement("style");
stylesheet.innerText = '.admin-modal-pu{position: fixed;width: 100vw;height: 100vh;top: 0;left: 0;background-color: rgba(0, 0, 0, 0.62);opacity: 0;visibility: hidden;transition: all 0.3s ease-in-out;}.admin-modal-pu--active{opacity: 1;visibility: visible;}.admin-modal-pu-wrapper{position: absolute;top: 0;left: 120%;width: 80%;height: 100vh;background-color: aliceblue;transition: all 0.3s ease-in-out;}.admin-modal-pu--active .admin-modal-pu-wrapper{left: 20%;}.admin-modal-pu--active .admin-modal-pu-wrapper.admin-modal-pu-offset{left: 0;width: 100%;}.close-admin-modal-pu{cursor: pointer;position: absolute;top: 15px;right: 15px;}.close-admin-modal-pu:hover svg path{fill: red;}';
document.head.appendChild(stylesheet);
class PopUp {
    constructor(id, prevModalID = null) {
        this.eventHandlers = {};
        this.createdModal = false;
        this.prevModalID = prevModalID;
        this.innerID = id;
        this.modalID = this.guidGenerator();
    }
    on(event, callback) {
        if (!(event in this.eventHandlers)) {
            this.eventHandlers[event] = [];
        }
        for (let i = 0; i < this.eventHandlers[event]; i++) {
            if (this.eventHandlers[event][i] === callback) {
                return;
            }
        }
        this.eventHandlers[event].push(callback);
    }
    trigger(event, eventParams = {}) {
        if (!(event in this.eventHandlers)) {
            return;
        }
        this.eventHandlers[event].forEach((handler) => handler(eventParams));
    }
    guidGenerator() {
        const S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }
    createPopUp() {
        this.modal = document.createElement("div");
        this.modal.id = this.modalID;
        this.modal.className = 'admin-modal-pu';
        this.modal.insertAdjacentHTML('afterbegin', `
        <div class="admin-modal-pu-wrapper">
            <div class="close-admin-modal-pu"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/></svg></div>
        </div>
        `);
        document.body.appendChild(this.modal);
        const closeModalBtn = this.modal.querySelector('.close-admin-modal-pu');
        closeModalBtn.addEventListener('click', () => {
            this.closeModal();
        });
    }
    setHTML() {
        const modalWrapper = this.modal.querySelector('.admin-modal-pu-wrapper');
        const content = document.getElementById(this.innerID);
        if (content !== null) {
            content.style.display = 'block';
            this.modal.classList.add('admin-modal-pu--active');
            if (modalWrapper !== null) {
                modalWrapper.appendChild(content);
            }
        }
        else {
            this.createdModal = true;
            const contentNew = document.createElement('div');
            contentNew.id = this.innerID;
            this.modal.classList.add('admin-modal-pu--active');
            if (modalWrapper !== null) {
                modalWrapper.appendChild(contentNew);
            }
        }
    }
    openModal() {
        if (document.getElementById(this.modalID) === null) {
            this.createPopUp();
        }
        setTimeout(() => {
            this.setHTML();
        });
        if (this.prevModalID !== null) {
            const prevModal = document.getElementById(this.prevModalID);
            if (prevModal !== null) {
                const prevModalWrapper = prevModal.querySelector('.admin-modal-pu-wrapper');
                if (prevModalWrapper !== null) {
                    prevModalWrapper.classList.add('admin-modal-pu-offset');
                }
            }
        }
        setTimeout(() => {
            this.trigger('open');
        });
    }
    closeModal() {
        this.modal.classList.remove('admin-modal-pu--active');
        if (this.prevModalID !== null) {
            const prevModal = document.getElementById(this.prevModalID);
            if (prevModal !== null) {
                const prevModalWrapper = prevModal.querySelector('.admin-modal-pu-wrapper');
                if (prevModalWrapper !== null) {
                    prevModalWrapper.classList.remove('admin-modal-pu-offset');
                }
            }
        }
        this.trigger('close');
        if (this.createdModal) {
            this.modal.remove();
        }
    }
}
class AdminPopUp {
    constructor(modalIDS) {
        this.modals = [];
        for (const modalIDSKey in modalIDS) {
            if (modalIDS[+modalIDSKey - 1] !== undefined) {
                this.modals.push(new PopUp(modalIDS[modalIDSKey], this.modals[+modalIDSKey - 1].modalID));
                this.addListener(`[data-admin-popup='${modalIDS[modalIDSKey]}']`, +modalIDSKey);
            }
            else {
                this.modals.push(new PopUp(modalIDS[modalIDSKey]));
                this.addListener("[data-admin-popup-init]", 0);
            }
        }
    }
    addListener(data, modalKey) {
        const btn = document.querySelector(data);
        if (btn !== null) {
            btn.addEventListener('click', () => {
                this.modals[modalKey].openModal();
            });
        }
    }
    getModal(contentID) {
        return this.modals.find(e => e.innerID === contentID);
    }
}
window.AdminPopUp = AdminPopUp;
