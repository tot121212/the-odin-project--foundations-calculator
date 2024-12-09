import { operate, calculatorState, sanitizeCalculatorValue, clearButton } from './javascript.js';

describe('Calculator Operations', () => {
    describe('operate function', () => {
        test('should add two numbers correctly', () => {
            expect(operate('+', 2, 3)).toBe('5.0000000');
        });

        test('should subtract two numbers correctly', () => {
            expect(operate('-', 5, 3)).toBe('2.0000000');
        });

        test('should multiply two numbers correctly', () => {
            expect(operate('*', 4, 3)).toBe('12.0000000');
        });

        test('should divide two numbers correctly', () => {
            expect(operate('/', 6, 2)).toBe('3.0000000');
        });

        test('should throw error when dividing by zero', () => {
            expect(() => operate('/', 6, 0)).toThrow('Division by zero');
        });

        test('should throw error with invalid number of arguments', () => {
            expect(() => operate('+', 2)).toThrow('Invalid number of arguments');
        });
    });

    describe('calculatorState', () => {
        beforeEach(() => {
            // Reset calculator state before each test
            calculatorState.firstOperand = null;
            calculatorState.operator = null;
            calculatorState.secondOperand = null;
            calculatorState.result = null;
        });

        test('clearButton should reset calculator state', () => {
            calculatorState.firstOperand = 5;
            calculatorState.operator = '+';
            calculatorState.secondOperand = 3;
            calculatorState.result = 8;

            clearButton();

            expect(calculatorState.firstOperand).toBeNull();
            expect(calculatorState.operator).toBeNull();
            expect(calculatorState.secondOperand).toBeNull();
            expect(calculatorState.result).toBeNull();
        });
    });

    describe('sanitizeCalculatorValue', () => {
        test('should accept valid calculator values', () => {
            expect(sanitizeCalculatorValue('+')).toBe(true);
            expect(sanitizeCalculatorValue('7')).toBe(true);
            expect(sanitizeCalculatorValue('clear')).toBe(true);
        });

        test('should throw error for invalid values', () => {
            expect(() => sanitizeCalculatorValue('invalid')).toThrow('Value is not safe');
            expect(() => sanitizeCalculatorValue('')).toThrow('No value');
            expect(() => sanitizeCalculatorValue(null)).toThrow('No value');
        });
    });
});
