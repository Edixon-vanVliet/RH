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

export const ExperienceModal = ({ isOpen, toggle, currentExperience, onChange }) => {
  const [errors, setErrors] = useState({
    company: "Compañia no puede estar vacio",
    position: "Posicion no puede estar vacio",
    from: "Fecha de inicio no puede estar vacio",
    until: "Fecha final no puede estar vacio",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [experience, setExperience] = useState({
    id: 0,
    company: "",
    position: "",
    from: "",
    until: "",
    salary: 0,
  });

  const clean = () => {
    setExperience({
      id: 0,
      company: "",
      position: "",
      from: "",
      until: "",
      salary: 0,
    });

    setErrors({
      company: "Compañia no puede estar vacio",
      position: "Posicion no puede estar vacio",
    });
  };

  const handleChange = ({ target: { name, value } }) => {
    let prevErrors = errors;
    delete prevErrors[name];
    setErrors(prevErrors);

    if (name === "company" && value === "") {
      setErrors((errors) => ({ ...errors, [name]: "Compañia no puede estar vacio" }));
    }

    if (name === "position" && value === "") {
      setErrors((errors) => ({ ...errors, [name]: "Posicion no puede estar vacio" }));
    }

    if (name === "from" && new Date(value) > new Date(experience.until)) {
      setErrors((errors) => ({ ...errors, [name]: "Fecha de inicio no puede ser mayor a la fecha final" }));
    }

    if (name === "from" && new Date(value) > new Date()) {
      setErrors((errors) => ({ ...errors, [name]: "Fecha de inicio no puede ser mayor a la de hoy" }));
    }

    if (name === "until" && new Date(value) < new Date(experience.from)) {
      setErrors((errors) => ({ ...errors, [name]: "Fecha final no puede ser menor a la fecha de inicio" }));
    }

    setExperience((experience) => ({ ...experience, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);

      onChange(experience);
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
    if (currentExperience) {
      setErrors({});
      setExperience(currentExperience);
    }
  }, [currentExperience]);

  return (
    <Modal isOpen={isOpen}>
      <ModalHeader>{currentExperience ? "Editar" : "Agregar"} Experiencia</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="name">Compañía</Label>
            <Input
              id="company"
              name="company"
              placeholder="Compañía"
              type="text"
              value={experience.company}
              onChange={handleChange}
              invalid={Object.keys(errors).includes("company")}
            />
            <FormFeedback>{errors["company"]}</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label for="position">Posición</Label>
            <Input
              id="position"
              name="position"
              placeholder="Posición"
              type="text"
              value={experience.position}
              onChange={handleChange}
              invalid={Object.keys(errors).includes("position")}
            />
            <FormFeedback>{errors["position"]}</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label for="from">Desde</Label>
            <Input
              id="from"
              name="from"
              placeholder="Desde"
              type="date"
              value={experience.from}
              onChange={handleChange}
              invalid={Object.keys(errors).includes("from")}
            />
            <FormFeedback>{errors["from"]}</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label for="until">Hasta</Label>
            <Input
              id="until"
              name="until"
              placeholder="Hasta"
              type="date"
              value={experience.until}
              onChange={handleChange}
              invalid={Object.keys(errors).includes("until")}
            />
            <FormFeedback>{errors["until"]}</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label for="salary">Salario</Label>
            <Input
              id="salary"
              name="salary"
              placeholder="Salario"
              type="number"
              value={experience.salary}
              onChange={handleChange}
            />
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
