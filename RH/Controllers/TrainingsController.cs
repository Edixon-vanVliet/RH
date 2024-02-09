using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RH.Data;
using RH.Models;

namespace RH.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TrainingsController : ControllerBase
{
    private readonly ApplicationDbContext _applicationDbContext;

    public TrainingsController(ApplicationDbContext applicationDbContext)
    {
        _applicationDbContext = applicationDbContext;
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<Training>>> Get()
    {
        return Ok(await _applicationDbContext.Trainings.ToListAsync());
    }

    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<Training>> Get(int id)
    {
        var training = await _applicationDbContext.Trainings.SingleOrDefaultAsync(x => x.Id == id);

        return training is null ? NotFound() : Ok(training);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    public async Task<IActionResult> Post([FromBody] Training training)
    {
        await _applicationDbContext.Trainings.AddAsync(training);
        await _applicationDbContext.SaveChangesAsync();

        return CreatedAtAction(nameof(Post), new { training.Id });
    }

    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Put(int id, [FromBody] Training updatedTraining)
    {
        if (id != updatedTraining.Id)
        {
            return BadRequest();
        }

        var training = await _applicationDbContext.Trainings.AsNoTracking().SingleOrDefaultAsync(x => x.Id == id);

        if (training is null)
        {
            return NotFound();
        }

        _applicationDbContext.Trainings.Update(updatedTraining);
        await _applicationDbContext.SaveChangesAsync();

        return Ok();
    }

    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        var training = await _applicationDbContext.Trainings.SingleOrDefaultAsync(x => x.Id == id);

        if (training is null)
        {
            return NotFound();
        }

        _applicationDbContext.Trainings.Remove(training);
        await _applicationDbContext.SaveChangesAsync();

        return Ok();
    }
}