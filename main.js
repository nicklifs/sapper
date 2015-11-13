/**
 * Created by usr on 12.11.2015.
 */
window.onload = function(e){
    function Saper() {
        self = this;
        this.table = document.querySelector('#field > table');
        this.elCountBomb = document.querySelector('#countBomb > strong');
        this.settings = document.querySelector('#settings');

        this.level = null;
        this.m = null;
        this.n = null;
        this.countBomb = null;
        this.countBombChecked = null;
        this.field = null;
        this.levels = [
            [9, 9, 10],
            [9, 16, 40],
            [16, 30, 99]
        ];

        function Cell(isBomb) {
            this.status = 0;
            this.around = 0;
            this.isBomb = isBomb;
        }

        this.fieldCheckBomb = function(i, j) {
            return self.field[i][j].isBomb
        };

        this.renderField = function() {
            for (var i = 0; i < self.m; i++){
                var tr = document.createElement('tr');
                for (var j = 0; j < self.n; j++){
                    var td = document.createElement('td');
                    //td.innerHTML = !self.field[i][j].isBomb ? self.field[i][j].around : '';
                    td.setAttribute('data-i', i);
                    td.setAttribute('data-j', j);
                    //if (self.field[i][j].isBomb) td.className = 'bomb';
                    tr.appendChild(td);
                }
                self.table.appendChild(tr);
            }
        };

        this.calcAroundBomb = function(i, j) {

            var count = 0;
            var array = [[i-1, j-1], [i-1, j], [i-1, j+1], [i, j+1], [i+1, j+1], [i+1, j], [i+1, j-1], [i, j-1]];

            for (var i = 0; i < array.length; i++){
                var x = array[i][0];
                var y = array[i][1];

                if (x < 0 || x > self.m-1 || y < 0 || y > self.n-1) continue;

                count += self.field[x][y].isBomb;
            }

            return count;

            /*if (i == 0) { *//* in first line *//*
                if (j == 0) {
                    return self.calcAroundBombByPositions([[i, j+1], [i+1, j], [i+1, j+1]]);
                } else if (j == self.n) {
                    return self.calcAroundBombByPositions([[i, j-1], [i+1, j-1], [i+1, j]]);
                } else {
                    return self.calcAroundBombByPositions([[i, j-1], [i+1, j-1], [i+1, j], [i+1, j+1], [i, j+1]]);
                }
            } else if (i == self.m) { *//* in last  line *//*
                if (j == 0)  {
                    return self.calcAroundBombByPositions([[i-1, j], [i-1, j+1], [i, j+1]]);
                } else if (j == self.n) {
                    return self.calcAroundBombByPositions([[i, j-1], [i-1, j-1], [i-1, j]]);
                } else {
                    return self.calcAroundBombByPositions([[i, j-1], [i-1, j-1], [i-1, j], [i-1, j+1], [i, j+1]]);
                }
            } else { *//* in middle line *//*
                if (j == 0)  {
                    return self.calcAroundBombByPositions([[i-1, j], [i-1, j+1], [i, j+1], [i+1, j+1], [i+1, j]]);
                } else if (j == self.n) {
                    return self.calcAroundBombByPositions([[i-1, j], [i-1, j-1], [i, j-1], [i+1, j-1], [i+1, j]]);
                } else {
                    return self.calcAroundBombByPositions([[i-1, j-1], [i-1, j], [i-1, j+1], [i, j+1], [i+1, j+1], [i+1, j], [i+1, j-1], [i, j-1]]);
                }
            }*/
        };


        this.step = function(elem) {
            var i = parseInt(elem.getAttribute('data-i'));
            var j = parseInt(elem.getAttribute('data-j'));

            if (self.field[i][j].status == 6) {
                self.countBombChecked -= 1;
                self.refreshCountBomb();
            }
            self.field[i][j].status = 1;
            if (self.field[i][j].isBomb) {
                elem.className = 'bomb open';
            } else {
                elem.innerHTML = self.field[i][j].around ? self.field[i][j].around : '';
                elem.className = 'open';

                // if nothing here, open other empty elems
                if (0 == self.field[i][j].around && false == self.field[i][j].isBomb) {
                    self.checkEmptyAround(i, j);
                }
            }
        };

        this.changeStatus = function(elem) {
            var i = parseInt(elem.getAttribute('data-i'));
            var j = parseInt(elem.getAttribute('data-j'));

            if (self.field[i][j].status == 0) {
                self.field[i][j].status = 6; //bomb
                self.countBombChecked += 1;
                self.refreshCountBomb();
                elem.classList.add('bombQ');
            } else if (self.field[i][j].status == 6) {
                self.field[i][j].status = 7; //?
                self.countBombChecked -= 1;
                self.refreshCountBomb();
                elem.classList.remove('bombQ');
                elem.classList.add('q');
            } else if (self.field[i][j].status == 7) {
                self.field[i][j].status = 0; //nothing
                elem.classList.remove('q');
            }
        };

        this.refreshCountBomb = function() {
            self.elCountBomb.innerHTML = self.countBomb - self.countBombChecked;
        };

        this.checkEmptyAround = function(i, j) {

            var array = [[i - 1, j - 1], [i - 1, j], [i - 1, j + 1], [i, j + 1], [i + 1, j + 1], [i + 1, j], [i + 1, j - 1], [i, j - 1]];
            console.log(array);
            for (var i = 0; i < array.length; i++) {
                var x = array[i][0];
                var y = array[i][1];
                console.log(x + '   ' + y);
                if (x < 0 || x > self.m - 1 || y < 0 || y > self.n - 1) continue;

                if (false == self.field[x][y].isBomb && 1 != self.field[x][y].status) {
                    self.field[x][y].status = 1;
                    var elem = self.table.querySelector('td[data-i="' + x + '"][data-j="' + y + '"]');
                    elem.className = 'open';

                    if (0 == self.field[x][y].around) {
                        this.checkEmptyAround(x, y);
                    } else {
                        elem.innerHTML = self.field[x][y].around;
                    }
                }
            }
        };

        this.initTable = function() {
            this.table.onclick = function(e) {
                var target = event.target;

                // цикл двигается вверх от target к родителям до table
                while (target != this.table) {
                    if (target.tagName == 'TD') {
                        // нашли элемент, который нас интересует!
                        if (!target.classList.contains('open')) {
                            self.step(target);
                        }
                        return;
                    }
                    target = target.parentNode;
                }
            };

            this.table.oncontextmenu = function(e) {
                var target = event.target;

                // цикл двигается вверх от target к родителям до table
                while (target != this.table) {
                    if (target.tagName == 'TD') {
                        // нашли элемент, который нас интересует!
                        if (!target.classList.contains('open')) {
                            self.changeStatus(target);
                        }
                        return false;
                    }
                    target = target.parentNode;
                }
            };
        };

        this.initSettings = function() {
            this.settings.onclick = function(e) {
                var target = event.target;

                // цикл двигается вверх от target к родителям до table
                while (target != self.settings) {
                    if (target.tagName == 'BUTTON') {
                        // нашли элемент, который нас интересует!
                        self.initGame(target.getAttribute('data-level'));
                        return;
                    }
                    target = target.parentNode;
                }
            };
        };

        this.initGame = function(level) {
            self.settings.style.display = 'none';
            //alert(level);

            self.m = self.levels[level][0];
            self.n = self.levels[level][1];
            self.countBomb = self.levels[level][2];

            //alert(m + '   ' + n);
            self.initField();
        };

        this.initField = function() {
            // init
            self.field = [];
            for (var i = 0; i < self.m; i++){
                self.field[i] = [];
                for (var j = 0; j < self.n; j++){
                    self.field[i][j] = 0;
                }}

            // set bomb
            var countBomb = self.countBomb;
            while (countBomb > 0) {
                var randM = Math.floor((Math.random() * self.m));
                var randN = Math.floor((Math.random() * self.n));

                if (self.field[randM][randN] == 0) {
                    self.field[randM][randN] = new Cell(true);
                    countBomb--;
                }
            }

            // set not bomb
            for (var i = 0; i < self.m; i++){
                for (var j = 0; j < self.n; j++){
                    if(self.field[i][j] == 0) {
                        self.field[i][j] = new Cell(false);
                    }
                }}

            // init tags - count bomb around
            for (var i = 0; i < self.m; i++){
                for (var j = 0; j < self.n; j++){
                    if(!self.field[i][j].isBomb) {
                        self.field[i][j].around =  self.calcAroundBomb(i, j);
                    }
                }}

            self.renderField();

            self.elCountBomb.innerHTML = self.countBomb;
            self.elCountBomb.parentNode.style.display = '';
            self.countBombChecked = 0;

            console.log( self.field);
        };


        this.init = function() {
            this.initTable();
            this.initSettings();
            self.elCountBomb.parentNode.style.display = 'none';
        };
    }


    var saper = new Saper();
    saper.init();
};