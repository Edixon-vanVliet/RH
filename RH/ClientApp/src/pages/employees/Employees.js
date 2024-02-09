import React, { useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { EmployeeModal } from "./EmployeeModal";
import { get, send } from "../../utils/apiService";
import { Alert } from "../../components/layout/alert";

export const Employees = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [currentEmployee, setCurrentEmployee] = useState(undefined);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      setEmployees(await get("api/employees"));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleModal = async () => {
    if (isModalOpen) {
      await fetchData();

      if (currentEmployee) {
        setCurrentEmployee(undefined);
      }
    }

    setIsModalOpen((isModalOpen) => !isModalOpen);
  };

  const handleEdit = (id) => {
    setCurrentEmployee(id);

    handleModal();
  };

  const handleDelete = (id) => {
    setCurrentEmployee(id);
    setIsAlertOpen(true);
  };

  const handleConfirm = async () => {
    await send(`api/employees/${currentEmployee}`, null, "DELETE");
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
      <EmployeeModal isOpen={isModalOpen} toggle={handleModal} id={currentEmployee} />
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
          {employees.length ? (
            employees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.name}</td>
                <td>{employee.position.name}</td>
                <td>{employee.department.name}</td>
                <td>
                  <div style={{ display: "flex", gap: 10 }}>
                    <FontAwesomeIcon
                      className="formAction"
                      icon={faPencil}
                      color="var(--bs-blue)"
                      title="Editar"
                      onClick={() => handleEdit(employee.id)}
                    />
                    <FontAwesomeIcon
                      className="formAction"
                      icon={faTrashCan}
                      color="var(--bs-red)"
                      title="Eliminar"
                      onClick={() => handleDelete(employee.id)}
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
        isOpen={isAlertOpen}
        title={"Eliminar Empleado"}
        content={"¿Estas seguro que deseas eliminar este empleado?"}
        onConfirm={handleConfirm}
        toggle={() => setIsAlertOpen((isOpen) => !isOpen)}
      />
    </div>
  );
};
