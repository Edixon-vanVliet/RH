using RH.Enums;

namespace RH.Models;

public class Position : BaseModel
{
    public required string Name { get; set; }

    public Risk Risk { get; set; }

    public decimal MinimumSalary { get; set; }

    public decimal MaximumSalary { get; set; }
}