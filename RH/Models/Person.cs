namespace RH.Models;

public abstract class Person : BaseModel
{
    public required string Cedula { get; set; }

    public required string Name { get; set; }

    public int PositionId { get; set; }

    public Position? Position { get; set; }

    public int DepartmentId { get; set; }

    public Department? Department { get; set; }

    public decimal Salary { get; set; }

    public List<Skill> Skills { get; set; } = new List<Skill>();

    public List<Training> Trainings { get; } = new List<Training>();

    public List<Experience> Experiences { get; set; } = new List<Experience>();
    public List<Language> Languages { get; set; } = new List<Language>();
}