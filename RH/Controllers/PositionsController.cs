using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RH.Data;
using RH.Models;

namespace RH.Controllers;

[Route("api/[controller]")]
[ApiController]
public class PositionsController : ControllerBase
{
    private readonly ApplicationDbContext _applicationDbContext;

    public PositionsController(ApplicationDbContext applicationDbContext)
    {
        _applicationDbContext = applicationDbContext;
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<Position>>> Get()
    {
        return Ok(await _applicationDbContext.Positions.ToListAsync());
    }

    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<Position>> Get(int id)
    {
        var position = await _applicationDbContext.Positions.SingleOrDefaultAsync(x => x.Id == id);

        return position is null ? NotFound() : Ok(position);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    public async Task<IActionResult> Post([FromBody] Position position)
    {
        await _applicationDbContext.Positions.AddAsync(position);
        await _applicationDbContext.SaveChangesAsync();

        return CreatedAtAction(nameof(Post), new { position.Id });
    }

    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Put(int id, [FromBody] Position updatedPosition)
    {
        if (id != updatedPosition.Id)
        {
            return BadRequest();
        }

        var position = await _applicationDbContext.Positions.AsNoTracking().SingleOrDefaultAsync(x => x.Id == id);

        if (position is null)
        {
            return NotFound();
        }

        _applicationDbContext.Positions.Update(updatedPosition);
        await _applicationDbContext.SaveChangesAsync();

        return Ok();
    }

    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        var position = await _applicationDbContext.Positions.SingleOrDefaultAsync(x => x.Id == id);

        if (position is null)
        {
            return NotFound();
        }

        _applicationDbContext.Positions.Remove(position);
        await _applicationDbContext.SaveChangesAsync();

        return Ok();
    }
}