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

export const LanguageModal = ({ isOpen, toggle, id }) => {
  const [errors, setErrors] = useState({
    name: "Nombre no puede estar vacio",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState({ id: 0, name: "" });

  const clean = () => {
    setLanguage({ id: 0, name: "" });
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

    setLanguage((language) => ({ ...language, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);

      if (id) {
        await send(`api/languages/${id}`, language, "PUT");
      } else {
        await send("api/languages", language, "POST");
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
      setErrors({});
      const fetchData = async () => {
        setIsLoading(true);
        try {
          setLanguage(await get(`api/languages/${id}`));
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
      <ModalHeader>{id ? "Editar" : "Agregar"} Idioma</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="name">Nombre</Label>
            <Input
              id="name"
              name="name"
              placeholder="Nombre"
              type="text"
              value={language.name}
              onChange={handleChange}
              invalid={Object.keys(errors).includes("name")}
            />
            <FormFeedback>{errors["name"]}</FormFeedback>
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
