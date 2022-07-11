var word_list = new Array();
var results = new Array();

function make_grid(characters){
    var grid = new Array();
    var index = 0;
    for (var r = 0; r < 4; r++){
        grid[r] = new Array();
        for (var c = 0; c < 4; c++){
            grid[r][c] = characters[index];
            index++;
        }
    }
    return grid;
}

function binary_search(word){
    var prefix_match = false;
    var left = 0;
    var right = word_list.length - 1;
    
    while (left < right){
        var mid = Math.floor((left + right) / 2);
        
        if (word == word_list[mid]){
            return "match";
        }
        if (word < word_list[mid] && word == word_list[mid].slice(0,word.length)){
            prefix_match = true;
        }
        if (word > word_list[mid]){
            left = mid + 1;
        } else{
            right = mid;
        }
    }
    if (prefix_match){
        return "prefix_match";
    }else{
        return "no_match";
    }
}

function find_longest_helper(grid, occupied, cur_string, cur_index){
    if (cur_string.length > 16){
        return;
    }

    var search_result = binary_search(cur_string);
    if (search_result == "match" && cur_string.length >= 3 && !results.includes(cur_string)){
        console.log(cur_string);
        results.push(cur_string);
    } else if (search_result == "no_match"){
        return;
    }

    var cur_row = Math.floor(cur_index / 4);
    var cur_col = cur_index % 4;
    for (var row_change = -1; row_change <= 1; row_change++){
        for (var col_change = -1; col_change <= 1; col_change++){
            if (row_change == 0 && col_change == 0) continue;
            var next_row = cur_row + row_change;
            var next_col = cur_col + col_change;
            if (next_row < 0 || next_row > 3 || next_col < 0 || next_col > 3 || occupied[next_row][next_col]){
                continue
            }
            next_index = next_row * 4 + next_col;
            next_string = cur_string + grid[next_row][next_col];
            occupied[next_row][next_col] = next_string.length;
            find_longest_helper(grid, occupied, next_string, next_index);
            occupied[next_row][next_col] = 0;
        }
    }
}

function find_longest_words(grid){
    var occupied = new Array();
    for (var start_index = 0; start_index < 16; start_index++){
        var start_row = Math.floor(start_index / 4);
        var start_col = start_index % 4;
        for (var r = 0; r < 4; r++){
            occupied[r] = new Array();
            for (var c = 0; c < 4; c++){
                occupied[r][c] = 0;
            }
        }
        console.log(start_row);
        occupied[start_row][start_col] = 1;
        var cur_string = grid[start_row][start_col];
        find_longest_helper(grid, occupied, cur_string, start_index);
    }
}

function submit_onclick(){
    var characters = document.getElementById("characters").value;
    if (characters.length == 0) {
        document.getElementById("output").textContent = "You didn't type in anything!";
    } else if (/[^a-zA-Z]/.test(characters)){
        document.getElementById("output").textContent = "Please type in only letters";
    } else if (characters.length != 16){
        document.getElementById("output").textContent = "You typed in " +  characters.length + " letters instead of 16";
    } else{
        var grid = make_grid(characters);
        find_longest_words(grid);
        results.sort(function(a, b){return b.length - a.length;});
        console.log(results);
        var results_string = "";
        for (var i = 0; i < results.length; i++) {
            results_string += results[i];
            if (i < results.length - 1) results_string += ", ";
        }
        document.getElementById("output").textContent = results_string;

    }
}