import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { Button } from "reactstrap";
import { SkillModal } from "./SkillModal";
import { Alert } from "../../../components/layout/alert";

export const SkillsTable = ({ skills, onChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [currentSkill, setCurrentSkill] = useState(undefined);

  const handleChange = (skill) => {
    if (skill.id !== 0) {
      onChange({
        target: {
          name: "skills",
          value: skills.map((currentSkill) => {
            if (currentSkill.id === skill.id) {
              return skill;
            }

            return currentSkill;
          }),
        },
      });
    } else {
      const ids = skills
        .map((currentSkill) => currentSkill.id)
        .filter((id) => id < 0)
        .sort();

      onChange({
        target: {
          name: "skills",
          value: [
            ...skills,
            {
              ...skill,
              id: ids.length ? ids[0] - 1 : -1,
            },
          ],
        },
      });
    }
  };

  const handleModal = async () => {
    if (isModalOpen && currentSkill) {
      setCurrentSkill(undefined);
    }

    setIsModalOpen((isModalOpen) => !isModalOpen);
  };

  const handleEdit = (skill) => {
    setCurrentSkill(skill);

    handleModal();
  };

  const handleDelete = (skill) => {
    setCurrentSkill(skill);
    setIsAlertOpen(true);
  };

  const handleConfirm = async () => {
    onChange({
      target: {
        name: "skills",
        value: skills.filter((skill) => skill.id !== currentSkill.id),
      },
    });
  };

  return (
    <div>
      <Button type="button" className="btn btn-success float-end" onClick={handleModal}>
        <FontAwesomeIcon icon={faPlus} /> Agregar Competencia
      </Button>
      <SkillModal isOpen={isModalOpen} toggle={handleModal} currentSkill={currentSkill} onChange={handleChange} />
      <table className="table table-striped" aria-labelledby="tableLabel">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {skills.length ? (
            skills.map((skill) => (
              <tr key={skill.id}>
                <td>{skill.name}</td>
                <td>{skill.description}</td>
                <td>
                  <div style={{ display: "flex", gap: 10 }}>
                    <FontAwesomeIcon
                      className="formAction"
                      icon={faPencil}
                      color="var(--bs-blue)"
                      title="Editar"
                      onClick={() => handleEdit(skill)}
                    />
                    <FontAwesomeIcon
                      className="formAction"
                      icon={faTrashCan}
                      color="var(--bs-red)"
                      title="Eliminar"
                      onClick={() => handleDelete(skill)}
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
