using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RH.Data;
using RH.Models;

namespace RH.Controllers;

[Route("api/[controller]")]
[ApiController]
public class DepartmentsController : ControllerBase
{
    private readonly ApplicationDbContext _applicationDbContext;

    public DepartmentsController(ApplicationDbContext applicationDbContext)
    {
        _applicationDbContext = applicationDbContext;
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<Department>>> Get()
    {
        return Ok(await _applicationDbContext.Departments.ToListAsync());
    }

    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<Department>> Get(int id)
    {
        var department = await _applicationDbContext.Departments.SingleOrDefaultAsync(x => x.Id == id);

        return department is null ? NotFound() : Ok(department);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    public async Task<IActionResult> Post([FromBody] Department department)
    {
        await _applicationDbContext.Departments.AddAsync(department);
        await _applicationDbContext.SaveChangesAsync();

        return CreatedAtAction(nameof(Post), new { department.Id });
    }

    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Put(int id, [FromBody] Department updatedDepartment)
    {
        if (id != updatedDepartment.Id)
        {
            return BadRequest();
        }

        var department = await _applicationDbContext.Departments.AsNoTracking().SingleOrDefaultAsync(x => x.Id == id);

        if (department is null)
        {
            return NotFound();
        }

        _applicationDbContext.Departments.Update(updatedDepartment);
        await _applicationDbContext.SaveChangesAsync();

        return Ok();
    }

    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        var department = await _applicationDbContext.Departments.SingleOrDefaultAsync(x => x.Id == id);

        if (department is null)
        {
            return NotFound();
        }

        _applicationDbContext.Departments.Remove(department);
        await _applicationDbContext.SaveChangesAsync();

        return Ok();
    }
}