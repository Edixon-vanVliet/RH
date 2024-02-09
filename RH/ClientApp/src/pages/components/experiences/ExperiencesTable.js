import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { Button } from "reactstrap";
import { ExperienceModal } from "./ExperienceModal";
import { Alert } from "../../../components/layout/alert";

export const ExperiencesTable = ({ experiences, onChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [currentExperience, setCurrentExperience] = useState(undefined);

  const handleChange = (experience) => {
    if (experience.id !== 0) {
      onChange({
        target: {
          name: "experiences",
          value: experiences.map((currentExperience) => {
            if (currentExperience.id === experience.id) {
              return experience;
            }

            return currentExperience;
          }),
        },
      });
    } else {
      const ids = experiences
        .map((currentExperience) => currentExperience.id)
        .filter((id) => id < 0)
        .sort();

      onChange({
        target: {
          name: "experiences",
          value: [
            ...experiences,
            {
              ...experience,
              id: ids.length ? ids[0] - 1 : -1,
            },
          ],
        },
      });
    }
  };

  const handleModal = async () => {
    if (isModalOpen && currentExperience) {
      setCurrentExperience(undefined);
    }

    setIsModalOpen((isModalOpen) => !isModalOpen);
  };

  const handleEdit = (experience) => {
    setCurrentExperience({
      ...experience,
      from: experience.from.substring(0, 10),
      until: experience.until.substring(0, 10),
    });

    handleModal();
  };

  const handleDelete = (experience) => {
    setCurrentExperience(experience);
    setIsAlertOpen(true);
  };

  const handleConfirm = async () => {
    onChange({
      target: {
        name: "experiences",
        value: experiences.filter((experience) => experience.id !== currentExperience.id),
      },
    });
  };

  return (
    <div>
      <Button type="button" className="btn btn-success float-end" onClick={handleModal}>
        <FontAwesomeIcon icon={faPlus} /> Agregar Experiencia
      </Button>
      <ExperienceModal
        isOpen={isModalOpen}
        toggle={handleModal}
        currentExperience={currentExperience}
        onChange={handleChange}
      />
      <table className="table table-striped" aria-labelledby="tableLabel">
        <thead>
          <tr>
            <th>Compañía</th>
            <th>Posición</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {experiences.length ? (
            experiences.map((experience) => (
              <tr key={experience.id}>
                <td>{experience.company}</td>
                <td>{experience.position}</td>
                <td>
                  <div style={{ display: "flex", gap: 10 }}>
                    <FontAwesomeIcon
                      className="formAction"
                      icon={faPencil}
                      color="var(--bs-blue)"
                      title="Editar"
                      onClick={() => handleEdit(experience)}
                    />
                    <FontAwesomeIcon
                      className="formAction"
                      icon={faTrashCan}
                      color="var(--bs-red)"
                      title="Eliminar"
                      onClick={() => handleDelete(experience)}
                    />
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} style={{ textAlign: "center" }}>
                No data
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <Alert
        isOpen={isAlertOpen}
        title={"Eliminar Competencia"}
        content={"¿Estas seguro que deseas eliminar esta competencia?"}
        onConfirm={handleConfirm}
        toggle={() => setIsAlertOpen((isOpen) => !isOpen)}
      />
    </div>
  );
};
