class Modal {
    constructor({ modals }) {
        this.modals = 
    }

    createElement() {
      this.modals.forEach(modal => {
        this.element = document.createElement('div');
        this.element.classList.add(modal.className);
        this.element.innerHTML = (modal.content);
      });
    }

    init(container) {
      this.createElement();
      this.modals.forEach(modal => container.appendChild(modal));
    }

}