class Scoreboard {
    constructor() {
        this.init();
    }

    init() {
        this.inning = 1;
        this.home = 0;
        this.guest = 0;
        this.count = [0, 0, 0];
    }

    changeInning(increment = 1) {
        const nextInning = this.inning + increment;
        this.inning = nextInning < 1 ? 1 : nextInning;
    }

    changeScore(team, increment = 1) {
        if (this[team] === undefined) {
            return;
        }
        const nextScore = this[team] + increment;
        this[team] = nextScore < 0 ? 0 : nextScore;
    }

    changeCount(type) {
        const nextCount = [...this.count];
        switch (type) {
            case 'ball':
                nextCount[0] = (nextCount[0] + 1) % 4;
                break;

            case 'strike':
                nextCount[1] = (nextCount[1] + 1) % 3;
                break;

            case 'out':
                nextCount[2] = (nextCount[2] + 1) % 3;
                break;

            default:
                throw new Error(`Unexpected pitch type: ${type}`);
        }

        this.count = nextCount;
    }

    resetCount(resetOuts) {
        this.count[0] = 0;
        this.count[1] = 0;
        if (resetOuts) {
            this.count[2] = 0;
        }
    }
}

function scoreboard(opts = {}) {
    const board = new Scoreboard(opts);
    return {
        reset() {
            board.init();
        },

        inning(increment) {
            board.changeInning(increment);
        },

        home(increment) {
            board.changeScore('home', increment);
        },

        guest(increment) {
            board.changeScore('guest', increment);
        },

        ball() {
            board.changeCount('ball');
        },

        strike() {
            board.changeCount('strike');
        },

        out() {
            board.changeCount('out');
        },

        resetCount(resetOuts = false) {
            board.resetCount(resetOuts);
        },

        get score() {
            return {
                home: board.home,
                guest: board.guest,
                inning: board.inning,
            };
        },

        get count() {
            const [ball, strike, out] = board.count;
            return { ball, strike, out };
        },
    };
}
