import React, { useEffect, useState } from "react";
import { Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

export const ExperienceModal = ({ isOpen, toggle, currentExperience, onChange }) => {
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
  };

  const handleChange = ({ target: { name, value } }) => {
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
            />
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
            />
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
            />
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
            />
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
        <Button type="button" className="btn btn-primary" onClick={handleSave} disabled={isLoading}>
          Confirmar
        </Button>
      </ModalFooter>
    </Modal>
  );
};
