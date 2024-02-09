using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RH.Data;
using RH.Models;

namespace RH.Controllers;

[Route("api/[controller]")]
[ApiController]
public class LanguagesController : ControllerBase
{
    private readonly ApplicationDbContext _applicationDbContext;

    public LanguagesController(ApplicationDbContext applicationDbContext)
    {
        _applicationDbContext = applicationDbContext;
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<Language>>> Get()
    {
        return Ok(await _applicationDbContext.Languages.ToListAsync());
    }

    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<Language>> Get(int id)
    {
        var language = await _applicationDbContext.Languages.SingleOrDefaultAsync(x => x.Id == id);

        return language is null ? NotFound() : Ok(language);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    public async Task<IActionResult> Post([FromBody] Language language)
    {
        await _applicationDbContext.Languages.AddAsync(language);
        await _applicationDbContext.SaveChangesAsync();

        return CreatedAtAction(nameof(Post), new { language.Id });
    }

    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Put(int id, [FromBody] Language updatedLanguage)
    {
        if (id != updatedLanguage.Id)
        {
            return BadRequest();
        }

        var language = await _applicationDbContext.Languages.AsNoTracking().SingleOrDefaultAsync(x => x.Id == id);

        if (language is null)
        {
            return NotFound();
        }

        _applicationDbContext.Languages.Update(updatedLanguage);
        await _applicationDbContext.SaveChangesAsync();

        return Ok();
    }

    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        var language = await _applicationDbContext.Languages.SingleOrDefaultAsync(x => x.Id == id);

        if (language is null)
        {
            return NotFound();
        }

        _applicationDbContext.Languages.Remove(language);
        await _applicationDbContext.SaveChangesAsync();

        return Ok();
    }
}