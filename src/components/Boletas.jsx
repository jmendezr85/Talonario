import React, { useState, useEffect } from "react";
import { collection, addDoc, doc, setDoc, getDocs } from "firebase/firestore";
import { db } from "../service/Firebase";

const Boletas = ({ talonario }) => {
  const [tickets, setTickets] = useState([]);
  const [ticketNumber, setTicketNumber] = useState("");
  const [ticketType, setTicketType] = useState("");
  const [ticketName, setTicketName] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedTicketName, setSelectedTicketName] = useState("");
  const [filter, setFilter] = useState("all");
  const [showAllTickets, setShowAllTickets] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const obtenerTickets = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, `tickets-${talonario.id}`));
        const ticketsData = [];
        querySnapshot.forEach((doc) => {
          ticketsData.push({ id: doc.id, ...doc.data() });
        });
        const sortedTickets = ticketsData.sort((a, b) => a.number.localeCompare(b.number, 'en', { numeric: true }));
        setTickets(sortedTickets);
      } catch (error) {
        console.error("Error al obtener los tickets:", error);
      }
    };

    obtenerTickets();
  }, [talonario.id]);

  const handleCreateTickets = async (start, end) => {
    const batch = [];
    for (let i = start; i <= end; i++) {
      const ticket = {
        number: i.toString().padStart(2, "0"),
        name: "",
        type: "",
      };
      batch.push(ticket);
    }

    try {
      const batchRefs = await Promise.all(
        batch.map((ticket) => addDoc(collection(db, `tickets-${talonario.id}`), ticket))
      );
      console.log(`Se han creado ${batch.length} boletas correctamente.`);
      const newTickets = batch.map((ticket, index) => ({
        id: batchRefs[index].id,
        ...ticket,
      }));
      const sortedTickets = [...tickets, ...newTickets].sort((a, b) =>
        a.number.localeCompare(b.number)
      );
      setTickets(sortedTickets);
      setShowAllTickets(true);
    } catch (error) {
      console.error("Error al crear las boletas:", error);
    }
  };

  const handleToggleTickets = () => {
    setShowAllTickets((prevShowAllTickets) => !prevShowAllTickets);
  };

  const handleOpenModal = (ticketNumber) => {
    const ticket = tickets.find((ticket) => ticket.number === ticketNumber);
    if (ticket) {
      setSelectedTicket(ticket);
      setSelectedTicketName(ticket.name);
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSaveTicket = async () => {
    if (!selectedTicket) return;

    const updatedTicket = {
      ...selectedTicket,
      name: selectedTicketName,
      type: ticketType,
    };

    try {
      await setDoc(doc(db, `tickets-${talonario.id}`, selectedTicket.id), updatedTicket);
      const updatedTickets = tickets.map((ticket) =>
        ticket.number === selectedTicket.number ? updatedTicket : ticket
      );
      const sortedTickets = updatedTickets.sort((a, b) => a.number.localeCompare(b.number));
      setTickets(sortedTickets);
      handleCloseModal();
    } catch (error) {
      console.error("Error al guardar el ticket:", error);
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    if (filter === "all") return true;
    if (filter === "paid") return ticket.type === "paid";
    if (filter === "reserved") return ticket.type === "reserved";
    if (filter === "free") return ticket.type === "";
    return false;
  });

  const gridColumnsDesktop = 5;
  const gridColumnsMobile = 5;

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Boletas</h2>
        <div className="flex flex-wrap gap-2">
          {tickets.length === 0 && (
            <>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => handleCreateTickets(0, 99)}
              >
                Crear boletas 01-99
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => handleCreateTickets(0, 999)}
              >
                Crear boletas 001-999
              </button>
            </>
          )}
          {tickets.length > 0 && (
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded"
              onClick={handleToggleTickets}
            >
              {showAllTickets ? "Ocultar boletas" : "Mostrar boletas"}
            </button>
          )}
        </div>
      </div>
      {showAllTickets && (
        <>
          <div className="mb-4">
            <label className="block mb-2 font-bold">Filtrar:</label>
            <select
              className="border rounded px-4 py-2 w-full"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">Todas</option>
              <option value="paid">Pagas</option>
              <option value="reserved">Reservadas</option>
              <option value="free">Libres</option>
            </select>
          </div>
          <div className={`grid grid-cols-8 md:grid-cols-8 gap-2`}>
            {filteredTickets.map((ticket) => (
              <button
                key={ticket.number}
                className={`border rounded px-4 py-2 ${
                  ticket.type === "paid"
                    ? "bg-blue-500 text-white"
                    : ticket.type === "reserved"
                    ? "bg-orange-500 text-white"
                    : ""
                }`}
                onClick={() => handleOpenModal(ticket.number)}
                style={{ position: "relative" }}
              >
                <span
                  className="ticket-number"
                  style={{
                    position: "relative",
                    top: "-12px",
                    left: "-15px",
                    background: "",
                    color: "black",
                    padding: "1px",
                    fontSize: "14px",
                  }}
                >
                  {ticket.number}
                </span>
              </button>
            ))}
          </div>
        </>
      )}
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded p-4">
            <div className="mb-4">
              <h2 className="text-lg font-bold">
                Boleta número: <strong>{selectedTicket && selectedTicket.number}</strong>
              </h2>
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-bold">Nombre:</label>
              <input
                type="text"
                className="border rounded w-full px-4 py-2"
                value={selectedTicketName}
                onChange={(e) => setSelectedTicketName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-bold">Tipo:</label>
              <select
                className="border rounded w-full px-4 py-2"
                value={ticketType}
                onChange={(e) => setTicketType(e.target.value)}
              >
                <option value="">Seleccionar</option>
                <option value="paid">Pagado</option>
                <option value="reserved">Reservado</option>
              </select>
            </div>
            <div className="flex justify-end">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleSaveTicket}
              >
                Guardar
              </button>
              <button
                className="bg-red-500 text-white ml-4 px-4 py-2 rounded mr-2"
                onClick={handleCloseModal}
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

export default Boletas;
