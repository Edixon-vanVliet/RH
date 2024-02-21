using Microsoft.AspNetCore.Identity;

namespace RH.Models;

public class ApplicationUser : IdentityUser
{
    public int EmployeeId { get; set; }

    public Employee? Employee { get; set; }
}