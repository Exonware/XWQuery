from exonware.xwsyntax import XWSyntax
s = XWSyntax()
# Test Python
print("Testing Python grammar...")
g_py = s.load_grammar('python')
code = '''def greet(name):
    return "Hello, " + name'''
ast = g_py.parse(code)
print(f'Python parse successful! AST type: {ast.type}, children: {len(ast.children)}')
# Test Rust
print("\nTesting Rust grammar...")
g_rs = s.load_grammar('rust')
rust_code = '''fn greet(name: &str) -> String {
    format!("Hello, {}", name)
}'''
ast_rs = g_rs.parse(rust_code)
print(f'Rust parse successful! AST type: {ast_rs.type}, children: {len(ast_rs.children)}')
