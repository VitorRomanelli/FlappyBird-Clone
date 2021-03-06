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

function CoupleOfBarriers(height, opening, x) {
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
        new CoupleOfBarriers(height, opening, width),
        new CoupleOfBarriers(height, opening, width + space),
        new CoupleOfBarriers(height, opening, width + space * 2),
        new CoupleOfBarriers(height, opening, width + space * 3)
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

function isOverlap(elementA, elementB) {
    const a = elementA.getBoundingClientRect();
    const b = elementB.getBoundingClientRect();

    const horizontal = a.left + a.width >= b.left && b.left + b.width >= a.left;
    const vertical = a.top + a.height >= b.top && b.top + b.height >= a.top;

    return horizontal && vertical;
}

function collided(bird, barriers) {
    let collided = false;

    barriers.couples.forEach(coupleOfBarriers => {
        if(!collided) {
            const top = coupleOfBarriers.top.element;
            const bottom = coupleOfBarriers.bottom.element;

            collided = isOverlap(bird.element, top) || isOverlap(bird.element, bottom);
        }
    });
    return collided;
}

function flappyBird() {
    let points = 0;

    const gameArea = document.querySelector("[wm-flappy]");
    const height = gameArea.clientHeight;
    const width = gameArea.clientWidth;

    const progress = new Progress();
    const barriers = new Barriers(height, width, 190, 400, () => progress.updatePoints(++points));
    const bird = new Bird(height);

    gameArea.appendChild(progress.element);
    gameArea.appendChild(bird.element);
    barriers.couples.forEach(couple => gameArea.appendChild(couple.element));

    this.start = () => {
        const timer = setInterval(() => {
            barriers.animate();
            bird.animate();

            if(collided(bird, barriers)){
                clearInterval(timer);
                endGame();
            }
        }, 20);
    };
}

function startGame() {
    document.querySelector("[wm-flappy]").removeChild(startButton);
    new flappyBird().start();
}

function endGame() {
    const gameArea = document.querySelector("[wm-flappy]");

    const scoreSpan = newElement("span", "scoreSpan");
    scoreSpan.innerHTML = "SCORE";

    const endScore = document.querySelector(".progress");
    endScore.classList.remove("progress");
    endScore.classList.add("endScore");
    
    const restartButton = newElement("button", "startButton");
    restartButton.innerHTML = "RESTART";

    gameArea.appendChild(scoreSpan);
    gameArea.appendChild(endScore);
    gameArea.appendChild(restartButton);

    restartButton.onclick = () => {
        document.querySelector("[wm-flappy]").innerHTML = "";
        new flappyBird().start();    
    };
}

const startButton = document.querySelector("button");

startButton.onclick = startGame;