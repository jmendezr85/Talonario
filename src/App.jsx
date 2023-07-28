import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import CrearTalonario from './components/CrearTalonario';
import Sidebar from './components/Sidebar';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './service/Firebase';
import Boletas from './components/Boletas';
 
const App = () => {
  const [listaTalonarios, setListaTalonarios] = useState([]);

  const agregarTalonario = (talonarioData) => {
    setListaTalonarios((prevLista) => [...prevLista, talonarioData]);
  };

  const setCantidadBoletas = (cantidad) => {
    // Lógica para establecer la cantidad de boletas
    console.log('Cantidad de boletas:', cantidad);
    // Aquí puedes realizar las acciones necesarias con la cantidad de boletas,
    // como enviarla a un servidor, almacenarla en el estado, etc.
  };

  useEffect(() => {
    const obtenerTalonarios = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'talonarios'));
        const talonarios = [];
        querySnapshot.forEach((doc) => {
          talonarios.push({ id: doc.id, ...doc.data() });
        });
        setListaTalonarios(talonarios);
      } catch (error) {
        console.error('Error al obtener los talonarios:', error);
      }
    };

    obtenerTalonarios();
  }, []);

  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <Sidebar
                listaTalonarios={listaTalonarios}
                setListaTalonarios={setListaTalonarios}
                setCantidadBoletas={setCantidadBoletas} // Agregada la prop setCantidadBoletas
              />
            }
          />
          <Route
            path="/CrearTalonario"
            element={<CrearTalonario agregarTalonario={agregarTalonario} />}
          />
          <Route path="/Boletas" element={<Boletas setCantidadBoletas={setCantidadBoletas}  />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
