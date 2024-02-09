using RH.Enums;

namespace RH.Models;

public class BaseModel
{
    public int Id { get; set; }

    public State State { get; set; } = State.Active;

    public DateTimeOffset? StateChangedAt { get; set; }
}