const resultElement = document.querySelector("#display");
const buttonContainer = document.querySelector("#calculator #container");

const calculatorState = new Map([
    ['firstOperand', '0'],
    ['operator', null],
    ['secondOperand', null],
    ['result', null]
]);
// hi
const Operations = new Map([
    ["+", (a, b) => a + b],
    ["-", (a, b) => a - b],
    ["*", (a, b) => a * b],
    ["/", (a, b) => a / b]
]);

const fractionDigits = 7;

function calculatorErrorAndRethrow(error) {
    clearCalculatorState();
    calculatorState.set('result', 'ERROR');
    console.error(error);
    throw error;
}

function operate(operator, firstOperand, secondOperand) { // performs operations based on button clicks, also returns result
    try {
        console.log("Operate function called");
        if (typeof operator !== 'string'){
            throw new Error("Operator is not a string");
        }
        const operands = [firstOperand, secondOperand];
        for (const operand of operands) {
            if (typeof operand !== 'number') {
                throw new Error(`${operand} is not a number`);
            }
            if (operand === 0 && operator === "/"){
                throw new Error('Cannot divide by zero');
            }
        }
        let operatorFunction = Operations.get(operator); // get function from Operators object for specified operator
        if (!operatorFunction) {
            throw new Error("Invalid operator or operatorFunction");
        }
        let result = operatorFunction(firstOperand, secondOperand).toFixed(fractionDigits);
        if (typeof Number(result) !== "number") {
            throw new Error("Invalid result");
        }
        console.log(`Result: ${result}`);
        return result;
    }
    catch (error) {
        calculatorErrorAndRethrow(error);
    }
}

// Note: Need to fix all operations so that they display correctly.
function updateResultElement(result) {
    resultElement.textContent = String(result);
}

function clearCalculatorState() {
    console.log("Clearing calculator state");
    calculatorState.forEach((value, key) => {
        calculatorState.set(key, null);
    });
    calculatorState.set('result', '0');
}

function clearButtonClicked(_button) {
    console.log("Clearing calculator state");

    // clear all properties and reset display
    clearCalculatorState();
    updateResultElement(calculatorState.get("result"));
}

function performEqualsOperation() {
    if (calculatorState.get('firstOperand') === null) {
        console.log("No first operand, ignoring");
        return;
    }
    if (!calculatorState.get('operator')) {
        console.log("No operator, ignoring");
        return;
    }
    if (!calculatorState.get('secondOperand')) {
        console.log("No second operand, ignoring");
        return;
    }
    
    const result = operate(
        calculatorState.get('operator'),
        calculatorState.get('firstOperand'),
        calculatorState.get('secondOperand')
    );

    calculatorState.set('operator', null);
    calculatorState.set('secondOperand', null);
    calculatorState.set('result', Number(result));
    calculatorState.set('firstOperand', calculatorState.get('result'));

    return true;
}

function equalsButtonClicked(_button) {
    console.log("Equals button clicked");
    // if not enough
    if (performEqualsOperation() === true){
        updateResultElement(String(calculatorState.get('result')));
    }
}

function performRepeatedOperatorOperation() {
    console.log("Performing repeatedOperatorOperation");
    calculatorState.set('secondOperand', calculatorState.get('firstOperand')); // set second operand to first one
    performEqualsOperation();
}

function performOperatorDeclaration(operator) {
    try {
        if (typeof operator !== "string" || !Operations.get(operator)) { // check for if operations has that operator
            throw new Error("Invalid operator");
        }
        if (calculatorState.get('firstOperand')) { // if there is a first operand and operand is valid
            if (!calculatorState.get('operator')) { // if there is no operator, store it
                console.log("No operator, setting operator");
                calculatorState.set('operator', operator);
            } else if (calculatorState.get('operator') === operator) { // else if input is a repeated operator
                return "repeatedOperator";
            }
        } else {
            console.log("No first operand, ignore");
        }
    }
    catch (error) {
        calculatorErrorAndRethrow(error);
    }
}

function operatorButtonClicked(button) {
    console.log("Operator button clicked");
    if (performOperatorDeclaration(button.value) === "repeatedOperator") { // if we have repeated operator
        performRepeatedOperatorOperation();
        updateResultElement(String(calculatorState.get('result'))); // update display after repeating
    }
}

function whichOperand() {
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
    try {
        if (isNaN(Number(newOperand))) {
            throw new Error("Invalid operand");
        }
        let which = whichOperand();
        let storedOperand = calculatorState.get(which); // get specified operand
        if (storedOperand !== null || storedOperand === 0) { // if a number is already assigned, append value to opperand
            newOperand = Number(String(storedOperand) + String(newOperand)); // concat
        }
        calculatorState.set(which, Number(newOperand));
    }
    catch (error) {
        calculatorErrorAndRethrow(error);
    }
}

function operandButtonClicked(button) {
    console.log("Operand button clicked");
    performOperandDeclaration(button.value);
    updateResultElement(String(calculatorState.get(whichOperand())));
}

function performDecimalDeclaration() {
    try {
        let which = whichOperand();
        let operand = String(calculatorState.get(which));
        if (!operand instanceof String){
            throw new Error("Operand is valid");
        }
        if (operand.includes(".")) {
            console.log("Operand already contains decimal, ignoring");
            return;
        }
        calculatorState.set(which, operand.concat("."));
    }
    catch (error) {
        calculatorErrorAndRethrow(error);
    }
}

function decimalButtonClicked(button) {
    console.log("Decimal button clicked");
    performDecimalDeclaration();
    updateResultElement(String(calculatorState.get(whichOperand())));
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
    try{
        if (!value) {
            throw new Error(`No value`);
        }
        if (!safeCalculatorValues.has(value)) {
            throw new Error(`Value is not safe`);
        }
        return true;
    }
    catch (error) {
        calculatorErrorAndRethrow(error);
    }
}

function sanitizeButton(button) {
    try{
        if (!button) {
            throw new Error(`Button is null`);
        }
        return sanitizeCalculatorValue(button.value);
    }
    catch (error) {
        calculatorErrorAndRethrow(error);
    }
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

document.addEventListener("DOMContentLoaded", () => {
    buttonContainer.addEventListener("click", eventCalculatorButtonClicked);
    console.log("DOM fully loaded and parsed");
});

export {
    calculatorErrorAndRethrow,
    operate,
    calculatorState,
    clearCalculatorState,
    performEqualsOperation,
    performOperandDeclaration,
    performOperatorDeclaration,
    performRepeatedOperatorOperation,
    performDecimalDeclaration,
    Operations,
    whichOperand,
    fractionDigits,
};