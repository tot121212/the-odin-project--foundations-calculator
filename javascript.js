let storedFirstOperand = null;
let storedOperator = null;
let storedPrevOperator = null;
let storedSecondOperand = null;
let storedResult = null;

const resultElement = document.querySelector(".display");

const decimalPlaces = 7;

const Operands = {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "*": (a, b) => a * b,
    "/": (a, b) => {
        if (b === 0) {
            throw new Error("Division by zero");
        }
        return a / b;
    },
}

function operate(...args) { // performs operations based on button clicks, also returns result
    if (args.length !== 3) {
        throw new Error("Invalid number of arguments");
    }
    if (args.some(item => typeof (item !== "number"))) { // verify that all args exist
        throw new Error("Invalid arguments");
    }
    const [operator, firstOperand, secondOperand] = args || []; // deconstruct into individual consts
    // if (Operands.keys.includes(operator)) {
    //     return Operands[operator](firstOperand, secondOperand).toFixed(decimalPlaces);
    // }
}

function clearButton(e) {
    resultElement.textContent = "0";
    // clear all
    storedFirstOperand = null;
    storedOperator = null;
    storedSecondOperand = null;
    storedResult = null;
}

function equalsButtonClicked(_button) {
    if (!storedFirstOperand || !storedOperator || !storedSecondOperand) { // need all three to perform operation
        return;
    }
    const result = operate(storedOperator, storedFirstOperand, storedSecondOperand);
    storedFirstOperand = null;
    storedOperator = null;
    storedSecondOperand = null;
    storedResult = result;
    resultElement.textContent = storedResult;
}

// Function to handle operator button clicks
// If there's a stored first operand:
//   - If no operator is stored, store the clicked button's value as the operator
//   - If operator exists and matches clicked button, use first operand as second operand and calculate
function operatorButtonClicked(button) {
    if (storedFirstOperand && Operands.keys.contains(button.value)) {
        if (!storedOperator) {
            storedOperator = button.value;
        } else if (Operands.keys.contains(button.value) && (storedOperator === button.value)) {
            storedSecondOperand = storedFirstOperand;
            equalsButtonClicked(button);
        }
    }
}

function operandButtonClicked(button) {
}

function isStringSafe(str){
    if (!str) return false;
    
    // Convert to string if not already
    str = str.toString();
    
    // Check for whitespace
    if (str !== str.trim()) return false;
    
    // Check for HTML tags
    if (/<[^>]*>/g.test(str)) return false;
    
    // Check for invalid characters
    if (/[^0-9\.\+\-\*\/]/g.test(str)) return false;
    
    return true;
}

function sanitizeButton(button){
    if (button || button.value || isStringSafe(str) || Operands.keys.includes(button.value)) {
        return true;
    }
    return false;
}

function eventCalculatorButtonClicked(e) {
    if (!e.target.classList.contains("calculatorButton")) return;
    const button = e.target;
    if (button && sanitizeButton(button)){
        if (button.classList.contains("clear")) {
            clearButton(button);
        } else if (button.classList.contains("equals")) {
            equalsButtonClicked(button);
        } else if (button.classList.contains("operator")) {
            operatorButtonClicked(button);
        } else if (button.classList.contains("operand")) {
            operandButtonClicked(button);
        }
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const buttonContainer = document.querySelector(".calculator");
    buttonContainer.addEventListener("click", eventCalculatorButtonClicked);
});

