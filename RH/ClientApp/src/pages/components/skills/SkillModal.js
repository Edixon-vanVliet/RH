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

export const SkillModal = ({ isOpen, toggle, currentSkill, onChange }) => {
  const [errors, setErrors] = useState({
    name: "Nombre no puede estar vacio",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [skill, setSkill] = useState({ id: 0, name: "", description: "" });

  const clean = () => {
    setSkill({ id: 0, name: "", description: "" });
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

    setSkill((skill) => ({ ...skill, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);

      onChange(skill);
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
    if (currentSkill) {
      setSkill(currentSkill);
    }
  }, [currentSkill]);

  return (
    <Modal isOpen={isOpen}>
      <ModalHeader>{currentSkill ? "Editar" : "Agregar"} Competencia</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="name">Nombre</Label>
            <Input
              id="name"
              name="name"
              placeholder="Nombre"
              type="text"
              value={skill.name}
              onChange={handleChange}
              invalid={Object.keys(errors).includes("name")}
            />
            <FormFeedback>{errors["name"]}</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label for="description">Descripción</Label>
            <Input
              id="description"
              name="description"
              placeholder="Descripción"
              type="textarea"
              value={skill.description}
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
