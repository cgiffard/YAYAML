/**
* @ngdoc function
* @name parser
*
* @description
* Function which kicks off YAYAML parsing. Takes a YAYAML string and retuns its
* in-memory object representation.
*
* @param {string}    input      A string containing the YAYAML file.
*
* @returns {object}  object     The object representation of the YAYAML file
*
*/
function parser(input) {
    return (function tokenIterator(tokens) {
        return tokens.reduce(function(ast, token) {
            var text        = token.line;
                propName    = getPropName(text),
                propVal     = getPropVal(text);

            if (propVal && token.children) {
                if (ast[propName] instanceof Array)
                    throw new Error(
                        "You can't put named map properties into an array. (" +
                        token.line.trim() + ")");

                ast[propName] = ast[propName] || {};
                ast[propName][propVal] = tokenIterator(token.children);

            } else if (propVal && !token.children) {
                ast[propName] = createOrPush(propVal, ast[propName]);

            } else {
                ast[propName] = createOrPush(
                    tokenIterator(token.children), ast[propName]);
            }

            return ast;
        }, {});
    })(tokeniser(input));
}

/**
* @ngdoc function
* @name createOrPush
*
* @description
* If an item already exists for the current key, this function creates an array
* representation of it. If the property is already an array, this function
* returns the value of the current key with the new value pushed onto the end.
*
* @param {object}    item       A string containing the node to add to the AST.
* @param {object}    astNode    The current AST node property value
*
* @returns {object}  object     The value to add to the AST
*
*/
function createOrPush(item, astNode) {
    if (!astNode)
        return item;

    if (astNode instanceof Array)
        return astNode.concat(item);

    return [astNode, item];
}

/**
* @ngdoc function
* @name getPropName
*
* @description
* Returns the property name for a given line
*
* @param {string}    lineText   The original line text, less the original
*                               indentation
*
* @returns {string}  propName   The property name
*
*/
function getPropName(text) {
    return text.split(/\s+/, 1)[0];
}

/**
* @ngdoc function
* @name getPropVal
*
* @description
* Returns the property value for a given line, parsing it to an number if
* required.
*
* @param {string}    lineText   The original line text, less the original
*                               indentation
*
* @returns {string}  propName   The property value
*
*/
function getPropVal(text) {
    var valText = text.substr(getPropName(text).length, text.length).trim();

    if (valText.match(/^[\d\.\-]+$/))
        return parseFloat(valText);

    return valText;
}

/**
* @ngdoc function
* @name tokeniser
*
* @description
* Turns the original YAYAML text into a hierarchy of variously tagged tokens.
* Each is tagged with a score, which relates to its absolute indentation level.
* This is used to calculate the hierarchy.
*
* @param {string}    input      A string containing the YAYAML file.
*
* @returns {array}   array      An array of tokens generated from the file.
*
*/
function tokeniser(input) {
    if (typeof input !== "string")
        throw new Error("Input must be a string!");

    var lines =
        input
            .split(/[\r\n]+/ig)
            .filter(function(line) {
                // The line is blank
                if (!line) return false;

                // The line is only whitespace
                if (!line.replace(/\s+/ig, "").length) return false;

                // The line is just a comment
                if (line.replace(/\s+/ig, "")[0] === "#") return false;

                return true;
            });

    return (function lineIterator(lines, output, prev, stack) {
        if (!lines.length) return output || [];

        output = output || [];
        stack  = stack  || [output];

        var head            = lines[0],
            tail            = lines.slice(1),
            lineScore       = countWhitespace(head),
            prevLineScore   = prev ? prev.score : Infinity,
            indented        = lineScore > prevLineScore,
            current =
                { line: trimLeadingWhitespace(head), score: lineScore };

        if (!indented) {
            while (lineScore <= stack[stack.length - 1].score) {
                stack.pop();
            }

            (stack[stack.length - 1].children ||
                stack[stack.length - 1]).push(current);

            prev = stack[stack.length - 2];

        } else {
            if (prev.children) {
                prev.children.push(current);
            } else {
                prev.children = [current];
            }

            stack.push(prev);
        }

        return lineIterator(tail, output, current, stack);
    }(lines));
}

/**
* @ngdoc function
* @name countWhitespace
*
* @description
* Function which counts the number of whitespace characters at the beginning of
* a line.
*
* @param {string}    input      A string containing a line of YAYAML
*
* @returns {number}  whitespace The number of leading whitespace characters.
*
*/
function countWhitespace(input) {
    return input.match(/^\s+/) ? input.match(/^\s+/)[0].length : 0;
}

/**
* @ngdoc function
* @name countWhitespace
*
* @description
* Function which trims leading whitespace only.
*
* @param {string}    input      A string containing a line of YAYAML
*
* @returns {string}  line       The trimmed YAYAML string
*
*/
function trimLeadingWhitespace(input) {
    return input.replace(/^\s+/, "");
}

module.exports = parser;
module.exports.tokeniser = tokeniser;