import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import { get, send } from "../../utils/apiService";
import { SkillsTable } from "../components/skills";
import { ExperiencesTable } from "../components/experiences/ExperiencesTable";
import { isValidCedula } from "../../utils/checkCedula";

export const CandidateModal = ({ isOpen, toggle, id }) => {
  const [errors, setErrors] = useState({
    name: "Nombre no puede estar vacio",
    cedula: "Cedula no puede estar vacio",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [positions, setPositions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [candidate, setCandidate] = useState({
    id: 0,
    name: "",
    cedula: "",
    positionId: 1,
    departmentId: 1,
    salary: 0,
    recommendedById: undefined,
    skills: [],
    trainings: [],
    experiences: [],
    languages: [],
  });

  const clean = () => {
    setCandidate({
      id: 0,
      name: "",
      cedula: "",
      positionId: 1,
      departmentId: 1,
      salary: 0,
      recommendedById: undefined,
      skills: [],
      trainings: [],
      experiences: [],
      languages: [],
    });

    setErrors({
      name: "Nombre no puede estar vacio",
      cedula: "Cedula no puede estar vacio",
    });
  };

  const handleChange = ({ target: { name, value, selectedOptions } }) => {
    let prevErrors = errors;
    delete prevErrors[name];
    setErrors(prevErrors);

    if (name === "name" && value === "") {
      setErrors((errors) => ({ ...errors, [name]: "Nombre no puede estar vacio" }));
    }

    if (name === "cedula" && !isValidCedula(value)) {
      setErrors((errors) => ({ ...errors, [name]: "Cedula invalida" }));
    }

    if (name === "cedula" && value === "") {
      setErrors((errors) => ({ ...errors, [name]: "Cedula no puede estar vacio" }));
    }

    if (name === "salary" && parseFloat(value) < 0) {
      setErrors((errors) => ({ ...errors, [name]: "Salario no puede ser menor a 0" }));
    }

    if (name === "languages") {
      value = Array.from(selectedOptions, (option) => ({ languageId: option.value, candidateId: id }));
    }

    setCandidate((candidate) => ({ ...candidate, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);

      const updatedCandidate = {
        ...candidate,
        skills: candidate.skills?.map((skill) => ({
          ...skill,
          id: skill.id > 0 ? skill.id : 0,
        })),
        experiences: candidate.experiences?.map((experience) => ({
          ...experience,
          id: experience.id > 0 ? experience.id : 0,
        })),
      };

      if (id) {
        await send(`api/candidates/${id}`, updatedCandidate, "PUT");
      } else {
        await send("api/candidates", updatedCandidate, "POST");
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
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (id) {
          setErrors({});
          const candidate = await get(`api/candidates/${id}`);

          setCandidate({
            ...candidate,
            recommendedById: candidate.recommendedById ? candidate.recommendedById : undefined,
          });
        }
        setPositions(await get("api/positions"));
        setDepartments(await get("api/departments"));
        setEmployees(await get("api/employees"));
        setLanguages(await get("api/languages"));
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return (
    <Modal isOpen={isOpen} size="lg">
      <ModalHeader>{id ? "Editar" : "Agregar"} Candidato</ModalHeader>
      <ModalBody>
        <Form>
          <Row>
            <Col>
              <FormGroup>
                <Label for="name">Nombre</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Nombre"
                  type="text"
                  value={candidate.name}
                  onChange={handleChange}
                  invalid={Object.keys(errors).includes("name")}
                />
                <FormFeedback>{errors["name"]}</FormFeedback>
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <Label for="cedula">Cedula</Label>
                <Input
                  id="cedula"
                  name="cedula"
                  placeholder="Cedula"
                  type="text"
                  value={candidate.cedula}
                  onChange={handleChange}
                  invalid={Object.keys(errors).includes("cedula")}
                />
                <FormFeedback>{errors["cedula"]}</FormFeedback>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormGroup>
                <Label for="positionId">Posición</Label>
                <Input
                  id="positionId"
                  name="positionId"
                  type="select"
                  value={candidate.positionId}
                  onChange={handleChange}
                >
                  {positions?.map((position) => (
                    <option key={position.id} value={position.id}>
                      {position.name}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <Label for="departmentId">Departamento</Label>
                <Input
                  id="departmentId"
                  name="departmentId"
                  type="select"
                  value={candidate.departmentId}
                  onChange={handleChange}
                >
                  {departments?.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormGroup>
                <Label for="salary">Salario Aspirado</Label>
                <Input
                  id="salary"
                  name="salary"
                  placeholder="Salario"
                  type="number"
                  value={candidate.salary}
                  onChange={handleChange}
                  invalid={Object.keys(errors).includes("salary")}
                />
                <FormFeedback>{errors["salary"]}</FormFeedback>
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <Label for="recommendedById">Recomendado por</Label>
                <Input
                  id="recommendedById"
                  name="recommendedById"
                  type="select"
                  value={candidate.recommendedById}
                  onChange={handleChange}
                >
                  <option value={undefined}>Seleccione...</option>
                  {employees
                    .filter((employee) => employee.id !== id)
                    ?.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.name}
                      </option>
                    ))}
                </Input>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <FormGroup>
              <Label for="languages">Idiomas</Label>
              <Input
                id="languages"
                name="languages"
                type="select"
                value={candidate.languages?.map((language) => language.languageId)}
                onChange={handleChange}
                multiple
              >
                {languages?.map((language) => (
                  <option key={language.id} value={language.id}>
                    {language.name}
                  </option>
                ))}
              </Input>
            </FormGroup>
          </Row>
          <Row>
            <Col>
              <SkillsTable skills={candidate.skills} onChange={handleChange} />
            </Col>
            <Col>
              <ExperiencesTable experiences={candidate.experiences} onChange={handleChange} />
            </Col>
          </Row>
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
