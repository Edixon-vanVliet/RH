namespace RH.Models;

public class Employee : Person
{
    public int CandidateId { get; set; }

    public Candidate? Candidate { get; set; }

    public DateTime StartDate { get; set; }

    public ICollection<Candidate> Recommendations { get; } = new List<Candidate>();
}