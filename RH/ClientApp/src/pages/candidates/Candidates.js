import React, { useCallback, useEffect, useState } from "react";
import { Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPencil, faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { CandidateModal } from "./CandidateModal";
import { get, send } from "../../utils/apiService";
import { Alert } from "../../components/layout/alert";

export const Candidates = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [isHireAlertOpen, setIsHireAlertOpen] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [currentCandidate, setCurrentCandidate] = useState(undefined);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      setCandidates(await get("api/candidates"));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleModal = async () => {
    if (isModalOpen) {
      await fetchData();

      if (currentCandidate) {
        setCurrentCandidate(undefined);
      }
    }

    setIsModalOpen((isModalOpen) => !isModalOpen);
  };

  const handleEdit = (id) => {
    setCurrentCandidate(id);

    handleModal();
  };

  const handleDelete = (id) => {
    setCurrentCandidate(id);
    setIsDeleteAlertOpen(true);
  };

  const handleDeleteConfirm = async () => {
    await send(`api/candidates/${currentCandidate}`, null, "DELETE");
    await fetchData();
  };

  const handleHire = (id) => {
    setCurrentCandidate(id);
    setIsHireAlertOpen(true);
  };

  const handleHireConfirm = async () => {
    await send(`api/candidates/${currentCandidate}`, null, "POST");
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
        <FontAwesomeIcon icon={faPlus} /> Agregar Candidato
      </Button>
      <CandidateModal isOpen={isModalOpen} toggle={handleModal} id={currentCandidate} />
      <table className="table table-striped" aria-labelledby="tableLabel">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Posición</th>
            <th>Departamento</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {candidates.length ? (
            candidates.map((candidate) => (
              <tr key={candidate.id}>
                <td>{candidate.name}</td>
                <td>{candidate.position.name}</td>
                <td>{candidate.department.name}</td>
                <td>
                  <div style={{ display: "flex", gap: 10 }}>
                    <FontAwesomeIcon
                      className="formAction"
                      icon={faCheck}
                      color="var(--bs-green)"
                      title="Contratar"
                      onClick={() => handleHire(candidate.id)}
                    />
                    <FontAwesomeIcon
                      className="formAction"
                      icon={faPencil}
                      color="var(--bs-blue)"
                      title="Editar"
                      onClick={() => handleEdit(candidate.id)}
                    />
                    <FontAwesomeIcon
                      className="formAction"
                      icon={faTrashCan}
                      color="var(--bs-red)"
                      title="Eliminar"
                      onClick={() => handleDelete(candidate.id)}
                    />
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} style={{ textAlign: "center" }}>
                No data
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <Alert
        isOpen={isDeleteAlertOpen}
        title={"Eliminar Candidato"}
        content={"¿Estas seguro que deseas eliminar este candidato?"}
        onConfirm={handleDeleteConfirm}
        toggle={() => setIsDeleteAlertOpen((isOpen) => !isOpen)}
      />
      <Alert
        isOpen={isHireAlertOpen}
        title={"Contratar Candidato"}
        content={"¿Estas seguro que deseas contratar este candidato?"}
        onConfirm={handleHireConfirm}
        toggle={() => setIsHireAlertOpen((isOpen) => !isOpen)}
      />
    </div>
  );
};
