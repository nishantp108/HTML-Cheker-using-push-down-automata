//variable Declaration
const push = document.querySelector(".push");
const pop = document.querySelector(".pop");
const reset = document.querySelector(".reset");
const bucket = document.querySelector(".main-stack-bucket");
const input = document.querySelector(".text");
const massage = document.querySelector(".massage");
const massageBox = document.querySelector(".massage-box");
const box = document.querySelectorAll(".box");
let stack = [];

function push_ele(ele) {
    const itemValue = ele; //for store the input value
    stack.push(itemValue); //push the value into the stack
    
    //creating a new element
    const element = document.createElement("div");
    element.classList.add("ele");
    element.innerText = stack[stack.length - 1];
    bucket.appendChild(element);
}

function pop_ele(){
	//start popping the element
    //delete the element from the bucket
    bucket.removeChild(bucket.lastElementChild);
    
    //Storing the popped value
    const itemValue = stack.pop();
}

function update_info(state, tos, curr_symbol) {
    document.getElementById("curr_state").innerHTML = state;
    document.getElementById("top_stack").innerHTML = tos;
    document.getElementById("curr_symbol").innerHTML = curr_symbol;
}

function set_result(str) {
    document.getElementById("result").innerHTML = "<h2><center>" + str + "</center></h2>";
}

class Stack {
    constructor() {
        this.items = [];
        stack = [];
    }

    push(element) {
        this.items.push(element);
        push_ele(element);
    }

    pop() {
        if(this.isEmpty()) return "underflow";
        pop_ele();
        return this.items.pop();
    }

    top() {
        if(this.isEmpty()) return "underflow";
        return this.items[this.items.length - 1];
    }

    secondTop() {
        if(this.isEmpty() || this.items.length == 1) return "underflow";
        return this.items[this.items.length - 2];
    }

    isEmpty() {
        return this.items.length == 0;
    }

    getStack() {
        return this.items;
    }
}

class PDA {
    constructor(pda_info) {
        this.stack = new Stack();

        this.stack.push("Z0");
        this.initialState = pda_info["initial_state"];
        this.finalStates = pda_info["final_states"];
        this.productions = pda_info["productions"];

        this.currentStackSymbol = this.stack.top();
        this.currentState = this.initialState;
    }

    async compute(input) {
        console.log(input);
        // console.log(this.productions);
        input.push("ϵ");

        for(let i in input) {
            let inputSymbol = input[i];
            // console.log(inputSymbol);
            let flag = 0;

            changeActiveState("Q"+this.currentState);
            highlightText(input, i);

            console.log(inputSymbol, this.currentState, this.currentStackSymbol);
            update_info(this.currentState, this.currentStackSymbol, inputSymbol);

            for(let p in this.productions) {
                let production = this.productions[p];
                if(production[0] == this.currentState && production[1] == inputSymbol && (production[2] == this.currentStackSymbol
                    || production[2] == "X")) {
                        if(production[4].length == 2) {
                            this.stack.push(inputSymbol);
                        } else if(production[4] == "ϵ" && !this.stack.isEmpty()) {
                            this.stack.pop();
                        }

                        this.currentState = production[3];
                        flag = 1;
                        break;
                }
            }

            if(flag == 0) {
                for(let p in this.productions) {
                    let production = this.productions[p];
                    if(production[0] == this.currentState && production[1] == "X" && 
                        (production[2] == this.currentStackSymbol || (production[2] == "X" && this.currentStackSymbol == inputSymbol)
                        || production[2] == "Y" || (production[2].length == 2 && production[2][0] == "X" && production[2][1] == this.stack.secondTop()))) {
                            if(production[4].length == 2) {
                                this.stack.push(inputSymbol);
                            } else if(production[4] == "ϵ" && !this.stack.isEmpty()) {
                                
                                this.stack.pop();
                            }
    
                            this.currentState = production[3];
                            flag = 1
                            break;
                    }
                }
            }

            if(flag == 0) return false;

            this.currentStackSymbol = this.stack.top();

            await new Promise(r => setTimeout(r, 2500));
        }

        changeActiveState("Q"+this.currentState);

        if(this.finalStates.includes(this.currentState)) {
            return true;
        } else {
            return false;
        }
    }
}

let pda_info = {
    "initial_state": 0,
    "final_states": [9],
    "productions": [
        [0, "html", "Z0", 1, ["html", "Z0"]],

        [1, "head", "html", 2, ["head", "html"]],
        [1, "body", "html", 6, ["body", "html"]],
        [1, "/", "html", 7, ["html"]],

        [2, "title", "head", 3, ["title", "head"]],
        [2, "meta", "head", 2, ["head"]],
        [2, "link", "head", 3, ["link", "head"]],
        [2, "script", "head", 3, ["script", "head"]],
        [2, "/", "head", 4, ["head"]],

        [3, "/", "X", 4, ["X"]],

        [4, "X", "X", 2, ["ϵ"]],
        [4, "head", "head", 5, ["ϵ"]],

        [5, "body", "html", 6, ["body", "html"]],
        [5, "/", "html", 7, ["html"]],

        [6, "X", "Y", 6, ["X", "Y"]],
        [6, "/", "X", 7, ["X"]],
        [6, "img", "X", 6, "X"],
        [6, "br", "X", 6, "X"],
        [6, "hr", "X", 6, "X"],
        [6, "hr", "X", 6, "X"],
        // [6, "table", "X", 7, ["table", "X"]],

        // [7, "tr", "X", 7, ["tr", "X"]],
        // [7, "td", "X", 7, ["td", "X"]],
        // [7, "/", "X", 8, ["X"]],

        // [8, "tr", "tr", 7, ["ϵ"]],
        // [8, "td", "td", 7, ["ϵ"]],
        // [8, "table", "table", 6, ["ϵ"]],

        [7, "X", ["X", "table"], 10, ["ϵ"]],


        [7, "X", "X", 6, ["ϵ"]],
        [7, "html", "html", 8, ["ϵ"]],

        [8, "ϵ", "Z0", 9, ["Z0"]],



        [6, "table", "X", 10, ["table", "X"]],

        [10, "tr", "table", 11, ["tr", "table"]],
        [10, "/", "X", 7, ["X"]],

        [11, "td", "tr", 6, ["td", "tr"]],
        [11, "/", "X", 7, ["X"]]
    ]
};

async function getText() {
    var text = document.getElementById("name").value.toLowerCase();
    // alert(inp(text));
    tags = inp(text);

    document.getElementById("input_str").innerHTML = tags;
    console.log(tags);

    var pda = new PDA(pda_info);
    var result = await pda.compute(tags);
    if(result == true) {
        set_result("html syntax accepted by pda");
    } else {
        set_result("html syntax rejected by pda");
    }
}

//Convert input into array 
function inp(text){
    var array_tag = [];
    var flag = false;
    var str = "";
    for(var i=0;i<text.length;++i){
        if(text.charAt(i) == '>'){
            flag = false;

            if(text.charAt(i-1) == '/') str = str + "/";

            array_tag.push(str);
            str = "";
        }
        if(flag){
            if(text.charAt(i) =='/')
                array_tag.push('/');
            
            else if(text.charAt(i) ==' ')
                flag = false;
            else
                str = str + text.charAt(i);
        }
            
        if(text.charAt(i) == '<')
            flag = true;
    }
    return array_tag;
}

// var pda = new PDA(pda_info);
// console.log(pda.compute([
//     "html",
//         "head",
//             "title",
//             "/","title",
//             "meta",
//         "/","head",
//         "body",
//             "table",
//                 "tr",
//                     "td",
//                     "/","td",
//                 "/","tr",
//             "/","table",
//             "p",
//                 "a",
//                 "/","a",
//             "/","p",
//         "/","body",
//     "/","html"
// ]));