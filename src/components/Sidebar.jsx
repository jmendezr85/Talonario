import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteDocument } from '../service/Firebase';
import Card from './Card';

const Sidebar = ({ listaTalonarios, setListaTalonarios }) => {
  const navigate = useNavigate();
  const [selectedTarjetaId, setSelectedTarjetaId] = useState(null);

  const handleCrearTalonarioClick = () => {
    navigate('/CrearTalonario');
  };

  const handleEliminarTarjeta = (talonarioId) => {
    deleteDocument('talonarios', talonarioId)
      .then(() => {
        setSelectedTarjetaId(null);
        const updatedListaTalonarios = listaTalonarios.filter(
          (talonario) => talonario.id !== talonarioId
        );
        setListaTalonarios(updatedListaTalonarios);
      })
      .catch((error) => {
        console.log('Error al eliminar tarjeta:', error);
      });
  };

  const handleTarjetaClick = (id) => {
    setSelectedTarjetaId(id);
  };

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="bg-gray-200 text-gray-700 w-full lg:w-1/4 p-4">
        <div className="mb-4">
          <button
            className="bg-blue-500 text-white rounded-md py-2 px-4 w-full mb-2"
            onClick={handleCrearTalonarioClick}
          >
            Crear Talonario
          </button>
        </div>
      </div>
      <div className="bg-white text-gray-700 flex-grow p-4">
        <div className="bg-gray-200 text-gray-700 p-4 mb-4">
          <h1 className="text-xl font-bold">Talonarios de Rifas</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {listaTalonarios.map((talonario) => (
            <Card
              key={talonario.id}
              talonario={talonario}
              isSelected={talonario.id === selectedTarjetaId}
              setSelectedTarjetaId={handleTarjetaClick}
              handleEliminarTarjeta={handleEliminarTarjeta} // Pasa la función handleEliminarTarjeta
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
