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

function truncateDecimalPlaces(number){
    // Convert to string with fixed decimal places
    const fixed = Number(number).toFixed(decimalPlaces);
    // Convert back to number to remove trailing zeros
    return Number(fixed).toString();
}

const decimalPlaces = 7;

function operate(...args) { // performs operations based on button clicks, also returns result
    console.log("Operate function called");
    if (args.length !== 3) {
        throw new Error("Invalid number of arguments");
    }
    if (args.some(item => typeof item !== "number")) { // verify that all args exist
        throw new Error("Invalid arguments");
    }
    const [operator, firstOperand, secondOperand] = args || []; // deconstruct into individual consts
    let operatorFunction = Operations.get(operator); // get function from Operators object
    result = truncateDecimalPlaces(operatorFunction(firstOperand, secondOperand)); // compute result and truncate it
    console.log(`Result: ${result}`);
    return result;
}

function clearButton(_button) {
    console.log("Clearing calculator state");

    // clear all properties and reset display
    calculatorState.set('firstOperand', null);
    calculatorState.set('operator', null);
    calculatorState.set('secondOperand', null);
    calculatorState.set('result', null);

    resultElement.textContent = "0";
}

function equalsButtonClicked(_button) {
    console.log("Equals button clicked");

    if (!calculatorState.get('operator')) {
        console.log("No operator");
        return;
    }
    if (!calculatorState.get('secondOperand')) {
        console.log("No second operand");
        return;
    }
    if (!calculatorState.get('firstOperand')) {
        console.log("No first operand");
        return;
    }
    try {
        const result = operate(
            calculatorState.get('operator'),
            calculatorState.get('firstOperand'),
            calculatorState.get('secondOperand')
        );

        calculatorState.set('firstOperand', null);
        calculatorState.set('operator', null);
        calculatorState.set('secondOperand', null);
        calculatorState.set('result', result);
    
        resultElement.textContent = result;
    } catch (error) {
        console.error(error);
        resultElement.textContent = "ERROR";
    }
}

function operatorButtonClicked(button) {
    console.log("Operator button clicked");

    if (calculatorState.get('firstOperand') && Operations.has(button.value)) { // if there is a first operand and operand is valid
        if (!calculatorState.get('operator')) { // if there is no operator, store it
            console.log("No operator, setting operator");
            calculatorState.set('operator', button.value);
        } else if (calculatorState.get('operator') === button.value) { // else if current operator is same as user input operator, we dont need to set it
            console.log("Operator is same as current operator : performing duplicated operation : i.e. `4+4 4*4 4/4 4-4`");
            calculatorState.set('secondOperand', calculatorState.get('firstOperand')); // set second operand to first one
            equalsButtonClicked(button); // perform an operation
        }
    }
}

function operandButtonClicked(button) {
    console.log("Operand button clicked");

    let whichOperand;

    function updateOperand(obj, val) { // either concatinates number or returns input
        let operandValue = obj.get(whichOperand);
        operandValue = operandValue ? Number(String(operandValue) + val) : Number(val) // if a number is already assigned, append value to opperand
        obj.set(whichOperand,  operandValue); 
        resultElement.textContent = String(operandValue);
    }
    
    if (!calculatorState.get('operator')) { // if no operator stored, we are on first operand still.
        console.log("No operator, setting first operand");
        whichOperand = 'firstOperand';
    } else {
        console.log("Operator exists, setting second operand");
        whichOperand = 'secondOperand';
    }
    updateOperand(calculatorState, button.value);
}

function decimalButtonClicked(_button) {
}


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

function eventCalculatorButtonClicked(e) {
    console.log(`eventCalculatorButtonClicked: ${e.target.value}`);
    if (e.target.type !== "button") return;
    const button = e.target;
    if (button && sanitizeButton(button)) {
        let classList = button.classList
        console.log(`classList: ${classList}`);
        if (button.classList.contains("clear")) {
            clearButton(button);
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

export { operate, clearButton, equalsButtonClicked, operatorButtonClicked, operandButtonClicked, decimalButtonClicked };