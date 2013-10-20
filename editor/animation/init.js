//Dont change it
requirejs(['ext_editor_1', 'jquery_190', 'raphael_210'],
    function (ext, $, TableComponent) {

        var cur_slide = {};

        ext.set_start_game(function (this_e) {
        });

        ext.set_process_in(function (this_e, data) {
            cur_slide["in"] = data[0];
        });

        ext.set_process_out(function (this_e, data) {
            cur_slide["out"] = data[0];
        });

        ext.set_process_ext(function (this_e, data) {
            cur_slide.ext = data;
            this_e.addAnimationSlide(cur_slide);
            cur_slide = {};
        });

        ext.set_process_err(function (this_e, data) {
            cur_slide['error'] = data[0];
            this_e.addAnimationSlide(cur_slide);
            cur_slide = {};
        });

        ext.set_animate_success_slide(function (this_e, options) {
            var $h = $(this_e.setHtmlSlide('<div class="animation-success"><div></div></div>'));
            this_e.setAnimationHeight(115);
        });

        var sizeN = 3;
            var cell = 60;
            var padding = 0;
            var innerCell = cell - padding * 2;
            var cornerRadius = 4;
            var zeroX = 5;
            var zeroY = 5;
            var colorBase = "#294270";
            var colorOrange = "#FABA00";
            var colorBlue = "#8FC7ED";
            var colorWhite = "#FFFFFF";
            var opacityTrue = 1;
            var opacityFalse = 1;
            var delay = 200;
            var stepDelay = delay * 1.5;
            var goalLocation = [
                [2, 2],
                [0, 0],
                [0, 1],
                [0, 2],
                [1, 0],
                [1, 1],
                [1, 2],
                [2, 0],
                [2, 1]
            ];
            var attrInLine = {"stroke": colorBase, "stroke-width": 1};
            var attrText = {"stroke": colorBase, "font-size": 18, "fill": colorBase};
            var attrRect = {"stroke": colorBase, "stroke-width": 4};
            var moves = {'U': [-1, 0], 'D': [1, 0], 'L': [0, -1], 'R': [0, 1]};

            function createField(paper, locations) {
                //    var imageO = paper.image("Octocat.png", zeroX, zeroY, 180, 180).attr("clip-rect", "10,10,60,60");
                var mainRect = paper.rect(zeroX, zeroY, cell * sizeN, cell * sizeN, 4).attr({"stroke": colorBase, "stroke-width": 2});

                //    mainRect.node.setAttribute("fill", 'url(Octocat.png)');
                for (var k = 1; k < sizeN; k++) {
                    paper.path(createLinePath(zeroX, zeroY + cell * k, zeroX + cell * sizeN, zeroY + cell * k)).attr(attrInLine);
                    paper.path(createLinePath(zeroX + cell * k, zeroY, zeroX + cell * k, zeroY + cell * sizeN)).attr(attrInLine);
                }
                var figureSet = paper.set();
                for (var i = 1; i < sizeN * sizeN; i++) {
                    var row = locations[i][0];
                    var column = locations[i][1];
                    var figure = paper.set();
                    figure.push(paper.rect(zeroX + cell * column + padding,
                            zeroY + cell * row + padding,
                            innerCell, innerCell,
                            cornerRadius).attr(attrRect));
                    figure.push(paper.image("/media/files/octocat/octocat" + i + ".png", zeroX + cell * column, zeroY + cell * row, cell, cell).attr({"opacity": opacityTrue, "stroke": colorBase, "stroke-width": 2}));

                    figure.push(paper.text(zeroX + cell * column + cell / 6 + cell / 3 * goalLocation[i][1], zeroY + cell * row + cell / 6 + cell / 3 * goalLocation[i][0], String(i)).attr(attrText));
                    figure.push(paper.rect(zeroX + cell * column + padding,
                            zeroY + cell * row + padding,
                            innerCell, innerCell,
                            cornerRadius).attr(attrRect));
                    if (String(locations[i]) === String(goalLocation[i])) {
                        figure[1].attr("opacity", opacityTrue);
                        figure[0].attr("fill", colorBlue);
                    }
                    else {
                        figure[1].attr("opacity", opacityFalse);
                        figure[0].attr("fill", colorOrange);
                    }
                    figure[0].node.setAttribute("class", "chip");
                    figure[1].node.setAttribute("class", "chip");
                    figure[2].node.setAttribute("class", "chip");
                    figure[3].node.setAttribute("class", "chip");
                    figureSet[i] = figure;

                }
                return figureSet;


            }

            function matrixToLocations(matrix) {
                var n = matrix.length;
                var locations = [];
                for (var i = 0; i < n; i++) {
                    for (var j = 0; j < n; j++) {
                        locations[matrix[i][j]] = [i, j];
                    }
                }
                return locations;
            }

            function locationsToMatrix(inLocations) {
                var matrix = [];
                for (var i=0; i < sizeN; i++) {
                    matrix.push([]);
                }
                for (var j=0; j < inLocations.length; j++) {
                    var x = inLocations[j][0];
                    var y = inLocations[j][1];
                    matrix[x][y] = j;
                }
                return matrix;
            }
            function createLinePath(x1, y1, x2, y2) {
                return "M" + x1 + "," + y1 + "L" + x2 + "," + y2;
            }

            function movePlayer(route, fSet, inLocations, timeouts) {
                var tempLocations = inLocations.slice();
                for (var i = 0; i < route.length; i++) {
                    var x = tempLocations[0][0];
                    var y = tempLocations[0][1];
                    var nx = x + moves[route[i]][0];
                    var ny = y + moves[route[i]][1];

                    var moved;
                    for (var j = 0; j < tempLocations.length; j++) {
                        if (String([nx, ny]) === String(tempLocations[j])) {
                            moved = j;
                            break;
                        }
                    }
                    tempLocations[moved] = [x, y];
                    tempLocations[0] = [nx, ny];
                    timeouts.push(setTimeout(function () {
                        var m = moved;
                        var dx = -1 * moves[route[i]][0];
                        var dy = -1 * moves[route[i]][1];
                        var newColor = String(tempLocations[m]) === String(goalLocation[m]) ? colorBlue : colorOrange;
                        var newOpacity = String(tempLocations[m]) === String(goalLocation[m]) ? opacityTrue : opacityFalse;
                        return function () {
                            fSet[m].animate({"transform": "...t" + dy * cell + "," + dx * cell}, delay);
                            fSet[m][0].animate({"fill": newColor}, delay);
                            fSet[m][1].animate({"opacity": newOpacity}, delay);

                        }
                    }(), i * stepDelay));

                }
            }



        ext.set_animate_slide(function (this_e, data, options) {
            var $content = $(this_e.setHtmlSlide(ext.get_template('animation'))).find('.animation-content');
            if (!data) {
                console.log("data is undefined");
                return false;
            }

            var checkioInput = data.in;

            if (data.error) {
                $content.find('.call').html('Fail: checkio(' + JSON.stringify(checkioInput) + ')');
                $content.find('.output').html(data.error.replace(/\n/g, ","));

                $content.find('.output').addClass('error');
                $content.find('.call').addClass('error');
                $content.find('.answer').remove();
                $content.find('.explanation').remove();
                this_e.setAnimationHeight($content.height() + 60);
                return false;
            }

            var rightResult = data.ext["answer"];
            var userResult = data.out;
            var result = data.ext["result"];
            var result_message = data.ext["result_addon"][1];
            var route = data.ext["result_addon"][0];


            //if you need additional info from tests (if exists)
            var explanation = data.ext["explanation"];

            $content.find('.output').html('&nbsp;Your result:&nbsp;' + JSON.stringify(userResult));

            if (!result) {
                $content.find('.call').html('Fail: checkio(' + JSON.stringify(checkioInput) + ')');
                $content.find('.answer').html(result_message);
                $content.find('.answer').addClass('error');
                $content.find('.output').addClass('error');
                $content.find('.call').addClass('error');
            }
            else {
                $content.find('.call').html('Pass: checkio(' + JSON.stringify(checkioInput) + ')');
                $content.find('.answer').remove();
            }

            var canvas = Raphael($content.find(".explanation")[0], cell * sizeN + zeroX * 2, cell * sizeN + zeroY * 2, 0, 0);
            var locations = matrixToLocations(checkioInput);
            var gameSet = createField(canvas, locations);
            movePlayer(route, gameSet, locations, []);


            this_e.setAnimationHeight($content.height() + 60);

        });

        function checkRoute(route, locations) {
                var tempLocations = locations.slice(0);
                var chRoute = '';
                if (route.length < 1) {
                    return [false, '', "I didn't see familar letters."];
                }
                for (var i = 0; i < route.length; i++) {
                    var zx = tempLocations[0][0];
                    var zy = tempLocations[0][1];
                    var cx = zx + moves[route[i]][0];
                    var cy = zy + moves[route[i]][1];
                    if (0 <= cx && cx < sizeN && 0 <= cy && cy < sizeN) {
                        var moved;
                        for (var j = 0; j < tempLocations.length; j++) {
                            if (String([cx, cy]) === String(tempLocations[j])) {
                                moved = j;
                                break;
                            }
                        }
                        tempLocations[moved] = [zx, zy];
                        tempLocations[0] = [cx, cy];

                        chRoute += route[i];
                    }

                }
                if (String(tempLocations) === String(goalLocation)) {
                    return [true, chRoute, "Puzzle solved."];
                }
                else {
                    return [false, chRoute, "Puzzle didn't solved."];
                }
            }
            function shuffle() {
                while (true) {
                    var numbsList = [];
                    for (var i = 1; i < sizeN * sizeN; i++) {
                        numbsList.push(i);
                    }
                    var linearPuzzle = [];
                    for (i = 1; i < sizeN * sizeN; i++) {
                        var rIndex = Math.floor(Math.random() * numbsList.length);
                        var n = numbsList.splice(rIndex, 1);
                        linearPuzzle.push(n);
                    }
                    linearPuzzle.push(0);
                    var inversions = 0;
                    for (i = 0; i < linearPuzzle.length - 1; i++) {
                        for (var j = i + 1; j < linearPuzzle.length; j++) {
                            if (linearPuzzle[j] < linearPuzzle[i]) {
                                inversions++;
                            }
                        }
                    }
                    if (inversions % 2 === 0) {
                        break;
                    }

                }
                var sLocations = [];
                for (i = 0; i < linearPuzzle.length; i++) {
                    sLocations[linearPuzzle[i]] = [Math.floor(i / sizeN), i % sizeN];
                }

                return sLocations;
            }

            var $tryit;
            var tPaper;
            var tIds = [];
            var tFigureSet;
            var tLocations;
            var tooltip = false;
            var animated = false;
            ext.set_console_process_ret(function(this_e, ret){
                ret = String(ret);
                ret = ret.replace(/'/g, "");
                var routeArray = ret.match(/[UDLR]/g);
                var route = '';
                if (routeArray && routeArray.length > 0) {
                    route = routeArray.join('');
                }
                var resCheck = checkRoute(route, tLocations);
                animated = true;
                movePlayer(resCheck[1], tFigureSet, tLocations, tIds);

                $tryit.find(".checkio-result .in-result").html(resCheck[2]);
            });

            ext.set_generate_animation_panel(function(this_e){

                $tryit = $(this_e.setHtmlTryIt(ext.get_template('tryit')));

                var startState = [
                    [1, 2, 3],
                    [4, 5, 6],
                    [7, 8, 0]
                ];
                tPaper = Raphael($tryit.find(".tryit-canvas")[0], cell * sizeN + zeroX * 2, cell * sizeN + zeroY * 2, 0, 0);
                tLocations = matrixToLocations(startState);
                tFigureSet = createField(tPaper, tLocations);

                var reset = function () {
                    animated = false;
                    for (var i = 0; i < tIds.length; i++) {
                        clearTimeout(tIds[i]);
                    }
                    for (var i = 1; i < sizeN * sizeN; i++) {
                        var row = tLocations[i][0];
                        var column = tLocations[i][1];
                        tFigureSet[i].attr("transform", "");

                        tFigureSet[i][1].attr({"x": zeroX + cell * column + padding,
                            "y": zeroY + cell * row + padding});
                        tFigureSet[i][3].attr({"x": zeroX + cell * column + padding,
                            "y": zeroY + cell * row + padding});
                        tFigureSet[i][0].attr({"x": zeroX + cell * column + padding,
                            "y": zeroY + cell * row + padding});
                        tFigureSet[i][2].attr({"x": zeroX + cell * column + cell / 6 + cell / 3 * goalLocation[i][1],
                            "y": zeroY + cell * row + cell / 6 + cell / 3 * goalLocation[i][0]});
                        if (String(tLocations[i]) === String(goalLocation[i])) {
                            tFigureSet[i][0].attr("fill", colorBlue);
                            tFigureSet[i][1].animate({"opacity": opacityTrue});
                        }
                        else {
                            tFigureSet[i][0].attr("fill", colorOrange);
                            tFigureSet[i][1].animate({"opacity": opacityFalse});
                        }
                    }

                };
                reset();

                //Tooltip
                $tryit.find(".tryit-canvas").mouseenter(function (e) {
                    if (tooltip) {
                        return false;
                    }
                    var $tooltip = $tryit.find(".tryit-canvas .tooltip");
                    $tooltip.fadeIn(1000);
                    setTimeout(function () {
                        $tooltip.fadeOut(1000);
                    }, 2000);
                    tooltip = true;
                });

                for (var f = 1; f < sizeN * sizeN; f++) {
                    var temp = f;
                    tFigureSet[f].click(function () {
                        var numb = f;
                        return function () {
                            if (animated) {
                                reset();
                                return false;
                            }
                            var cx = tLocations[numb][0];
                            var cy = tLocations[numb][1];
                            var zx = tLocations[0][0];
                            var zy = tLocations[0][1];
                            if (Math.abs(cx - zx) + Math.abs(cy - zy) === 1) {
                                tLocations[0] = [cx, cy];
                                tLocations[numb] = [zx, zy];
                                var dx = zx - cx;
                                var dy = zy - cy;
                                var newColor = String(tLocations[numb]) === String(goalLocation[numb]) ? colorBlue : colorOrange;
                                tFigureSet[numb].animate({"transform": "...t" + dy * cell + "," + dx * cell}, delay);
                                tFigureSet[numb][0].animate({"fill": newColor}, delay);
                            }
                        }
                    }())
                }

                $tryit.find('.bn-check').click(function (e) {
                    reset();
//                result_return("UDRL1PLRDURRLLDDUU");
                    var inPuzzle = locationsToMatrix(tLocations);
                    this_e.sendToConsoleCheckiO(inPuzzle);
                    e.stopPropagation();
                    return false;

                });
                $tryit.find('.bn-shuffle').click(function (e) {
                    tLocations = shuffle();
                    reset();
                    return false;

                });

            });


    }
);
