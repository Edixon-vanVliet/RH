import React, { useState } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

export const Alert = ({ isOpen, toggle, title, content, onConfirm }) => {
  const [isLoading, setIsLoading] = useState(false);
  const handleConfirm = () => {
    try {
      setIsLoading(true);
      onConfirm();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      toggle();
    }
  };

  return (
    <Modal isOpen={isOpen}>
      <ModalHeader>{title}</ModalHeader>
      <ModalBody>{content}</ModalBody>
      <ModalFooter>
        <Button type="button" className="btn btn-secondary" onClick={toggle}>
          Cancelar
        </Button>
        <Button type="button" className="btn btn-primary" onClick={handleConfirm} disabled={isLoading}>
          Confirmar
        </Button>
      </ModalFooter>
    </Modal>
  );
};
