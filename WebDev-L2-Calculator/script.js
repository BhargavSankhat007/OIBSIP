

const display = document.querySelector(".display");
const buttons = document.querySelectorAll("button");

let string = "";
let justCalculated = false;

// Display update function
function updateDisplay() {
    display.value = string;
}

// Calculate expression without eval()
function calculateExpression(expression) {

    const tokens = [];
    let position = 0;

    // Convert expression into tokens
    while (position < expression.length) {

        const remaining = expression.slice(position);

        const match = remaining.match(
            /^(?:\d+(?:\.\d*)?|\.\d+|[+\-*/%])/
        );

        if (!match) {
            throw new Error("Invalid Expression");
        }

        tokens.push(match[0]);
        position += match[0].length;
    }

    let index = 0;

    // Addition and subtraction
    function parseExpression() {

        let result = parseTerm();

        while (
            tokens[index] === "+" ||
            tokens[index] === "-"
        ) {

            const operator = tokens[index];
            index++;

            const nextValue = parseTerm();

            if (operator === "+") {
                result += nextValue;
            } else {
                result -= nextValue;
            }
        }

        return result;
    }

    // Multiplication, division and modulo
    function parseTerm() {

        let result = parseUnary();

        while (
            tokens[index] === "*" ||
            tokens[index] === "/" ||
            tokens[index] === "%"
        ) {

            const operator = tokens[index];
            index++;

            const nextValue = parseUnary();

            if (
                (operator === "/" || operator === "%") &&
                nextValue === 0
            ) {
                throw new Error("Cannot divide by zero");
            }

            if (operator === "*") {
                result *= nextValue;
            }

            else if (operator === "/") {
                result /= nextValue;
            }

            else if (operator === "%") {
                result %= nextValue;
            }
        }

        return result;
    }

    // Handle positive and negative numbers
    function parseUnary() {

        if (tokens[index] === "+") {
            index++;
            return parseUnary();
        }

        if (tokens[index] === "-") {
            index++;
            return -parseUnary();
        }

        return parseNumber();
    }

    // Read numbers
    function parseNumber() {

        const token = tokens[index];

        if (!token || !/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(token)) {
            throw new Error("Invalid Number");
        }

        index++;

        return Number(token);
    }

    const result = parseExpression();

    // Check remaining tokens
    if (index !== tokens.length) {
        throw new Error("Invalid Expression");
    }

    if (!Number.isFinite(result)) {
        throw new Error("Invalid Result");
    }

    return result;
}


// Button click events
buttons.forEach((button) => {

    button.addEventListener("click", () => {

        const value = button.textContent.trim();

        // AC button
        if (value === "AC") {

            string = "";
            justCalculated = false;

            updateDisplay();
        }

        // DEL button
        else if (value === "DEL") {

            if (justCalculated) {
                justCalculated = false;
            }

            string = string.slice(0, -1);

            updateDisplay();
        }

        // Equal button
        else if (value === "=") {

            if (string === "") return;

            try {

                const result = calculateExpression(string);

                string = String(
                    Number(result.toFixed(10))
                );

                justCalculated = true;

                updateDisplay();

            } catch (error) {

                display.value = "Error";

                string = "";
                justCalculated = false;
            }
        }

        // Number and operator buttons
        else {

            const isOperator = ["+", "-", "*", "/", "%"].includes(value);

            // Start new calculation after result
            if (justCalculated) {

                if (isOperator) {
                    // Continue with previous result
                } else {
                    string = "";
                }

                justCalculated = false;
            }

            // Prevent multiple decimal points in one number
            if (value === ".") {

                const currentNumber = string.split(/[+\-*/%]/).pop();

                if (currentNumber.includes(".")) {
                    return;
                }
            }

            // Replace previous operator
            if (isOperator) {

                const lastChar = string.slice(-1);

                if (["+", "-", "*", "/", "%"].includes(lastChar)) {

                    if (value === "-" && lastChar !== "-") {
                        string += value;
                    } else {
                        string = string.slice(0, -1) + value;
                    }

                    updateDisplay();
                    return;
                }
            }

            string += value;

            updateDisplay();
        }

    });

});