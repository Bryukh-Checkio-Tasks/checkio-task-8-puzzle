"""
TESTS is a dict with all you tests.
Keys for this will be categories' names.
Each test is dict with
    "input" -- input data for user function
    "answer" -- your right answer
    "explanation" -- not necessary key, it's using for additional info in animation.
"""
from functools import reduce
import random



TESTS = {
    "Basics": [
        {
            "input": [
                [1, 2, 3],
                [4, 6, 8],
                [7, 5, 0]
            ],
            "answer": [
                [1, 2, 3],
                [4, 6, 8],
                [7, 5, 0]
            ]
        },

        {
            "input": [
                [7, 3, 5],
                [4, 8, 6],
                [1, 2, 0]
            ],
            "answer": [
                [7, 3, 5],
                [4, 8, 6],
                [1, 2, 0]
            ]
        }

    ],
    "Randoms": [
        {
            "input": None
        },

        {
            "input": None
        }

    ]
}


def generate_rand_puzzle(N):
    """generate matrix NxN with numbers from 0 to N**2"""
    shuffled_list = list(range(1, N ** 2))
    random.shuffle(shuffled_list)
    res_matrix = [[0] * N for _ in range(N)]
    for i, v in enumerate(shuffled_list):
        res_matrix[i // N][i % N] = v
    return res_matrix


def check_solvable(puzzle):
    """Check solvable the puzzle or not"""
    linear = reduce(lambda x, y: x + y, puzzle)
    inversions = 0
    for i, v in enumerate(linear):
        inversions += sum([1 for k in linear[i:] if v > k and k])
    return inversions % 2 == 0


def generate_good_puzzle(N):
    """Generate random solvable puzzle"""
    while True:
        puzzle = generate_rand_puzzle(N)
        if check_solvable(puzzle):
            return puzzle

for t in TESTS["Randoms"]:
    t["input"] = t["answer"] = generate_good_puzzle(3)
