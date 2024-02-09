using RH.Enums;

namespace RH.Models;

public class Training : BaseModel
{
    public required string Description { get; set; }

    public Level Level { get; set; }

    public DateTime From { get; set; }

    public DateTime Until { get; set; }

    public required string Institution { get; set; }
}