using RH.Models;

namespace RH;

public class EmployeeDto
{
    public string Nombre { get; set; }

    public string Cedula { get; set; }

    public string Posicion { get; set; }

    public string Departamento { get; set; }

    public decimal Salario { get; set; }

    public DateTime FechaDeContratacion { get; set; }

    public EmployeeDto(Employee employee)
    {
        Nombre = employee.Name;
        Cedula = employee.Cedula;
        Posicion = employee.Position.Name;
        Departamento = employee.Department.Name;
        Salario = employee.Salary;
        FechaDeContratacion = employee.StartDate;
    }
}