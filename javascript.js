const resultElement = document.querySelector("#display");
const buttonContainer = document.querySelector("#calculator #container");

const calculatorState = new Map([
    ['firstOperand', null],
    ['operator', null],
    ['secondOperand', null],
    ['result', null]
]);

const Operations = new Map([
    ["+", (a, b) => a + b],
    ["-", (a, b) => a - b],
    ["*", (a, b) => a * b],
    ["/", (a, b) => {
        if (b === 0) {
            throw new Error("Division by zero");
        }
        return a / b;
    }]
]);

const fractionDigits = 7;

function operate(...args) { // performs operations based on button clicks, also returns result
    console.log("Operate function called");
    if (args.length !== 3) {
        throw new Error("Invalid number of arguments");
    }
    if (args.slice(1, 2).some(item => typeof item !== "number")) { // verify that all args exist
        throw new Error("Invalid arguments");
    }
    const [operator, firstOperand, secondOperand] = args || []; // deconstruct into individual consts
    let operatorFunction = Operations.get(operator); // get function from Operators object for specified operator
    if (!operatorFunction || typeof operatorFunction !== "function") {
        throw new Error("Invalid operator or operatorFunction");
    }
    let result = operatorFunction(firstOperand, secondOperand).toFixed(fractionDigits);
    if (!result || typeof result !== "number") {
        throw new Error("Invalid result");
    }
    console.log(`Result: ${result}`);
    return result;
}

function clearCalculatorState() {
    console.log("Clearing calculator state");
    calculatorState.forEach((value, key) => {
        calculatorState.set(key, null);
    });
}

function clearButtonClicked(_button) {
    console.log("Clearing calculator state");

    // clear all properties and reset display
    clearCalculatorState()
    resultElement.textContent = "0";
}

function performEqualsOperation() {
    if (!calculatorState.get('operator')) {
        throw new Error("No operator");
    }
    if (!calculatorState.get('secondOperand')) {
        throw new Error("No second operand");
    }
    if (!calculatorState.get('firstOperand')) {
        throw new Error("No first operand");
    }
    try {
        const result = operate(
            calculatorState.get('operator'),
            calculatorState.get('firstOperand'),
            calculatorState.get('secondOperand')
        );
        if (typeof result !== "number") {
            throw new Error("Invalid result");
        }
        calculatorState.set('firstOperand', null);
        calculatorState.set('operator', null);
        calculatorState.set('secondOperand', null);
        calculatorState.set('result', Number(result));
    } catch (error) {
        console.error(error);
        return "ERROR";
    }
}

function equalsButtonClicked(_button) {
    console.log("Equals button clicked");
    let operationError = performEqualsOperation();
    resultElement.textContent = operationError ? operationError : + calculatorState.get('result');
}

function performOperatorDeclaration(operator) {
    if (typeof operator !== "string") {
        throw new Error("Invalid datatype");
    }
    if (!Operations.has(operator)){ // check for if operations has that operator
        throw new Error("Invalid operator operation");
    }
    if (calculatorState.get('firstOperand')) { // if there is a first operand and operand is valid
        if (!calculatorState.get('operator')) { // if there is no operator, store it
            console.log("No operator, setting operator");
            calculatorState.set('operator', operator);
        } else if (calculatorState.get('operator') === operator) { // else if current operator is same as user input operator, we dont need to set it
            console.log("Operator is same as current operator : performing duplicated operation : i.e. `4+4 4*4 4/4 4-4`");
            calculatorState.set('secondOperand', calculatorState.get('firstOperand')); // set second operand to first one
        }
    } else {
        console.log("No first operand, ignore");
    }
}

function operatorButtonClicked(button) {
    console.log("Operator button clicked");
    let operationError = performOperatorDeclaration(button.value);
    resultElement.textContent = operationError ? operationError : Number(calculatorState.get('result'));
}

function whichOperand(){
    let which;
    if (!calculatorState.get('operator')) { // if no operator stored, we are on first operand still.
        console.log("No operator, setting first operand");
        which = 'firstOperand';
    } else {
        console.log("Operator exists, setting second operand");
        which = 'secondOperand';
    }
    return which;
}

function performOperandDeclaration(newOperand) {
    if (typeof newOperand !== "number") {
        throw new Error("Invalid datatype");
    }
    
    // Check for operator, finding current operator
    let whichOperand;
    if (!calculatorState.get('operator')) { // if no operator stored, we are on first operand still.
        console.log("No operator, setting first operand");
        whichOperand = 'firstOperand';
    } else {
        console.log("Operator exists, setting second operand");
        whichOperand = 'secondOperand';
    }
    
    // Check if operand exists
    let storedOperand = Number(calculatorState.get(whichOperand)); // get specified operand
    if (storedOperand){ // if a number is already assigned, append value to opperand
        newOperand = Number(String(storedOperand) + String(newOperand)) // concat
    }
    
    calculatorState.set(whichOperand, newOperand);
    return String(newOperand);
}

function operandButtonClicked(button) {
    console.log("Operand button clicked");
    resultElement.textContent =  performOperandDeclaration(button.value);
}

function decimalButtonClicked(_button) {
}

const safeCalculatorValues = new Set([
    "clear",
    "sign",
    "percent",
    "/",
    "*",
    "-",
    "+",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    ".",
    "="
]);

function sanitizeCalculatorValue(value) {
    if (!value) {
        throw new Error(`No value`);
    }
    if (!safeCalculatorValues.has(value)) {
        throw new Error(`Value is not safe`);
    }
    return true;
}

function sanitizeButton(button) {
    if (!button) {
        throw new Error(`Button is null`);
    }
    return sanitizeCalculatorValue(button.value);
}

function eventCalculatorButtonClicked(e) {
    console.log(`eventCalculatorButtonClicked: ${e.target.value}`);
    if (e.target.type !== "button") return;
    const button = e.target;
    if (button && sanitizeButton(button)) {
        console.log(`button.classList: ${button.classList}`);
        if (button.classList.contains("clear")) {
            clearButtonClicked(button);
        } else if (button.classList.contains("equals")) {
            equalsButtonClicked(button);
        } else if (button.classList.contains("operator")) {
            operatorButtonClicked(button);
        } else if (button.classList.contains("operand")) {
            operandButtonClicked(button);
        } else if (button.classList.contains("decimal")) {
            decimalButtonClicked(button);
        }
    }
}

window.addEventListener("keydown", function (e) {
    const key = document.querySelector(`button[data-key="${e.key}"]`);
    if (key) {
        key.click();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    buttonContainer.addEventListener("click", eventCalculatorButtonClicked);
    console.log("DOM fully loaded and parsed");
});