namespace RH.Models;

public class Candidate : Person
{
    public int? RecommendedById { get; set; }

    public Employee? RecommendedBy { get; set; }
}