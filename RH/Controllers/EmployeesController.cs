using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RH.Data;
using RH.Models;

namespace RH.Controllers;

[Route("api/[controller]")]
[ApiController]
public class EmployeesController : ControllerBase
{
    private readonly ApplicationDbContext _applicationDbContext;

    public EmployeesController(ApplicationDbContext applicationDbContext)
    {
        _applicationDbContext = applicationDbContext;
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<Employee>>> Get()
    {
        return Ok(await _applicationDbContext.Employees
            .Include(employee => employee.Department)
            .Include(employee => employee.Position)
            .ToListAsync());
    }

    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<Employee>> Get(int id)
    {
        var employee = await _applicationDbContext.Employees
            .Include(candidate => candidate.Experiences)
            .Include(candidate => candidate.Skills)
            .Include(candidate => candidate.Trainings)
            .SingleOrDefaultAsync(x => x.Id == id);

        return employee is null ? NotFound() : Ok(employee);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    public async Task<IActionResult> Post([FromBody] Employee employee)
    {
        await _applicationDbContext.Employees.AddAsync(employee);
        await _applicationDbContext.SaveChangesAsync();

        return CreatedAtAction(nameof(Post), new { employee.Id });
    }

    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Put(int id, [FromBody] Employee updatedEmployee)
    {
        if (id != updatedEmployee.Id)
        {
            return BadRequest();
        }

        var employee = await _applicationDbContext.Employees
            .AsNoTracking()
            .Include(x => x.Skills)
            .Include(x => x.Experiences)
            .SingleOrDefaultAsync(x => x.Id == id);

        if (employee is null)
        {
            return NotFound();
        }

        var skillsToDelete = employee.Skills.Where(x => !updatedEmployee.Skills.Any(y => y.Id == x.Id)).ToList();
        var experienciesToDelete = employee.Experiences.Where(x => !updatedEmployee.Experiences.Any(y => y.Id == x.Id)).ToList();

        _applicationDbContext.Employees.Update(updatedEmployee);
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
        var employee = await _applicationDbContext.Employees.SingleOrDefaultAsync(x => x.Id == id);

        if (employee is null)
        {
            return NotFound();
        }

        _applicationDbContext.Employees.Remove(employee);
        await _applicationDbContext.SaveChangesAsync();

        return Ok();
    }
}