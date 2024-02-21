using ClosedXML.Excel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RH.Data;
using RH.Models;
using System.Data;

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
            .Include(candidate => candidate.Languages)
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

        var languagesToDelete = await _applicationDbContext.LanguageCandidates.Where(language => language.EmployeeId == id).ToListAsync();
        var skillsToDelete = employee.Skills.Where(x => !updatedEmployee.Skills.Any(y => y.Id == x.Id)).ToList();
        var experienciesToDelete = employee.Experiences.Where(x => !updatedEmployee.Experiences.Any(y => y.Id == x.Id)).ToList();

        if (languagesToDelete.Any())
            _applicationDbContext.LanguageCandidates.RemoveRange(languagesToDelete);

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

    [HttpGet("report")]
    public async Task<IActionResult> GetReport()
    {
        var employees = await _applicationDbContext.Employees
            .Include(employee => employee.Department)
            .Include(employee => employee.Position)
            .ToListAsync();

        using var workbook = new XLWorkbook();
        var worksheet = workbook.AddWorksheet("Nuevos Empleados");
        var columnNames = typeof(EmployeeDto).GetProperties();
        var currentColumn = 1;

        foreach (var column in columnNames)
        {
            worksheet.Cell(1, currentColumn).Value = column.Name;
            currentColumn++;
        }

        worksheet.Cell(2, 1).InsertData(employees.Select(employee => new EmployeeDto(employee)));

        using var stream = new MemoryStream();
        workbook.SaveAs(stream);

        return File(stream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "empleados.xlsx");
    }
}