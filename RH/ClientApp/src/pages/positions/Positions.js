import React, { useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { risk } from "../../enums/risk";
import { ConvertToMoney } from "../../utils/convertToMoney";
import { Button } from "reactstrap";
import { PositionModal } from "./PositionModal";
import { get, send } from "../../utils/apiService";
import { Alert } from "../../components/layout/alert";

export const Positions = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [positions, setPositions] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(undefined);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      setPositions(await get("api/positions"));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleModal = async () => {
    if (isModalOpen) {
      await fetchData();

      if (currentPosition) {
        setCurrentPosition(undefined);
      }
    }

    setIsModalOpen((isModalOpen) => !isModalOpen);
  };

  const handleEdit = (id) => {
    setCurrentPosition(id);

    handleModal();
  };

  const handleDelete = (id) => {
    setCurrentPosition(id);
    setIsAlertOpen(true);
  };

  const handleConfirm = async () => {
    await send(`api/positions/${currentPosition}`, null, "DELETE");
    await fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexGrow: 1, height: "100%" }}>
        <p>
          <em>Loading...</em>
        </p>
      </div>
    );
  }

  return (
    <div>
      <Button type="button" className="btn btn-success float-end" onClick={handleModal}>
        <FontAwesomeIcon icon={faPlus} /> Agregar Posición
      </Button>
      <PositionModal isOpen={isModalOpen} toggle={handleModal} id={currentPosition} />
      <table className="table table-striped" aria-labelledby="tableLabel">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Riesgo</th>
            <th>Salario Minimo</th>
            <th>Salario Maximo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {positions.length ? (
            positions.map((position) => (
              <tr key={position.id}>
                <td>{position.name}</td>
                <td>{risk[position.risk]}</td>
                <td>{ConvertToMoney(position.minimumSalary)}</td>
                <td>{ConvertToMoney(position.maximumSalary)}</td>
                <td>
                  <div style={{ display: "flex", gap: 10 }}>
                    <FontAwesomeIcon
                      className="formAction"
                      icon={faPencil}
                      color="var(--bs-blue)"
                      title="Editar"
                      onClick={() => handleEdit(position.id)}
                    />
                    <FontAwesomeIcon
                      className="formAction"
                      icon={faTrashCan}
                      color="var(--bs-red)"
                      title="Eliminar"
                      onClick={() => handleDelete(position.id)}
                    />
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} style={{ textAlign: "center" }}>
                No data
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <Alert
        isOpen={isAlertOpen}
        title={"Eliminar Posición"}
        content={"¿Estas seguro que deseas eliminar esta posición?"}
        onConfirm={handleConfirm}
        toggle={() => setIsAlertOpen((isOpen) => !isOpen)}
      />
    </div>
  );
};
