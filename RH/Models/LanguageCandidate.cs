namespace RH.Models;

public class LanguageCandidate
{
    public int Id { get; set; }

    public int LanguageId { get; set; }

    public int? CandidateId { get; set; }

    public int? EmployeeId { get; set; }
}