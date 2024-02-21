using Microsoft.AspNetCore.Identity;
using RH.Models;

namespace RH.Data;

public static class Seed
{
    public static async Task SeedData(this IApplicationBuilder app)
    {
        using var scope = app.ApplicationServices.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

        if (await roleManager.RoleExistsAsync("RH"))
        {
            return;
        }

        var languages = new List<Language>()
        {
            new Language() { Name = "Español" },
            new Language() { Name = "Ingles" },
            new Language() { Name = "Frances" },
        };

        var departments = new List<Department>()
        {
            new Department() { Name = "Recursos Humanos" },
            new Department() { Name = "Contabilidad" },
            new Department() { Name = "Tecnologia" },
        };

        var positions = new List<Position>()
        {
            new Position()
            {
                Name = "Reclutadora",
                MaximumSalary = 30_000,
                MinimumSalary = 15_000,
                Risk = Enums.Risk.Low,
            },
        };

        var candidates = new List<Candidate>()
        {
            new Candidate()
            {
                Cedula = "12345678901",
                Name = "Maria Trinidad",
                Department = departments[0],
                Position = positions[0],
                Salary = 25_000,
                State = Enums.State.Inactive,
            }
        };

        var employees = new List<Employee>()
        {
            new Employee()
            {
                CandidateId = 1,
                Cedula = "12345678901",
                Name = "Maria Trinidad",
                Department = departments[0],
                Position = positions[0],
                Salary = 25_000,
                StartDate = DateTime.Now,
            }
        };

        await dbContext.AddRangeAsync(languages);
        await dbContext.AddRangeAsync(departments);
        await dbContext.AddRangeAsync(positions);
        await dbContext.AddRangeAsync(candidates);
        await dbContext.AddRangeAsync(employees);

        await dbContext.SaveChangesAsync();

        var user = new ApplicationUser()
        {
            Email = "m.trinidad@rh.com",
            EmailConfirmed = true,
            PhoneNumberConfirmed = true,
            TwoFactorEnabled = false,
            EmployeeId = 1,
            LockoutEnabled = false,
            UserName = "m.trinidad@rh.com",
        };

        var result = await userManager.CreateAsync(user, "Aa!12345");

        if (result.Succeeded)
        {
            await roleManager.CreateAsync(new IdentityRole() { Name = "RH" });
            await roleManager.CreateAsync(new IdentityRole() { Name = "Employee" });

            await userManager.AddToRoleAsync(user, "RH");
        }
    }
}