import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Asegúrate de importar Bootstrap
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="text-center my-4">Bienvenido a SAMG</h1>
      </header>
      <div className="container">
        <div className="row">
          <div className="col-md-6 text-center">
            <h2>Columna 1</h2>
            <p>Este es un ejemplo de contenido en la columna 1.</p>
            <button className="btn btn-primary">Botón en Columna 1</button>
          </div>
          <div className="col-md-6 text-center">
            <h2>Columna 2</h2>
            <p>Este es un ejemplo de contenido en la columna 2.</p>
            <button className="btn btn-secondary">Botón en Columna 2</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
