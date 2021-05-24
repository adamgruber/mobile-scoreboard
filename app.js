(function () {
    const board = scoreboard();
    const boardEl = document.getElementById('scoreboard');
    const boardEls = {};
    const updateActions = ['inning', 'home', 'guest', 'ball', 'strike', 'out'];

    const updaters = {
        text(el, value) {
            el.textContent = value;
        },
        dot(el, value) {
            el.querySelectorAll('input.dot').forEach((input, idx) => {
                if (idx < value) {
                    input.setAttribute('checked', true);
                } else {
                    input.removeAttribute('checked');
                }
            });
        },
    };

    const resetBoard = () => {
        updateBoard('inning', 1);
        updateBoard('home', 0);
        updateBoard('guest', 0);
        resetCount(true);
    };

    const resetCount = resetOuts => {
        updateBoard('ball', 0);
        updateBoard('strike', 0);
        if (resetOuts) {
            updateBoard('out', 0);
        }
    };

    const updateBoard = (action, value) => {
        // Use cached el if available
        let updateEl = boardEls[action];

        // Find el if not already cached
        if (!updateEl) {
            updateEl = boardEls[action] = boardEl.querySelector(
                `[data-bind=${action}]`
            );
        }

        // Fire off update function
        const updateType = updateEl.getAttribute('data-bind-type');
        if (updaters[updateType]) {
            updaters[updateType](updateEl, value);
        } else {
            console.log('no updater found for: ', updateType);
        }
    };

    // Handle scoreboard updates
    const onScoreboardUpdate = e => {
        const { detail } = e;
        const { action } = detail;

        switch (action) {
            case 'reset':
                resetBoard();
                break;

            case 'resetCount':
                resetCount();
                break;

            default:
                updateBoard(action, detail[action]);
        }
    };

    // Handle button clicks
    const onActionClick = e => {
        // Get the action to call
        const action = e.target.getAttribute('data-action');
        let args = e.target.getAttribute('data-args');
        if (args) {
            try {
                args = JSON.parse(args);
            } catch (e) {
                args = [];
            }
        } else {
            args = [];
        }

        // Update the scoreboard data
        board[action](...args);

        // Trigger an update event
        const event = new CustomEvent('scoreboard.update', {
            detail: {
                action,
                ...board.score,
                ...board.count,
            },
        });

        boardEl.dispatchEvent(event);
    };

    // Bind listeners
    boardEl.querySelectorAll('button[data-action]').forEach(el => {
        el.addEventListener('click', onActionClick);
        el.addEventListener('touchend', e => {
            onActionClick(e);
            e.preventDefault();
        });
    });

    boardEl.addEventListener('scoreboard.update', onScoreboardUpdate);

    resetBoard();
})();
