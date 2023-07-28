import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Boletas from './Boletas';
import defaultImage from '../images/regalo-01.png';

const Card = ({ talonario, isSelected, setSelectedTarjetaId, handleEliminarTarjeta }) => {
  const navigate = useNavigate();
  const [eliminarModalVisible, setEliminarModalVisible] = useState(false); // Estado del modal de eliminación

  const handleCardClick = () => {
    setSelectedTarjetaId(talonario.id);
  };

  const handleEliminarClick = () => {
    setEliminarModalVisible(true);
  };

  const handleEliminarConfirm = () => {
    handleEliminarTarjeta(talonario.id);
    setEliminarModalVisible(false);
  };

  const handleEliminarCancel = () => {
    setEliminarModalVisible(false);
  };

  // Verificar si talonario existe y tiene la propiedad imageUrl
  if (!talonario || !talonario.imageUrl) {
    return null; // Otra acción apropiada, dependiendo del caso
  }

  return (
    <div
      className={`max-w-sm mx-auto bg-white rounded-lg shadow-md overflow-hidden ${
        isSelected ? 'border-2 border-blue-500' : ''
      } transform transition duration-300 hover:scale-105 hover:shadow-xl`}
      onClick={handleCardClick}
    >
      <img
        src={talonario.imageUrl || defaultImage}
        alt="Imagen del Talonario"
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">{talonario.descripcion}</h2>
        <p className="text-gray-600 mb-2">Rifade: {talonario.rifade}</p>
        <p className="text-gray-600 mb-2">
          Fecha del Sorteo: {talonario.fechaSorteo}
        </p>
        <p className="text-gray-600 mb-2">Vendedor: {talonario.vendedor}</p>
        <p className="text-gray-600 mb-4">
          Valor Boleta: {talonario.valorBoleta}
        </p>
        <Boletas talonario={talonario} />
        <button
          className="bg-red-500 text-white rounded-md py-2 px-4 w-full"
          onClick={handleEliminarClick}
        >
          Eliminar
        </button>
      </div>
      {eliminarModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="bg-white p-8 rounded-md">
            <h2 className="text-2xl font-bold mb-4">Eliminar Talonario</h2>
            <p>¿Estás seguro de que deseas eliminar este talonario?</p>
            <div className="flex justify-end mt-6">
              <button
                className="bg-red-500 text-white rounded-md py-2 px-4 mr-2 hover:bg-red-600 transition-colors"
                type="button"
                onClick={handleEliminarConfirm}
              >
                Eliminar
              </button>
              <button
                className="bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-600 transition-colors"
                type="button"
                onClick={handleEliminarCancel}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;
