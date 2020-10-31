function newElement(tagName, className) {
    const elem = document.createElement(tagName);
    elem.className = className;
    return elem;
}

function createBarrier(reverse = false) {
    this.element = newElement("div", "barrier");

    const border = newElement("div", "barrierBorder");
    const body = newElement("div", "barrierBody");
    
    this.element.appendChild(reverse ? body : border);
    this.element.appendChild(reverse ? border : body);

    this.setHeight = height => body.style.height = `${height}px`;
}

function coupleOfBarriers(height, opening, x) {
    this.element = newElement('div', 'coupleOfBarriers');

    this.top = new createBarrier(true);
    this.bottom = new createBarrier(false);

    this.element.appendChild(this.top.element);
    this.element.appendChild(this.bottom.element);

    this.sortOpening = () => {
        const topHeight = Math.random() * (height - opening);
        const bottomHeight = height - opening - topHeight;
        this.top.setHeight(topHeight);
        this.bottom.setHeight(bottomHeight);
    }

    this.getX = () => parseInt(this.element.style.left.split('px')[0]);
    this.setX = x => this.element.style.left = `${x}px`;
    this.getWidth = () => this.element.clientWidth;

    this.sortOpening();
    this.setX(x);
}