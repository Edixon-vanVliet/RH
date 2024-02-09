namespace RH.Models;

public class Experience : BaseModel
{
    public required string Company { get; set; }

    public required string Position { get; set; }

    public DateTime From { get; set; }

    public DateTime Until { get; set; }

    public decimal Salary { get; set; }
}