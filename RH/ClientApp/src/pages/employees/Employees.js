import React, { useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrashCan, faTable } from "@fortawesome/free-solid-svg-icons";
import { EmployeeModal } from "./EmployeeModal";
import { get, getBlob, send } from "../../utils/apiService";
import { Alert } from "../../components/layout/alert";
import authService from "../../components/api-authorization/AuthorizeService";
import { Button } from "reactstrap";

export const Employees = () => {
  const [user, setUser] = useState(undefined);
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

  const handleDownload = async () => {
    try {
      const data = await getBlob("api/employees/report");

      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `empleados_${new Date().toISOString().substring(0, 10)}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch {
      console.log("error downloading report");
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const populateState = async () => {
      const user = await authService.getUser();

      setUser(user);
    };

    var subscription = authService.subscribe(() => populateState());
    populateState();

    return () => {
      authService.unsubscribe(subscription);
    };
  }, []);

  if (isLoading || !user) {
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
      <Button type="button" className="btn btn-success float-end" onClick={handleDownload}>
        <FontAwesomeIcon icon={faTable} /> Descargar reporte
      </Button>
      <EmployeeModal isOpen={isModalOpen} toggle={handleModal} id={currentEmployee} userRole={user.role} />
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
            employees
              .filter((employee) => user.role === "RH" || employee.id === Number(user.employeeId))
              .map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.name}</td>
                  <td>{employee.position.name}</td>
                  <td>{employee.department.name}</td>
                  <td>
                    {((user.role === "RH" && employee.id !== Number(user.employeeId)) ||
                      (user.role !== "RH" && employee.id === Number(user.employeeId))) && (
                      <div style={{ display: "flex", gap: 10 }}>
                        {
                          <FontAwesomeIcon
                            className="formAction"
                            icon={faPencil}
                            color="var(--bs-blue)"
                            title="Editar"
                            onClick={() => handleEdit(employee.id)}
                          />
                        }
                        {user.role === "RH" && (
                          <FontAwesomeIcon
                            className="formAction"
                            icon={faTrashCan}
                            color="var(--bs-red)"
                            title="Eliminar"
                            onClick={() => handleDelete(employee.id)}
                          />
                        )}
                      </div>
                    )}
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
