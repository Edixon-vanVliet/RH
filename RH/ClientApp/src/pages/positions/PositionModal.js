import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import { get, send } from "../../utils/apiService";

export const PositionModal = ({ isOpen, toggle, id }) => {
  const [errors, setErrors] = useState({
    name: "Nombre no puede estar vacio",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState({
    id: 0,
    name: "",
    risk: 3,
    minimumSalary: 0,
    maximumSalary: 0,
  });

  const clean = () => {
    setPosition({
      id: 0,
      name: "",
      risk: 3,
      minimumSalary: 0,
      maximumSalary: 0,
    });

    setErrors({
      name: "Nombre no puede estar vacio",
    });
  };

  const handleChange = ({ target: { name, value } }) => {
    let prevErrors = errors;
    delete prevErrors[name];
    setErrors(prevErrors);

    if (name === "name" && value === "") {
      setErrors((errors) => ({ ...errors, [name]: "Nombre no puede estar vacio" }));
    }

    if (name === "minimumSalary" && Number(value) > Number(position.maximumSalary)) {
      setErrors((errors) => ({ ...errors, [name]: "Salario minimo no puede ser mayor al salario maximo" }));
    }

    if (name === "maximumSalary" && Number(position.minimumSalary) > Number(value)) {
      setErrors((errors) => ({ ...errors, [name]: "Salario maximo no puede ser menor al salario minimo" }));
    }
    setPosition((position) => ({ ...position, [name]: name === "risk" ? Number(value) : value }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);

      if (id) {
        await send(`api/positions/${id}`, position, "PUT");
      } else {
        await send("api/positions", position, "POST");
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
          setPosition(await get(`api/positions/${id}`));
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
      <ModalHeader>{id ? "Editar" : "Agregar"} Posición</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="name">Nombre</Label>
            <Input
              id="name"
              name="name"
              placeholder="Nombre"
              type="text"
              value={position.name}
              onChange={handleChange}
              invalid={Object.keys(errors).includes("name")}
            />
            <FormFeedback>{errors["name"]}</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label for="risk">Riesgo</Label>
            <Input id="risk" name="risk" type="select" value={position.risk} onChange={handleChange}>
              <option value={1}>Alto</option>
              <option value={2}>Medio</option>
              <option value={3}>Bajo</option>
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="minimumSalary">Salario Minimo</Label>
            <Input
              id="minimumSalary"
              name="minimumSalary"
              placeholder="Salario Minimo"
              type="number"
              value={position.minimumSalary}
              onChange={handleChange}
              invalid={Object.keys(errors).includes("minimumSalary")}
            />
            <FormFeedback>{errors["minimumSalary"]}</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label for="maximumSalary">Salario Maximo</Label>
            <Input
              id="maximumSalary"
              name="maximumSalary"
              placeholder="Salario Maximo"
              type="number"
              value={position.maximumSalary}
              onChange={handleChange}
              invalid={Object.keys(errors).includes("maximumSalary")}
            />
            <FormFeedback>{errors["maximumSalary"]}</FormFeedback>
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button type="button" className="btn btn-secondary" onClick={handleCancel}>
          Cancelar
        </Button>
        <Button
          type="button"
          className="btn btn-primary"
          onClick={handleSave}
          disabled={isLoading || Object.keys(errors).length}
        >
          Confirmar
        </Button>
      </ModalFooter>
    </Modal>
  );
};
