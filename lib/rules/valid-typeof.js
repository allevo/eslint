/**
 * @fileoverview Ensures that the results of typeof are compared against a valid string
 * @author Ian Christian Myers
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "enforce comparing `typeof` expressions against valid strings",
            category: "Possible Errors",
            recommended: true
        },

        schema: [
            {
                type: "object",
                properties: {
                    requireStringLiterals: {
                        type: "boolean"
                    }
                },
                additionalProperties: false
            }
        ]
    },

    create(context) {

        const VALID_TYPES = ["symbol", "undefined", "object", "boolean", "number", "string", "function"],
            OPERATORS = ["==", "===", "!=", "!=="];

        const requireStringLiterals = context.options[0] && context.options[0].requireStringLiterals;

        /**
        * Determines whether a node is a typeof expression.
        * @param {ASTNode} node The node
        * @returns {boolean} `true` if the node is a typeof expression
        */
        function isTypeofExpression(node) {
            return node.type === "UnaryExpression" && node.operator === "typeof";
        }

        //--------------------------------------------------------------------------
        // Public
        //--------------------------------------------------------------------------

        return {

            UnaryExpression(node) {
                if (isTypeofExpression(node)) {
                    const parent = context.getAncestors().pop();

                    if (parent.type === "BinaryExpression" && OPERATORS.indexOf(parent.operator) !== -1) {
                        const sibling = parent.left === node ? parent.right : parent.left;

                        if (sibling.type === "Literal") {
                            if (VALID_TYPES.indexOf(sibling.value) === -1) {
                                context.report(sibling, "Invalid typeof comparison value.");
                            }
                        } else if (requireStringLiterals && !isTypeofExpression(sibling)) {
                            context.report(sibling, "Typeof comparisons should be to string literals.");
                        }
                    }
                }
            }

        };

    }
};
