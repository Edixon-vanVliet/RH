import React, { useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { Button } from "reactstrap";
import { DepartmentModal } from "./DepartmentModal";
import { get, send } from "../../utils/apiService";
import { Alert } from "../../components/layout/alert";

export const Departments = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [currentDepartment, setCurrentDepartment] = useState(undefined);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      setDepartments(await get("api/departments"));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleModal = async () => {
    if (isModalOpen) {
      await fetchData();

      if (currentDepartment) {
        setCurrentDepartment(undefined);
      }
    }

    setIsModalOpen((isModalOpen) => !isModalOpen);
  };

  const handleEdit = (id) => {
    setCurrentDepartment(id);

    handleModal();
  };

  const handleDelete = (id) => {
    setCurrentDepartment(id);
    setIsAlertOpen(true);
  };

  const handleConfirm = async () => {
    await send(`api/departments/${currentDepartment}`, null, "DELETE");
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
        <FontAwesomeIcon icon={faPlus} /> Agregar Departamento
      </Button>
      <DepartmentModal isOpen={isModalOpen} toggle={handleModal} id={currentDepartment} />
      <table className="table table-striped" aria-labelledby="tableLabel">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {departments.length ? (
            departments.map((department) => (
              <tr key={department.id}>
                <td>{department.name}</td>
                <td>
                  <div style={{ display: "flex", gap: 10 }}>
                    <FontAwesomeIcon
                      className="formAction"
                      icon={faPencil}
                      color="var(--bs-blue)"
                      title="Editar"
                      onClick={() => handleEdit(department.id)}
                    />
                    <FontAwesomeIcon
                      className="formAction"
                      icon={faTrashCan}
                      color="var(--bs-red)"
                      title="Eliminar"
                      onClick={() => handleDelete(department.id)}
                    />
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={2} style={{ textAlign: "center" }}>
                No data
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <Alert
        isOpen={isAlertOpen}
        title={"Eliminar Departamento"}
        content={"¿Estas seguro que deseas eliminar este departamento?"}
        onConfirm={handleConfirm}
        toggle={() => setIsAlertOpen((isOpen) => !isOpen)}
      />
    </div>
  );
};
