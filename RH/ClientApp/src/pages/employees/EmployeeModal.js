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
import { send } from "../../utils/apiService";
import { get } from "jquery";
import { SkillsTable } from "../components/skills";
import { ExperiencesTable } from "../components/experiences/ExperiencesTable";
import { isValidCedula } from "../../utils/checkCedula";

export const EmployeeModal = ({ isOpen, toggle, id, userRole }) => {
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [positions, setPositions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [employee, setEmployee] = useState({
    id: 0,
    name: "",
    cedula: "",
    positionId: 1,
    departmentId: 1,
    salary: 0,
    employeeId: 0,
    StartDate: "",
    skills: [],
    trainings: [],
    experiences: [],
    languages: [],
  });

  const clean = () => {
    setEmployee({
      id: 0,
      name: "",
      cedula: "",
      positionId: 1,
      departmentId: 1,
      salary: 0,
      employeeId: 0,
      StartDate: "",
      skills: [],
      trainings: [],
      experiences: [],
      languages: [],
    });
    setErrors({});
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

    if (name === "languages") {
      value = Array.from(selectedOptions, (option) => ({ languageId: option.value, employeeId: id }));
    }

    setEmployee((employee) => ({ ...employee, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);

      const updatedEmployee = {
        ...employee,
        skills: employee.skills.map((skill) => ({
          ...skill,
          id: skill.id > 0 ? skill.id : 0,
        })),
        experiences: employee.experiences.map((experience) => ({
          ...experience,
          id: experience.id > 0 ? experience.id : 0,
        })),
      };

      if (id) {
        await send(`api/employees/${id}`, updatedEmployee, "PUT");
      } else {
        await send("api/employees", updatedEmployee, "POST");
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
          var employee = await get(`api/employees/${id}`);
          setErrors({});
          setEmployee({
            ...employee,
            startDate: employee.startDate.substring(0, 10),
          });
        }
        setPositions(await get("api/positions"));
        setDepartments(await get("api/departments"));
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
      <ModalHeader>{id ? "Editar" : "Agregar"} Empleado</ModalHeader>
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
                  value={employee.name}
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
                  value={employee.cedula}
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
                  value={employee.positionId}
                  onChange={handleChange}
                  disabled={userRole !== "RH"}
                >
                  {positions.map((position) => (
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
                  value={employee.departmentId}
                  onChange={handleChange}
                  disabled={userRole !== "RH"}
                >
                  {departments.map((department) => (
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
                <Label for="salary">Salario</Label>
                <Input
                  id="salary"
                  name="salary"
                  placeholder="Salario"
                  type="number"
                  value={employee.salary}
                  onChange={handleChange}
                  disabled={userRole !== "RH"}
                />
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <Label for="startDate">Fecha de Contratación</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  placeholder="Fecha"
                  type="date"
                  value={employee.startDate}
                  onChange={handleChange}
                  disabled={userRole !== "RH"}
                />
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
                value={employee.languages?.map((language) => language.languageId)}
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
              <SkillsTable skills={employee.skills} onChange={handleChange} />
            </Col>
            <Col>
              <ExperiencesTable experiences={employee.experiences} onChange={handleChange} />
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
