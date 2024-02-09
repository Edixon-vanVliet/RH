import React, { useEffect, useState } from "react";
import { Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

export const SkillModal = ({ isOpen, toggle, currentSkill, onChange }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [skill, setSkill] = useState({ id: 0, name: "", description: "" });

  const clean = () => {
    setSkill({ id: 0, name: "", description: "" });
  };

  const handleChange = ({ target: { name, value } }) => {
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
            <Input id="name" name="name" placeholder="Nombre" type="text" value={skill.name} onChange={handleChange} />
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
        <Button type="button" className="btn btn-primary" onClick={handleSave} disabled={isLoading}>
          Confirmar
        </Button>
      </ModalFooter>
    </Modal>
  );
};
