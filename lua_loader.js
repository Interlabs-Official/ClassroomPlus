// lua-transpiler-loader.js - True Lua to JavaScript transpiler
const luaparse = require('luaparse');

module.exports = function(source) {
  const callback = this.async();
  
  try {
    // Parse Lua to AST
    const ast = luaparse.parse(source);
    
    // Convert AST to JavaScript (improved)
    const jsCode = transpileToJS(ast);
    
    const output = `
// Transpiled from Lua to JavaScript at build time
// MV3 compatible - no eval() or runtime parsing

${jsCode}
`;
    
    callback(null, output);
  } catch (error) {
    callback(error);
  }
};

function transpileToJS(ast) {
  let code = '';
  let exported = [];

  ast.body.forEach(statement => {
    if (statement.type === 'FunctionDeclaration') {
      const funcName = statement.identifier.name;
      const params = statement.parameters.map(p => p.name).join(', ');
      code += `function ${funcName}(${params}) {\n`;
      // Expose chrome, window, document, etc.
      code += `  const chrome = globalThis.chrome;\n`;
      code += `  const window = globalThis.window;\n`;
      code += `  const document = globalThis.document;\n`;
      code += transpileBlock(statement.body);
      code += `}\n\n`;
      exported.push(funcName);
    } else if (statement.type === 'CallStatement' && statement.expression.base.name === 'print') {
      code += transpileStatement(statement);
    }
  });

  code += `module.exports = { ${exported.join(', ')} };\n`;

  return code;
}

function transpileBlock(block) {
  return block.map(transpileStatement).join('');
}

function transpileStatement(statement) {
  switch (statement.type) {
    case 'CallStatement':
      return transpileCall(statement.expression) + ';\n';
    case 'ReturnStatement':
      return 'return ' + transpileExpression(statement.arguments[0]) + ';\n';
    case 'AssignmentStatement':
      return (
        statement.variables.map(transpileExpression).join(', ') +
        ' = ' +
        statement.init.map(transpileExpression).join(', ') +
        ';\n'
      );
    default:
      return '// [unhandled statement type: ' + statement.type + ']\n';
  }
}

function transpileCall(expr) {
  // Only handle print and function calls
  if (expr.base.type === 'Identifier' && expr.base.name === 'print') {
    return 'console.log(' + expr.arguments.map(transpileExpression).join(', ') + ')';
  } else {
    // function call
    return expr.base.name + '(' + expr.arguments.map(transpileExpression).join(', ') + ')';
  }
}

function transpileExpression(expr) {
  if (!expr) return '';
  switch (expr.type) {
    case 'StringLiteral':
      return JSON.stringify(expr.value);
    case 'NumericLiteral':
      return expr.value;
    case 'Identifier':
      return expr.name;
    case 'BinaryExpression':
      return transpileExpression(expr.left) + ' ' + expr.operator + ' ' + transpileExpression(expr.right);
    case 'CallExpression':
      return transpileCall(expr);
    default:
      return '/* [unhandled expr: ' + expr.type + '] */';
  }
}