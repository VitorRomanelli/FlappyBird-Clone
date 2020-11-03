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

function Barriers(height, width, opening, space, notifyPoint) {
    this.couples = [
        new coupleOfBarriers(height, opening, width),
        new coupleOfBarriers(height, opening, width + space),
        new coupleOfBarriers(height, opening, width + space * 2),
        new coupleOfBarriers(height, opening, width + space * 3)
    ]

    const offset = 3;

    this.animate = () => {
        this.couples.forEach(couple => {
            couple.setX(couple.getX() - offset);

            if(couple.getX() < -couple.getWidth()) {
                couple.setX(couple.getX() + space * this.couples.length);
                couple.sortOpening();
            }

            const middle = width / 2;

            const crossMid = couple.getX() + offset >= middle && couple.getX() < middle;

            if(crossMid) {
                notifyPoint();
            }
        });
    }
}

function Bird(gameHeight) {
    let flying = false;

    this.element = newElement("img", "bird");
    this.element.src = "../../images/bird.png";

    this.getY = () => parseInt(this.element.style.bottom.split("px")[0]);
    this.setY = y => this.element.style.bottom = `${y}px`;

    window.onkeydown = e => flying = true;
    window.onkeyup = e => flying = false;

    this.animate = () => {
        const newY = this.getY() + (flying ? 8 : -5);
        const maxHeight = gameHeight - this.element.clientHeight;

        if(newY <= 0) {
            this.setY(0);
        } else if (newY >= maxHeight) {
            this.setY(maxHeight);
        } else {
            this.setY(newY);
        }

    }
    
    this.setY(gameHeight / 2);
}

function Progress() {
    this.element = newElement("span", "progress");
    this.updatePoints = points => {
        this.element.innerHTML = points;
    }
    this.updatePoints(0);
}

function flappyBird() {
    let points = 0;

    const gameArea = document.querySelector("[wm-flappy]");
    const height = gameArea.clientHeight;
    const width = gameArea.clientWidth;

    const progress = new Progress();
    const barriers = new Barriers(height, width, 200, 400, () => progress.updatePoints(++points));
    const bird = new Bird(height);

    gameArea.appendChild(progress.element);
    gameArea.appendChild(bird.element);
    gameArea.appendChild(progress.element);
    barriers.couples.forEach(couple => gameArea.appendChild(couple.element));

    this.start = () => {
        const timer = setInterval(() => {
            barriers.animate();
            bird.animate();
        }, 20);
    };
}

new flappyBird().start();
