using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RH.Data;
using RH.Models;

namespace RH.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CandidatesController : ControllerBase
{
    private readonly ApplicationDbContext _applicationDbContext;

    private readonly UserManager<ApplicationUser> _userManager;

    public CandidatesController(ApplicationDbContext applicationDbContext, UserManager<ApplicationUser> userManager)
    {
        _applicationDbContext = applicationDbContext;
        _userManager = userManager;
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<Candidate>>> Get()
    {
        return Ok(await _applicationDbContext.Candidates
            .Include(candidate => candidate.Department)
            .Include(candidate => candidate.Position)
            .ToListAsync());
    }

    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<Candidate>> Get(int id)
    {
        var candidate = await _applicationDbContext.Candidates
            .Include(candidate => candidate.Experiences)
            .Include(candidate => candidate.Skills)
            .Include(candidate => candidate.Trainings)
            .SingleOrDefaultAsync(x => x.Id == id);

        return candidate is null ? NotFound() : Ok(candidate);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    public async Task<IActionResult> Post([FromBody] Candidate candidate)
    {
        await _applicationDbContext.Candidates.AddAsync(candidate);
        await _applicationDbContext.SaveChangesAsync();

        return CreatedAtAction(nameof(Post), new { candidate.Id });
    }

    [HttpPost("{id}")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Post(int id)
    {
        var candidate = await _applicationDbContext.Candidates
            .AsNoTracking()
            .Include(candidate => candidate.Experiences)
            .Include(candidate => candidate.Skills)
            .SingleOrDefaultAsync(x => x.Id == id);

        if (candidate is null)
        {
            return NotFound();
        }

        var employee = new Employee
        {
            CandidateId = candidate.Id,
            Cedula = candidate.Cedula,
            Name = candidate.Name,
            DepartmentId = candidate.DepartmentId,
            PositionId = candidate.PositionId,
            Salary = candidate.Salary,
            StartDate = DateTime.Now,
            Skills = candidate.Skills,
            Experiences = candidate.Experiences,
        };

        _applicationDbContext.Candidates.Remove(candidate);
        await _applicationDbContext.Employees.AddAsync(employee);
        await _applicationDbContext.SaveChangesAsync();

        var username = $"{employee.Name.Replace(" ", ".").ToLower()}@rh.com";
        var user = new ApplicationUser()
        {
            Email = username,
            EmailConfirmed = true,
            PhoneNumberConfirmed = true,
            TwoFactorEnabled = false,
            EmployeeId = employee.Id,
            LockoutEnabled = false,
            UserName = username,
        };

        await _userManager.CreateAsync(user, "Aa!12345");
        await _userManager.AddToRoleAsync(user, employee.DepartmentId == 1 ? "RH" : "Employee");

        return CreatedAtAction(nameof(Post), new { employee.Id });
    }

    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Put(int id, [FromBody] Candidate updatedCandidate)
    {
        if (id != updatedCandidate.Id)
        {
            return BadRequest();
        }

        var candidate = await _applicationDbContext.Candidates
            .AsNoTracking()
            .Include(x => x.Skills)
            .Include(x => x.Experiences)
            .SingleOrDefaultAsync(x => x.Id == id);

        if (candidate is null)
        {
            return NotFound();
        }

        var skillsToDelete = candidate.Skills.Where(x => !updatedCandidate.Skills.Any(y => y.Id == x.Id)).ToList();
        var experienciesToDelete = candidate.Experiences.Where(x => !updatedCandidate.Experiences.Any(y => y.Id == x.Id)).ToList();

        _applicationDbContext.Candidates.Update(updatedCandidate);
        if (skillsToDelete.Any())
            _applicationDbContext.Skills.RemoveRange(skillsToDelete);
        if (experienciesToDelete.Any())
            _applicationDbContext.Experiences.RemoveRange(experienciesToDelete);
        await _applicationDbContext.SaveChangesAsync();

        return Ok();
    }

    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        var candidate = await _applicationDbContext.Candidates.SingleOrDefaultAsync(x => x.Id == id);

        if (candidate is null)
        {
            return NotFound();
        }

        _applicationDbContext.Candidates.Remove(candidate);
        await _applicationDbContext.SaveChangesAsync();

        return Ok();
    }
}