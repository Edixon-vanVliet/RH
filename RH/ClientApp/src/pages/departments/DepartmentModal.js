import React, { useEffect, useState } from "react";
import { Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { get, send } from "../../utils/apiService";

export const DepartmentModal = ({ isOpen, toggle, id }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [department, setDepartment] = useState({ id: 0, name: "" });

  const clean = () => {
    setDepartment({ id: 0, name: "" });
  };

  const handleChange = ({ target: { name, value } }) => {
    setDepartment((department) => ({ ...department, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);

      if (id) {
        await send(`api/departments/${id}`, department, "PUT");
      } else {
        await send("api/departments", department, "POST");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      clean();
      toggle();
    }
  };

  const handleCancel = () => {
    clean();
    toggle();
  };

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          setDepartment(await get(`api/departments/${id}`));
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [id]);

  return (
    <Modal isOpen={isOpen}>
      <ModalHeader>{id ? "Editar" : "Agregar"} Departamento</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="name">Nombre</Label>
            <Input
              id="name"
              name="name"
              placeholder="Nombre"
              type="text"
              value={department.name}
              onChange={handleChange}
            />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button type="button" className="btn btn-secondary" onClick={handleCancel}>
          Cancelar
        </Button>
        <Button type="button" className="btn btn-primary" onClick={handleSave} disabled={isLoading}>
          Confirmar
        </Button>
      </ModalFooter>
    </Modal>
  );
};
