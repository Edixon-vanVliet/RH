using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RH.Data;
using RH.Models;

namespace RH.Controllers;

[Route("api/[controller]")]
[ApiController]
public class SkillsController : ControllerBase
{
    private readonly ApplicationDbContext _applicationDbContext;

    public SkillsController(ApplicationDbContext applicationDbContext)
    {
        _applicationDbContext = applicationDbContext;
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<Skill>>> Get()
    {
        return Ok(await _applicationDbContext.Skills.ToListAsync());
    }

    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<Skill>> Get(int id)
    {
        var skill = await _applicationDbContext.Skills.SingleOrDefaultAsync(x => x.Id == id);

        return skill is null ? NotFound() : Ok(skill);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    public async Task<IActionResult> Post([FromBody] Skill skill)
    {
        await _applicationDbContext.Skills.AddAsync(skill);
        await _applicationDbContext.SaveChangesAsync();

        return CreatedAtAction(nameof(Post), new { skill.Id });
    }

    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Put(int id, [FromBody] Skill updatedSkill)
    {
        if (id != updatedSkill.Id)
        {
            return BadRequest();
        }

        var skill = await _applicationDbContext.Skills.AsNoTracking().SingleOrDefaultAsync(x => x.Id == id);

        if (skill is null)
        {
            return NotFound();
        }

        _applicationDbContext.Skills.Update(updatedSkill);
        await _applicationDbContext.SaveChangesAsync();

        return Ok();
    }

    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        var skill = await _applicationDbContext.Skills.SingleOrDefaultAsync(x => x.Id == id);

        if (skill is null)
        {
            return NotFound();
        }

        _applicationDbContext.Skills.Remove(skill);
        await _applicationDbContext.SaveChangesAsync();

        return Ok();
    }
}