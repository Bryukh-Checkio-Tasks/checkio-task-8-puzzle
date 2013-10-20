from copy import deepcopy
from checkio.signals import ON_CONNECT
from checkio import api
from checkio.referees.io import CheckiOReferee

from tests import TESTS

GOAL = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 0]
]

MOVES = {'U': (-1, 0), 'D': (1, 0), 'L': (0, -1), 'R': (0, 1)}

def check_route(puzzle, route):
    if not route:
        return False, ("", "Checkio return {0}".format(route))
    if not isinstance(route, str):
        return False, ("", "Checkio return {0} instead string".format(route))
    work_puzzle = deepcopy(puzzle)
    checked_route = ''
    goal = GOAL
    x = y = -1
    for i in range(len(work_puzzle)):
        if 0 in work_puzzle[i]:
            x = i
            y = work_puzzle[i].index(0)
            break

    for ch in route:
        if ch not in MOVES.keys():
            continue
        swap_x = x + MOVES[ch][0]
        swap_y = y + MOVES[ch][1]
        if 0 <= swap_x < len(work_puzzle) and 0 <= swap_y < len(work_puzzle):
            work_puzzle[x][y] = work_puzzle[swap_x][swap_y]
            work_puzzle[swap_x][swap_y] = 0
            x, y = swap_x, swap_y
            checked_route += ch
    if work_puzzle == goal:
        return True, (checked_route, "Puzzle solved")
    else:
        return False, (checked_route, "Puzzle didn't solved")


api.add_listener(
    ON_CONNECT,
    CheckiOReferee(
        tests=TESTS,
        checker=check_route).on_ready)
