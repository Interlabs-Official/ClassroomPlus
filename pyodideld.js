        let pyodide = null;
        const output = document.getElementById('output');
        const status = document.getElementById('status');
        
        function log(message) {
            output.textContent += message + '\n';
            console.log(message);
        }
        
        function setStatus(message, className) {
            status.textContent = message;
            status.className = className;
        }
        
        // Initialize Pyodide
        async function initPyodide() {
            try {
                setStatus('Loading Pyodide...', 'loading');
                log('Initializing Pyodide from local files...');
                
                // Load Pyodide with local indexURL
                pyodide = await loadPyodide({
                    indexURL: './pyodide/'
                });
                
                log('Pyodide loaded successfully!');
                log('Python version: ' + pyodide.runPython('import sys; sys.version'));
                
                setStatus('Pyodide Ready!', 'ready');
                
                // Enable buttons
                document.getElementById('testBasic').disabled = false;
                document.getElementById('testNumpy').disabled = false;
                document.getElementById('testPandas').disabled = false;
                
            } catch (error) {
                setStatus('Error loading Pyodide', 'error');
                log('Error: ' + error.message);
                console.error(error);
            }
        }
        
        // Test basic Python
        async function testBasic() {
            try {
                log('\n--- Testing Basic Python ---');
                
                const result = pyodide.runPython(`
# Basic Python test
import sys
import platform

result = []
result.append(f"Python {sys.version}")
result.append(f"Platform: {platform.platform()}")
result.append(f"2 + 2 = {2 + 2}")

# List comprehension
squares = [x**2 for x in range(10)]
result.append(f"Squares: {squares}")

"\\n".join(result)
                `);
                
                log(result);
                
            } catch (error) {
                log('Error: ' + error.message);
                console.error(error);
            }
        }
        
        // Test NumPy
        async function testNumpy() {
            try {
                log('\n--- Testing NumPy ---');
                log('Loading numpy package...');
                
                await pyodide.loadPackage('numpy');
                
                const result = pyodide.runPython(`
import numpy as np

result = []
result.append(f"NumPy version: {np.__version__}")

# Create array
arr = np.array([1, 2, 3, 4, 5])
result.append(f"Array: {arr}")
result.append(f"Mean: {arr.mean()}")
result.append(f"Sum: {arr.sum()}")

# Matrix operations
matrix = np.array([[1, 2], [3, 4]])
result.append(f"Matrix:\\n{matrix}")
result.append(f"Determinant: {np.linalg.det(matrix)}")

"\\n".join(result)
                `);
                
                log(result);
                
            } catch (error) {
                log('Error: ' + error.message);
                console.error(error);
            }
        }
        
        // Test Pandas
        async function testPandas() {
            try {
                log('\n--- Testing Pandas ---');
                log('Loading pandas package (this may take a moment)...');
                
                await pyodide.loadPackage('pandas');
                
                const result = pyodide.runPython(`
import pandas as pd
import io

result = []
result.append(f"Pandas version: {pd.__version__}")

# Create DataFrame
df = pd.DataFrame({
    'Name': ['Alice', 'Bob', 'Charlie'],
    'Age': [25, 30, 35],
    'City': ['New York', 'London', 'Paris']
})

buffer = io.StringIO()
df.info(buf=buffer)

result.append("\\nDataFrame:")
result.append(df.to_string())
result.append(f"\\nMean age: {df['Age'].mean()}")

"\\n".join(result)
                `);
                
                log(result);
                
            } catch (error) {
                log('Error: ' + error.message);
                console.error(error);
            }
        }
        
        // Event listeners
        document.getElementById('testBasic').addEventListener('click', testBasic);
        document.getElementById('testNumpy').addEventListener('click', testNumpy);
        document.getElementById('testPandas').addEventListener('click', testPandas);
        document.getElementById('clearOutput').addEventListener('click', () => {
            output.textContent = '';
        });
        
        // Initialize on load
        initPyodide();