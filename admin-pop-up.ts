let stylesheet = document.createElement("style");
stylesheet.innerText = '.admin-modal-pu{position: fixed;width: 100vw;height: 100vh;top: 0;left: 0;background-color: rgba(0, 0, 0, 0.62);opacity: 0;visibility: hidden;transition: all 0.3s ease-in-out;}.admin-modal-pu--active{opacity: 1;visibility: visible;}.admin-modal-pu-wrapper{position: absolute;top: 0;left: 120%;width: 80%;height: 100vh;background-color: aliceblue;transition: all 0.3s ease-in-out;}.admin-modal-pu--active .admin-modal-pu-wrapper{left: 20%;}.admin-modal-pu--active .admin-modal-pu-wrapper.admin-modal-pu-offset{left: 0;width: 100%;}.close-admin-modal-pu{cursor: pointer;position: absolute;top: 15px;right: 15px;}.close-admin-modal-pu:hover svg path{fill: red;}'
document.head.appendChild(stylesheet);

class AdminPopUp {
    protected innerID: string
    protected modalID: string
    protected modal: any
    protected prevModalID: string | null

    constructor(id: string, prevModalID: string | null = null) {
        this.prevModalID = prevModalID
        this.innerID = id
        this.modalID = this.guidGenerator()
        this.createPopUp()
    }

    protected createPopUp(): void {
        this.modal = document.createElement("div");
        this.modal.id = this.modalID
        this.modal.className = 'admin-modal-pu'
        this.modal.insertAdjacentHTML('afterbegin', `
        <div class="admin-modal-pu-wrapper">
            <div class="close-admin-modal-pu"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/></svg></div>
        </div>
        `)

        document.addEventListener('DOMContentLoaded', () => {
            document.body.appendChild(this.modal)
        })

        const closeModalBtn = this.modal.querySelector('.close-admin-modal-pu')
        closeModalBtn.addEventListener('click', () => {
            this.closeModal()
        })
    }

    public closeModal(): void {
        this.modal.classList.remove('admin-modal-pu--active')
        if (this.prevModalID !== null) {
            const prevModal = document.getElementById(this.prevModalID)
            if (prevModal !== null) {
                const prevModalWrapper = prevModal.querySelector('.admin-modal-pu-wrapper')
                if (prevModalWrapper !== null) {
                    prevModalWrapper.classList.remove('admin-modal-pu-offset')
                }
            }
        }
    }

    public getID(): string {
        return this.modalID
    }

    protected guidGenerator(): string {
        const S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }

    protected setHTML(): void {
        const modalWrapper = this.modal.querySelector('.admin-modal-pu-wrapper')
        const content = document.getElementById(this.innerID)
        if (content !== null) {
            content.style.display = 'block'
            this.modal.classList.add('admin-modal-pu--active')
            if (modalWrapper !== null) {
                modalWrapper.appendChild(content)
            }
        }
    }

    public openModal() {
        this.setHTML()
        if (this.prevModalID !== null) {
            const prevModal = document.getElementById(this.prevModalID)
            if (prevModal !== null) {
                const prevModalWrapper = prevModal.querySelector('.admin-modal-pu-wrapper')
                if (prevModalWrapper !== null) {
                    prevModalWrapper.classList.add('admin-modal-pu-offset')
                }
            }
        }
    }
}

(window as any).AdminPopUp = AdminPopUp
