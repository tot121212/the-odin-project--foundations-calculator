// calculator.test.js

import {
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
    calculatorErrorAndRethrow,
} from './javascript.js';

describe('Calculator Operations', () => {
    beforeEach(() => {
        clearCalculatorState();
    });

    describe('operate function', () => {
        test('adds two numbers correctly', () => {
            expect(operate('+', 2, 3)).toBe('5.0000000');
        });

        test('subtracts two numbers correctly', () => {
            expect(operate('-', 5, 3)).toBe('2.0000000');
        });

        test('multiplies two numbers correctly', () => {
            expect(operate('*', 4, 3)).toBe('12.0000000');
        });

        test('divides two numbers correctly', () => {
            expect(operate('/', 6, 2)).toBe('3.0000000');
        });

        test('throws error on division by zero', () => {
            expect(() => operate('/', 6, 0)).toThrow('Cannot divide by zero');
        });
    });

    describe('performOperandDeclaration', () => {
        test('sets first operand correctly', () => {
            performOperandDeclaration('5');
            expect(calculatorState.get('firstOperand')).toBe(5);
        });

        test('concatenates digits for same operand', () => {
            performOperandDeclaration('1');
            performOperandDeclaration('2');
            expect(calculatorState.get('firstOperand')).toBe(12);
        });

        test('handles invalid input', () => {
            expect(() => performOperandDeclaration('fleshWound')).toThrow("Invalid operand");
        });
    });

    describe('performOperatorDeclaration', () => {
        test('ensure first operand is declared before setting operator, but shouldn\'t throw error', () => {
            calculatorState.set('firstOperand', null);
            performOperatorDeclaration('+')
            expect(calculatorState.get('operator')).toBe(null);
        });
        test('ensure operator is string', () => {
            calculatorState.set('firstOperand', 5);
            expect(() => performOperatorDeclaration(8)).toThrow('Invalid operator');
        });
        test('ensure operator is valid', () => {
            calculatorState.set('firstOperand', 5);
            expect(() => performOperatorDeclaration('a')).toThrow('Invalid operator');
        });
        test('sets operator correctly', () => {
            calculatorState.set('firstOperand', 5);
            performOperatorDeclaration('+');
            expect(calculatorState.get('operator')).toBe('+');
        });
        test('identifies repeated operator', () => {
            calculatorState.set('firstOperand', 5);
            calculatorState.set('operator', '+');
            expect(performOperatorDeclaration('+')).toBe('repeatedOperator');
        });
    });

    describe('performDecimalDeclaration', () => {
        test('adds decimal point to number', () => {
            calculatorState.set('firstOperand', '5');
            performDecimalDeclaration();
            expect(calculatorState.get('firstOperand')).toBe('5.');
        });

        test('adds leading zero for decimal without number', () => {
            calculatorState.set('firstOperand', '0');
            performDecimalDeclaration();
            expect(calculatorState.get('firstOperand')).toBe('0.');
        });
        test('does not allow more than one decimal point in a declaration', () => {
            calculatorState.set('firstOperand', '5.5');
            performDecimalDeclaration();
            expect(calculatorState.get('firstOperand')).toBe('5.5');
        });
    });

    describe('whichOperand function', () => {
        test('returns firstOperand when no operator', () => {
            expect(whichOperand()).toBe('firstOperand');
        });

        test('returns secondOperand when operator exists', () => {
            calculatorState.set('operator', '+');
            expect(whichOperand()).toBe('secondOperand');
        });
    });
});

