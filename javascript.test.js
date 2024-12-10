// calculator.test.js

const { 
    operate,
    truncateDecimalPlaces,
    calculatorState,
    Operations,
} = require('./javascript.js');

describe('Calculator Operations', () => {
    describe('operate function', () => {
        test('should add two numbers correctly', () => {
            expect(operate('+', 2, 3)).toBe(5);
        });

        test('should subtract two numbers correctly', () => {
            expect(operate('-', 5, 3)).toBe(2);
        });

        test('should multiply two numbers correctly', () => {
            expect(operate('*', 4, 3)).toBe(12);
        });

        test('should divide two numbers correctly', () => {
            expect(operate('/', 6, 2)).toBe(3);
        });

        test('should throw error on division by zero', () => {
            expect(() => operate('/', 6, 0)).toThrow('Division by zero');
        });

        test('should throw error with invalid number of arguments', () => {
            expect(() => operate('+', 2)).toThrow('Invalid number of arguments');
        });

        test('should throw error with invalid operator', () => {
            expect(() => operate('%', 2, 3)).toThrow('Invalid operator or operatorFunction');
        });
    });

    describe('truncateDecimalPlaces function', () => {
        test('should truncate decimal places correctly', () => {
            expect(truncateDecimalPlaces(3.14159265359)).toBeCloseTo(3.1415927);
        });

        test('should handle whole numbers', () => {
            expect(truncateDecimalPlaces(42)).toBe(42);
        });
    });

    describe('calculatorState', () => {
        beforeEach(() => {
            // Reset calculator state before each test
            calculatorState.set('firstOperand', null);
            calculatorState.set('operator', null);
            calculatorState.set('secondOperand', null);
            calculatorState.set('result', null);
        });

        test('should initialize with null values', () => {
            expect(calculatorState.get('firstOperand')).toBeNull();
            expect(calculatorState.get('operator')).toBeNull();
            expect(calculatorState.get('secondOperand')).toBeNull();
            expect(calculatorState.get('result')).toBeNull();
        });
    });

    describe('Operations Map', () => {
        test('should contain all required operators', () => {
            expect(Operations.has('+')).toBeTruthy();
            expect(Operations.has('-')).toBeTruthy();
            expect(Operations.has('*')).toBeTruthy();
            expect(Operations.has('/')).toBeTruthy();
        });

        test('each operation should be a function', () => {
            Operations.forEach(operation => {
                expect(typeof operation).toBe('function');
            });
        });
    });
});
