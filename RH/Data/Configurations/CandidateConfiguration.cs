using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RH.Models;

namespace RH.Data.Configurations;

public class CandidateConfiguration : IEntityTypeConfiguration<Candidate>
{
    public void Configure(EntityTypeBuilder<Candidate> builder)
    {
        builder.HasOne(candidate => candidate.RecommendedBy)
            .WithMany(employee => employee.Recommendations)
            .HasForeignKey(candidate => candidate.RecommendedById);

        builder.HasMany(candidate => candidate.Languages)
            .WithOne();
    }
}