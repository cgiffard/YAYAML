var expect  = require("chai").expect,
    fs      = require("fs"),
    path    = require("path");

function runTest(testName, fn) {
    return function() {
        var input = fs.readFileSync(
                path.join(__dirname, "fixtures", testName + ".yay"), "utf8"),
            output =
                require(path.join(__dirname, "fixtures", testName + ".json"));

        expect(fn(input)).to.eql(output);
    };
}

describe("API", function() {
    it("Should export a function which takes a string", function() {
        expect(require("../lib/yayaml")).to.be.a("function");
        expect(require("../lib/yayaml").length).to.equal(1);
    });

    it("Should export a function property `tokeniser` which takes a string",
        function() {
            expect(require("../lib/yayaml").tokeniser).to.be.a("function");
            expect(require("../lib/yayaml").tokeniser.length).to.equal(1);
        });

    it("Given an empty string, returns an empty object", function() {
        expect(require("../lib/yayaml")("")).to.eql({});
    });
})

describe("Parsing ", function() {
    describe("Tokenisation", function() {
        var tokeniser = require("../lib/yayaml").tokeniser;

        it("Correctly ascertains nesting order for elements with tabs",
            runTest("tokenisation-tabs", tokeniser));

        it("Correctly ascertains nesting order for elements with spaces",
            runTest("tokenisation-spaces", tokeniser));

        it( "Correctly ascertains nesting order for elements with a mixture " +
            "of tabs and spaces",
            runTest("tokenisation-mixed", tokeniser));

        it("Ignores comments",
            runTest("tokenisation-ignores-comments", tokeniser));
    });

    describe("Object creation", function() {
        var parser = require("../lib/yayaml");

        it("Correctly sets object properties",
            runTest("objectcreation-sets-properties", parser));

        it("Correctly creates arrays from duplicate properties",
            runTest("objectcreation-creates-arrays", parser));

        it("Correctly creates double-nested objects",
            runTest("objectcreation-double-nested", parser));

        it("Produces the right result for the parsing acid test",
            runTest("acidtest", parser));
    });
});