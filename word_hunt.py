import numpy as np
import os
cur_file_path = os.path.dirname(os.path.abspath(__file__))
# word list from nltk.corpus.words.words()
with open(cur_file_path+'/words.txt') as wordFile:
    word_list = wordFile.read().split()

results = []

def make_grid(charcters):
    grid = []
    index = 0
    for r in range(4):
        row = []
        for c in range(4):
            row.append(characters[index])
            index += 1
        grid.append(row)
    return grid

def binary_search(word):
    prefix_match = False
    left, right = 0, len(word_list) - 1
    
    while left < right:
        mid = (left + right) // 2 
        
        if word == word_list[mid]:
            return "match"
        if word < word_list[mid] and word == word_list[mid][:len(word)]:
            prefix_match = True
        if word > word_list[mid]:
            left = mid + 1
        else:
            right = mid
    if prefix_match:
        return "prefix_match"
    else: 
        return "no_match"

def find_longest_helper(grid, occupied, cur_string, cur_index):
    if len(cur_string) > 16:
        return

    search_result = binary_search(cur_string)
    if search_result == "match" and len(cur_string) >= 3 and cur_string not in results:
        results.append(cur_string)
        if len(cur_string) >= 6:
            if len(cur_string) >= 7: print("*********************")
            print(cur_string)
            print(occupied)
    elif search_result == "no_match":
        return

    cur_row = cur_index // 4
    cur_col = cur_index % 4
    for row_change in range(-1, 2):
        for col_change in range(-1, 2):
            if row_change == 0 and col_change == 0: continue
            next_row = cur_row + row_change
            next_col = cur_col + col_change
            if next_row < 0 or next_row > 3 or next_col < 0 or next_col > 3 or occupied[next_row][next_col]:
                continue
            next_occupied = occupied.copy()
            next_index = next_row * 4 + next_col
            next_string = cur_string + grid[next_row][next_col]
            next_occupied[next_row][next_col] = len(next_string)
            find_longest_helper(grid, next_occupied, next_string, next_index)


def find_longest_words(grid):
    for start_index in range(16):
        start_row = start_index // 4
        start_col = start_index % 4
        occupied = np.zeros((4,4))
        occupied[start_row][start_col] = 1
        cur_string = grid[start_row][start_col]
        find_longest_helper(grid, occupied, cur_string, start_index)

correct_input_length = False
while not correct_input_length:
    characters = input("Please type in the 16 letters:\n")
    try:
        assert len(characters) == 16
        correct_input_length = True
    except AssertionError:
        print(f"You typed in {len(characters)} instead of 16")
    
grid = make_grid(characters)
find_longest_words(grid)
print(sorted(results, key = len))