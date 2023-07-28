import React, { useState, useEffect } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../service/Firebase';
import { useNavigate } from 'react-router-dom';

import defaultImage from '../images/regalo-01.png';

const CrearTalonario = ({ agregarTalonario }) => {
  const [imagen, setImagen] = useState(null);
  const [rifade, setRifade] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaSorteo, setFechaSorteo] = useState('');
  const [vendedor, setVendedor] = useState('');
  const [valorBoleta, setValorBoleta] = useState('');
  const [numBoletas, setNumBoletas] = useState('');
  const [registroExitoso, setRegistroExitoso] = useState(false);
  const navigate = useNavigate();

  const handleImagenChange = (e) => {
    if (e.target.files[0]) {
      setImagen(e.target.files[0]);
    }
  };

  const handleCrearTalonario = async () => {
    try {
      let imageUrl = imagen ? '' : defaultImage; // Asigna la imagen por defecto si no se selecciona una imagen

      if (imagen) {
        const storageRef = ref(storage, `imagenes/${imagen.name}`);
        await uploadBytes(storageRef, imagen);
        imageUrl = await getDownloadURL(storageRef);
      }

      const talonarioData = {
        imageUrl,
        rifade,
        descripcion,
        fechaSorteo,
        vendedor,
        valorBoleta,
        numBoletas,
      };
      const docRef = await addDoc(collection(db, 'talonarios'), talonarioData);

      agregarTalonario({ ...talonarioData, id: docRef.id });

      setRegistroExitoso(true);
    } catch (error) {
      console.error('Error al crear el talonario:', error);
    }
  };

  useEffect(() => {
    if (registroExitoso) {
      const timer = setTimeout(() => {
        navigate('/');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [registroExitoso, navigate]);

  const closeModal = () => {
    setRegistroExitoso(false);
    setImagen(null);
    setRifade('');
    setDescripcion('');
    setFechaSorteo('');
    setVendedor('');
    setValorBoleta('');
    setNumBoletas('');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Crear Talonario</h1>
      <form className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <label className="block font-bold mb-2" htmlFor="imagen">
            Imagen:
          </label>
          <input
            type="file"
            id="imagen"
            onChange={handleImagenChange}
            accept="image/*"
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block font-bold mb-2" htmlFor="rifade">
            Rifade:
          </label>
          <input
            type="text"
            id="rifade"
            value={rifade}
            onChange={(e) => setRifade(e.target.value)}
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block font-bold mb-2" htmlFor="descripcion">
            Descripción:
          </label>
          <input
            type="text"
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block font-bold mb-2" htmlFor="fechaSorteo">
            Fecha de Sorteo:
          </label>
          <input
            type="date"
            id="fechaSorteo"
            value={fechaSorteo}
            onChange={(e) => setFechaSorteo(e.target.value)}
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block font-bold mb-2" htmlFor="vendedor">
            Vendedor:
          </label>
          <input
            type="text"
            id="vendedor"
            value={vendedor}
            onChange={(e) => setVendedor(e.target.value)}
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block font-bold mb-2" htmlFor="valorBoleta">
            Valor de la Boleta:
          </label>
          <div className="flex items-center border border-gray-300 rounded-md focus-within:ring-blue-500 focus-within:border-blue-500">
            <span className="text-gray-500 px-3">$</span>
            <input
              type="number"
              id="valorBoleta"
              value={valorBoleta}
              onChange={(e) => setValorBoleta(e.target.value)}
              className="w-full py-2 px-1 border-none outline-none focus:ring-0"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block font-bold mb-2" htmlFor="numBoletas">
            Juega con la lotería:
          </label>
          <input
            type="text"
            id="numBoletas"
            value={numBoletas}
            onChange={(e) => setNumBoletas(e.target.value)}
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          className="bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-600 transition-colors w-full"
          type="button"
          onClick={handleCrearTalonario}
        >
          Crear Talonario
        </button>
      </form>
      {registroExitoso && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="bg-white p-8 rounded-md">
            <h2 className="text-2xl font-bold mb-4">Talonario creado exitosamente</h2>
            <p>El talonario ha sido creado correctamente.</p>
            <button
              className="bg-blue-500 text-white rounded-md py-2 px-4 mt-4 hover:bg-blue-600 transition-colors w-full"
              type="button"
              onClick={closeModal}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrearTalonario;
