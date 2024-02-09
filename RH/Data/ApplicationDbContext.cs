using Duende.IdentityServer.EntityFramework.Options;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using RH.Models;
using System.Reflection;

namespace RH.Data;

public class ApplicationDbContext : ApiAuthorizationDbContext<ApplicationUser>
{
    public DbSet<Candidate> Candidates => Set<Candidate>();

    public DbSet<Department> Departments => Set<Department>();

    public DbSet<Employee> Employees => Set<Employee>();

    public DbSet<Experience> Experiences => Set<Experience>();

    public DbSet<Language> Languages => Set<Language>();

    public DbSet<Position> Positions => Set<Position>();

    public DbSet<Skill> Skills => Set<Skill>();

    public DbSet<Training> Trainings => Set<Training>();

    public ApplicationDbContext(DbContextOptions options, IOptions<OperationalStoreOptions> operationalStoreOptions)
        : base(options, operationalStoreOptions)
    {
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        var typesToRegister = Assembly.GetExecutingAssembly().GetTypes()
            .Where(t => Array.Exists(t.GetInterfaces(), i => i.IsGenericType && i.GetGenericTypeDefinition() == typeof(IEntityTypeConfiguration<>)));

        foreach (var type in typesToRegister)
        {
            dynamic? configurationInstance = Activator.CreateInstance(type);
            builder.ApplyConfiguration(configurationInstance);
        }

        builder.Entity<Candidate>().HasQueryFilter(x => x.State == Enums.State.Active);
        builder.Entity<Department>().HasQueryFilter(x => x.State == Enums.State.Active);
        builder.Entity<Employee>().HasQueryFilter(x => x.State == Enums.State.Active);
        builder.Entity<Experience>().HasQueryFilter(x => x.State == Enums.State.Active);
        builder.Entity<Language>().HasQueryFilter(x => x.State == Enums.State.Active);
        builder.Entity<Position>().HasQueryFilter(x => x.State == Enums.State.Active);
        builder.Entity<Skill>().HasQueryFilter(x => x.State == Enums.State.Active);
        builder.Entity<Training>().HasQueryFilter(x => x.State == Enums.State.Active);

        base.OnModelCreating(builder);
    }
}