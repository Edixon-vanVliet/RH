namespace RH.Models;

public class Language : BaseModel
{
    public required string Name { get; set; }

    public ICollection<LanguageCandidate> LanguageCandidates { get; set; }
}