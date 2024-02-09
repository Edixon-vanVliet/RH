using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RH.Data;
using RH.Models;

namespace RH.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ExperiencesController : ControllerBase
{
    private readonly ApplicationDbContext _applicationDbContext;

    public ExperiencesController(ApplicationDbContext applicationDbContext)
    {
        _applicationDbContext = applicationDbContext;
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<Experience>>> Get()
    {
        return Ok(await _applicationDbContext.Experiences.ToListAsync());
    }

    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<Experience>> Get(int id)
    {
        var experience = await _applicationDbContext.Experiences.SingleOrDefaultAsync(x => x.Id == id);

        return experience is null ? NotFound() : Ok(experience);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    public async Task<IActionResult> Post([FromBody] Experience experience)
    {
        await _applicationDbContext.Experiences.AddAsync(experience);
        await _applicationDbContext.SaveChangesAsync();

        return CreatedAtAction(nameof(Post), new { experience.Id });
    }

    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Put(int id, [FromBody] Experience updatedExperience)
    {
        if (id != updatedExperience.Id)
        {
            return BadRequest();
        }

        var experience = await _applicationDbContext.Experiences.AsNoTracking().SingleOrDefaultAsync(x => x.Id == id);

        if (experience is null)
        {
            return NotFound();
        }

        _applicationDbContext.Experiences.Update(updatedExperience);
        await _applicationDbContext.SaveChangesAsync();

        return Ok();
    }

    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        var experience = await _applicationDbContext.Experiences.SingleOrDefaultAsync(x => x.Id == id);

        if (experience is null)
        {
            return NotFound();
        }

        _applicationDbContext.Experiences.Remove(experience);
        await _applicationDbContext.SaveChangesAsync();

        return Ok();
    }
}